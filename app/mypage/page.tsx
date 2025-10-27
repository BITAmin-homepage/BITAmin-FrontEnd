"use client"

import { useAuth, isAdmin } from "@/lib/auth"
import { API_ENDPOINTS } from "@/lib/api"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { User, Mail, School, Calendar, Edit, Github, Link as LinkIcon, Upload, X } from "lucide-react"
import Image from "next/image"

export default function MyPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [fetchedUser, setFetchedUser] = useState<any>(null)
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string>("")
  const [isAuthChecking, setIsAuthChecking] = useState(true) // 인증 체크 중 상태
  const [editData, setEditData] = useState({
    name: "",
    gender: "",
    birthDate: "",
    school: "",
    phone: "",
    email: "",
    cohort: 0,
    role: "MEMBER" as "MEMBER" | "ADMIN",
    link1: "", // GitHub
    link2: "", // 자유 링크
    profileImage: "", // 프로필 이미지 URL
  })

  // 링크 문자열 정규화: 빈값/"null" -> "", http 미포함 시 https:// 붙임
  const normalizeLink = (value?: string) => {
    if (!value) return ""
    const v = value.trim()
    if (v === "" || v.toLowerCase() === "null") return ""
    return v.startsWith("http") ? v : `https://${v}`
  }

  useEffect(() => {
    // 인증 체크 완료 표시 (약간의 지연을 두어 localStorage 복원 대기)
    const timer = setTimeout(() => {
      setIsAuthChecking(false)
    }, 100)

    if (!isAuthenticated && !isAuthChecking) {
      // 인증 체크가 완료되고 인증되지 않은 경우에만 리다이렉트
      router.push("/login")
    } else if (user) {
      setEditData({
        name: user.name || "",
        gender: user.gender || "",
        birthDate: user.birthDate || "",
        school: user.school || "",
        phone: user.phone || "",
        email: user.email || "",
        cohort: user.cohort || 0,
        role: (user.role === "ROLE_ADMIN" || user.role === "ADMIN") ? "ADMIN" : "MEMBER",
        link1: user.link1 || "",
        link2: user.link2 || "",
        profileImage: (user as any).profileImage || "",
      })
      
      // 기존 프로필 이미지가 있으면 미리보기 설정
      if ((user as any).profileImage) {
        setProfileImagePreview((user as any).profileImage)
      }

      // 최신 회원 정보 조회
      const fetchMemberInfo = async () => {
        try {
          const token = localStorage.getItem("auth_token")
          const memberId = (user.memberId || user.id)?.toString()
          if (!token || !memberId) return
          const res = await fetch(API_ENDPOINTS.MEMBERS.DETAIL(memberId), {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (res.ok) {
            const result = await res.json()
            if (result?.success && result?.data) {
              // 백엔드 API 응답을 우선 사용 (image 또는 profileImage)
              const finalProfileImage = result.data.profileImage || result.data.image || ""
              
              const mergedData = {
                ...result.data,
                profileImage: finalProfileImage
              }
              
              setFetchedUser(mergedData)
            }
          }
        } catch (e) {
        }
      }
      fetchMemberInfo()
    }

    return () => clearTimeout(timer)
  }, [isAuthenticated, user, router, isAuthChecking])

  // 프로필 이미지 업로드 핸들러
  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // 프로필 이미지 제거
  const handleRemoveProfileImage = () => {
    setProfileImageFile(null)
    setProfileImagePreview("")
    setEditData({ ...editData, profileImage: "" })
  }

  const handleUpdateMember = async () => {
    if (!user?.id && !user?.memberId) {
      alert("사용자 ID를 찾을 수 없습니다.")
      return
    }

    setIsLoading(true)
    try {
      const token = localStorage.getItem("auth_token")
      
      // memberId가 있으면 사용하고, 없으면 id 사용
      const userId = user.memberId || user.id
      
      let profileImageUrl = editData.profileImage

      // 1. 프로필 이미지가 새로 업로드된 경우 S3에 업로드
      if (profileImageFile) {
        try {
          const formData = new FormData()
          formData.append("file", profileImageFile)
          formData.append("type", `profile/${displayUser.name || userId}`)
          formData.append("memberId", userId.toString())
          
          const uploadResponse = await fetch("/api/members/profile/upload", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          })

          const uploadResult = await uploadResponse.json()
          
          if (uploadResult.success) {
            // S3 URL 추출
            profileImageUrl = uploadResult.data || uploadResult.url
            
            if (profileImageUrl) {
              // localStorage에 프로필 이미지 URL 저장 (백엔드가 반환하지 않는 경우 대비)
              localStorage.setItem(`profile_image_${userId}`, profileImageUrl)
            }
          } else {
            throw new Error(uploadResult.message || "프로필 이미지 업로드에 실패했습니다.")
          }
        } catch (uploadError) {
          alert(`프로필 이미지 업로드 중 오류가 발생했습니다: ${uploadError instanceof Error ? uploadError.message : String(uploadError)}`)
          // 업로드 실패 시에도 다른 정보는 저장하도록 계속 진행
        }
      }
      
      // 2. BE API UpdateMemberRequestDto 형식에 맞게 데이터 구성
      // 모든 필드를 포함해야 NULL로 덮어쓰이지 않음
      // displayUser에서 현재 저장된 값을 가져와서 덮어쓰이지 않도록 함
      const currentUser = fetchedUser || user
      const updateData = {
        name: editData.name || currentUser.name,
        gender: editData.gender || currentUser.gender || "",
        birthDate: editData.birthDate || currentUser.birthDate || "",
        school: editData.school || currentUser.school || "",
        phone: editData.phone || currentUser.phone || "",
        email: editData.email || currentUser.email,
        cohort: editData.cohort || currentUser.cohort,
        role: editData.role || currentUser.role,
        // link1, link2는 기존 값 유지 (editData에 없으면 currentUser에서 가져옴)
        link1: editData.link1 || (currentUser as any).link1 || (currentUser as any).github || "",
        link2: editData.link2 || (currentUser as any).link2 || "",
        profileImage: profileImageUrl || (currentUser as any).profileImage || "" // S3 URL 포함
      }

      const response = await fetch(API_ENDPOINTS.MEMBERS.UPDATE(userId.toString()), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        alert("정보가 성공적으로 수정되었습니다.")
        setIsEditDialogOpen(false)
        
        // 프로필 이미지 미리보기 초기화
        setProfileImageFile(null)
        setProfileImagePreview("")
        
        // localStorage의 user_data 업데이트
        const currentUser = fetchedUser || user
        const updatedUser = {
          ...currentUser,
          name: editData.name || currentUser.name,
          gender: editData.gender || currentUser.gender || "",
          birthDate: editData.birthDate || currentUser.birthDate || "",
          school: editData.school || currentUser.school || "",
          phone: editData.phone || currentUser.phone || "",
          email: editData.email || currentUser.email,
          cohort: editData.cohort || currentUser.cohort,
          role: editData.role || currentUser.role,
          link1: editData.link1 || (currentUser as any).link1 || (currentUser as any).github || "",
          link2: editData.link2 || (currentUser as any).link2 || "",
          profileImage: profileImageUrl || (currentUser as any).profileImage || ""
        }
        
        localStorage.setItem("user_data", JSON.stringify(updatedUser))
        
        // 프로필 이미지가 업로드된 경우 즉시 화면에 반영
        if (profileImageUrl) {
          // fetchedUser 업데이트
          if (fetchedUser) {
            setFetchedUser({
              ...fetchedUser,
              profileImage: profileImageUrl
            } as any)
          }
        }

        // 페이지 이동 없이 최신 정보로 갱신
        try {
          const refreshRes = await fetch(API_ENDPOINTS.MEMBERS.DETAIL(userId.toString()), {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (refreshRes.ok) {
            const refreshed = await refreshRes.json()
            if (refreshed?.success && refreshed?.data) {
              const d = refreshed.data
              
              // 백엔드 API 응답을 우선 사용 (image 또는 profileImage)
              // 업로드 직후라면 profileImageUrl도 고려
              const finalProfileImage = d.profileImage || d.image || profileImageUrl || ""
              
              const mergedData = {
                ...d,
                profileImage: finalProfileImage
              }
              
              // @ts-ignore - display 전용 상태
              setFetchedUser(mergedData)
              setEditData({
                name: d.name || "",
                gender: d.gender || "",
                birthDate: d.birthDate || "",
                school: d.school || "",
                phone: d.phone || "",
                email: d.email || "",
                cohort: d.cohort || 0,
                role: (d.role === "ROLE_ADMIN" || d.role === "ADMIN") ? "ADMIN" : "MEMBER",
                link1: d.link1 || "",
                link2: d.link2 || "",
                profileImage: finalProfileImage,
              })
            } else {
              // 실패 시 로컬 값으로라도 즉시 반영
              // @ts-ignore
              setFetchedUser(updatedUser)
            }
          }
        } catch (e) {
          // 네트워크 오류 시에도 페이지 이탈 없이 로컬 값 적용
          // @ts-ignore
          setFetchedUser(updatedUser)
        }
      } else {
        alert(result.message || "정보 수정에 실패했습니다.")
      }
    } catch (error) {
      alert("정보 수정 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const displayUser = fetchedUser || user

  // 인증 체크 중일 때 로딩 표시
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d3431a] mx-auto mb-4"></div>
          <p className="text-gray-400">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !displayUser) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">마이페이지</h1>
            <p className="text-gray-300">내 정보를 확인하고 수정하세요</p>
          </div>
          <Dialog 
            open={isEditDialogOpen} 
            onOpenChange={(open) => {
              setIsEditDialogOpen(open)
              // 다이얼로그가 열릴 때 현재 프로필 이미지를 미리보기로 설정
              if (open && user) {
                const currentUser = fetchedUser || user
                const userId = (user.memberId || user.id)?.toString()
                const storedProfileImage = userId ? localStorage.getItem(`profile_image_${userId}`) : null
                const currentProfileImage = (currentUser as any).profileImage || storedProfileImage || ""
                setProfileImagePreview(currentProfileImage)
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-[#d3431a] hover:bg-[#b8371a] text-white">
                <Edit className="h-4 w-4 mr-2" />
                정보 수정
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#121212] border-white/10 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">정보 수정</DialogTitle>
                <DialogDescription className="text-gray-400">
                  개인 정보를 수정할 수 있습니다.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                {/* 프로필 이미지 업로드 */}
                <div className="space-y-2">
                  <Label>프로필 이미지</Label>
                  <div className="flex flex-col items-center gap-4">
                    {/* 이미지 미리보기 */}
                    {profileImagePreview ? (
                      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#d3431a]">
                        <Image
                          src={profileImagePreview}
                          alt="프로필 미리보기"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveProfileImage}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center border-2 border-dashed border-gray-500">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    
                    {/* 파일 업로드 버튼 */}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-gray-500 text-gray-800 hover:bg-gray-200 hover:text-gray-900"
                        onClick={() => document.getElementById('profile-image-input')?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        이미지 선택
                      </Button>
                      <input
                        id="profile-image-input"
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름 *</Label>
                    <Input
                      id="name"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="bg-black border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">성별 *</Label>
                    <Select
                      value={editData.gender}
                      onValueChange={(value) => setEditData({ ...editData, gender: value })}
                    >
                      <SelectTrigger className="bg-black border-white/20 text-white">
                        <SelectValue placeholder="성별 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">남성</SelectItem>
                        <SelectItem value="female">여성</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">생년월일 *</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={editData.birthDate}
                      onChange={(e) => setEditData({ ...editData, birthDate: e.target.value })}
                      className="bg-black border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school">학교 *</Label>
                    <Input
                      id="school"
                      value={editData.school}
                      onChange={(e) => setEditData({ ...editData, school: e.target.value })}
                      className="bg-black border-white/20 text-white"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">전화번호 *</Label>
                    <Input
                      id="phone"
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      className="bg-black border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일 *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="bg-black border-white/20 text-white"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cohort">기수 *</Label>
                    <Input
                      id="cohort"
                      type="number"
                      value={editData.cohort}
                      onChange={(e) => setEditData({ ...editData, cohort: parseInt(e.target.value) || 0 })}
                      className="bg-black border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">역할 *</Label>
                    <Select
                      value={editData.role}
                      onValueChange={(value: "MEMBER" | "ADMIN") => setEditData({ ...editData, role: value })}
                      disabled={true}
                    >
                      <SelectTrigger className="bg-black border-white/20 text-white opacity-60 cursor-not-allowed">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MEMBER">멤버</SelectItem>
                        <SelectItem value="ADMIN">관리자</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">역할은 관리자만 변경할 수 있습니다</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="link1" className="flex items-center gap-2">
                      <Github className="h-4 w-4" />
                      GitHub 링크
                    </Label>
                    <Input
                      id="link1"
                      placeholder="https://github.com/username"
                      value={editData.link1}
                      onChange={(e) => setEditData({ ...editData, link1: e.target.value })}
                      className="bg-black border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="link2" className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4" />
                      기타 링크 (블로그, LinkedIn 등)
                    </Label>
                    <Input
                      id="link2"
                      placeholder="https://your-blog.com"
                      value={editData.link2}
                      onChange={(e) => setEditData({ ...editData, link2: e.target.value })}
                      className="bg-black border-white/20 text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleUpdateMember}
                    disabled={isLoading}
                    className="flex-1 bg-[#d3431a] hover:bg-[#b8371a] text-white"
                  >
                    {isLoading ? "수정 중..." : "수정 완료"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                    className="flex-1 border-white/20 text-gray-800 hover:bg-white/10"
                  >
                    취소
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          <Card className="bg-[#121212] border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="h-5 w-5" />
                프로필 정보
              </CardTitle>
              <CardDescription className="text-gray-400">내 계정 정보를 확인할 수 있습니다</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {/* 프로필 이미지와 정보를 좌우로 배치 */}
              <div className="flex flex-col lg:flex-row gap-8">
                {/* 왼쪽: 프로필 이미지 영역 */}
                <div className="flex flex-col items-center space-y-4 lg:w-64 flex-shrink-0">
                  <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-[#d3431a] bg-gray-700">
                    {(displayUser as any).profileImage ? (
                      <Image
                        src={(displayUser as any).profileImage}
                        alt={`${displayUser.name} 프로필`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-24 h-24 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">{displayUser.name}</h2>
                    <Badge
                      className={
                        isAdmin(displayUser.role) ? "bg-[#d3431a] text-white" : "bg-white/10 text-white"
                      }
                    >
                      {isAdmin(displayUser.role) ? "관리자" : "멤버"}
                    </Badge>
                  </div>
                </div>

                {/* 오른쪽: 정보 그리드 */}
                <div className="flex-1">
                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">
                    {/* 이메일 */}
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-400">이메일</div>
                        <div className="font-medium text-white break-all">{displayUser.email}</div>
                      </div>
                    </div>

                    {/* 전화번호 */}
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-sm text-gray-400">전화번호</div>
                        <div className="font-medium text-white">{displayUser.phone || "미등록"}</div>
                      </div>
                    </div>

                    {/* 학교 */}
                    <div className="flex items-start gap-3">
                      <School className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-sm text-gray-400">학교</div>
                        <div className="font-medium text-white">{displayUser.school || "미등록"}</div>
                      </div>
                    </div>

                    {/* 기수 */}
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-sm text-gray-400">기수</div>
                        <div className="font-medium text-white">{displayUser.cohort}기</div>
                      </div>
                    </div>

                    {/* 성별 */}
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-sm text-gray-400">성별</div>
                        <div className="font-medium text-white">
                          {displayUser.gender === "male" ? "남성" : displayUser.gender === "female" ? "여성" : "미등록"}
                        </div>
                      </div>
                    </div>

                    {/* 생년월일 */}
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-sm text-gray-400">생년월일</div>
                        <div className="font-medium text-white">{displayUser.birthDate || "미등록"}</div>
                      </div>
                    </div>
                  </div>

                  {/* 링크 섹션 */}
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-4">링크</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* GitHub */}
                      <div className="flex items-start gap-3">
                        <Github className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-gray-400 mb-1">GitHub</div>
                          {normalizeLink(displayUser.link1) ? (
                            <a
                              href={normalizeLink(displayUser.link1)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-[#d3431a] hover:text-[#b8371a] transition-colors block break-all"
                            >
                              {normalizeLink(displayUser.link1).replace('https://', '')}
                            </a>
                          ) : (
                            <div className="text-sm text-gray-500">미등록</div>
                          )}
                        </div>
                      </div>

                      {/* 기타 링크 */}
                      <div className="flex items-start gap-3">
                        <LinkIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-gray-400 mb-1">기타 링크</div>
                          {normalizeLink(displayUser.link2) ? (
                            <a
                              href={normalizeLink(displayUser.link2)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-[#d3431a] hover:text-[#b8371a] transition-colors block break-all"
                            >
                              {normalizeLink(displayUser.link2).replace('https://', '')}
                            </a>
                          ) : (
                            <div className="text-sm text-gray-500">미등록</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
</CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
