"use client"

import { useAuth } from "@/lib/auth"
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
import { User, Mail, School, Calendar, Edit, Github, Link as LinkIcon } from "lucide-react"

export default function MyPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [fetchedUser, setFetchedUser] = useState<any>(null)
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
  })

  // 링크 문자열 정규화: 빈값/"null" -> "", http 미포함 시 https:// 붙임
  const normalizeLink = (value?: string) => {
    if (!value) return ""
    const v = value.trim()
    if (v === "" || v.toLowerCase() === "null") return ""
    return v.startsWith("http") ? v : `https://${v}`
  }

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    } else if (user) {
      console.log("마이페이지 user 데이터:", user)
      console.log("user.link1:", user.link1)
      console.log("user.link2:", user.link2)
      
      setEditData({
        name: user.name || "",
        gender: user.gender || "",
        birthDate: user.birthDate || "",
        school: user.school || "",
        phone: user.phone || "",
        email: user.email || "",
        cohort: user.cohort || 0,
        role: user.role || "MEMBER",
        link1: user.link1 || "",
        link2: user.link2 || "",
      })

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
              setFetchedUser(result.data)
            }
          }
        } catch (e) {
          console.error("회원 정보 조회 실패", e)
        }
      }
      fetchMemberInfo()
    }
  }, [isAuthenticated, user, router])

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
      
      // BE API UpdateMemberRequestDto 형식에 맞게 데이터 구성
      // 모든 필드를 포함해야 NULL로 덮어쓰이지 않음
      const updateData = {
        name: editData.name || user.name,
        gender: editData.gender || user.gender || "",
        birthDate: editData.birthDate || user.birthDate || "",
        school: editData.school || user.school || "",
        phone: editData.phone || user.phone || "",
        email: editData.email || user.email,
        cohort: editData.cohort || user.cohort,
        role: editData.role || user.role,
        link1: editData.link1 || user.link1 || "",
        link2: editData.link2 || user.link2 || ""
      }

      console.log("수정할 데이터:", updateData)
      console.log("사용자 ID:", userId)

      const response = await fetch(API_ENDPOINTS.MEMBERS.UPDATE(userId.toString()), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      })

      const result = await response.json()
      console.log("수정 응답:", result)
      console.log("응답 상태:", response.status)

      if (response.ok && result.success) {
        alert("정보가 성공적으로 수정되었습니다.")
        setIsEditDialogOpen(false)
        
        // localStorage의 user_data 업데이트
        const updatedUser = {
          ...user,
          name: editData.name || user.name,
          gender: editData.gender || user.gender || "",
          birthDate: editData.birthDate || user.birthDate || "",
          school: editData.school || user.school || "",
          phone: editData.phone || user.phone || "",
          email: editData.email || user.email,
          cohort: editData.cohort || user.cohort,
          role: editData.role || user.role,
          link1: editData.link1 || user.link1 || "",
          link2: editData.link2 || user.link2 || ""
        }
        
        localStorage.setItem("user_data", JSON.stringify(updatedUser))

        // 페이지 이동 없이 최신 정보로 갱신
        try {
          const refreshRes = await fetch(API_ENDPOINTS.MEMBERS.DETAIL(userId.toString()), {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (refreshRes.ok) {
            const refreshed = await refreshRes.json()
            if (refreshed?.success && refreshed?.data) {
              // BE 최신 값으로 반영
              // fetchedUser가 있다면 교체, 없으면 생성
              // 또한 수정 폼 초기값도 동기화
              // 링크 정규화는 표시 시점에 처리하므로 원본 저장
              // (normalizeLink는 렌더링 단계에서 사용)
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const d = refreshed.data
              // @ts-ignore - display 전용 상태
              setFetchedUser(d)
              setEditData({
                name: d.name || "",
                gender: d.gender || "",
                birthDate: d.birthDate || "",
                school: d.school || "",
                phone: d.phone || "",
                email: d.email || "",
                cohort: d.cohort || 0,
                role: d.role || "MEMBER",
                link1: d.link1 || "",
                link2: d.link2 || "",
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
      console.error("Error updating member:", error)
      alert("정보 수정 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const displayUser = fetchedUser || user

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
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
              <div className="space-y-4">
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
                    >
                      <SelectTrigger className="bg-black border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MEMBER">멤버</SelectItem>
                        <SelectItem value="ADMIN">관리자</SelectItem>
                      </SelectContent>
                    </Select>
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
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
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
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
      <div className="flex items-center gap-3">
        <User className="h-5 w-5 text-gray-400" />
        <div>
          <div className="text-sm text-gray-400">이름</div>
          <div className="font-medium text-white">{displayUser.name}</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Mail className="h-5 w-5 text-gray-400" />
        <div>
          <div className="text-sm text-gray-400">이메일</div>
          <div className="font-medium text-white">{displayUser.email}</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <School className="h-5 w-5 text-gray-400" />
        <div>
          <div className="text-sm text-gray-400">학교</div>
          <div className="font-medium text-white">{displayUser.school || "미등록"}</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <User className="h-5 w-5 text-gray-400" />
        <div>
          <div className="text-sm text-gray-400">전화번호</div>
          <div className="font-medium text-white">{displayUser.phone || "미등록"}</div>
        </div>
      </div>
    </div>

    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Calendar className="h-5 w-5 text-gray-400" />
        <div>
          <div className="text-sm text-gray-400">기수</div>
          <div className="font-medium text-white">{displayUser.cohort}기</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <User className="h-5 w-5 text-gray-400" />
        <div>
          <div className="text-sm text-gray-400">성별</div>
          <div className="font-medium text-white">
            {displayUser.gender === "male" ? "남성" : displayUser.gender === "female" ? "여성" : "미등록"}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Calendar className="h-5 w-5 text-gray-400" />
        <div>
          <div className="text-sm text-gray-400">생년월일</div>
          <div className="font-medium text-white">{displayUser.birthDate || "미등록"}</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <School className="h-5 w-5 text-gray-400" />
        <div>
          <div className="text-sm text-gray-400">역할</div>
          <Badge
            className={
              displayUser.role === "ADMIN" ? "bg-[#d3431a] text-white" : "bg-white/10 text-white"
            }
          >
            {displayUser.role === "ADMIN" ? "관리자" : "멤버"}
          </Badge>
        </div>
      </div>
      
      {/* 링크 섹션 - 항상 표시, NULL이면 비어있음 표시 */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <h4 className="text-lg font-semibold text-white mb-4">링크</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 왼쪽: GitHub */}
          <div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Github className="h-5 w-5 text-gray-400" />
                <div className="text-sm text-gray-400">GitHub</div>
              </div>
              {normalizeLink(displayUser.link1) ? (
                <a
                  href={normalizeLink(displayUser.link1)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#d3431a] hover:text-[#b8371a] transition-colors block break-all"
                >
                  {normalizeLink(displayUser.link1)}
                </a>
              ) : (
                <div className="text-sm text-gray-500">비어있음</div>
              )}
            </div>
          </div>

          {/* 오른쪽: 기타 링크 */}
          <div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-gray-400" />
                <div className="text-sm text-gray-400">기타 링크</div>
              </div>
              {normalizeLink(displayUser.link2) ? (
                <a
                  href={normalizeLink(displayUser.link2)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#d3431a] hover:text-[#b8371a] transition-colors block break-all"
                >
                  {normalizeLink(displayUser.link2)}
                </a>
              ) : (
                <div className="text-sm text-gray-500">비어있음</div>
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
