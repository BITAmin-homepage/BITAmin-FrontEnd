"use client"

import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FileText, Download, Search, Calendar, User, Upload } from "lucide-react"
import Link from "next/link"

interface SessionPost {
  id: number
  title: string
  description: string
  author: string
  date: string
  week: number
  files: { name: string; size: string; type: string }[]
  views: number
  content: string
}

export default function SessionsPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [posts, setPosts] = useState<SessionPost[]>([])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // 초기 세션 데이터와 로컬 스토리지에서 추가된 데이터 합치기
  useEffect(() => {
    const initialPosts: SessionPost[] = [
      {
        id: 1,
        title: "파이썬 기초와 데이터 구조",
        description: "파이썬의 기본 문법과 리스트, 딕셔너리 등 데이터 구조에 대해 학습합니다.",
        author: "김교육",
        date: "2024-01-15",
        week: 1,
        files: [
          { name: "1주차_파이썬기초.pdf", size: "2.3MB", type: "pdf" },
          { name: "1주차_실습자료.pdf", size: "1.8MB", type: "pdf" },
        ],
        views: 45,
        content: "파이썬 기초 내용",
      },
      {
        id: 2,
        title: "데이터 전처리와 Pandas",
        description: "Pandas 라이브러리를 활용한 데이터 전처리 기법을 배웁니다.",
        author: "이운영",
        date: "2024-01-22",
        week: 2,
        files: [
          { name: "2주차_Pandas기초.pdf", size: "3.1MB", type: "pdf" },
          { name: "2주차_실습데이터.pdf", size: "2.5MB", type: "pdf" },
        ],
        views: 38,
        content: "Pandas 내용",
      },
      {
        id: 3,
        title: "데이터 시각화 with Matplotlib",
        description: "Matplotlib과 Seaborn을 이용한 효과적인 데이터 시각화 방법을 학습합니다.",
        author: "박분석",
        date: "2024-01-29",
        week: 3,
        files: [
          { name: "3주차_시각화기초.pdf", size: "4.2MB", type: "pdf" },
          { name: "3주차_차트예제.pdf", size: "3.7MB", type: "pdf" },
        ],
        views: 52,
        content: "Matplotlib 내용",
      },
      {
        id: 4,
        title: "머신러닝 입문 - 지도학습",
        description: "Scikit-learn을 활용한 지도학습 알고리즘의 이해와 실습을 진행합니다.",
        author: "최머신",
        date: "2024-02-05",
        week: 4,
        files: [
          { name: "4주차_머신러닝기초.pdf", size: "5.1MB", type: "pdf" },
          { name: "4주차_실습코드.pdf", size: "2.9MB", type: "pdf" },
        ],
        views: 67,
        content: "머신러닝 내용",
      },
    ]

    // 로컬 스토리지에서 추가된 세션 데이터 가져오기
    const savedSessions = localStorage.getItem("bitamin_sessions")
    const additionalSessions = savedSessions ? JSON.parse(savedSessions) : []

    setPosts([...initialPosts, ...additionalSessions])
  }, [])

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">세션 자료</h1>
          <p className="text-gray-600">매주 업로드되는 학습 자료를 확인하고 다운로드하세요</p>
        </div>

        {/* 검색 및 필터 */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="세션 제목이나 내용으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* 업로드 버튼 (운영진만) */}
        {user?.role === "management" && (
          <div className="mb-6">
            <Link href="/sessions/write">
              <Button className="bg-[#d3431a] hover:bg-[#b8371a] text-white">
                <Upload className="h-4 w-4 mr-2" />새 게시물 작성
              </Button>
            </Link>
          </div>
        )}

        {/* 세션 목록 */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{post.week}주차</Badge>
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
                    {post.date}
                  </div>
                  <div>조회수 {post.views}</div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">첨부 파일</h4>
                  {post.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-[#d3431a]" />
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
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-500">다른 검색어를 시도해보세요</p>
          </div>
        )}
      </div>
    </div>
  )
}
