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
  cohort: number
  name: string
  link1: string | null
  link2: string | null
  depart: string | null
  image: string | null
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCohort, setSelectedCohort] = useState("active")

  useEffect(() => {
    fetchMembers()
    
    // 페이지 포커스 시 데이터 새로고침 (마이페이지에서 돌아올 때)
    const handleFocus = () => {
      fetchMembers()
    }
    
    window.addEventListener('focus', handleFocus)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const fetchMembers = async () => {
    try {
      const response = await fetch("/api/members/all")
      const result = await response.json()
      
      if (result.success && result.data) {
        setMembers(result.data)
      } else {
        setMembers([])
      }
    } catch (error) {
      setMembers([])
    } finally {
      setLoading(false)
    }
  }

  const cohorts = Array.from(new Set(members.map((m) => m.cohort))).sort((a, b) => b - a)
  
  // 활동 중인 기수 (최신 2개 기수)
  const activeCohorts = cohorts.slice(0, 2)

  const filteredMembers = members.filter((member) => {
    if (selectedCohort === "all") {
      return true
    } else if (selectedCohort === "active") {
      // 활동 중인 최신 2개 기수만 표시
      return activeCohorts.includes(member.cohort)
    } else {
      return member.cohort.toString() === selectedCohort
    }
  })

  // 표시할 기수 목록 결정
  const displayCohorts = selectedCohort === "active" ? activeCohorts : 
                         selectedCohort === "all" ? cohorts :
                         cohorts.filter(c => c.toString() === selectedCohort)

  // 기수별로 그룹화
  const membersByCohort = displayCohorts.reduce(
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
                <SelectItem value="active" className="text-white hover:bg-gray-700 focus:bg-gray-700">
                  활동 중인 기수
                </SelectItem>
                <SelectItem value="all" className="text-white hover:bg-gray-700 focus:bg-gray-700">전체 기수</SelectItem>
                {cohorts.map((cohort) => (
                  <SelectItem key={cohort} value={cohort.toString()} className="text-white hover:bg-gray-700 focus:bg-gray-700">
                    {cohort}기
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 기수별 멤버 목록 */}
        <div className="space-y-10">
          {displayCohorts.map((cohort) => {
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
                    <Card key={`${member.name}-${member.cohort}`} className="transition-transform hover:-translate-y-0.5 bg-[#121212] border-white/10">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-700 border-2 border-white/20">
                            {member.image && member.image.trim() !== "" ? (
                              <>
                                <img
                                  src={member.image}
                                  alt={`${member.name} 프로필`}
                                  className="object-cover w-full h-full"
                                />
                              </>
                            ) : (
                              <>
                                <div className="w-full h-full flex items-center justify-center">
                                  <User className="w-10 h-10 text-gray-400" />
                                </div>
                              </>
                            )}
                          </div>

                          <div className="space-y-3">
                            <div className="flex flex-col items-center justify-center gap-1">
                              {member.depart && (
                                <Badge 
                                  variant="secondary" 
                                  className="bg-[#ff6b35] text-white text-xs px-2 py-1 rounded-full"
                                >
                                  {member.depart}
                                </Badge>
                              )}
                              {!member.depart && (
                                <Badge 
                                  variant="secondary" 
                                  className="bg-white/10 text-white text-xs px-2 py-1 rounded-full"
                                >
                                  멤버
                                </Badge>
                              )}
                              <h3 className="font-semibold text-lg text-white">{member.name}</h3>
                            </div>

                            <div className="flex items-center justify-center gap-3">
                              {member.link1 && member.link1.trim() !== "" && (
                                <>
                                  <Link
                                    href={member.link1}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-sm text-[#ff6b35] hover:text-[#ff875c] transition-colors"
                                  >
                                    <Github className="h-4 w-4" />
                                    GitHub
                                  </Link>
                                </>
                              )}
                              {member.link2 && member.link2.trim() !== "" && (
                                <>
                                  <Link
                                    href={member.link2}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-sm text-[#ff6b35] hover:text-[#ff875c] transition-colors"
                                  >
                                    <User className="h-4 w-4" />
                                    Link
                                  </Link>
                                </>
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
