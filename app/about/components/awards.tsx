"use client"

import { useState } from "react"

export default function AwardSection() {
  const [showAll, setShowAll] = useState(false)

  const awards = [
    ["2025 도서관 데이터 활용 공모전, 우수상, 국립중앙도서관", "2025 SW 경진대회, 대상, 정보통신기획평가원"],
    ["제 3회 BDA 채용 연계 공모전, 우수상, BDA x 세일링스톤", "2025 날씨 빅데이터 콘테스트, 장려상, 기상청"],
    ["2025 DB 보험금융공모전, 장려상, DB 김준기문화재단", "2025 날씨 빅데이터 콘테스트, 장려상, 기상청"],
    ["2024 제 1회 화성시 공공데이터분석 공모전, 장려상, 화성시", "2025 공공주택 공유차량 적정규모 산정 공모전, 최우수상, LH한국토지주택공사"],
    ["2024 DATA:AI 분석 경진대회, 우수문제 해결상, 한국과학기술정보연구원", "2024 제조 빅데이터 분석 경진대회, 장려상, 경상국립대학교"],
    ["2024 한국관광 데이터랩 활용사례 경진대회, 장려상, 문화체육관광부", "2024 NH 투자증권 빅데이터 경진대회, 대상, NH 투자증권"],
    ["2024 도서관 빅데이터 활용 공모전, 최우수상, 국립중앙도서관", "2024 신용정보 분석 공모전, 우수상, 금융보안원"],
    ["2023 금융데이터 경진대회, 장려상, 금융보안원", "2023 통계데이터 경진대회, 장려상, 통계청"],
    ["2023 AI 해커톤, 우수상, SW중심대학협의회", "2023 산업데이터 분석대회, 장려상, 산업통상자원부"],
    ["2023 AI 해커톤, 우수상, SW중심대학협의회", "2023 산업데이터 분석대회, 장려상, 산업통상자원부"],
    ["2023 AI 해커톤, 우수상, SW중심대학협의회", "2023 산업데이터 분석대회, 장려상, 산업통상자원부"],
    ["2023 AI 해커톤, 우수상, SW중심대학협의회", "2023 산업데이터 분석대회, 장려상, 산업통상자원부"],
  ]

  const visibleAwards = showAll ? awards : awards.slice(0, 6)

  return (
    <section
      className="relative text-white py-24 overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at center, rgba(255,110,40,0.35) 0%, rgba(0,0,0,1) 70%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-sm text-white/70 mb-2">수상이력</p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#ff6b35] mb-16">
          BITAmin과 함께 그려나가는 미래
        </h2>

        {/* 중앙 세로 타임라인 */}
        <div className="relative flex flex-col items-center">
          {/* 세로선 */}
          <div
            className="absolute left-1/2 top-0 h-full w-[2px]"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,107,53,0.3), rgba(255,255,255,0.3), rgba(255,107,53,0.3))",
            }}
          />

          {/* 수상 내역 */}
          <div className="space-y-12 w-full relative">
            {visibleAwards.map((pair, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative"
              >
                {/* 왼쪽 */}
                <div className="md:pr-8 md:text-right text-white/90">
                  {pair[0] && (
                    <p className="text-base md:text-lg leading-relaxed">
                      {pair[0]}
                    </p>
                  )}
                </div>

                {/* 중앙 점 */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <div className="relative w-5 h-5">
                    <div className="absolute inset-0 bg-[#ff6b35] rounded-full shadow-[0_0_10px_#ff6b35aa]" />
                    <div className="absolute inset-[4px] bg-black rounded-full" />
                  </div>
                </div>

                {/* 오른쪽 */}
                <div className="md:pl-8 md:text-left text-white/90">
                  {pair[1] && (
                    <p className="text-base md:text-lg leading-relaxed">
                      {pair[1]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 펼쳐보기 버튼 */}
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-20 px-6 py-2 rounded-full border border-white/40 text-white/80 hover:text-[#ff6b35] hover:border-[#ff6b35] transition-colors text-sm flex items-center gap-2"
          >
            {showAll ? "접기 ▲" : "펼쳐보기 ▼"}
          </button>
        </div>
      </div>
    </section>
  )
}