"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Upload, X, FileCode, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react"

interface AssignmentData {
  title: string
  description: string
  week: string
  type: string
  dueDate: string
  content: string
  submissionLink: string
}

export default function WriteAssignmentPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [assignmentId, setAssignmentId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [assignmentData, setAssignmentData] = useState<AssignmentData>({
    title: "",
    description: "",
    week: "",
    type: "",
    dueDate: "",
    content: "",
    submissionLink: "",
  })

  const [files, setFiles] = useState<File[]>([])

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "management") {
      router.push("/assignments")
    }
  }, [isAuthenticated, user, router])

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch("/api/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(assignmentData),
      })

      const result = await response.json()

      if (result.success) {
        setAssignmentId(result.data.id)
        setCurrentStep(2)
      } else {
        alert(result.message || "과제 정보 저장에 실패했습니다.")
      }
    } catch (error) {
      console.error("Assignment creation error:", error)
      alert("과제 정보 저장 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (files.length === 0) {
      alert("최소 1개의 파일을 업로드해주세요.")
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem("auth_token")
      const formData = new FormData()

      files.forEach((file) => {
        formData.append("files", file)
      })

      const response = await fetch(`/api/assignments/${assignmentId}/files`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        alert("과제가 성공적으로 업로드되었습니다!")
        router.push("/assignments")
      } else {
        alert(result.message || "파일 업로드에 실패했습니다.")
      }
    } catch (error) {
      console.error("File upload error:", error)
      alert("파일 업로드 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || [])
    setFiles([...files, ...uploadedFiles])
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      router.push("/assignments")
    }
  }

  if (!isAuthenticated || user?.role !== "management") {
    return null
  }

  const progress = (currentStep / 2) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={goBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            뒤로가기
          </Button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">과제 업로드</h1>
          <p className="text-gray-600">과제를 단계별로 업로드하세요</p>

          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>진행률</span>
              <span>{currentStep}/2 단계</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStep === 1 ? (
                <>
                  <FileCode className="h-5 w-5 text-green-600" />
                  1단계: 과제 정보 입력
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 text-green-600" />
                  2단계: 파일 업로드
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentStep === 1 ? (
              <form onSubmit={handleStep1Submit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">제목 *</Label>
                    <Input
                      id="title"
                      value={assignmentData.title}
                      onChange={(e) => setAssignmentData({ ...assignmentData, title: e.target.value })}
                      placeholder="과제 제목을 입력하세요"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="week">주차</Label>
                    <Select onValueChange={(value) => setAssignmentData({ ...assignmentData, week: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="주차를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 40 }, (_, i) => i + 1).map((week) => (
                          <SelectItem key={week} value={week.toString()}>
                            {week}주차
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">과제 유형 *</Label>
                    <Select onValueChange={(value) => setAssignmentData({ ...assignmentData, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="과제 유형을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="preview">예습과제</SelectItem>
                        <SelectItem value="review">복습과제</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">마감일 *</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={assignmentData.dueDate}
                      onChange={(e) => setAssignmentData({ ...assignmentData, dueDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">간단한 설명 *</Label>
                  <Input
                    id="description"
                    value={assignmentData.description}
                    onChange={(e) => setAssignmentData({ ...assignmentData, description: e.target.value })}
                    placeholder="과제에 대한 간단한 설명을 입력하세요"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">상세 내용</Label>
                  <Textarea
                    id="content"
                    value={assignmentData.content}
                    onChange={(e) => setAssignmentData({ ...assignmentData, content: e.target.value })}
                    placeholder="과제의 상세 내용을 입력하세요"
                    rows={8}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="submissionLink">구글폼 제출 링크</Label>
                  <Input
                    id="submissionLink"
                    value={assignmentData.submissionLink}
                    onChange={(e) => setAssignmentData({ ...assignmentData, submissionLink: e.target.value })}
                    placeholder="https://forms.google.com/..."
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
                    {loading ? "저장 중..." : "다음 단계"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleStep2Submit} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600 mb-4">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">과제 정보가 저장되었습니다!</span>
                  </div>

                  <div>
                    <Label>과제 파일 업로드 (ipynb, csv, pdf, py 등) *</Label>
                    <div className="mt-2">
                      <input
                        type="file"
                        accept=".ipynb,.csv,.pdf,.py,.txt,.md"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        파일 선택
                      </label>
                    </div>

                    {files.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileCode className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium">{file.name}</span>
                              <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                            </div>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={goBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    이전 단계
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || files.length === 0}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {loading ? "업로드 중..." : "과제 업로드 완료"}
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
