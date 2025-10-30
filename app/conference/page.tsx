"use client"

import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FileText, Download, Search, Calendar, User, Upload } from "lucide-react"
import Link from "next/link"

interface ConferencePost {
  id: number
  title: string
  description: string
  author: string
  date: string
  eventDate: string
  files: { name: string; size: string; type: string }[]
  views: number
  status: "upcoming" | "ongoing" | "completed"
}

export default function ConferencePage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.push("/login")
  //   }
  // }, [isAuthenticated, router])

  const conferencePosts: ConferencePost[] = [
    {
      id: 1,
      title: "2024 상반기 비타민 컨퍼런스",
      description: "상반기 프로젝트 발표 및 성과 공유의 시간입니다. 각 팀별 프로젝트 결과를 발표합니다.",
      author: "박기획",
      date: "2024-01-20",
      eventDate: "2024-02-15",
      files: [
        { name: "컨퍼런스_프로그램.pdf", size: "1.2MB", type: "pdf" },
        { name: "발표_가이드라인.pdf", size: "890KB", type: "pdf" },
      ],
      views: 89,
      status: "upcoming",
    },
    {
      id: 2,
      title: "데이터 사이언스 트렌드 세미나",
      description: "2024년 데이터 사이언스 최신 트렌드와 기술 동향에 대한 전문가 세미나입니다.",
      author: "이운영",
      date: "2024-01-15",
      eventDate: "2024-01-25",
      files: [
        { name: "트렌드_세미나_자료.pdf", size: "3.4MB", type: "pdf" },
        { name: "참고_논문_모음.pdf", size: "5.2MB", type: "pdf" },
      ],
      views: 67,
      status: "completed",
    },
    {
      id: 3,
      title: "현직자 멘토링 세션",
      description: "빅테크 기업 현직 데이터 사이언티스트와의 멘토링 및 Q&A 시간입니다.",
      author: "최멘토",
      date: "2024-01-10",
      eventDate: "2024-01-30",
      files: [
        { name: "멘토링_질문지.pdf", size: "456KB", type: "pdf" },
        { name: "커리어_가이드.pdf", size: "2.1MB", type: "pdf" },
      ],
      views: 134,
      status: "upcoming",
    },
    {
      id: 4,
      title: "AI/ML 프로젝트 쇼케이스",
      description: "멤버들이 진행한 AI/ML 프로젝트 결과물을 공유하고 피드백을 받는 시간입니다.",
      author: "김프로젝트",
      date: "2024-01-05",
      eventDate: "2024-01-20",
      files: [
        { name: "프로젝트_발표_템플릿.pdf", size: "1.8MB", type: "pdf" },
        { name: "평가_기준표.pdf", size: "678KB", type: "pdf" },
      ],
      views: 92,
      status: "ongoing",
    },
  ]

  const filteredPosts = conferencePosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "ongoing":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "예정"
      case "ongoing":
        return "진행중"
      case "completed":
        return "완료"
      default:
        return "알 수 없음"
    }
  }

  // if (!isAuthenticated) {
  //   return null
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">컨퍼런스</h1>
          <p className="text-gray-600">정기 컨퍼런스, 세미나, 멘토링 세션 자료를 확인하세요</p>
        </div>

        {/* 검색 */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="컨퍼런스 제목이나 내용으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* 업로드 버튼 (운영진만) */}
        {user?.role === "management" && (
          <div className="mb-6">
            <Link href="/conference/write">
              <Button className="bg-[#d3431a] hover:bg-[#b8371a] text-white">
                <Upload className="h-4 w-4 mr-2" />새 컨퍼런스 게시물 작성
              </Button>
            </Link>
          </div>
        )}

        {/* 컨퍼런스 목록 */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getStatusColor(post.status)}>{getStatusText(post.status)}</Badge>
                    </div>
                    <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                    <CardDescription className="text-gray-600 mb-4">{post.description}</CardDescription>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3 sm:h-4 sm:w-4" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    게시: {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    행사: {post.eventDate}
                  </div>
                  <div>조회 {post.views}</div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">첨부 자료</h4>
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
