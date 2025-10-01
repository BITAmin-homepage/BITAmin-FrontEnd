"use client"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Footer } from "@/components/footer"
import { ApplyModal } from "@/components/apply-modal"
import { useState } from "react"

export default function HomePage() {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 첫 번째 배경 레이어 - 그라데이션 */}
      <div 
        className="absolute"
        style={{
          width: '1440px',
          height: '4044px',
          left: '-1590px',
          top: '-111px',
          background: `
            linear-gradient(48.43deg, rgba(0, 0, 0, 0.2) 26.04%, rgba(255, 160, 8, 0.2) 99.02%),
            radial-gradient(63.43% 59.38% at 50% -7.32%, #E04A0F 0%, #9C330A 17.84%, #000000 58.67%)
          `
        }}
      />
      
      {/* 두 번째 배경 레이어 - 구체 이미지 */}
      <div 
        className="absolute"
        style={{
          width: '1440px',
          height: '1085.53px',
          left: '0px',
          top: '0px',
          backgroundImage: 'url(/images/futuristic-metallic-sphere.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Header />
      <Hero onOpenApplyModal={() => setIsApplyModalOpen(true)} />
      <About />
      <Footer />
      
      <ApplyModal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} />
    </div>
  )
}