"use client"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { ActivitiesSection } from "@/components/activities"
import { ApplyProcessSection } from "@/components/apply"
import { ApplyModal } from "@/components/apply-modal"
import { useState } from "react"
import { UniversitiesSection } from "@/components/university"
import { ReviewSection } from "@/components/review"
import { IS_RECRUITING_ACTIVE } from "@/lib/recruit-config"

export default function HomePage() {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 배경 이미지 (home.png) - 화면 전체 반응형 */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 30%, rgba(255,140,64,0.30) 0%, rgba(255,140,64,0.10) 35%, rgba(0,0,0,0) 65%), linear-gradient(to bottom, #0c0b0a 0%, #1b120d 45%, #2a1a12 70%, #0d0a08 100%), url(/images/home.png)',
          backgroundBlendMode: 'soft-light, multiply, normal',
          backgroundSize: 'cover'
        }}
      />

      {/* 상단 비디오 오버레이 - 반응형 크기 */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute left-0 right-0 mx-auto z-0 w-full h-screen object-cover pointer-events-none"
        style={{
          top: 0,
        }}
      >
        <source src="/images/typeA-reverse.mp4" type="video/mp4" />
      </video>
      <Header onOpenApplyModal={() => setIsApplyModalOpen(true)} />
      <Hero onOpenApplyModal={() => setIsApplyModalOpen(true)} />

      <ActivitiesSection />
      
      <UniversitiesSection />
      
      <ReviewSection />
      
      <ApplyProcessSection />
      <Footer />
      
      {/* 모집 마감일 때만 모달 렌더링 */}
      {!IS_RECRUITING_ACTIVE && (
        <ApplyModal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} />
      )}
    </div>
  )
}