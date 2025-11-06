"use client"

import { useState } from "react"

type AwardsByYear = Record<number, string[]>

export default function AwardSection() {
  const [selectedYear, setSelectedYear] = useState<number>(2025)

  const awardsByYear: AwardsByYear = {
    2025: [
      "SW 경진대회, 대상, 정보통신기획평가원",
      "도서관 데이터 활용 공모전, 우수상, 국립중앙도서관",
      "날씨 빅데이터 콘테스트, 장려상, 기상청",
      "제 3회 BDA 채용 연계 공모전, 우수상, BDA × 세일링스톤",
      "날씨 빅데이터 콘테스트, 장려상, 기상청",
      "DB 보험금융공모전, 장려상, DB 김준기문화재단",
      "공공주택 공유차량 적정규모 산정 공모전, 최우수상, LH한국토지주택공사",
    ],
    2024: [
      "제조 빅데이터 분석 경진대회, 장려상, 경상국립대학교",
      "NH 투자증권 빅데이터 경진대회, 대상, NH 투자증권",
      "도서관 빅데이터 활용 공모전, 최우수상, 국립중앙도서관",
      "사회문제 해결을 위한 해커톤, 우수상, 한국정책학회",
      "제 1회 화성시 공공데이터분석 공모전, 장려상, 화성시",
      "DATA:AI 분석 경진대회, 우수문제 해결상, 한국과학기술정보연구원",
      "한국관광 데이터랩 활용사례 경진대회, 장려상, 문화체육관광부",
    ],
    2023: [
      "디지털IT 학회 연계 프로그램, 대상, 삼성증권",
      "디지털IT 학회 연계 프로그램, 우수상, 삼성증권",
      "제 5회 대구 빅데이터 분석 경진대회, 최우수상, 대구디지털혁신진흥원",
      "NH투자증권 빅데이터 경진대회, 입선, NH 투자증권",
      "K-water 대국민 물 빅데이터 공모전, 우수상, 한국수자원공사",
    ],
    2022: [
      "통계데이터 인공지능 활용대회, 우수상, 한국통계진흥원",
      "공공조달 빅데이터 경진대회, 최우수상, 한국지능시스템학회",
      "미래기술 챌린지, 최우수상, CJ 대한통운",
    ],
    2021: [
      "신용카드 대금 연체 예측, 3위, 데이터온",
      "데이터 크리에이터 캠프, 우수상, 과학기술정보통신부",
      "데이터 기반 코로나 19 예측 공모전, 우수상, 경기도경제과학진흥원",
    ],
    2020: [
      "Y&Z세대 투자자 프로파일링 시각화 경진대회, 입선, 데이터온",
      "제 1회 삼성카드 데이터 분석&아이디어 공모전, 2위, 삼성카드",
      "문화관광 빅데이터 분석대회, 금상, 한국문화관광연구원",
    ],
    2019: [
      "KCB 금융스타일 시각화 경진대회, 1위, KCB",
      "KCB 금융스타일 시각화 경진대회, 3위, KCB",
      "L.POINT 빅데이터 컴피티션, 최우수상, 롯데멤버스",
    ],
  }

  const years = Object.keys(awardsByYear)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <section className="relative text-white py-12 md:py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-6 text-center relative z-10">
        <p className="text-xs md:text-sm text-white/70 mb-2 tracking-wide">수상이력</p>
        <h2 className="text-2xl md:text-4xl font-bold text-[#ff6b35] mb-8 md:mb-16 tracking-wide">
          BITAmin과 함께 그려나가는 미래
        </h2>

        {/* 데스크톱 버전 - 타임라인 스타일 */}
        <div className="hidden md:block">
          {/* 선 위치 */}
          <div className="absolute left-0 right-0 top-[129px] h-[2px] bg-[#ff6b35]" />

          {/* 연도 + 수상 내역 */}
          <div className="flex justify-around max-w-5xl mx-auto relative">
            {years.map((year) => (
              <div key={year} className="flex flex-col items-center w-full">
                <button onClick={() => setSelectedYear(year)} className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full mb-1 relative -top-[8px] transition-all ${
                      selectedYear === year
                        ? "border-2 border-[#ff6b35] bg-transparent scale-150 shadow-[0_0_8px_#ff6b35aa]"
                        : "bg-[#ff6b35]"
                    }`}
                  />
                  <span
                    className={`transition-all ${
                      selectedYear === year
                        ? "text-[#ff6b35] text-3xl font-bold"
                        : "text-[#ff8c5c] text-lg"
                    }`}
                  >
                    {year}
                  </span>
                </button>

                {/* 선택된 연도 설명 */}
                {selectedYear === year && (
                  <div className="mt-6 flex flex-col items-start gap-1 animate-fadeIn">
                    {awardsByYear[year].map((award, index) => (
                      <div
                        key={index}
                        className="text-white/90 text-sm leading-relaxed whitespace-nowrap"
                      >
                        {award}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 모바일 버전 - 가로 스크롤 + 카드 스타일 */}
        <div className="md:hidden">
          {/* 연도 선택 버튼 - 가로 스크롤 */}
          <div className="relative mb-8">
            <div className="flex gap-3 overflow-x-auto pb-4 px-2 scrollbar-hide snap-x snap-mandatory">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`flex-shrink-0 px-6 py-3 rounded-full transition-all snap-center ${
                    selectedYear === year
                      ? "bg-[#ff6b35] text-white scale-80 shadow-lg"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  <span className={`font-semibold ${selectedYear === year ? "text-lg" : "text-base"}`}>
                    {year}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 수상 내역 */}
          <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm animate-fadeIn">
            <div className="flex flex-col gap-3">
              {awardsByYear[selectedYear].map((award, index) => {
                const parts = award.split(", ")
                const title = parts[0]
                const prize = parts[1]
                const organization = parts.slice(2).join(", ")
                
                return (
                  <div
                    key={index}
                    className="bg-white/5 rounded-lg p-4 text-left hover:bg-white/10 transition-colors"
                  >
                    <div className="text-white font-medium text-sm mb-1">{title}</div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="text-[#ff6b35] font-semibold">{prize}</span>
                      <span className="text-white/60">•</span>
                      <span className="text-white/70">{organization}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Fade 애니메이션 + 스크롤바 숨기기 */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { 
          animation: fadeIn 0.35s ease-out forwards; 
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}