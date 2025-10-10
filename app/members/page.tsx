"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Github, School, User } from "lucide-react"
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
  status?: "pending" | "approved" | "rejected"
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
    try {
      const response = await fetch("/api/members?status=approved")
      const result = await response.json()

      if (result.success) {
        setMembers(result.data)
      } else {
        console.error("Failed to fetch members:", result.error)
      }
    } catch (error) {
      console.error("Error fetching members:", error)
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">멤버</h1>
          <p className="text-gray-600">비타민 동아리 멤버들을 소개합니다</p>
        </div>

        {/* 필터 */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
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

            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="역할" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="management">운영진</SelectItem>
                <SelectItem value="member">멤버</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 기수별 멤버 목록 */}
        <div className="space-y-8">
          {cohorts.map((cohort) => {
            const cohortMembers = membersByCohort[cohort]
            if (!cohortMembers || cohortMembers.length === 0) return null

            return (
              <div key={cohort}>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{cohort}기</h2>
                  <Badge variant="outline" className="text-sm">
                    {cohortMembers.length}명
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {cohortMembers.map((member) => (
                    <Card key={member.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                            <Image
                              src={member.profileImage || "/placeholder.svg?height=80&width=80&text=프로필"}
                              alt={`${member.name} 프로필`}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-center gap-2">
                              <h3 className="font-semibold text-gray-900">{member.name}</h3>
                              <Badge
                                className={
                                  member.role === "management" ? "bg-[#d3431a] text-white" : "bg-gray-100 text-gray-800"
                                }
                              >
                                {member.role === "management" ? "운영진" : "멤버"}
                              </Badge>
                            </div>

                            <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                              <School className="h-4 w-4" />
                              <span>{member.school}</span>
                            </div>

                            {member.major && <div className="text-sm text-gray-600">{member.major}</div>}

                            {member.github && (
                              <Link
                                href={member.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-[#d3431a] hover:text-[#b8371a] transition-colors"
                              >
                                <Github className="h-4 w-4" />
                                GitHub
                              </Link>
                            )}
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
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">표시할 멤버가 없습니다</h3>
            <p className="text-gray-500">다른 필터를 시도해보세요</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
