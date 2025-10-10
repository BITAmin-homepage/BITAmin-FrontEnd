"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Users, ExternalLink, Instagram} from "lucide-react"
import Link from "next/link"

interface ApplyModalProps {
  isOpen: boolean
  onClose: () => void
}

// 모집 설정 - 실제 환경에서는 API나 환경변수로 관리
const RECRUITMENT_CONFIG = {
  isOpen: true, // 모집 활성화 여부
  startDate: "2024-03-01", // 모집 시작일
  endDate: "2024-03-31", // 모집 마감일
  googleFormUrl: "https://forms.google.com/d/e/1FAIpQLSe_example_form_id/viewform", // 구글폼 링크
  cohort: 16, // 기수
  maxMembers: 20, // 최대 모집 인원
}

export function ApplyModal({ isOpen, onClose }: ApplyModalProps) {
  const [daysLeft, setDaysLeft] = useState(0)
  const [recruitmentStatus, setRecruitmentStatus] = useState<"before" | "active" | "closed">("closed")

  useEffect(() => {
    const now = new Date()
    const startDate = new Date(RECRUITMENT_CONFIG.startDate)
    const endDate = new Date(RECRUITMENT_CONFIG.endDate)

    if (now < startDate) {
      setRecruitmentStatus("before")
      const timeDiff = startDate.getTime() - now.getTime()
      setDaysLeft(Math.ceil(timeDiff / (1000 * 3600 * 24)))
    } else if (now >= startDate && now <= endDate && RECRUITMENT_CONFIG.isOpen) {
      setRecruitmentStatus("active")
      const timeDiff = endDate.getTime() - now.getTime()
      setDaysLeft(Math.ceil(timeDiff / (1000 * 3600 * 24)))
    } else {
      setRecruitmentStatus("closed")
      setDaysLeft(0)
    }
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-white">
            비타민 {RECRUITMENT_CONFIG.cohort}기 모집
          </DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            데이터 분석 동아리 비타민에 지원하세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 모집 상태 배지 */}
          <div className="flex justify-center">
            {recruitmentStatus === "active" && (
              <Badge className="bg-green-600 text-white px-3 py-1">
                <Clock className="h-3 w-3 mr-1" />
                모집 중
              </Badge>
            )}
            {recruitmentStatus === "before" && (
              <Badge className="bg-blue-600 text-white px-3 py-1">
                <Calendar className="h-3 w-3 mr-1" />
                모집 예정
              </Badge>
            )}
            {recruitmentStatus === "closed" && (
              <Badge className="bg-red-600 text-white px-3 py-1">
                <Clock className="h-3 w-3 mr-1" />
                모집 마감
              </Badge>
            )}
          </div>

          {/* 모집 중일 때 */}
          {recruitmentStatus === "active" && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-center text-green-400">지금 지원하세요!</CardTitle>
                <CardDescription className="text-center text-gray-300">
                  {daysLeft > 0 ? `마감까지 ${daysLeft}일 남았습니다` : "오늘이 마감일입니다!"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <Calendar className="h-4 w-4 mx-auto mb-1 text-gray-400" />
                    <p className="text-gray-400">모집 기간</p>
                    <p className="text-white font-medium">
                      {formatDate(RECRUITMENT_CONFIG.startDate)} ~<br />
                      {formatDate(RECRUITMENT_CONFIG.endDate)}
                    </p>
                  </div>
                  <div className="text-center">
                    <Users className="h-4 w-4 mx-auto mb-1 text-gray-400" />
                    <p className="text-gray-400">모집 인원</p>
                    <p className="text-white font-medium">{RECRUITMENT_CONFIG.maxMembers}명</p>
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-[#d3431a] to-[#ff6b35] hover:from-[#b8371a] hover:to-[#e55a2b]"
                >
                  <Link href={RECRUITMENT_CONFIG.googleFormUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    지원서 작성하기
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* 모집 예정일 때 */}
          {recruitmentStatus === "before" && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-center text-blue-400">모집 예정</CardTitle>
                <CardDescription className="text-center text-gray-300">
                  {daysLeft > 0 ? `${daysLeft}일 후 모집이 시작됩니다` : "곧 모집이 시작됩니다!"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-400">모집 시작일</p>
                  <p className="text-white font-medium text-lg">{formatDate(RECRUITMENT_CONFIG.startDate)}</p>
                </div>

                <div className="text-center text-sm text-gray-400">
                  <p>모집 시작 알림을 받고 싶다면</p>
                  <p>비타민 SNS를 팔로우해주세요!</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    asChild
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                  >
                    <Link href="https://instagram.com/bitamin_official" target="_blank" rel="noopener noreferrer">
                      <Instagram className="h-4 w-4 mr-2" />
                      Instagram
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 모집 마감일 때 */}
          {recruitmentStatus === "closed" && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-center text-red-400">모집이 마감되었습니다</CardTitle>
                <CardDescription className="text-center text-gray-300">
                  {RECRUITMENT_CONFIG.cohort}기 모집이 종료되었습니다
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-400 mb-2">다음 모집 소식을 가장 빠르게 받아보세요</p>
                  <p className="text-sm text-gray-500">보통 매 학기 초에 새로운 기수를 모집합니다</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    asChild
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                  >
                    <Link href="https://instagram.com/bitamin_official" target="_blank" rel="noopener noreferrer">
                      <Instagram className="h-4 w-4 mr-2" />
                      Instagram
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Button
            onClick={onClose}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
          >
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
