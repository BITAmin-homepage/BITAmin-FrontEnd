"use client"
import { motion } from "framer-motion"

export function UniversitiesSection() {
  const universities = [
    { name: "서울대학교", image: "/images/seoul.png" },
    { name: "연세대학교", image: "/images/yonsei.png" },
    { name: "고려대학교", image: "/images/korea.png" },
    { name: "한양대학교", image: "/images/hanyang.png" },
    { name: "서강대학교", image: "/images/sogang.png" },
  ]

  // 동일한 리스트 2개를 만들어 무한 회전처럼 보이게 함
  const scrollingUniversities = [...universities, ...universities]

  return (
    <section className="relative z-10 mt-16 md:mt-24 py-16 md:py-20 bg-transparent overflow-hidden">
      {/* 제목 영역 */}
      <div className="text-center mb-8">
        <p className="text-base md:text-lg text-gray-400 font-medium mb-1">활동 대학</p>
        <h2 className="text-2xl md:text-4xl font-bold text-[#ff5722]">
          BITAmin은 23개의 소속 학교의 학생들 함께 모여 학습합니다
        </h2>
      </div>

      {/* 슬라이드 영역 — 폭을 글씨보다 좁게 */}
      <div className="relative mx-auto w-[70vw] md:w-[60vw] lg:w-[50vw] overflow-hidden">
        <motion.div
          className="flex items-center space-x-8 md:space-x-12"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            duration: 25, // 속도 조절 (숫자 작을수록 빠름)
            ease: "linear",
          }}
        >
          {scrollingUniversities.map((u, index) => (
            <div key={index} className="flex items-center space-x-3 flex-shrink-0">
              <img
                src={u.image}
                alt={u.name}
                className="w-10 h-10 md:w-14 md:h-14 object-contain"
              />
              <p className="text-white text-sm md:text-lg font-medium whitespace-nowrap">
                {u.name}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}