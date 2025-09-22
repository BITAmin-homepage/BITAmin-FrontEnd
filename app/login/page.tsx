"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const success = await login(formData.username, formData.password)
      if (success) {
        // 관리자든 멤버든 홈으로 리다이렉트
        router.push("/")
      }
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleTestLogin = (username: string, password: string) => {
    setFormData({ username, password })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d3431a] via-black to-orange-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-700">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image src="/images/logo_2.png" alt="비타민 로고" width={60} height={60} className="h-15 w-15" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">로그인</CardTitle>
          <CardDescription className="text-gray-400">비타민 동아리 계정으로 로그인하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">
                아이디
              </Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="bg-gray-800 border-gray-600 text-white focus:ring-[#d3431a] focus:border-[#d3431a]"
                placeholder="아이디를 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                비밀번호
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-gray-800 border-gray-600 text-white focus:ring-[#d3431a] focus:border-[#d3431a]"
                placeholder="비밀번호를 입력하세요"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#d3431a] to-[#ff6b35] hover:from-[#b8371a] hover:to-[#e55a2b] text-white font-semibold py-3"
            >
              {loading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-400 mb-3">🧪 테스트 계정:</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleTestLogin("admin", "admin")}
                className="w-full text-left p-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <p className="text-xs text-green-400">관리자 계정</p>
                <p className="text-xs text-gray-300">ID: admin / PW: admin</p>
              </button>
              <button
                type="button"
                onClick={() => handleTestLogin("member", "member")}
                className="w-full text-left p-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <p className="text-xs text-blue-400">멤버 계정</p>
                <p className="text-xs text-gray-300">ID: member / PW: member</p>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              계정이 없으신가요?{" "}
              <Link href="/register" className="text-[#d3431a] hover:underline font-medium">
                회원가입
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
