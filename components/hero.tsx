import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-[#d3431a] via-black to-[#ff6b35] text-white py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-orange-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-[#d3431a] rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-orange-600 rounded-full blur-3xl opacity-15"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <div className="mb-8">
            <Image
              src="/images/logo_1.png"
              alt="비타민 로고"
              width={600}
              height={200}
              className="mx-auto h-24 w-auto"
            />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            데이터로 미래를 설계하다
          </h1>

          <p className="text-xl mb-8 text-gray-300 max-w-3xl mx-auto leading-relaxed">
            빅데이터와 AI 기술을 통해 혁신을 만들어가는 대학생들의 커뮤니티입니다.
            <br />
            함께 성장하고, 배우며, 실무 경험을 쌓아 데이터 사이언티스트로 성장해보세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#d3431a] to-[#ff6b35] hover:from-[#b8371a] hover:to-[#e55a2b] text-white font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                지금 시작하기
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#d3431a] text-[#d3431a] hover:bg-[#d3431a] hover:text-white bg-transparent px-8 py-3 text-lg transition-all duration-300"
              >
                더 알아보기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
