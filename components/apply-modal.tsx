"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Instagram } from "lucide-react"
import Link from "next/link"

interface ApplyModalProps {
  isOpen: boolean
  onClose: () => void
}

// 모집 설정
const RECRUITMENT_CONFIG = {
  cohort: 16, // 기수
}

export function ApplyModal({ isOpen, onClose }: ApplyModalProps) {
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
          {/* 모집 마감 */}
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
