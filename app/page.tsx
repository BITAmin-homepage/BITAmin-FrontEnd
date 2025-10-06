"use client"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { ActivitiesSection } from "@/components/activities"
import { ApplyModal } from "@/components/apply-modal"
import { useState } from "react"
import { UniversitiesSection } from "@/components/university"
export default function HomePage() {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 배경 이미지 (home.png) - 화면 전체 반응형 */}
      <div
        className="absolute inset-0 -z-10 bg-cover"
        style={{
          backgroundImage: 'url(/images/home.png)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top center',
        }}
      />

      {/* 상단 구체 이미지 오버레이 - 반응형 크기 */}
      <div
        className="absolute left-0 right-0 mx-auto -z-10"
        style={{
          top: 0,
          width: '100%',
          height: '40vh',
          //backgroundImage: 'url(/images/futuristic-metallic-sphere.png)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top center',
          backgroundSize: 'contain',
        }}
      />
      <Header onOpenApplyModal={() => setIsApplyModalOpen(true)} />
      <Hero onOpenApplyModal={() => setIsApplyModalOpen(true)} />

      <ActivitiesSection />
      
      <UniversitiesSection />
      <Footer />
      
      <ApplyModal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} />
    </div>
  )
}