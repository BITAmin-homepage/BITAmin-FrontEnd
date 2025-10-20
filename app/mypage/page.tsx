"use client"

import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, School, Calendar } from "lucide-react"

export default function MyPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">마이페이지</h1>
          <p className="text-gray-300">내 정보를 확인하세요</p>
        </div>

        <div className="space-y-6">
          <Card className="bg-[#121212] border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="h-5 w-5" />
                프로필 정보
              </CardTitle>
              <CardDescription className="text-gray-400">내 계정 정보를 확인할 수 있습니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-400">이름</div>
                      <div className="font-medium text-white">{user.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-400">이메일</div>
                      <div className="font-medium text-white">{user.email}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-400">기수</div>
                      <div className="font-medium text-white">{user.cohort}기</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <School className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-400">역할</div>
                      <Badge
                        className={user.role === "ADMIN" ? "bg-[#d3431a] text-white" : "bg-white/10 text-white"}
                      >
                        {user.role === "ADMIN" ? "관리자" : "멤버"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
