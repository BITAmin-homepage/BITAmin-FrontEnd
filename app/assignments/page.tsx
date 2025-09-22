"use client"

import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FileCode, Download, Search, Calendar, User, Upload, ExternalLink } from "lucide-react"
import Link from "next/link"

interface AssignmentPost {
  id: number
  title: string
  description: string
  author: string
  date: string
  dueDate: string
  week: number
  files: { name: string; size: string; type: string }[]
  submissionLink?: string
  type: "preview" | "review"
  status: "active" | "closed"
}

export default function AssignmentsPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [posts, setPosts] = useState<AssignmentPost[]>([])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // 초기 과제 데이터와 로컬 스토리지에서 추가된 데이터 합치기
  useEffect(() => {
    const initialPosts: AssignmentPost[] = [
      {
        id: 1,
        title: "1주차 예습과제 - 파이썬 기초 문법",
        description: "파이썬 기본 문법을 익히고 간단한 계산기 프로그램을 작성해보세요.",
        author: "김교육",
        date: "2024-01-10",
        dueDate: "2024-01-14",
        week: 1,
        files: [{ name: "1주차_예습과제.ipynb", size: "45KB", type: "ipynb" }],
        submissionLink: "https://forms.google.com/d/e/1FAIpQLSe...",
        type: "preview",
        status: "closed",
      },
      {
        id: 2,
        title: "1주차 복습과제 - 데이터 타입과 조건문",
        description: "파이썬의 다양한 데이터 타입을 활용하여 조건문 문제를 해결해보세요.",
        author: "김교육",
        date: "2024-01-16",
        dueDate: "2024-01-21",
        week: 1,
        files: [{ name: "1주차_복습과제.ipynb", size: "52KB", type: "ipynb" }],
        submissionLink: "https://forms.google.com/d/e/1FAIpQLSe...",
        type: "review",
        status: "active",
      },
      {
        id: 3,
        title: "2주차 예습과제 - Pandas 기초",
        description: "Pandas 라이브러리의 기본 사용법을 익히고 데이터프레임을 다뤄보세요.",
        author: "이운영",
        date: "2024-01-17",
        dueDate: "2024-01-21",
        week: 2,
        files: [
          { name: "2주차_예습과제.ipynb", size: "67KB", type: "ipynb" },
          { name: "sample_data.csv", size: "123KB", type: "csv" },
        ],
        submissionLink: "https://forms.google.com/d/e/1FAIpQLSe...",
        type: "preview",
        status: "active",
      },
    ]

    // 로컬 스토리지에서 추가된 과제 데이터 가져오기
    const savedAssignments = localStorage.getItem("bitamin_assignments")
    const additionalAssignments = savedAssignments ? JSON.parse(savedAssignments) : []

    setPosts([...initialPosts, ...additionalAssignments])
  }, [])

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || post.type === selectedType
    return matchesSearch && matchesType
  })

  const types = [
    { value: "all", label: "전체" },
    { value: "preview", label: "예습과제" },
    { value: "review", label: "복습과제" },
  ]

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "preview":
        return "예습과제"
      case "review":
        return "복습과제"
      default:
        return type
    }
  }

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">과제</h1>
          <p className="text-gray-600">예습과제, 복습과제를 확인하고 제출하세요</p>
        </div>

        {/* 검색 및 필터 */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="과제 제목이나 내용으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {types.map((type) => (
              <Button
                key={type.value}
                variant={selectedType === type.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type.value)}
                className={selectedType === type.value ? "bg-[#d3431a] hover:bg-[#b8371a]" : ""}
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        {/* 업로드 버튼 (운영진만) */}
        {user?.role === "management" && (
          <div className="mb-6">
            <Link href="/assignments/write">
              <Button className="bg-[#d3431a] hover:bg-[#b8371a] text-white">
                <Upload className="h-4 w-4 mr-2" />새 과제 작성
              </Button>
            </Link>
          </div>
        )}

        {/* 과제 목록 */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {post.week > 0 && <Badge variant="secondary">{post.week}주차</Badge>}
                      <Badge variant="outline">{getTypeLabel(post.type)}</Badge>
                      <Badge className={getStatusColor(post.status)}>
                        {post.status === "active" ? "진행중" : "마감"}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                    <CardDescription className="text-gray-600 mb-4">{post.description}</CardDescription>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    출제: {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    마감: {post.dueDate}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">과제 파일</h4>
                    {post.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                        <div className="flex items-center gap-3">
                          <FileCode className="h-5 w-5 text-[#d3431a]" />
                          <div>
                            <div className="font-medium text-gray-900">{file.name}</div>
                            <div className="text-sm text-gray-500">{file.size}</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          다운로드
                        </Button>
                      </div>
                    ))}
                  </div>

                  {post.submissionLink && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-3">과제 제출</h4>
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div>
                          <div className="font-medium text-blue-900">구글폼으로 제출하기</div>
                          <div className="text-sm text-blue-700">과제를 완료한 후 구글폼을 통해 제출해주세요</div>
                        </div>
                        <Button
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => window.open(post.submissionLink, "_blank")}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          제출하기
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <FileCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-500">다른 검색어나 과제 유형을 시도해보세요</p>
          </div>
        )}
      </div>
    </div>
  )
}
