"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Users, FolderOpen } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "ADMIN")) {
      router.push("/")
      return
    }
  }, [isAuthenticated, user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d3431a] mx-auto"></div>
          <p className="mt-4 text-white">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">관리자 대시보드</h1>
          <p className="text-gray-300 mt-2">안녕하세요, {user.name}님! 비타민 동아리 관리 시스템입니다.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 멤버 관리 (자두색 포커스) */}
          <Card className="bg-[#121212] border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Users className="h-5 w-5 text-[#8b2f6b]" />
                멤버 관리
              </CardTitle>
              <CardDescription className="text-gray-400">동아리 멤버 승인 및 관리</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">
                새로운 가입 신청을 검토하고 멤버를 승인하거나 거부할 수 있습니다.
              </p>
              <Link href="/dashboard/members">
                <Button className="w-full bg-[#8b2f6b] hover:bg-[#732659] text-white">
                  <Users className="h-4 w-4 mr-2" />
                  멤버 관리하기
                </Button>
              </Link>
            </CardContent>
          </Card>


          {/* 프로젝트 관리 (오렌지 포커스) */}
          <Card className="bg-[#121212] border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FolderOpen className="h-5 w-5 text-[#ff6b35]" />
                프로젝트 관리
              </CardTitle>
              <CardDescription className="text-gray-400">프로젝트 업로드 및 관리</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">동아리 프로젝트를 업로드하고 관리할 수 있습니다.</p>
              <Link href="/projects/write">
                <Button className="w-full bg-[#ff6b35] hover:bg-[#e55a2b] text-white">
                  <Upload className="h-4 w-4 mr-2" />
                  프로젝트 업로드
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
