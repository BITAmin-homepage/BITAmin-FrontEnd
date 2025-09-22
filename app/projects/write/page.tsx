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
import { Upload, X, FileText, ImageIcon, Trophy, Medal, Star, ChevronRight, ChevronLeft, Check } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function WriteProjectPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [projectId, setProjectId] = useState<number | null>(null)

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

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "management") {
      router.push("/projects")
    }
  }, [isAuthenticated, user, router])

  // Step 1: 기본 정보 저장
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("auth_token")

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "프로젝트 생성에 실패했습니다.")
      }

      setProjectId(result.data.id)
      setCurrentStep(2)
    } catch (error) {
      console.error("Error creating project:", error)
      alert("프로젝트 생성 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  // Step 2: 썸네일 업로드
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!thumbnailFile) {
      setCurrentStep(3)
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem("auth_token")
      const formDataFiles = new FormData()
      formDataFiles.append("thumbnail", thumbnailFile)

      const response = await fetch(`/api/projects/${projectId}/thumbnail`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataFiles,
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "썸네일 업로드에 실패했습니다.")
      }

      setCurrentStep(3)
    } catch (error) {
      console.error("Error uploading thumbnail:", error)
      alert("썸네일 업로드 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  // Step 3: PPT 파일 업로드
  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!pptFile) {
      alert("PPT 파일을 선택해주세요.")
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem("auth_token")
      const formDataFiles = new FormData()
      formDataFiles.append("ppt", pptFile)

      const response = await fetch(`/api/projects/${projectId}/ppt`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataFiles,
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "PPT 파일 업로드에 실패했습니다.")
      }

      alert("프로젝트가 성공적으로 업로드되었습니다!")
      router.push("/projects")
    } catch (error) {
      console.error("Error uploading PPT:", error)
      alert("PPT 파일 업로드 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
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

  const handlePptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPptFile(file)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (!isAuthenticated || user?.role !== "management") {
    return null
  }

  const steps = [
    { number: 1, title: "기본 정보", description: "프로젝트 기본 정보를 입력하세요" },
    { number: 2, title: "썸네일 이미지", description: "프로젝트 썸네일을 업로드하세요" },
    { number: 3, title: "PPT 파일", description: "프로젝트 발표 자료를 업로드하세요" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">프로젝트 업로드</h1>
          <p className="text-gray-600">새로운 프로젝트를 단계별로 업로드하세요</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep > step.number
                      ? "bg-green-500 border-green-500 text-white"
                      : currentStep === step.number
                        ? "bg-[#d3431a] border-[#d3431a] text-white"
                        : "bg-white border-gray-300 text-gray-500"
                  }`}
                >
                  {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
                </div>
                <div className="ml-3">
                  <p
                    className={`text-sm font-medium ${currentStep >= step.number ? "text-gray-900" : "text-gray-500"}`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && <ChevronRight className="w-5 h-5 text-gray-400 mx-4" />}
              </div>
            ))}
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="w-full" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "1단계: 프로젝트 기본 정보"}
              {currentStep === 2 && "2단계: 썸네일 이미지 업로드"}
              {currentStep === 3 && "3단계: PPT 파일 업로드"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Step 1: 기본 정보 입력 */}
            {currentStep === 1 && (
              <form onSubmit={handleStep1Submit} className="space-y-6">
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
                    placeholder="프로젝트에 대한 상세한 설명을 입력하세요"
                    rows={4}
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
                    <Select
                      value={formData.award}
                      onValueChange={(value) => setFormData({ ...formData, award: value })}
                    >
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

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => router.push("/projects")}>
                    취소
                  </Button>
                  <Button type="submit" className="bg-[#d3431a] hover:bg-[#b8371a] text-white" disabled={loading}>
                    {loading ? "저장 중..." : "다음 단계"}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            )}

            {/* Step 2: 썸네일 업로드 */}
            {currentStep === 2 && (
              <form onSubmit={handleStep2Submit} className="space-y-6">
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">썸네일 이미지 업로드</h3>
                  <p className="text-gray-600 mb-6">프로젝트를 대표하는 썸네일 이미지를 업로드하세요 (선택사항)</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label
                      htmlFor="thumbnail-upload"
                      className="inline-flex items-center px-6 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#d3431a] hover:bg-orange-50 transition-colors"
                    >
                      <ImageIcon className="h-6 w-6 mr-3 text-gray-400" />
                      <span className="text-gray-600">이미지 파일을 선택하거나 드래그하세요</span>
                    </label>
                  </div>

                  {thumbnailPreview && (
                    <div className="flex justify-center">
                      <div className="relative">
                        <img
                          src={thumbnailPreview || "/placeholder.svg"}
                          alt="썸네일 미리보기"
                          className="w-64 h-40 object-cover rounded-lg border shadow-md"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 bg-red-500 text-white hover:bg-red-600 rounded-full p-1"
                          onClick={() => {
                            setThumbnailFile(null)
                            setThumbnailPreview("")
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between gap-4">
                  <Button type="button" variant="outline" onClick={goToPreviousStep}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    이전 단계
                  </Button>
                  <Button type="submit" className="bg-[#d3431a] hover:bg-[#b8371a] text-white" disabled={loading}>
                    {loading ? "업로드 중..." : "다음 단계"}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            )}

            {/* Step 3: PPT 파일 업로드 */}
            {currentStep === 3 && (
              <form onSubmit={handleStep3Submit} className="space-y-6">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">PPT 파일 업로드</h3>
                  <p className="text-gray-600 mb-6">프로젝트 발표 자료(PPT)를 업로드하세요</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-center">
                    <input
                      type="file"
                      accept=".ppt,.pptx"
                      onChange={handlePptUpload}
                      className="hidden"
                      id="ppt-upload"
                    />
                    <label
                      htmlFor="ppt-upload"
                      className="inline-flex items-center px-6 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#d3431a] hover:bg-orange-50 transition-colors"
                    >
                      <Upload className="h-6 w-6 mr-3 text-gray-400" />
                      <span className="text-gray-600">PPT 파일을 선택하세요 (.ppt, .pptx)</span>
                    </label>
                  </div>

                  {pptFile && (
                    <div className="flex justify-center">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border max-w-md w-full">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-orange-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{pptFile.name}</p>
                            <p className="text-xs text-gray-500">{(pptFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setPptFile(null)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between gap-4">
                  <Button type="button" variant="outline" onClick={goToPreviousStep}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    이전 단계
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#d3431a] hover:bg-[#b8371a] text-white"
                    disabled={loading || !pptFile}
                  >
                    {loading ? "업로드 중..." : "업로드 완료"}
                    <Check className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
