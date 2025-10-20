"use client"

import type React from "react"

import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Users,
  Plus,
  Edit,
  
  Mail,
  Phone,
  School,
  Github,
  ImageIcon,
  X,
  Check,
  UserCheck,
  Clock,
} from "lucide-react"
import Image from "next/image"

interface Member {
  memberId: number
  name: string
  email: string
  phone: string
  school: string
  major?: string
  gender: string
  birthDate: string
  cohort: number
  role: "MEMBER" | "ADMIN"
  status: "PENDING" | "APPROVED" | "REJECTED"
  profileImage?: string
  github?: string
}

export default function MembersPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [members, setMembers] = useState<Member[]>([])
  const [pendingMembers, setPendingMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCohort, setSelectedCohort] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [profilePreview, setProfilePreview] = useState<string>("")
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: "",
    school: "",
    major: "",
    gender: "",
    birthDate: "",
    cohort: "",
    role: "MEMBER" as "MEMBER" | "ADMIN",
    github: "",
  })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "ADMIN") {
      router.push("/dashboard")
    } else {
      fetchMembers()
      fetchPendingMembers()
    }
  }, [isAuthenticated, user, router])

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/members?status=APPROVED", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const result = await response.json()

      console.log("Approved members API response:", result)

      if (result.success) {
        setMembers(result.data)
      } else {
        console.error("Failed to fetch members:", result.message)
        setMembers([]) // 빈 배열로 초기화
      }
    } catch (error) {
      console.error("Error fetching members:", error)
      setMembers([]) // 에러 시 빈 배열로 초기화
    }
  }

  const fetchPendingMembers = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/members?status=PENDING", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const result = await response.json()

      console.log("Pending members API response:", result)

      if (result.success) {
        setPendingMembers(result.data)
      } else {
        console.error("Failed to fetch pending members:", result.message)
        setPendingMembers([]) // 빈 배열로 초기화
      }
    } catch (error) {
      console.error("Error fetching pending members:", error)
      setPendingMembers([]) // 에러 시 빈 배열로 초기화
    } finally {
      setLoading(false)
    }
  }

  const handleApproveMember = async (memberId: number) => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`/api/members/status/${memberId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const result = await response.json()

      if (result.success) {
        // 승인된 멤버를 pending에서 제거하고 approved로 이동
        const approvedMember = pendingMembers.find((m) => m.memberId === memberId)
        if (approvedMember) {
          setPendingMembers(pendingMembers.filter((m) => m.memberId !== memberId))
          setMembers([...members, { ...approvedMember, status: "APPROVED" }])
          alert(`${approvedMember.name}님의 가입이 승인되었습니다.`)
        }
      } else {
        alert(result.message || "멤버 승인에 실패했습니다.")
      }
    } catch (error) {
      console.error("Error approving member:", error)
      alert("멤버 승인 중 오류가 발생했습니다.")
    }
  }

  const handleRejectMember = async (memberId: number) => {
    const memberToReject = pendingMembers.find((m) => m.memberId === memberId)
    if (!memberToReject) return

    if (!confirm(`${memberToReject.name}님의 가입을 거부하시겠습니까?`)) return

    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`/api/members/delete/${memberId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const result = await response.json()

      if (result.success) {
        setPendingMembers(pendingMembers.filter((m) => m.memberId !== memberId))
        alert(`${memberToReject.name}님의 가입이 거절되었습니다.`)
      } else {
        alert(result.message || "멤버 거부에 실패했습니다.")
      }
    } catch (error) {
      console.error("Error rejecting member:", error)
      alert("멤버 거부 중 오류가 발생했습니다.")
    }
  }

  const handleAddMember = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      const memberData = {
        ...newMember,
        cohort: Number.parseInt(newMember.cohort),
        profileImage: profilePreview,
      }

      const response = await fetch("/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(memberData),
      })

      const result = await response.json()

      if (result.success) {
        setMembers([...members, result.data])
        setNewMember({
          name: "",
          email: "",
          phone: "",
          school: "",
          major: "",
          gender: "",
          birthDate: "",
          cohort: "",
          role: "MEMBER",
          github: "",
        })
        setProfilePreview("")
        setIsAddDialogOpen(false)
        alert("멤버가 추가되었습니다!")
      } else {
        alert(result.message || "멤버 추가에 실패했습니다.")
      }
    } catch (error) {
      console.error("Error adding member:", error)
      alert("멤버 추가 중 오류가 발생했습니다.")
    }
  }

  const handleEditMember = async () => {
    if (!editingMember) return

    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`/api/members/${editingMember.memberId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingMember),
      })

      const result = await response.json()

      if (result.success) {
        setMembers(members.map((member) => (member.memberId === editingMember.memberId ? result.data : member)))
        setEditingMember(null)
        setProfilePreview("")
        setIsEditDialogOpen(false)
        alert("멤버 정보가 수정되었습니다!")
      } else {
        alert(result.message || "멤버 수정에 실패했습니다.")
      }
    } catch (error) {
      console.error("Error editing member:", error)
      alert("멤버 수정 중 오류가 발생했습니다.")
    }
  }

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setProfilePreview(imageUrl)
        if (isEdit && editingMember) {
          setEditingMember({ ...editingMember, profileImage: imageUrl })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const filteredMembers = members.filter((member) => {
    const matchesCohort = selectedCohort === "all" || member.cohort.toString() === selectedCohort
    return matchesCohort
  })

  const cohorts = Array.from(new Set(members.map((m) => m.cohort))).sort((a, b) => b - a)

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-white">멤버 정보를 불러오는 중...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">멤버 관리</h1>
          <p className="text-gray-300">동아리 멤버들의 정보를 관리하세요</p>
        </div>

        <Tabs defaultValue="approved" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-[#1a1a1a] border-white/10">
            <TabsTrigger value="approved" className="flex items-center gap-2 data-[state=active]:bg-[#d3431a] data-[state=active]:text-white text-gray-300">
              <UserCheck className="h-4 w-4" />
              승인된 멤버
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2 data-[state=active]:bg-[#d3431a] data-[state=active]:text-white text-gray-300">
              <Clock className="h-4 w-4" />
              승인 대기 ({pendingMembers.length})
            </TabsTrigger>
          </TabsList>

          {/* 승인된 멤버 탭 */
          }
          <TabsContent value="approved" className="space-y-6">
            {/* 필터 */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <Select value={selectedCohort} onValueChange={setSelectedCohort}>
                <SelectTrigger className="w-full sm:w-48 bg-[#1a1a1a] border-white/10 text-white">
                  <SelectValue placeholder="기수 선택" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                  <SelectItem value="all" className="text-white hover:bg-gray-700 focus:bg-gray-700">전체 기수</SelectItem>
                  {cohorts.map((cohort) => (
                    <SelectItem key={cohort} value={cohort.toString()} className="text-white hover:bg-gray-700 focus:bg-gray-700">
                      {cohort}기
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#d3431a] hover:bg-[#b8371a] text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    멤버 추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>새 멤버 추가</DialogTitle>
                    <DialogDescription>새로운 멤버의 정보를 입력하세요</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* 프로필 이미지 업로드 */}
                    <div className="space-y-2">
                      <Label>프로필 이미지</Label>
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                          <Image
                            src={profilePreview || "/placeholder.svg?height=64&width=64&text=프로필"}
                            alt="프로필 미리보기"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleProfileImageUpload(e)}
                            className="hidden"
                            id="profile-upload"
                          />
                          <label
                            htmlFor="profile-upload"
                            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                          >
                            <ImageIcon className="h-4 w-4 mr-2" />
                            이미지 선택
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">이름 *</Label>
                        <Input
                          id="name"
                          value={newMember.name}
                          onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>성별 *</Label>
                        <RadioGroup
                          value={newMember.gender}
                          onValueChange={(value) => setNewMember({ ...newMember, gender: value })}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male" />
                            <Label htmlFor="male">남성</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female" />
                            <Label htmlFor="female">여성</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">이메일 *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newMember.email}
                        onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">전화번호 *</Label>
                        <Input
                          id="phone"
                          value={newMember.phone}
                          onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="birthDate">생년월일 *</Label>
                        <Input
                          id="birthDate"
                          type="date"
                          value={newMember.birthDate}
                          onChange={(e) => setNewMember({ ...newMember, birthDate: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="school">학교 *</Label>
                      <Input
                        id="school"
                        value={newMember.school}
                        onChange={(e) => setNewMember({ ...newMember, school: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="major">전공</Label>
                      <Input
                        id="major"
                        value={newMember.major}
                        onChange={(e) => setNewMember({ ...newMember, major: e.target.value })}
                        placeholder="예: 컴퓨터공학과"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="github">GitHub 주소</Label>
                      <Input
                        id="github"
                        value={newMember.github}
                        onChange={(e) => setNewMember({ ...newMember, github: e.target.value })}
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cohort">기수 *</Label>
                        <Select onValueChange={(value) => setNewMember({ ...newMember, cohort: value })}>
                          <SelectTrigger className="bg-[#1a1a1a] border-white/10 text-white">
                            <SelectValue placeholder="기수 선택" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                            {Array.from({ length: 30 }, (_, i) => i + 1).map((cohort) => (
                              <SelectItem key={cohort} value={cohort.toString()} className="text-white hover:bg-gray-700 focus:bg-gray-700">
                                {cohort}기
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">역할 *</Label>
                        <Select
                          onValueChange={(value: "MEMBER" | "ADMIN") =>
                            setNewMember({ ...newMember, role: value })
                          }
                        >
                          <SelectTrigger className="bg-[#1a1a1a] border-white/10 text-white">
                            <SelectValue placeholder="역할 선택" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                            <SelectItem value="MEMBER" className="text-white hover:bg-gray-700 focus:bg-gray-700">멤버</SelectItem>
                            <SelectItem value="ADMIN" className="text-white hover:bg-gray-700 focus:bg-gray-700">관리자</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddMember} className="flex-1 bg-[#d3431a] hover:bg-[#b8371a]">
                        추가
                      </Button>
                      <Button onClick={() => setIsAddDialogOpen(false)} variant="outline" className="flex-1">
                        취소
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* 통계 카드 */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-[#1a1a1a] border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-[#d3431a]" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-300">전체 멤버</p>
                      <p className="text-2xl font-bold text-white">{members.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-[#1a1a1a] border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-400" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-300">운영진</p>
                      <p className="text-2xl font-bold text-white">
                        {members.filter((m) => m.role === "ADMIN").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-[#1a1a1a] border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-green-400" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-300">일반 멤버</p>
                      <p className="text-2xl font-bold text-white">
                        {members.filter((m) => m.role === "MEMBER").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-[#1a1a1a] border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-orange-400" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-300">승인 대기</p>
                      <p className="text-2xl font-bold text-white">{pendingMembers.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 승인된 멤버 목록 */}
            <Card className="bg-[#121212] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">승인된 멤버 목록</CardTitle>
                <CardDescription className="text-gray-400">총 {filteredMembers.length}명의 멤버</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredMembers.length === 0 ? (
                  <div className="text-center py-12">
                    <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">승인된 멤버가 없습니다</h3>
                    <p className="text-gray-400">멤버를 추가하거나 승인 대기 목록을 확인해보세요</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredMembers.map((member) => (
                    <div
                      key={member.memberId}
                      className="flex items-center justify-between p-4 border border-white/10 rounded-lg hover:bg-gray-800 bg-[#1a1a1a]"
                    >
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                          <Image
                            src={member.profileImage || "/placeholder.svg?height=48&width=48&text=프로필"}
                            alt={`${member.name} 프로필`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <h3 className="font-semibold text-white">{member.name}</h3>
                            <Badge
                              className={
                                member.role === "ADMIN" ? "bg-[#d3431a] text-white" : "bg-white/10 text-white"
                              }
                            >
                              {member.role === "ADMIN" ? "관리자" : "멤버"}
                            </Badge>
                            <Badge variant="outline" className="border-white/20 text-white">{member.cohort}기</Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-300">
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3 flex-shrink-0 text-gray-400" />
                              <span className="truncate">{member.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3 flex-shrink-0 text-gray-400" />
                              <span>{member.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <School className="h-3 w-3 flex-shrink-0 text-gray-400" />
                              <span className="truncate">
                                {member.school} {member.major && `(${member.major})`}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Github className="h-3 w-3 flex-shrink-0 text-gray-400" />
                              <span className="truncate">
                                {member.github ? (
                                  <a
                                    href={member.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#d3431a] hover:underline"
                                  >
                                    GitHub
                                  </a>
                                ) : (
                                  "미등록"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingMember(member)
                          setProfilePreview(member.profileImage || "")
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        편집
                      </Button>
                    </div>
                  ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 승인 대기 멤버 탭 */}
          <TabsContent value="pending" className="space-y-6">
            <Card className="bg-[#121212] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">승인 대기 중인 멤버</CardTitle>
                <CardDescription className="text-gray-400">총 {pendingMembers.length}명이 승인을 기다리고 있습니다</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingMembers.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">승인 대기 중인 멤버가 없습니다</h3>
                    <p className="text-gray-400">새로운 가입 신청이 있으면 여기에 표시됩니다</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingMembers.map((member) => (
                      <div
                        key={member.memberId}
                        className="flex items-center justify-between p-4 border border-orange-500/20 rounded-lg bg-orange-500/5"
                      >
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                            <Image
                              src={member.profileImage || "/placeholder.svg?height=48&width=48&text=프로필"}
                              alt={`${member.name} 프로필`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <h3 className="font-semibold text-white">{member.name}</h3>
                              <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">승인 대기</Badge>
                              <Badge variant="outline" className="border-white/20 text-white">{member.cohort}기</Badge>
                              <Badge variant="outline" className="border-white/20 text-white">{member.role === "ADMIN" ? "관리자" : "멤버"}</Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3 flex-shrink-0 text-gray-400" />
                                <span className="truncate">{member.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-3 w-3 flex-shrink-0 text-gray-400" />
                                <span>{member.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <School className="h-3 w-3 flex-shrink-0 text-gray-400" />
                                <span className="truncate">{member.school}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleApproveMember(member.memberId)}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            승인
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                            onClick={() => handleRejectMember(member.memberId)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            거부
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 편집 다이얼로그 */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>멤버 정보 수정</DialogTitle>
              <DialogDescription>멤버의 정보를 수정하세요</DialogDescription>
            </DialogHeader>
            {editingMember && (
              <div className="space-y-4">
                {/* 프로필 이미지 업로드 */}
                <div className="space-y-2">
                  <Label>프로필 이미지</Label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                      <Image
                        src={editingMember.profileImage || "/placeholder.svg?height=64&width=64&text=프로필"}
                        alt="프로필 미리보기"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleProfileImageUpload(e, true)}
                        className="hidden"
                        id="edit-profile-upload"
                      />
                      <label
                        htmlFor="edit-profile-upload"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        이미지 변경
                      </label>
                      {editingMember.profileImage && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="ml-2 bg-transparent"
                          onClick={() => {
                            setEditingMember({ ...editingMember, profileImage: "" })
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">이름 *</Label>
                    <Input
                      id="edit-name"
                      value={editingMember.name}
                      onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>성별 *</Label>
                    <RadioGroup
                      value={editingMember.gender}
                      onValueChange={(value) => setEditingMember({ ...editingMember, gender: value })}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="edit-male" />
                        <Label htmlFor="edit-male">남성</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="edit-female" />
                        <Label htmlFor="edit-female">여성</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">이메일 *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingMember.email}
                    onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">전화번호 *</Label>
                    <Input
                      id="edit-phone"
                      value={editingMember.phone}
                      onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-birthDate">생년월일 *</Label>
                    <Input
                      id="edit-birthDate"
                      type="date"
                      value={editingMember.birthDate}
                      onChange={(e) => setEditingMember({ ...editingMember, birthDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-school">학교 *</Label>
                  <Input
                    id="edit-school"
                    value={editingMember.school}
                    onChange={(e) => setEditingMember({ ...editingMember, school: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-major">전공</Label>
                  <Input
                    id="edit-major"
                    value={editingMember.major || ""}
                    onChange={(e) => setEditingMember({ ...editingMember, major: e.target.value })}
                    placeholder="예: 컴퓨터공학과"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-github">GitHub 주소</Label>
                  <Input
                    id="edit-github"
                    value={editingMember.github || ""}
                    onChange={(e) => setEditingMember({ ...editingMember, github: e.target.value })}
                    placeholder="https://github.com/username"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-cohort">기수 *</Label>
                    <Select
                      value={editingMember.cohort.toString()}
                      onValueChange={(value) => setEditingMember({ ...editingMember, cohort: Number.parseInt(value) })}
                    >
                      <SelectTrigger className="bg-[#1a1a1a] border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                        {Array.from({ length: 30 }, (_, i) => i + 1).map((cohort) => (
                          <SelectItem key={cohort} value={cohort.toString()} className="text-white hover:bg-gray-700 focus:bg-gray-700">
                            {cohort}기
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-role">역할 *</Label>
                    <Select
                      value={editingMember.role}
                      onValueChange={(value: "MEMBER" | "ADMIN") =>
                        setEditingMember({ ...editingMember, role: value })
                      }
                    >
                      <SelectTrigger className="bg-[#1a1a1a] border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                        <SelectItem value="MEMBER" className="text-white hover:bg-gray-700 focus:bg-gray-700">멤버</SelectItem>
                        <SelectItem value="ADMIN" className="text-white hover:bg-gray-700 focus:bg-gray-700">관리자</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleEditMember} className="flex-1 bg-[#d3431a] hover:bg-[#b8371a]">
                    저장
                  </Button>
                  <Button onClick={() => setIsEditDialogOpen(false)} variant="outline" className="flex-1">
                    취소
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
