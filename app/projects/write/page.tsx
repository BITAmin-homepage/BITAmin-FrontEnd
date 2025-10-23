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
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Upload, X, FileText, ImageIcon, Trophy, Medal, Star, ChevronRight, ChevronLeft, Check, Calendar as CalendarIcon } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

export default function WriteProjectPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [projectId, setProjectId] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    domain: "",
    customDomain: "",
    cohort: [] as number[],
    startDate: null as Date | null,
    endDate: null as Date | null,
    award: "",
    teamMembers: "",
    conferenceName: "",
  })

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [projectFile, setProjectFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("")

  const domains = [
    "NLP",
    "CV", 
    "TimeSeries",
    "Multimodal",
    "추천시스템",
    "기타"
  ]

  const awards = [
    { value: "GRAND_PRIZE", label: "대상", icon: Trophy },
    { value: "EXCELLENCE_PRIZE", label: "최우수상", icon: Medal },
    { value: "MERIT_PRIZE", label: "우수상", icon: Star },
  ]

  const cohorts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "ADMIN") {
      router.push("/projects")
    }
  }, [isAuthenticated, user, router])

  // Step 1: 프로젝트 정보 저장
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("auth_token")

      // 백엔드 API 스펙에 맞게 데이터 구성 (ProjectInfoDto 형식)
      const projectData = {
        title: formData.title || "",
        category: formData.domain === "기타" ? formData.customDomain : formData.domain || "",
        description: formData.description || "",
        cohort: formData.cohort.map(c => `${c}기`), // ["15기", "16기"] 형식으로 변환
        startDate: formData.startDate?.toISOString().split('T')[0] || "", // YYYY-MM-DD 형식
        endDate: formData.endDate?.toISOString().split('T')[0] || "", // YYYY-MM-DD 형식
        award: formData.award === "GRAND_PRIZE" ? "GRAND_PRIZE" : 
               formData.award === "EXCELLENCE_AWARD" ? "GOLD_PRIZE" : 
               formData.award === "MERIT_AWARD" ? "MERIT_AWARD" : 
               formData.award === "EXCELLENCE_PRIZE" ? "EXCELLENCE_AWARD" : 
               formData.award === "MERIT_PRIZE" ? "MERIT_AWARD" : "GRAND_PRIZE",
        member: formData.teamMembers || "",
        period: formData.conferenceName || "",
      }

      console.log("Project data to send:", projectData)
      console.log("Token:", token)
      
      // 필수 필드 검증
      if (!formData.title || !formData.description || formData.cohort.length === 0) {
        throw new Error("필수 필드를 모두 입력해주세요.")
      }

      const response = await fetch("/api/project/uploadInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      })

      const result = await response.json()
      console.log("API Response:", result)

      if (!result.success) {
        throw new Error(result.error || "프로젝트 생성에 실패했습니다.")
      }

      // 백엔드 응답에서 projectId 추출
      let projectId = result.data?.projectId
      
      console.log("Extracted projectId:", projectId)
      console.log("Full result structure:", JSON.stringify(result, null, 2))
      
      // projectId가 없거나 null이면 에러
      if (!projectId || projectId === null) {
        console.error("No projectId from backend:", result)
        throw new Error("프로젝트 ID를 받지 못했습니다. 응답: " + JSON.stringify(result))
      }

      setProjectId(projectId)
      setCurrentStep(2)
    } catch (error) {
      console.error("Error creating project:", error)
      alert("프로젝트 생성 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  // Step 2: 썸네일과 프로젝트 파일 업로드
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!projectId) {
      alert("프로젝트 ID가 없습니다. 1단계를 다시 진행해주세요.")
      return
    }

    if (!thumbnailFile || !projectFile) {
      alert("썸네일과 프로젝트 파일을 모두 선택해주세요.")
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem("auth_token")
      
      // 1. 썸네일 업로드
      const thumbnailFormData = new FormData()
      thumbnailFormData.append("file", thumbnailFile)
      thumbnailFormData.append("type", `thumbnail/${formData.title}`)
      thumbnailFormData.append("projectId", projectId.toString())
      
      console.log("Thumbnail upload - type:", `thumbnail/${formData.title}`)
      console.log("Thumbnail upload - projectId:", projectId)
      console.log("Thumbnail file:", thumbnailFile.name, thumbnailFile.size)
      
      // projectId가 없으면 에러
      if (!projectId) {
        throw new Error("프로젝트 ID가 없습니다. 1단계를 다시 진행해주세요.")
      }

      const thumbnailResponse = await fetch(`/api/project/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: thumbnailFormData,
      })

      const thumbnailResult = await thumbnailResponse.json()
      console.log("Thumbnail upload result:", thumbnailResult)
      
      if (!thumbnailResult.success) {
        throw new Error(thumbnailResult.error || "썸네일 업로드에 실패했습니다.")
      }
      
      console.log("Thumbnail S3 URL:", thumbnailResult.url || thumbnailResult.data?.url || thumbnailResult.data)

      // 2. 프로젝트 파일 업로드
      const projectFormData = new FormData()
      projectFormData.append("file", projectFile)
      projectFormData.append("type", `ppt/${formData.title}`)
      projectFormData.append("projectId", projectId.toString())
      
      console.log("Project file upload - type:", `ppt/${formData.title}`)
      console.log("Project file upload - projectId:", projectId)
      console.log("Project file:", projectFile.name, projectFile.size)
      
      // projectId가 없으면 에러
      if (!projectId) {
        throw new Error("프로젝트 ID가 없습니다. 1단계를 다시 진행해주세요.")
      }

      const projectResponse = await fetch(`/api/project/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: projectFormData,
      })

      const projectResult = await projectResponse.json()
      console.log("Project file upload result:", projectResult)
      
      if (!projectResult.success) {
        throw new Error(projectResult.error || "프로젝트 파일 업로드에 실패했습니다.")
      }
      
      console.log("Project file S3 URL:", projectResult.url || projectResult.data?.url || projectResult.data)

      alert("프로젝트가 성공적으로 업로드되었습니다!")
      router.push("/projects")
    } catch (error) {
      console.error("Error uploading files:", error)
      alert("파일 업로드 중 오류가 발생했습니다.")
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

  const handleProjectFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProjectFile(file)
    }
  }

  const handleCohortToggle = (cohort: number) => {
    if (formData.cohort.includes(cohort)) {
      // 이미 선택된 기수면 제거
      setFormData(prev => ({ ...prev, cohort: prev.cohort.filter(c => c !== cohort) }))
    } else {
      // 새로운 기수 선택 (최대 2개)
      if (formData.cohort.length < 2) {
        setFormData(prev => ({ ...prev, cohort: [...prev.cohort, cohort] }))
      }
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return null
  }

  const steps = [
    { number: 1, title: "프로젝트 정보", description: "프로젝트 기본 정보를 입력하세요" },
    { number: 2, title: "파일 업로드", description: "프로젝트 파일을 업로드하세요" },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">프로젝트 업로드</h1>
          <p className="text-gray-300">새로운 프로젝트를 단계별로 업로드하세요</p>
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
                        : "bg-[#121212] border-gray-600 text-gray-400"
                  }`}
                >
                  {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
                </div>
                <div className="ml-3">
                  <p
                    className={`text-sm font-medium ${currentStep >= step.number ? "text-white" : "text-gray-400"}`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && <ChevronRight className="w-5 h-5 text-gray-400 mx-4" />}
              </div>
            ))}
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="w-full" />
        </div>

        <Card className="bg-[#121212] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">
              {currentStep === 1 && "1단계: 프로젝트 정보 입력"}
              {currentStep === 2 && "2단계: 프로젝트 파일 업로드"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Step 1: 프로젝트 정보 입력 */}
            {currentStep === 1 && (
              <form onSubmit={handleStep1Submit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">프로젝트 제목 *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="프로젝트 제목을 입력하세요"
                    className="bg-black border-white/20 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">기술 도메인 *</Label>
                  <Select
                    value={formData.domain}
                    onValueChange={(value) => setFormData({ ...formData, domain: value })}
                  >
                    <SelectTrigger className="bg-black border-white/20 text-white">
                      <SelectValue placeholder="기술 도메인을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                      {domains.map((domain) => (
                        <SelectItem key={domain} value={domain} className="text-white hover:bg-gray-700 focus:bg-gray-700">
                          {domain}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {formData.domain === "기타" && (
                    <Input
                      value={formData.customDomain}
                      onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })}
                      placeholder="기타 도메인을 입력하세요"
                      className="bg-black border-white/20 text-white mt-2"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">프로젝트 설명 *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="프로젝트의 내용을 3~4문장 정도로 간단하게 요약해주세요"
                    rows={4}
                    className="bg-black border-white/20 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">참여 기수 * (최대 2개)</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {cohorts.map((cohort) => (
                      <Button
                        key={cohort}
                        type="button"
                        variant={formData.cohort.includes(cohort) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleCohortToggle(cohort)}
                        disabled={!formData.cohort.includes(cohort) && formData.cohort.length >= 2}
                        className={`${
                          formData.cohort.includes(cohort)
                            ? "bg-[#d3431a] hover:bg-[#b8371a] text-white"
                            : "bg-[#1a1a1a] border-white/20 text-white hover:bg-white/10"
                        } ${
                          !formData.cohort.includes(cohort) && formData.cohort.length >= 2
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {cohort}기
                      </Button>
                    ))}
                  </div>
                  {formData.cohort.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-sm text-gray-400">선택된 기수:</span>
                      {formData.cohort.map((cohort) => (
                        <Badge key={cohort} variant="secondary" className="bg-[#d3431a] text-white">
                          {cohort}기
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">프로젝트 시작일 *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-black border-white/20 text-white hover:bg-white/10"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.startDate ? format(formData.startDate, "yyyy-MM-dd", { locale: ko }) : "시작일 선택"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-[#1a1a1a] border-white/10">
                        <Calendar
                          mode="single"
                          selected={formData.startDate || undefined}
                          onSelect={(date) => setFormData({ ...formData, startDate: date || null })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">프로젝트 종료일 *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-black border-white/20 text-white hover:bg-white/10"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.endDate ? format(formData.endDate, "yyyy-MM-dd", { locale: ko }) : "종료일 선택"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-[#1a1a1a] border-white/10">
                        <Calendar
                          mode="single"
                          selected={formData.endDate || undefined}
                          onSelect={(date) => setFormData({ ...formData, endDate: date || null })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">수상 *</Label>
                  <Select
                    value={formData.award}
                    onValueChange={(value) => setFormData({ ...formData, award: value })}
                  >
                    <SelectTrigger className="bg-black border-white/20 text-white">
                      <SelectValue placeholder="수상을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                      {awards.map((award) => (
                        <SelectItem key={award.value} value={award.value} className="text-white hover:bg-gray-700 focus:bg-gray-700">
                          <div className="flex items-center gap-2">
                            <award.icon className="h-4 w-4" />
                            {award.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="teamMembers" className="text-white">팀원 *</Label>
                    <Input
                      id="teamMembers"
                      value={formData.teamMembers}
                      onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
                      placeholder="팀원 이름을 쉼표로 구분하여 입력하세요"
                      className="bg-black border-white/20 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="conferenceName" className="text-white">컨퍼런스명 *</Label>
                    <Input
                      id="conferenceName"
                      value={formData.conferenceName}
                      onChange={(e) => setFormData({ ...formData, conferenceName: e.target.value })}
                      placeholder="예: 2024년-1학기"
                      className="bg-black border-white/20 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => router.push("/projects")} className="border-white/20 text-white hover:bg-white/10">
                    취소
                  </Button>
                  <Button type="submit" className="bg-[#d3431a] hover:bg-[#b8371a] text-white" disabled={loading}>
                    {loading ? "저장 중..." : "다음 단계"}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            )}

            {/* Step 2: 썸네일과 프로젝트 파일 업로드 */}
            {currentStep === 2 && (
              <form onSubmit={handleStep2Submit} className="space-y-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">파일 업로드</h3>
                  <p className="text-gray-300 mb-6">썸네일 이미지와 프로젝트 파일을 업로드하세요</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* 썸네일 업로드 */}
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">썸네일 이미지 *</h4>
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
                        className="inline-flex items-center px-6 py-3 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-[#d3431a] hover:bg-orange-50/10 transition-colors"
                      >
                        <ImageIcon className="h-6 w-6 mr-3 text-gray-400" />
                        <span className="text-gray-300">썸네일 이미지 선택</span>
                      </label>
                    </div>

                    {thumbnailPreview && (
                      <div className="flex justify-center">
                        <div className="relative">
                          <img
                            src={thumbnailPreview}
                            alt="썸네일 미리보기"
                            className="w-48 h-32 object-cover rounded-lg border shadow-md"
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

                    {thumbnailFile && (
                      <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg border border-white/10">
                        <div className="flex items-center gap-3">
                          <ImageIcon className="h-6 w-6 text-[#d3431a]" />
                          <div>
                            <p className="text-sm font-medium text-white">{thumbnailFile.name}</p>
                            <p className="text-xs text-gray-400">{(thumbnailFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 프로젝트 파일 업로드 */}
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">프로젝트 파일 *</h4>
                    <div className="flex justify-center">
                      <input
                        type="file"
                        accept=".pdf,.ppt,.pptx,.doc,.docx"
                        onChange={handleProjectFileUpload}
                        className="hidden"
                        id="project-file-upload"
                      />
                      <label
                        htmlFor="project-file-upload"
                        className="inline-flex items-center px-6 py-3 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-[#d3431a] hover:bg-orange-50/10 transition-colors"
                      >
                        <FileText className="h-6 w-6 mr-3 text-gray-400" />
                        <span className="text-gray-300">프로젝트 파일 선택</span>
                      </label>
                    </div>

                    {projectFile && (
                      <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg border border-white/10">
                        <div className="flex items-center gap-3">
                          <FileText className="h-6 w-6 text-[#d3431a]" />
                          <div>
                            <p className="text-sm font-medium text-white">{projectFile.name}</p>
                            <p className="text-xs text-gray-400">{(projectFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setProjectFile(null)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between gap-4">
                  <Button type="button" variant="outline" onClick={goToPreviousStep} className="border-white/20 text-white hover:bg-white/10">
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    이전 단계
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#d3431a] hover:bg-[#b8371a] text-white"
                    disabled={loading || !thumbnailFile || !projectFile}
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