"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    birthDate: "",
    school: "",
    phone: "",
    email: "",
    cohort: "",
    role: "",
    username: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          school: formData.school,
          gender: formData.gender,
          birthDate: formData.birthDate,
          cohort: Number.parseInt(formData.cohort),
          role: formData.role,
          username: formData.username,
          password: formData.password,
        }),
      })

      const result = await response.json()

      if (result.success) {
        alert(result.message || "회원가입이 완료되었습니다! 운영진의 승인을 기다려주세요.")
        router.push("/")
      } else {
        alert(result.message || "회원가입에 실패했습니다.")
      }
    } catch (error) {
      console.error("Registration error:", error)
      alert("회원가입 중 오류가 발생했습니다.")
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // 1부터 30기까지 생성
  const cohortOptions = Array.from({ length: 30 }, (_, i) => i + 1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d3431a] via-black to-orange-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-900 border-gray-700">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image src="/images/logo_2.png" alt="비타민 로고" width={60} height={60} className="h-15 w-15" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">회원가입</CardTitle>
          <CardDescription className="text-gray-400">비타민 동아리에 가입하여 함께 성장해요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  이름 *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-gray-800 border-gray-600 text-white focus:ring-[#d3431a] focus:border-[#d3431a]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">성별 *</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" className="border-gray-600 text-[#d3431a]" />
                    <Label htmlFor="male" className="text-white">
                      남성
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" className="border-gray-600 text-[#d3431a]" />
                    <Label htmlFor="female" className="text-white">
                      여성
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-white">
                  생년월일 *
                </Label>
                <Input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                  className="bg-gray-800 border-gray-600 text-white focus:ring-[#d3431a] focus:border-[#d3431a]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school" className="text-white">
                  학교 *
                </Label>
                <Input
                  id="school"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  required
                  className="bg-gray-800 border-gray-600 text-white focus:ring-[#d3431a] focus:border-[#d3431a]"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">
                  전화번호 *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="bg-gray-800 border-gray-600 text-white focus:ring-[#d3431a] focus:border-[#d3431a]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  이메일 *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-gray-800 border-gray-600 text-white focus:ring-[#d3431a] focus:border-[#d3431a]"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cohort" className="text-white">
                  기수 *
                </Label>
                <Select onValueChange={(value) => handleSelectChange("cohort", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:ring-[#d3431a] focus:border-[#d3431a]">
                    <SelectValue placeholder="기수를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {cohortOptions.map((cohort) => (
                      <SelectItem key={cohort} value={cohort.toString()} className="text-white hover:bg-gray-700">
                        {cohort}기
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-white">
                  역할 *
                </Label>
                <Select onValueChange={(value) => handleSelectChange("role", value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:ring-[#d3431a] focus:border-[#d3431a]">
                    <SelectValue placeholder="역할을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="member" className="text-white hover:bg-gray-700">
                      멤버
                    </SelectItem>
                    <SelectItem value="management" className="text-white hover:bg-gray-700">
                      운영진
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">
                  아이디 *
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="bg-gray-800 border-gray-600 text-white focus:ring-[#d3431a] focus:border-[#d3431a]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  비밀번호 *
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="bg-gray-800 border-gray-600 text-white focus:ring-[#d3431a] focus:border-[#d3431a]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">
                비밀번호 확인 *
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="bg-gray-800 border-gray-600 text-white focus:ring-[#d3431a] focus:border-[#d3431a]"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#d3431a] to-[#ff6b35] hover:from-[#b8371a] hover:to-[#e55a2b] text-white font-semibold py-3"
            >
              {loading ? "가입 중..." : "회원가입"}
            </Button>
          </form>

          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-400 mb-2">📌 회원가입 안내</p>
            <p className="text-xs text-gray-500">회원가입 후 운영진의 승인을 받아야 로그인이 가능합니다.</p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              이미 계정이 있으신가요?{" "}
              <Link href="/login" className="text-[#d3431a] hover:underline font-medium">
                로그인
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
