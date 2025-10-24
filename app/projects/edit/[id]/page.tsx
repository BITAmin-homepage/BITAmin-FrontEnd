"use client"

import type React from "react"

import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, FileText, ImageIcon, Trophy, Medal, Star } from "lucide-react"

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
}

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cohort: "",
    period: "",
    award: "",
    category: "",
    teamMembers: "",
    projectPeriod: "",
  })
  const [pptFile, setPptFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("")
  const [currentProject, setCurrentProject] = useState<Project | null>(null)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "management") {
      router.push("/projects")
    } else {
      fetchProject()
    }
  }, [isAuthenticated, user, router, params.id])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`)
      const result = await response.json()

      if (result.success) {
        const project = result.data
        setCurrentProject(project)
        setFormData({
          title: project.title,
          description: project.description,
          cohort: project.cohort,
          period: project.period,
          award: project.award,
          category: project.category,
          teamMembers: project.teamMembers.join(", "),
          projectPeriod: project.projectPeriod,
        })
        setThumbnailPreview(project.thumbnail || "")
      } else {
        alert("프로젝트를 찾을 수 없습니다.")
        router.push("/projects")
      }
    } catch (error) {
      console.error("Error fetching project:", error)
      alert("프로젝트 정보를 불러오는 중 오류가 발생했습니다.")
      router.push("/projects")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. 기본 정보 업데이트
      const response = await fetch(`/api/projects/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to update project")
      }

      // 2. 파일 업로드 (있는 경우)
      if (thumbnailFile || pptFile) {
        const formDataFiles = new FormData()
        if (thumbnailFile) formDataFiles.append("thumbnail", thumbnailFile)
        if (pptFile) formDataFiles.append("ppt", pptFile)

        const uploadResponse = await fetch(`/api/projects/${params.id}/upload`, {
          method: "POST",
          body: formDataFiles,
        })

        const uploadResult = await uploadResponse.json()
        if (!uploadResult.success) {
          console.error("File upload failed:", uploadResult.error)
        }
      }

      alert("프로젝트가 수정되었습니다!")
      router.push("/projects?refresh=true")
    } catch (error) {
      console.error("Error updating project:", error)
      alert("프로젝트 수정 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const handlePptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPptFile(file)
    }
  }

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnailFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  if (!isAuthenticated || user?.role !== "management") {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">프로젝트 정보를 불러오는 중...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">프로젝트 수정</h1>
          <p className="text-gray-600">프로젝트 정보를 수정하세요</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>프로젝트 수정</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">프로젝트 제목 *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="프로젝트 제목을 입력하세요"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">카테고리 *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="예: 금융, 의료, 교통 등"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">프로젝트 설명 *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="프로젝트에 대한 간단한 설명을 입력하세요"
                  rows={3}
                  required
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cohort">기수 *</Label>
                  <Select
                    value={formData.cohort}
                    onValueChange={(value) => setFormData({ ...formData, cohort: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="기수 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="13-14기">13-14기</SelectItem>
                      <SelectItem value="14-15기">14-15기</SelectItem>
                      <SelectItem value="15-16기">15-16기</SelectItem>
                      <SelectItem value="16-17기">16-17기</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period">기간 *</Label>
                  <Select
                    value={formData.period}
                    onValueChange={(value) => setFormData({ ...formData, period: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="기간 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="방학">방학</SelectItem>
                      <SelectItem value="학기">학기</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="award">수상 *</Label>
                  <Select value={formData.award} onValueChange={(value) => setFormData({ ...formData, award: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="수상 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="대상">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-600" />
                          대상
                        </div>
                      </SelectItem>
                      <SelectItem value="최우수상">
                        <div className="flex items-center gap-2">
                          <Medal className="h-4 w-4 text-blue-600" />
                          최우수상
                        </div>
                      </SelectItem>
                      <SelectItem value="우수상">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-green-600" />
                          우수상
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teamMembers">팀원 *</Label>
                  <Input
                    id="teamMembers"
                    value={formData.teamMembers}
                    onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
                    placeholder="팀원 이름을 쉼표로 구분하여 입력하세요"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectPeriod">프로젝트 수행 기간 *</Label>
                  <Input
                    id="projectPeriod"
                    value={formData.projectPeriod}
                    onChange={(e) => setFormData({ ...formData, projectPeriod: e.target.value })}
                    placeholder="예: 2024.01 - 2024.02"
                    required
                  />
                </div>
              </div>

              {/* 썸네일 업로드 */}
              <div className="space-y-4">
                <div>
                  <Label>썸네일 이미지</Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label
                      htmlFor="thumbnail-upload"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      썸네일 이미지 변경
                    </label>
                  </div>
                  {thumbnailPreview && (
                    <div className="mt-4">
                      <div className="relative w-full max-w-sm">
                        <img
                          src={thumbnailPreview || "/placeholder.svg"}
                          alt="썸네일 미리보기"
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-1 right-1 bg-red-500 text-white hover:bg-red-600"
                          onClick={() => {
                            setThumbnailFile(null)
                            setThumbnailPreview(currentProject?.thumbnail || "")
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* PPT 파일 업로드 */}
              <div className="space-y-4">
                <div>
                  <Label>PPT 파일</Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      accept=".ppt,.pptx"
                      onChange={handlePptUpload}
                      className="hidden"
                      id="ppt-upload"
                    />
                    <label
                      htmlFor="ppt-upload"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      PPT 파일 변경
                    </label>
                  </div>
                  {(pptFile || currentProject?.pptFile) && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-orange-500" />
                          <span className="text-sm">{pptFile?.name || currentProject?.pptFile}</span>
                        </div>
                        {pptFile && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => setPptFile(null)}>
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-[#d3431a] hover:bg-[#b8371a] text-white" disabled={loading}>
                  {loading ? "수정 중..." : "프로젝트 수정"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/projects")}>
                  취소
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
