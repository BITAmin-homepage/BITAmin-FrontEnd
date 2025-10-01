import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

interface HeroProps {
  onOpenApplyModal: () => void
}

export function Hero({ onOpenApplyModal }: HeroProps) {
  return (
    <section className="relative text-white py-20 pt-72 md:pt-80 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-orange-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-[#d3431a] rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-orange-600 rounded-full blur-3xl opacity-15"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">

          <div className="mb-6 flex justify-center">
            <Image
              src="/images/bitamin-logo-white.png"
              alt="비타민 로고"
              width={400}
              height={100}
              className="h-16 md:h-24 w-auto"
            />
          </div>

          <p className="text-xl mb-8 text-white max-w-3xl mx-auto leading-relaxed">
            우리는 데이터로 세상을 읽고, AI로 내일을 상상합니다.
            <br />
            BITAmin은 빅데이터와 AI를 통해 더 나은 미래를 만드는 열정적인 학생들이 모인 동아리입니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={onOpenApplyModal}
              className="bg-black/50 hover:bg-black/90 text-white font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              지원하기  →
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
