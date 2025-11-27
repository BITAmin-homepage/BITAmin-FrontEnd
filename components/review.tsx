"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function ReviewSection() {
  const reviews = [
    {
      id: 1,
      gen: "7기",
      role: "운영진",
      text: "BITAmin과 함께하는 모든 순간들이 제게 터닝포인트이자 막연했던 꿈의 길잡이가 되었습니다. 정규 세션을 통해 데이터 분석 및 머신러닝에 대한 지식을 쌓을 수 있고, 소모임에 참여하면서 다양한 기수 사람들과 교류하고 유익한 정보를 얻을 수 있답니다! BITAmin에서 활동하면서 뭔가 어렴풋이 느껴졌던 데이터와 친해질 수 있었고, 데이터로 의미 있는 변화를 만들어내고 싶다는 꿈을 한 번 더 굳힐 수 있게 되었습니다.",
    },
    {
      id: 2,
      gen: "10기",
      role: "운영진",
      text: "빅데이터 분석 학회 BITAmin의 가장 큰 장점은 데이터 분석 공부를 희망하는 다양한 사람들과 함께 공부할 수 있다는 점입니다. 다양한 전공, 그리고 열정을 가진 동아리원들과 활동을 함께 하며 큰 동기와 성취, 깨달음을 얻게 될 수 있었습니다. 또한 프로젝트 내 발표를 통해 분석적 사고방식의 시각을 넓혀 실력적으로 크게 성장하는 계기가 되었습니다. BITAmin에서 받았던 큰 배움과 도전했던 모든 것들이 제게 길을 알려주었고, 저를 성장시켜주었습니다.",
    },
    {
      id: 3,
      gen: "12기",
      role: "멤버",
      text: "데이터사이언스에 관심을 가진 이후 혼자 공부하는 것에는 분명한 한계가 있다고 느꼈고, 빅데이터 동아리 중 가장 체계적이고 탄탄한 프로그램을 가진 비타민에 들어오게 되었습니다. 머신러닝/딥러닝에 대해 직접적인 경험이 없어 초보자도 따라갈 수 있을까 고민이 되었지만, 매주 정성스럽게 준비해주시는 세션과 추가적으로 스터디, 프로젝트를 통해 데이터사이언스와 인공지능에 대한 지식을 키울 수 있었습니다.",
    },
    {
      id: 4,
      gen: "13기",
      role: "멤버",
      text: "1년동안 활동하며 정말 즐거운 추억을 쌓았습니다. 데이터분석에 대한 실력도 많이 쌓으며 정말 들어오길 잘했다는 생각이 들었습니다. 저도 산업공학을 전공했지만 정말 데이터분석에 무지했고 모르는게 너무 부끄러워 도움을 구하는 것도 힘들었던 경험이 있습니다. 그래서 비타민에 뛰어들었는데 비타민 멤버들이 옆에서 부족한 부분을 도와주셨습니다. 너무 겁먹지 말고 꼭 이곳에서 좋은 경험과 실력 그리고 인연을 쌓아가기 바랍니다. 어쩌면 성장한 스스로가 누군가에게 도움이 되는 순간이 올 것입니다.",
    },
    {
      id: 5,
      gen: "14기",
      role: "멤버",
      text: "컴퓨터공학을 복수전공했지만, 정작 데이터 분석과 인공지능을 접할 기회는 많지 않았던 것 같습니다. 혼자 공부하는 것에는 한계가 있었고, 함께 성장할 사람들을 찾고자 BITAmin에 지원했습니다. 1년 간 활동하며 머신러닝, 딥러닝, 강화학습 등을 공부하고, 다양한 프로젝트에 참여했습니다. 정해진 연구주제에 몰두해야 하는 연구실과 달리, 여러 사람들과 다양한 주제를 경험할 수 있는 것이 BITAmin의 큰 장점으로 느껴집니다.",
    },
    {
      id: 6,
      gen: "14기",
      role: "운영진",
      text: "BITAmin에서의 1년은 제게 있어 큰 성장의 기회였습니다. 저와 비슷한 관심사를 가진 사람들과 함께 공부하고 교류하며, 직간접적으로 많은 자극을 받을 수 있었습니다. BITAmin의 가장 큰 장점은 체계적인 커리큘럼과 총 5번의 프로젝트 경험을 쌓을 수 있다는 점입니다. 또한 논문 스터디, 기술 블로그 스터디 등 다양한 활동에 추가적으로 활동하면서 폭넓게 성장할 수 있던 값진 시간이었던 것 같습니다.",
    },
    {
      id: 7,
      gen: "15기",
      role: "운영진",
      text: "데이터사이언스를 진로로 꿈꾸면서도, 어디서부터 어떻게 시작해야 할지 막막했던 제게 BITAmin은 하나의 이정표가 되어주었습니다. 정규 세션을 통해 기초를 다지고, 프로젝트로 직접 모델을 구현해보며 제가 나아가야 할 방향을 더욱 확신할 수 있었습니다. 학업적인 성장은 물론, 소모임 활동과 네트워킹을 통해 평생 함께할 동료들을 만난 시간이기도 했습니다. 저에게 BITAmin에서의 1년은 단순한 동아리 활동이 아니라, 앞으로의 길을 함께 열어준 소중한 경험이었습니다.",
    },
  ]
  const [current, setCurrent] = useState(0)

  const nextReview = () => setCurrent((prev) => (prev + 1) % reviews.length)
  const prevReview = () => setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length)

  return (
    <section className="relative pt-40 pb-24 md:pt-52 md:pb-32 bg-transparent text-white overflow-hidden">
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
        <p className="text-base md:text-lg text-gray-400 mb-2">이전 기수 후기</p>
        <h2 className="text-2xl md:text-4xl font-bold text-[#ff5722]">
          BITAmin의 멤버들이 직접 전하는 생생한 경험담
        </h2>
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
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <span className="bg-white text-black font-bold px-2 py-1 rounded text-xs sm:text-sm">
                    {review.gen}
                  </span>
                  <span className="text-gray-300 text-xs sm:text-sm">{review.role}</span>
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