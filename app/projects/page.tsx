"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Users, Download, Eye, Search, Plus, Award } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth, isAdmin } from "@/lib/auth"

interface Project {
  projectId: number
  thumbnail: string | null
  ppt: string | null
  title: string
  cohort: string[]
  category: string
  period: string
  member: string
  award: string
}

export default function ProjectsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCohort, setSelectedCohort] = useState("all")
  const [selectedAward, setSelectedAward] = useState("all")

  useEffect(() => {
    fetchProjects()
  }, [])

  // URL 파라미터에서 refresh가 있으면 새로고침
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('refresh') === 'true') {
      // 강제 새로고침을 위해 약간의 지연 후 실행
      setTimeout(() => {
        fetchProjects(true) // 강제 새로고침
        // URL에서 refresh 파라미터 제거
        const newUrl = window.location.pathname
        window.history.replaceState({}, '', newUrl)
      }, 100)
    }
  }, [])

  useEffect(() => {
    filterProjects()
  }, [projects, searchQuery, selectedCohort, selectedAward])

  const filterProjects = () => {
    let filtered = projects

    // 검색어 필터
    if (searchQuery) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.member.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // 기수 필터
    if (selectedCohort !== "all") {
      filtered = filtered.filter((project) => project.cohort.includes(selectedCohort))
    }

    // 수상 필터
    if (selectedAward !== "all") {
      filtered = filtered.filter((project) => project.award === selectedAward)
    }
    
    setFilteredProjects(filtered)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCohort("all")
    setSelectedAward("all")
  }

  const fetchProjects = async (forceRefresh = false) => {
    try {
      setLoading(true)
      // 캐시 방지를 위해 timestamp와 랜덤 파라미터 추가
      const timestamp = Date.now()
      const random = Math.random()
      const response = await fetch(`/api/project/all?t=${timestamp}&r=${random}&force=${forceRefresh}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'If-Modified-Since': '0',
          'If-None-Match': '*'
        },
        cache: 'no-store'
      })
      const result = await response.json()

      if (result.success) {
        // 백엔드 응답 데이터를 그대로 사용 (projectId 포함)
        setProjects(result.data)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const getAwardText = (award: string) => {
    switch (award) {
      case "GRAND_PRIZE":
        return "대상"
      case "GOLD_PRIZE":
        return "최우수상"
      case "MERIT_AWARD":
        return "우수상"
      default:
        return award
    }
  }

  const getAwardBadge = (award: string) => {
    switch (award) {
      case "GRAND_PRIZE":
        return { color: "text-yellow-600 bg-yellow-100 border-yellow-300", icon: Award }
      case "GOLD_PRIZE":
        return { color: "text-blue-600 bg-blue-100 border-blue-300", icon: Award }
      case "MERIT_AWARD":
        return { color: "text-green-600 bg-green-100 border-green-300", icon: Award }
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d3431a] mx-auto"></div>
            <p className="mt-4 text-white">로딩 중...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 헤더 섹션 */}
          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">프로젝트</h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8">비타민 멤버들이 진행한 우수 프로젝트를 확인하세요</p>

            {/* 프로젝트 업로드 버튼 (운영진만) */}
            {user && isAdmin(user.role) && (
              <Button
                onClick={() => router.push("/projects/write")}
                className="bg-[#d3431a] hover:bg-[#b8361a] text-white mb-8"
              >
                <Plus className="w-4 h-4 mr-2" />
                프로젝트 업로드
              </Button>
            )}

            {/* 필터 섹션 */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="프로젝트 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                />
              </div>

              <Select value={selectedCohort} onValueChange={setSelectedCohort}>
                <SelectTrigger className="w-full md:w-[180px] bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="기수 선택" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all" className="text-white hover:bg-gray-700 focus:bg-gray-700 data-[state=checked]:bg-gray-700 data-[state=checked]:text-white">전체 기수</SelectItem>
                  {Array.from({ length: 20 }, (_, i) => (
                    <SelectItem key={i + 1} value={`${i + 1}기`} className="text-white hover:bg-gray-700 focus:bg-gray-700 data-[state=checked]:bg-gray-700 data-[state=checked]:text-white">
                      {i + 1}기
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedAward} onValueChange={setSelectedAward}>
                <SelectTrigger className="w-full md:w-[180px] bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="수상 선택" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all" className="text-white hover:bg-gray-700 focus:bg-gray-700 data-[state=checked]:bg-gray-700 data-[state=checked]:text-white">전체 수상</SelectItem>
                  <SelectItem value="GRAND_PRIZE" className="text-white hover:bg-gray-700 focus:bg-gray-700 data-[state=checked]:bg-gray-700 data-[state=checked]:text-white">대상</SelectItem>
                  <SelectItem value="GOLD_PRIZE" className="text-white hover:bg-gray-700 focus:bg-gray-700 data-[state=checked]:bg-gray-700 data-[state=checked]:text-white">최우수상</SelectItem>
                  <SelectItem value="MERIT_AWARD" className="text-white hover:bg-gray-700 focus:bg-gray-700 data-[state=checked]:bg-gray-700 data-[state=checked]:text-white">우수상</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 필터 결과 */}
            <div className="mt-4 text-sm text-gray-400">
              총 <span className="text-[#d3431a] font-semibold">{filteredProjects.length}</span>개의 프로젝트
            </div>
          </div>

          {/* 프로젝트 그리드 */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => {
                const awardBadge = project.award ? getAwardBadge(project.award) : null
                
                return (
                <Card
                  key={index}
                  className="bg-gray-800/50 border-gray-700 hover:border-[#d3431a] transition-all cursor-pointer group overflow-hidden shadow-lg hover:shadow-xl"
                >
                  <div className="relative h-64 overflow-hidden">
                    {project.thumbnail && !project.thumbnail.includes('null') ? (
                      <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized={true}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-600 to-gray-800">
                        <div className="text-center">
                          <div className="text-6xl mb-3">📁</div>
                          <div className="text-sm font-medium">{project.title}</div>
                          <div className="text-xs text-gray-500 mt-1">이미지 없음</div>
                        </div>
                      </div>
                    )}
                    
                    {awardBadge && (
                      <div className="absolute top-3 left-3">
                        <Badge className={`${awardBadge.color} border shadow-lg`}>
                          <awardBadge.icon className="w-3 h-3 mr-1" />
                          {getAwardText(project.award)}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-[#d3431a] transition-colors line-clamp-2 flex-1">
                        {project.title}
                      </h3>
                    </div>

                    {/* 기술 도메인과 기수를 한 줄에 배치 */}
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="outline" className="text-gray-400 border-gray-600">
                        {project.category}
                      </Badge>
                      {/* 기수 정보를 2번째 사진처럼 동그라미 배지로 */}
                      {project.cohort.map((cohort) => (
                        <Badge
                          key={cohort}
                          className="bg-gray-800 text-orange-500 border-orange-500 rounded-full px-3 py-1 text-xs font-medium"
                        >
                          {cohort}
                        </Badge>
                      ))}
                    </div>

                    {/* 기간과 참여자 이름 */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-500 text-sm mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-[#d3431a] flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{project.period}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 text-[#d3431a] flex-shrink-0" />
                        <span className="line-clamp-1 text-xs sm:text-sm">{project.member}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {project.projectId ? (
                        <Link href={`/projects/${project.projectId}`} className="flex-1">
                          <Button
                            variant="outline"
                            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent hover:border-[#d3431a] hover:text-[#d3431a] transition-all"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            상세보기
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          variant="outline"
                          className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                          disabled
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          상세보기
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}