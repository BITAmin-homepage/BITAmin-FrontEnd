"use client"
import { motion } from "framer-motion"

export function UniversitiesSection() {
  const universities = [
    { name: "서울대학교", image: "/images/school/seoul.png" },
    { name: "연세대학교", image: "/images/school/yonsei.png" },
    { name: "고려대학교", image: "/images/school/korea.png" },
    { name: "성균관대학교", image: "/images/school/sungkyunkwan.png" },
    { name: "한양대학교", image: "/images/school/hanyang.png" },
    { name: "중앙대학교", image: "/images/school/chungang.png" },
    { name: "경희대학교", image: "/images/school/kyunghee.png" },
    { name: "한국외국어대학교", image: "/images/school/hufs.png" },
    { name: "서강대학교", image: "/images/school/sogang.png" },
    { name: "동국대학교", image: "/images/school/dongguk.png" },
    { name: "홍익대학교", image: "/images/school/hongik.png" },
    { name: "숭실대학교", image: "/images/school/soongsil.png" },
    { name: "세종대학교", image: "/images/school/sejong.png" },
    { name: "건국대학교", image: "/images/school/konkuk.png" },
    { name: "명지대학교", image: "/images/school/myongji.png" },
    { name: "광운대학교", image: "/images/school/kwangwoon.png" },
    { name: "인하대학교", image: "/images/school/inha.png" },
    { name: "아주대학교", image: "/images/school/ajou.png" },
    { name: "가천대학교", image: "/images/school/gachon.png" },
    { name: "서울시립대학교", image: "/images/school/uos.png" },
    { name: "서울과학기술대학교", image: "/images/school/seoultech.png" },
    { name: "이화여자대학교", image: "/images/school/ewha.png" },
    { name: "숙명여자대학교", image: "/images/school/sookmyung.png" },
    { name: "성신여자대학교", image: "/images/school/sungshin.png" },
    { name: "덕성여자대학교", image: "/images/school/duksung.png" },
    { name: "동덕여자대학교", image: "/images/school/dongduk.png" },
    { name: "서울여자대학교", image: "/images/school/swu.png" },
    { name: "한국교통대학교", image: "/images/school/tu.png" },
  ]

  // 동일한 리스트 2개를 만들어 무한 회전처럼 보이게 함
  const scrollingUniversities = [...universities, ...universities]

  return (
    <section className="relative z-10 mt-16 md:mt-24 py-16 md:py-20 bg-transparent overflow-hidden">
      {/* 제목 영역 */}
      <div className="text-center mb-8">
        <p className="text-base md:text-lg text-gray-400 font-medium mb-1">활동 대학</p>
        <h2 className="text-2xl md:text-4xl font-bold text-[#ff5722]">
          BITAmin은 28개의 소속 학교의 학생들 함께 모여 학습합니다
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