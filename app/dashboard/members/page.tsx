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
  id: string
  name: string
  email: string
  phone: string
  school: string
  major?: string
  gender: string
  birthDate: string
  cohort: number
  role: "member" | "management"
  joinDate: string
  profileImage?: string
  github?: string
  status?: "pending" | "approved" | "rejected"
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
    role: "member" as "member" | "management",
    github: "",
  })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "management") {
      router.push("/dashboard")
    } else {
      fetchMembers()
      fetchPendingMembers()
    }
  }, [isAuthenticated, user, router])

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/members?status=approved", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const result = await response.json()

      if (result.success) {
        setMembers(result.data)
      } else {
        console.error("Failed to fetch members:", result.error)
      }
    } catch (error) {
      console.error("Error fetching members:", error)
    }
  }

  const fetchPendingMembers = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/members?status=pending", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const result = await response.json()

      if (result.success) {
        setPendingMembers(result.data)
      } else {
        console.error("Failed to fetch pending members:", result.error)
      }
    } catch (error) {
      console.error("Error fetching pending members:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveMember = async (memberId: string) => {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`/api/members/approve/${memberId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const result = await response.json()

      if (result.success) {
        // 승인된 멤버를 pending에서 제거하고 approved로 이동
        const approvedMember = pendingMembers.find((m) => m.id === memberId)
        if (approvedMember) {
          setPendingMembers(pendingMembers.filter((m) => m.id !== memberId))
          setMembers([...members, { ...approvedMember, status: "approved" }])
          alert(`${approvedMember.name}님의 가입이 승인되었습니다.`)
        }
      } else {
        alert(result.error || "멤버 승인에 실패했습니다.")
      }
    } catch (error) {
      console.error("Error approving member:", error)
      alert("멤버 승인 중 오류가 발생했습니다.")
    }
  }

  const handleRejectMember = async (memberId: string) => {
    const memberToReject = pendingMembers.find((m) => m.id === memberId)
    if (!memberToReject) return

    if (!confirm(`${memberToReject.name}님의 가입을 거부하시겠습니까?`)) return

    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`/api/members/reject/${memberId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const result = await response.json()

      if (result.success) {
        setPendingMembers(pendingMembers.filter((m) => m.id !== memberId))
        alert(`${memberToReject.name}님의 가입이 거부되었습니다.`)
      } else {
        alert(result.error || "멤버 거부에 실패했습니다.")
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
          role: "member",
          github: "",
        })
        setProfilePreview("")
        setIsAddDialogOpen(false)
        alert("멤버가 추가되었습니다!")
      } else {
        alert(result.error || "멤버 추가에 실패했습니다.")
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
      const response = await fetch(`/api/members/${editingMember.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingMember),
      })

      const result = await response.json()

      if (result.success) {
        setMembers(members.map((member) => (member.id === editingMember.id ? result.data : member)))
        setEditingMember(null)
        setProfilePreview("")
        setIsEditDialogOpen(false)
        alert("멤버 정보가 수정되었습니다!")
      } else {
        alert(result.error || "멤버 수정에 실패했습니다.")
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

  if (!isAuthenticated || user?.role !== "management") {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">멤버 정보를 불러오는 중...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">멤버 관리</h1>
          <p className="text-gray-600">동아리 멤버들의 정보를 관리하세요</p>
        </div>

        <Tabs defaultValue="approved" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="approved" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              승인된 멤버
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
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
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="기수 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 기수</SelectItem>
                  {cohorts.map((cohort) => (
                    <SelectItem key={cohort} value={cohort.toString()}>
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
                          <SelectTrigger>
                            <SelectValue placeholder="기수 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 30 }, (_, i) => i + 1).map((cohort) => (
                              <SelectItem key={cohort} value={cohort.toString()}>
                                {cohort}기
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">역할 *</Label>
                        <Select
                          onValueChange={(value: "member" | "management") =>
                            setNewMember({ ...newMember, role: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="역할 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="member">멤버</SelectItem>
                            <SelectItem value="management">운영진</SelectItem>
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
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-[#d3431a]" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">전체 멤버</p>
                      <p className="text-2xl font-bold text-gray-900">{members.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">운영진</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {members.filter((m) => m.role === "management").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">일반 멤버</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {members.filter((m) => m.role === "member").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">승인 대기</p>
                      <p className="text-2xl font-bold text-gray-900">{pendingMembers.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 승인된 멤버 목록 */}
            <Card>
              <CardHeader>
                <CardTitle>승인된 멤버 목록</CardTitle>
                <CardDescription>총 {filteredMembers.length}명의 멤버</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
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
                            <h3 className="font-semibold text-gray-900">{member.name}</h3>
                            <Badge
                              className={
                                member.role === "management" ? "bg-[#d3431a] text-white" : "bg-gray-100 text-gray-800"
                              }
                            >
                              {member.role === "management" ? "운영진" : "멤버"}
                            </Badge>
                            <Badge variant="outline">{member.cohort}기</Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{member.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3 flex-shrink-0" />
                              <span>{member.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <School className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">
                                {member.school} {member.major && `(${member.major})`}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Github className="h-3 w-3 flex-shrink-0" />
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* 승인 대기 멤버 탭 */}
          <TabsContent value="pending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>승인 대기 중인 멤버</CardTitle>
                <CardDescription>총 {pendingMembers.length}명이 승인을 기다리고 있습니다</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingMembers.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">승인 대기 중인 멤버가 없습니다</h3>
                    <p className="text-gray-500">새로운 가입 신청이 있으면 여기에 표시됩니다</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 border-yellow-200"
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
                              <h3 className="font-semibold text-gray-900">{member.name}</h3>
                              <Badge className="bg-yellow-100 text-yellow-800">승인 대기</Badge>
                              <Badge variant="outline">{member.cohort}기</Badge>
                              <Badge variant="outline">{member.role === "management" ? "운영진" : "멤버"}</Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{member.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-3 w-3 flex-shrink-0" />
                                <span>{member.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <School className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{member.school}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleApproveMember(member.id)}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            승인
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                            onClick={() => handleRejectMember(member.id)}
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
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 30 }, (_, i) => i + 1).map((cohort) => (
                          <SelectItem key={cohort} value={cohort.toString()}>
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
                      onValueChange={(value: "member" | "management") =>
                        setEditingMember({ ...editingMember, role: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">멤버</SelectItem>
                        <SelectItem value="management">운영진</SelectItem>
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
