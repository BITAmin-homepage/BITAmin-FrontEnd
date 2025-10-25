"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, ArrowLeft, Trophy, Tag, FileText, Calendar as CalendarIcon, Award, Download, Lock, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth, isAdmin } from "@/lib/auth"

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
  const [slideLoading, setSlideLoading] = useState(false)
  const [pptUrl, setPptUrl] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    console.log("Params:", params)
    console.log("Current user:", user)
    console.log("User role:", user?.role)
    console.log("Is Admin:", isAdmin(user?.role))
    if (params.id && params.id !== 'undefined') {
      fetchProject()
    }
  }, [params.id, user])


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

  // PPT URL 가져오기
  const fetchPptUrl = async () => {
    if (!project?.projectId) return
    
    try {
      setSlideLoading(true)
      const response = await fetch(`/api/project/ppt/${project.projectId}`)
      const result = await response.json()
      
      if (result.success && result.data.ppt) {
        setPptUrl(result.data.ppt)
      }
    } catch (error) {
      console.error("Error fetching PPT URL:", error)
    } finally {
      setSlideLoading(false)
    }
  }

  // 프로젝트가 로드되면 자동으로 PPT URL 가져오기
  useEffect(() => {
    if (project?.projectId) {
      fetchPptUrl()
    }
  }, [project])


  // PPT 로딩 상태 관리
  const handlePptLoad = () => {
    setSlideLoading(false)
  }

  // 프로젝트 삭제
  const handleDeleteProject = async () => {
    if (!project) return
    
    // 관리자 권한 확인
    if (!user || !isAdmin(user.role)) {
      alert("프로젝트 삭제는 관리자만 가능합니다.")
      setShowDeleteDialog(false)
      return
    }
    
    try {
      setDeleting(true)
      
      // S3 key 추출 (PPT URL 또는 thumbnail URL에서)
      let s3Key = null
      
      if (project.ppt) {
        // PPT URL에서 key 추출: "https://bucket.s3.amazonaws.com/ppt/folder/file.pdf" -> "ppt/folder/file.pdf"
        const pptUrl = new URL(project.ppt)
        s3Key = pptUrl.pathname.substring(1) // 맨 앞의 '/' 제거
      } else if (project.thumbnail) {
        // thumbnail URL에서 key 추출
        const thumbnailUrl = new URL(project.thumbnail)
        s3Key = thumbnailUrl.pathname.substring(1)
      }
      
      if (!s3Key) {
        alert("S3 키를 찾을 수 없습니다. PPT 또는 썸네일 정보가 필요합니다.")
        setDeleting(false)
        return
      }
      
      console.log("Deleting with S3 key:", s3Key)
      
      // localStorage에서 토큰 가져오기
      const token = localStorage.getItem('auth_token')
      
      if (!token) {
        alert("로그인이 필요합니다.")
        setDeleting(false)
        setShowDeleteDialog(false)
        return
      }
      
      const response = await fetch(`/api/project/${project.projectId}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ key: s3Key })
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert("프로젝트가 성공적으로 삭제되었습니다.")
        router.push('/projects')
      } else {
        alert(`삭제 실패: ${result.error}`)
      }
    } catch (error) {
      console.error("Delete error:", error)
      alert("삭제 중 오류가 발생했습니다.")
    } finally {
      setDeleting(false)
      setShowDeleteDialog(false)
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
            className="text-gray-400 hover:text-gray-700 mb-6"
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

            <div className="flex justify-between items-start">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{project.title}</h1>
              
              {/* 관리자용 삭제 버튼 */}
              {(() => {
                console.log("Rendering delete button section")
                console.log("User exists:", !!user)
                console.log("User role:", user?.role)
                console.log("isAdmin result:", isAdmin(user?.role))
                return user && isAdmin(user.role) ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      console.log("Delete button clicked")
                      console.log("User:", user)
                      console.log("User role:", user.role)
                      setShowDeleteDialog(true)
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    삭제
                  </Button>
                ) : null
              })()}
            </div>
          </div>

          {/* 프로젝트 정보 */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#d3431a]" />
                  팀원
                </h3>
                <p className="text-gray-300">{project.member || "팀원 정보가 없습니다."}</p>
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
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {project.description || "프로젝트 설명이 없습니다."}
              </p>
            </CardContent>
          </Card>

          {/* PPT 슬라이드 뷰어 */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">프로젝트 발표 자료</h3>
              </div>

              {/* PPT 뷰어 */}
              {pptUrl && (
                <div className="mt-6">
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    {/* Google Docs Viewer를 사용한 PPT 표시 */}
                    <div className="aspect-video relative overflow-hidden">
                      {slideLoading ? (
                        <div className="flex items-center justify-center h-full text-white">
                          PPT 로딩 중...
                        </div>
                      ) : (
                        <>
                          <iframe
                            src={`https://docs.google.com/gview?url=${encodeURIComponent(pptUrl)}&embedded=true`}
                            className="w-full h-full border-0"
                            title="PPT Viewer"
                            onLoad={handlePptLoad}
                            sandbox="allow-same-origin allow-scripts"
                            allow="fullscreen"
                          />
                          {/* Google Docs Viewer 상단 툴바를 가리는 오버레이 */}
                          <div className="absolute top-0 left-0 right-0 h-16 bg-black/90 pointer-events-none z-10"></div>
                        </>
                      )}
                    </div>

                    {/* 하단 컨트롤 */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm">
                            PPT 뷰어
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {user ? (
                            <Button
                              onClick={() => window.open(pptUrl, '_blank')}
                              variant="outline"
                              size="sm"
                              className="bg-black/50 border-white/20 text-white hover:bg-white/10"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              다운로드
                            </Button>
                          ) : (
                            <Button
                              disabled
                              variant="outline"
                              size="sm"
                              className="bg-black/50 border-gray-600 text-gray-400 cursor-not-allowed"
                            >
                              <Lock className="w-4 h-4 mr-2" />
                              로그인 필요
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </main>

      {/* 삭제 확인 다이얼로그 */}
      {showDeleteDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-[90%]">
            <h3 className="text-lg font-semibold text-white mb-4">프로젝트 삭제</h3>
            <p className="text-gray-300 mb-6">
              정말로 이 프로젝트를 삭제하시겠습니까?<br/>
              <span className="text-red-400 font-medium">이 작업은 되돌릴 수 없습니다.</span>
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                취소
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteProject}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {deleting ? "삭제 중..." : "삭제"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
