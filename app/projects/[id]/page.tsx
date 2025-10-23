"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, ArrowLeft, Trophy, Tag, FileText, Calendar as CalendarIcon, Award, Download, Lock } from "lucide-react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/lib/auth"

interface ProjectDetail {
  projectId: number
  title: string
  category: string
  description: string
  cohort: string[]
  period: string | null
  award: string
  member: string
  startDate: string
  endDate: string
  ppt: string | null
  thumbnail: string | null
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("Params:", params)
    if (params.id && params.id !== 'undefined') {
      fetchProject()
    }
  }, [params.id])

  const fetchProject = async () => {
    try {
      setLoading(true)
      const projectId = params.id as string
      console.log("Fetching project with ID:", projectId)
      
      if (!projectId || projectId === 'undefined') {
        console.error("Invalid project ID:", projectId)
        return
      }
      
      const response = await fetch(`/api/project/${projectId}`)
      console.log("Response status:", response.status)
      
      const result = await response.json()
      console.log("API result:", result)

      if (result.success) {
        setProject(result.data)
      } else {
        console.error("Failed to fetch project:", result.error)
      }
    } catch (error) {
      console.error("Error fetching project:", error)
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

  const handleDownload = () => {
    if (!user) {
      alert("PPT 다운로드는 로그인이 필요합니다.")
      return
    }

    if (project?.ppt) {
      window.open(project.ppt, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
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

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-white text-xl mb-4">프로젝트를 찾을 수 없습니다.</p>
            <Button onClick={() => router.push("/projects")} className="bg-[#d3431a] hover:bg-[#b8361a]">
              프로젝트 목록으로
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const awardBadge = project.award ? getAwardBadge(project.award) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 뒤로가기 버튼 */}
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white mb-6"
            onClick={() => router.push("/projects")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            목록으로
          </Button>

          {/* 프로젝트 헤더 */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {project.cohort.map((cohort) => (
                <Badge key={cohort} variant="outline" className="text-[#d3431a] border-[#d3431a]">
                  {cohort}
                </Badge>
              ))}
              <Badge variant="outline" className="text-blue-400 border-blue-600">
                {project.period}
              </Badge>
              <Badge variant="outline" className="text-gray-400 border-gray-600">
                {project.category}
              </Badge>
              {awardBadge && (
                <Badge className={`${awardBadge.color} border`}>
                  <awardBadge.icon className="w-3 h-3 mr-1" />
                  {getAwardText(project.award)}
                </Badge>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{project.title}</h1>
          </div>

          {/* 프로젝트 정보 */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#d3431a]" />
                  팀원
                </h3>
                <p className="text-gray-300">{project.member}</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#d3431a]" />
                  프로젝트 기간
                </h3>
                <p className="text-gray-300">{project.startDate} ~ {project.endDate}</p>
              </CardContent>
            </Card>
          </div>

          {/* 프로젝트 설명 */}
          <Card className="bg-gray-800/50 border-gray-700 mb-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#d3431a]" />
                프로젝트 설명
              </h3>
              <p className="text-gray-300 leading-relaxed">{project.description}</p>
            </CardContent>
          </Card>

          {/* PPT 다운로드 */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">프로젝트 발표 자료</h3>
                {user ? (
                  <Button onClick={handleDownload} className="bg-[#d3431a] hover:bg-[#b8361a] text-white">
                    <Download className="w-4 h-4 mr-2" />
                    PPT 다운로드
                  </Button>
                ) : (
                  <Button disabled className="bg-gray-700 text-gray-400 cursor-not-allowed">
                    <Lock className="w-4 h-4 mr-2" />
                    로그인 필요
                  </Button>
                )}
              </div>

              {!user && (
                <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-600 rounded-lg">
                  <p className="text-yellow-400 text-sm flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    PPT 파일 다운로드는 로그인 후 이용 가능합니다.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </main>

      <Footer />
    </div>
  )
}
