"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Github, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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
  otherLink?: string
  status?: "pending" | "approved" | "rejected"
  position?: "회장" | "기획부" | "교육부" | "총무부" | "멤버"
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCohort, setSelectedCohort] = useState("all")
  const [selectedRole, setSelectedRole] = useState("all")

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    const dummyMembers: Member[] = [
      {
        id: "d1",
        name: "노승수",
        email: "seoyeon@example.com",
        phone: "010-1111-2222",
        school: "",
        major: "",
        gender: "female",
        birthDate: "2001-05-10",
        cohort: 15,
        role: "management",
        position: "회장",
        joinDate: "2024-03-01",
        profileImage: "/placeholder-user.jpg",
        github: "https://github.com/example1",
        otherLink: "https://techblog.example.com",
        status: "approved",
      },
      {
        id: "d2",
        name: "서정훈",
        email: "junho@example.com",
        phone: "010-3333-4444",
        school: "",
        major: "",
        gender: "male",
        birthDate: "2000-11-22",
        cohort: 15,
        role: "member",
        position: "기획부",
        joinDate: "2023-09-01",
        profileImage: "/placeholder-user.jpg",
        github: "https://github.com/example2",
        otherLink: "https://www.linkedin.com/in/example2",
        status: "approved",
      },
      {
        id: "d3",
        name: "박승현",
        email: "jihu@example.com",
        phone: "010-5555-6666",
        school: "",
        major: "",
        gender: "male",
        birthDate: "2002-02-14",
        cohort: 16,
        role: "member",
        position: "기획부",
        joinDate: "2024-03-01",
        profileImage: "/placeholder-user.jpg",
        github: "",
        otherLink: "https://blog.example.com/jihu",
        status: "approved",
      },
      {
        id: "d4",
        name: "최지민",
        email: "jimin@example.com",
        phone: "010-7777-8888",
        school: "",
        major: "",
        gender: "female",
        birthDate: "2001-08-30",
        cohort: 14,
        role: "member",
        position: "멤버",
        joinDate: "2022-09-01",
        profileImage: "/placeholder-user.jpg",
        github: "https://github.com/example3",
        otherLink: "https://portfolio.example.com/jimin",
        status: "approved",
      },
    ]
    try {
      const response = await fetch("/api/members?status=approved")
      const result = await response.json()

      if (result.success) {
        if (Array.isArray(result.data) && result.data.length > 0) {
          setMembers(result.data)
        } else {
          setMembers(dummyMembers)
        }
      } else {
        console.error("Failed to fetch members:", result.error)
        setMembers(dummyMembers)
      }
    } catch (error) {
      console.error("Error fetching members:", error)
      setMembers(dummyMembers)
    } finally {
      setLoading(false)
    }
  }

  const filteredMembers = members.filter((member) => {
    const matchesCohort = selectedCohort === "all" || member.cohort.toString() === selectedCohort
    const matchesRole = selectedRole === "all" || member.role === selectedRole
    return matchesCohort && matchesRole
  })

  const cohorts = Array.from(new Set(members.map((m) => m.cohort))).sort((a, b) => b - a)

  // 기수별로 그룹화
  const membersByCohort = cohorts.reduce(
    (acc, cohort) => {
      acc[cohort] = filteredMembers.filter((member) => member.cohort === cohort)
      return acc
    },
    {} as Record<number, Member[]>,
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">멤버 정보를 불러오는 중...</div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10 text-center">
          <p className="text-sm text-white/60 mb-2">멤버소개</p>
          <h1 className="text-2xl md:text-3xl font-bold text-[#ff6b35]">함께 미래를 그려나가는 BITAmin 멤버를 소개합니다</h1>
        </div>

        {/* 필터 */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <Select value={selectedCohort} onValueChange={setSelectedCohort}>
              <SelectTrigger className="w-full sm:w-48 bg-[#141414] border-white/10 text-white">
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

            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full sm:w-40 bg-[#141414] border-white/10 text-white">
                <SelectValue placeholder="역할" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                <SelectItem value="all" className="text-white hover:bg-gray-700 focus:bg-gray-700">전체</SelectItem>
                <SelectItem value="management" className="text-white hover:bg-gray-700 focus:bg-gray-700">운영진</SelectItem>
                <SelectItem value="member" className="text-white hover:bg-gray-700 focus:bg-gray-700">멤버</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 기수별 멤버 목록 */}
        <div className="space-y-10">
          {cohorts.map((cohort) => {
            const cohortMembers = membersByCohort[cohort]
            if (!cohortMembers || cohortMembers.length === 0) return null

            return (
              <div key={cohort}>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-bold">{cohort}기</h2>
                  <Badge variant="outline" className="text-sm border-white/20 text-white/80">
                    {cohortMembers.length}명
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {cohortMembers.map((member) => (
                    <Card key={member.id} className="transition-transform hover:-translate-y-0.5 bg-[#121212] border-white/10">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-white/10 border border-white/10">
                            <Image
                              src={member.profileImage || "/placeholder.svg?height=80&width=80&text=프로필"}
                              alt={`${member.name} 프로필`}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="space-y-3">
                            <div className="flex flex-col items-center justify-center gap-1">
                              <Badge className="bg-white/10 text-white px-3 py-1">
                                {member.position || (member.role === "management" ? "운영진" : "멤버")}
                              </Badge>
                              <h3 className="font-semibold text-lg text-white">{member.name}</h3>
                            </div>

                            <div className="flex items-center justify-center gap-3">
                              {member.github && (
                                <Link
                                  href={member.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-sm text-[#ff6b35] hover:text-[#ff875c] transition-colors"
                                >
                                  <Github className="h-4 w-4" />
                                  GitHub
                                </Link>
                              )}
                              {member.otherLink && (
                                <Link
                                  href={member.otherLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-sm text-[#ff6b35] hover:text-[#ff875c] transition-colors"
                                >
                                  <User className="h-4 w-4" />
                                  Link
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-white/40 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">표시할 멤버가 없습니다</h3>
            <p className="text-white/60">다른 필터를 시도해보세요</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
