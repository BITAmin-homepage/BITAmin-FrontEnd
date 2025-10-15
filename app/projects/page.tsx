"use client"

import { useAuth } from "@/lib/auth"
import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Search, Calendar, Users, Upload, Award, Trophy, Medal, Star, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Project {
  id: number
  title: string
  description: string
  cohort: string
  period: "방학" | "학기"
  award: "대상" | "최우수상" | "우수상"
  thumbnail?: string
  pptFile?: string
  teamMembers: string[]
  projectPeriod: string
  category: string
  createdAt?: string
  updatedAt?: string
}

export default function ProjectsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCohort, setSelectedCohort] = useState("all")
  const [selectedPeriod, setSelectedPeriod] = useState("all")
  const [selectedAward, setSelectedAward] = useState("all")
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const queryParams = new URLSearchParams({
        search: searchTerm,
        cohort: selectedCohort === "all" ? "" : selectedCohort,
        period: selectedPeriod === "all" ? "" : selectedPeriod,
        award: selectedAward === "all" ? "" : selectedAward,
      })

      const response = await fetch(`/api/projects?${queryParams}`)
      const result = await response.json()

      if (result.success) {
        setProjects(result.data)
      } else {
        console.error("Failed to fetch projects:", result.error)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  // 검색/필터 변경 시 재조회
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProjects()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, selectedCohort, selectedPeriod, selectedAward])

  const handleDeleteProject = async (projectId: number) => {
    if (!confirm("정말로 이 프로젝트를 삭제하시겠습니까?")) return

    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const result = await response.json()

      if (result.success) {
        setProjects(projects.filter((p) => p.id !== projectId))
        alert("프로젝트가 삭제되었습니다.")
      } else {
        alert(result.error || "프로젝트 삭제에 실패했습니다.")
      }
    } catch (error) {
      console.error("Error deleting project:", error)
      alert("프로젝트 삭제 중 오류가 발생했습니다.")
    }
  }

  const handleDownloadPPT = async (project: Project) => {
    if (!project.pptFile) {
      alert("PPT 파일이 없습니다.")
      return
    }

    try {
      // 실제로는 백엔드에서 파일 다운로드 URL을 제공
      const response = await fetch(`/api/projects/${project.id}/download/ppt`)
      const result = await response.json()

      if (result.success && result.downloadUrl) {
        // 새 창에서 다운로드
        window.open(result.downloadUrl, "_blank")
      } else {
        alert("파일 다운로드에 실패했습니다.")
      }
    } catch (error) {
      console.error("Error downloading PPT:", error)
      alert("파일 다운로드 중 오류가 발생했습니다.")
    }
  }

  const getAwardColor = (award: string) => {
    switch (award) {
      case "대상":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "최우수상":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "우수상":
        return "bg-green-100 text-green-800 border-green-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getAwardIcon = (award: string) => {
    switch (award) {
      case "대상":
        return <Trophy className="h-4 w-4 text-yellow-600" />
      case "최우수상":
        return <Medal className="h-4 w-4 text-blue-600" />
      case "우수상":
        return <Star className="h-4 w-4 text-green-600" />
      default:
        return <Award className="h-4 w-4 text-gray-600" />
    }
  }

  const cohorts = Array.from(new Set(projects.map((p) => p.cohort))).sort()

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-white/70">프로젝트를 불러오는 중...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-16">
          <p className="text-sm text-white/60 mb-2">프로젝트</p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#ff6b35]">
            프로젝트를 통해 이론을 현실로, 아이디어를 결과로 만들어갑니다
          </h2>
        </div>

        {/* 검색 및 필터 */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-4 w-4" />
            <Input
              placeholder="프로젝트 제목, 설명, 카테고리로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#141414] border-white/10 text-white placeholder:text-white/40"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <Select value={selectedCohort} onValueChange={setSelectedCohort}>
              <SelectTrigger className="w-full sm:w-48 bg-[#141414] border-white/10 text-white">
                <SelectValue placeholder="기수 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 기수</SelectItem>
                {cohorts.map((cohort) => (
                  <SelectItem key={cohort} value={cohort}>
                    {cohort}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full sm:w-32 bg-[#141414] border-white/10 text-white">
                <SelectValue placeholder="기간" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="방학">방학</SelectItem>
                <SelectItem value="학기">학기</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedAward} onValueChange={setSelectedAward}>
              <SelectTrigger className="w-full sm:w-40 bg-[#141414] border-white/10 text-white">
                <SelectValue placeholder="수상" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 수상</SelectItem>
                <SelectItem value="대상">대상</SelectItem>
                <SelectItem value="최우수상">최우수상</SelectItem>
                <SelectItem value="우수상">우수상</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 업로드 버튼 (운영진만) */}
        {user?.role === "management" && (
          <div className="mb-6">
            <Link href="/projects/write">
              <Button className="bg-[#d3431a] hover:bg-[#b8371a] text-white">
                <Upload className="h-4 w-4 mr-2" />새 프로젝트 업로드
              </Button>
            </Link>
          </div>
        )}

        {/* 프로젝트 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-all duration-300 group bg-[#111] border-white/10 text-white">
              <div className="relative">
                <div className="aspect-video relative overflow-hidden rounded-t-lg bg-white/10">
                  <Image
                    src={project.thumbnail || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute top-3 left-3">
                  <Badge className={`${getAwardColor(project.award)} border font-semibold flex items-center gap-1`}>
                    {getAwardIcon(project.award)} {project.award}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-black bg-opacity-70 text-white">
                    {project.period}
                  </Badge>
                </div>
                {/* 운영진용 수정/삭제 버튼 */}
                {user?.role === "management" && (
                  <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/projects/edit/${project.id}`}>
                      <Button size="sm" variant="secondary" className="bg-white bg-opacity-90 hover:bg-opacity-100">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-red-500 text-white hover:bg-red-600"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs border-white/20 text-white/80">
                    {project.cohort}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-white/20 text-white/80">
                    {project.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg line-clamp-2 group-hover:text-[#d3431a] transition-colors">
                  {project.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-white/70">{project.description}</CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Users className="h-4 w-4" />
                    <span className="truncate">{project.teamMembers.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Calendar className="h-4 w-4" />
                    <span>{project.projectPeriod}</span>
                  </div>
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent border-white/20 text-white hover:bg-white/10"
                      onClick={() => handleDownloadPPT(project)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      PPT 다운로드
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <Award className="h-12 w-12 text-white/40 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">검색 결과가 없습니다</h3>
            <p className="text-white/60">다른 검색어나 필터를 시도해보세요</p>
          </div>
        )}
      </div>
    </div>
  )
}
