"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function ReviewSection() {
  const reviews = [
    {
      id: 1,
      gen: "14기",
      role: "멤버",
      name: "이○○",
      text: "컴퓨터공학을 복수전공했지만, 정작 데이터 분석과 인공지능을 접할 기회는 많지 않았던 것 같습니다. 혼자 공부하는 것에는 한계가 있었고, 함께 성장할 사람들을 찾고자 BITAmin에 지원했습니다. ",
    },
    {
      id: 2,
      gen: "13기",
      role: "운영진",
      name: "김○○",
      text: "BITAmin 활동을 통해 협업의 즐거움과 팀 프로젝트의 중요성을 배웠습니다. 다양한 전공의 학생들과 함께하며, 실제 서비스 기획과 데이터 분석을 경험했습니다.",
    },
    {
      id: 3,
      gen: "12기",
      role: "멤버",
      name: "박○○",
      text: "혼자서는 어려웠던 데이터 분석 공부를 함께할 수 있는 환경이 너무 좋았습니다. 세션과 스터디를 통해 꾸준히 성장할 수 있었습니다.",
    },
    {
      id: 4,
      gen: "11기",
      role: "운영진",
      name: "최○○",
      text: "운영진으로 활동하며 커뮤니티를 성장시키는 경험을 했습니다. 리더십과 커뮤니케이션 능력을 키울 수 있었던 소중한 시간이었습니다.",
    },
    {
      id: 5,
      gen: "10기",
      role: "멤버",
      name: "정○○",
      text: "BITAmin은 단순한 학회가 아니라 서로의 성장을 진심으로 응원하는 공동체라고 생각합니다. 매번 세션이 기다려질 정도로 즐거웠습니다.",
    },
    {
      id: 6,
      gen: "9기",
      role: "운영진",
      name: "홍○○",
      text: "BITAmin에서 데이터톤, 컨퍼런스, 스터디까지 정말 다양한 활동을 할 수 있었습니다. 그 어떤 대외활동보다 알찬 경험이었어요.",
    },
    {
      id: 7,
      gen: "8기",
      role: "멤버",
      name: "장○○",
      text: "BITAmin에서 배운 팀워크와 문제해결 능력이 현재 직무에도 큰 도움이 되고 있습니다. 추천하고 싶은 최고의 학회입니다.",
    },
    {
      id: 8,
      gen: "7기",
      role: "운영진",
      name: "유○○",
      text: "데이터에 관심 있는 학생이라면 꼭 참여해보세요. 다양한 학교, 전공의 학생들과 함께 배우고 성장할 수 있는 기회입니다.",
    },
  ]
  const [current, setCurrent] = useState(0)

  const nextReview = () => setCurrent((prev) => (prev + 1) % reviews.length)
  const prevReview = () => setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length)

  return (
    <section className="relative py-24 md:py-32 bg-transparent text-white overflow-hidden">
      {/* 주황색 빛 배경 */}
      <div
        className="absolute inset-0 top-1/2 h-[250px] opacity-50 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at center, rgba(255,100,0,0.35) 0%, rgba(0,0,0,0.85) 70%),
            linear-gradient(to right, rgba(255,80,0,0.25), rgba(255,80,0,0.6), rgba(255,80,0,0.25))
          `,
          filter: "blur(40px)",
          transform: "translateY(-50%)",
        }}
      />

      {/* 제목 */}
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">이전 기수 후기</h2>
        <p className="text-gray-400 text-sm md:text-base">
          BITAmin의 멤버들이 직접 전하는 생생한 경험담
        </p>
      </div>

      {/* 슬라이더 */}
      <div className="relative flex items-center justify-center max-w-5xl mx-auto px-4">
        {/* 좌우 버튼 */}
        <button
          onClick={prevReview}
          className="absolute left-2 md:left-8 text-white/70 hover:text-white transition z-20"
        >
          <ChevronLeft size={40} />
        </button>
        <button
          onClick={nextReview}
          className="absolute right-2 md:right-8 text-white/70 hover:text-white transition z-20"
        >
          <ChevronRight size={40} />
        </button>

        {/* 카드 영역 */}
        <div className="relative w-full h-[400px] md:h-[400px] flex items-center justify-center overflow-visible">
          {reviews.map((review, index) => {
            const distance = (index - current + reviews.length) % reviews.length

            // 현재 카드 주변에만 표시 (양옆 포함 3개만)
            if (distance > 2 && distance < reviews.length - 2) return null

            // 거리별 위치 조정
            const variants = {
              0: { scale: 1, opacity: 1, zIndex: 3, x: 0 },
              1: { scale: 0.85, opacity: 0.5, zIndex: 2, x: 220 },
              2: { scale: 0.75, opacity: 0.25, zIndex: 1, x: 380 },
              [-1]: { scale: 0.85, opacity: 0.5, zIndex: 2, x: -220 },
              [-2]: { scale: 0.75, opacity: 0.25, zIndex: 1, x: -380 },
            }

            const distanceKey = distance <= 2 ? distance : distance - reviews.length

            return (
              <motion.div
                key={review.id}
                className="absolute bg-[#111]/60 border border-gray-600 rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 text-left backdrop-blur-md w-[280px] sm:w-[320px] md:w-[400px]"
                animate={variants[distanceKey as keyof typeof variants]}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <div className="flex justify-between items-center mb-3 md:mb-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-white text-black font-bold px-2 py-1 rounded text-xs sm:text-sm">
                      {review.gen}
                    </span>
                    <span className="text-gray-300 text-xs sm:text-sm">{review.role}</span>
                  </div>
                  <span className="text-gray-400 text-xs sm:text-sm">{review.name}</span>
                </div>
                <p className="text-gray-200 text-xs sm:text-sm md:text-base leading-relaxed whitespace-pre-line">
                  {review.text}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}