"use client"

import { useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Users, FileText, Calendar, FolderOpen } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "management")) {
      router.push("/")
      return
    }
  }, [isAuthenticated, user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d3431a] mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || user?.role !== "management") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
          <p className="text-gray-600 mt-2">안녕하세요, {user.name}님! 비타민 동아리 관리 시스템입니다.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 멤버 관리 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#d3431a]" />
                멤버 관리
              </CardTitle>
              <CardDescription>동아리 멤버 승인 및 관리</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                새로운 가입 신청을 검토하고 멤버를 승인하거나 거부할 수 있습니다.
              </p>
              <Link href="/dashboard/members">
                <Button className="w-full bg-[#d3431a] hover:bg-[#b8371a] text-white">
                  <Users className="h-4 w-4 mr-2" />
                  멤버 관리하기
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* 세션 자료 업로드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                세션 자료 관리
              </CardTitle>
              <CardDescription>세션 자료 업로드 및 관리</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">정기 세션에서 사용할 자료를 업로드하고 관리할 수 있습니다.</p>
              <Link href="/sessions/write">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Upload className="h-4 w-4 mr-2" />
                  세션 자료 업로드
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* 과제 관리 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                과제 관리
              </CardTitle>
              <CardDescription>과제 파일 업로드 및 관리</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">멤버들에게 제공할 과제 파일을 업로드하고 관리할 수 있습니다.</p>
              <Link href="/assignments/write">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <Upload className="h-4 w-4 mr-2" />
                  과제 파일 업로드
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* 프로젝트 관리 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-purple-600" />
                프로젝트 관리
              </CardTitle>
              <CardDescription>프로젝트 업로드 및 관리</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">동아리 프로젝트를 업로드하고 관리할 수 있습니다.</p>
              <Link href="/projects/write">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
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
