"use client"

import { useState } from "react"

type AwardsByYear = Record<number, string[]>

export default function AwardSection() {
  const [selectedYear, setSelectedYear] = useState<number>(2025)

  const awardsByYear: AwardsByYear = {
    2025: [
      "SW 경진대회, 대상, 정보통신기획평가원",
      "공공주택 공유차량 적정규모 산정 공모전, 최우수상, LH한국토지주택공사",
      "도서관 데이터 활용 공모전, 우수상, 국립중앙도서관",
      "제 3회 BDA 채용 연계 공모전, 우수상, BDA × 세일링스톤",
      "날씨 빅데이터 콘테스트, 장려상, 기상청",
      "DB 보험금융공모전, 장려상, DB 김준기문화재단",
    ],
    2024: [
      "NH 투자증권 빅데이터 경진대회, 대상, NH 투자증권",
      "도서관 빅데이터 활용 공모전, 최우수상, 국립중앙도서관",
      "사회문제 해결을 위한 해커톤, 우수상, 한국정책학회",
      "DATA:AI 분석 경진대회, 우수문제 해결상, 한국과학기술정보연구원",
      "제 1회 화성시 공공데이터분석 공모전, 장려상, 화성시",
      "한국관광 데이터랩 활용사례 경진대회, 장려상, 문화체육관광부",
      "제조 빅데이터 분석 경진대회, 장려상, 경상국립대학교",
      "포용적 기후정책 해커톤, 장려상, 경기도청",
    ],
    2023: [
      "디지털IT 학회 연계 프로그램, 대상, 삼성증권",
      "제 5회 대구 빅데이터 분석 경진대회, 최우수상, 대구디지털혁신진흥원",
      "디지털IT 학회 연계 프로그램, 우수상, 삼성증권",
      "K-water 대국민 물 빅데이터 공모전, 우수상, 한국수자원공사",
      "NH투자증권 빅데이터 경진대회, 입선, NH 투자증권",
    ],
    2022: [
      "데이터 크리에이터 캠프, 대상, 과학기술정보통신부",
      "공공조달 빅데이터 경진대회, 최우수상, 한국지능시스템학회",
      "미래기술 챌린지, 최우수상, CJ 대한통운",
      "국토교통 온라인 해커톤, 우수상, 국토교통부",
      "통계데이터 인공지능 활용대회, 우수상, 한국통계진흥원",
    ],
    2021: [
      "제17회 경영혁신 연구논문 및 사례연구 공모전, 우수상, KMAC",
      "데이터 크리에이터 캠프, 우수상, 과학기술정보통신부",
      "데이터 기반 코로나 19 예측 공모전, 우수상, 경기도경제과학진흥원",
      "신용카드 대금 연체 예측, 3위, 데이터온",
      "대학(원)생 논문공모전, 장려상, 한국기업지배구조원",
      "대전광역시 교통사고 위험지역 도출 경진대회, 입선, 한국토지주택공사"

    ],
    2020: [
      "품질경영학회 추계 학술대회, 최우수상, 품질경영학회",
      "문화관광 빅데이터 분석대회, 금상, 한국문화관광연구원",
      "제 1회 삼성카드 데이터 분석&아이디어 공모전, 2위, 삼성카드",
      "Y&Z세대 투자자 프로파일링 시각화 경진대회, 입선, 데이터온",
    ],
    2019: [
      "KCB 금융스타일 시각화 경진대회, 1위, KCB",
      "L.POINT 빅데이터 컴피티션, 최우수상, 롯데멤버스",
      "교육 공공데이터 분석 활용 대회, 최우수상, 한국대학교육협의회",
      "날씨 빅데이터 콘테스트, 우수상, 기상청",
      "KCB 금융스타일 시각화 경진대회, 3위, KCB",
    ],
  }

  const years = Object.keys(awardsByYear)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <section className="relative text-white py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 text-center relative z-10">
        <p className="text-base md:text-lg text-white/70 mb-2 tracking-wide">수상이력</p>
        <h2 className="text-2xl md:text-4xl font-bold text-[#ff6b35] mb-8 md:mb-16 tracking-wide">
          BITAmin과 함께 그려나가는 미래
        </h2>

        {/* 데스크톱 버전 - 타임라인 스타일 */}
        <div className="hidden md:block max-w-full overflow-visible">
          {/* 연도 + 수상 내역 */}
          <div className="flex justify-between items-start w-full max-w-7xl mx-auto px-8 relative">
            {/* 선 위치 */}
            <div className="absolute left-8 right-8 top-[8px] h-[2px] bg-[#ff6b35]" />
            {years.map((year) => (
              <div key={year} className="flex flex-col items-center min-w-0 flex-1 relative min-h-[300px]">
                <button 
                  onClick={() => setSelectedYear(year)} 
                  onMouseEnter={() => setSelectedYear(year)}
                  className="flex flex-col items-center whitespace-nowrap relative z-10"
                >
                  <div
                    className={`w-3 h-3 rounded-full mb-1 relative -top-[-3px] transition-all duration-500 ease-in-out ${
                      selectedYear === year
                        ? "border-2 scale-150 shadow-[0_0_12px_rgba(217,70,166,0.6)]"
                        : ""
                    }`}
                    style={{
                      background: selectedYear === year 
                        ? 'transparent'
                        : 'linear-gradient(135deg, #8B4789 0%, #D946A6 50%, #FF6B35 100%)',
                      borderColor: selectedYear === year 
                        ? '#D946A6'
                        : 'transparent'
                    }}
                  />
                  <span
                    className={`transition-all duration-500 ease-in-out whitespace-nowrap ${
                      selectedYear === year
                        ? "text-2xl md:text-3xl font-bold"
                        : "text-base md:text-lg"
                    }`}
                    style={{
                      background: 'linear-gradient(135deg, #8B4789 0%, #D946A6 50%, #FF6B35 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    {year}
                  </span>
                </button>

                {/* 선택된 연도 설명 */}
                <div 
                  className={`absolute top-20 left-1/2 -translate-x-1/2 flex flex-col items-start gap-1 transition-all duration-500 ease-in-out ${
                    selectedYear === year 
                      ? 'opacity-100 pointer-events-auto' 
                      : 'opacity-0 pointer-events-none'
                  }`}
                >
                  {awardsByYear[year].map((award, index) => {
                    const parts = award.split(", ")
                    const title = parts[0]
                    const prize = parts[1]
                    const organization = parts.slice(2).join(", ")
                    
                    return (
                      <div
                        key={index}
                        className="text-white/90 text-sm leading-relaxed whitespace-nowrap"
                      >
                        {title}, <span className="text-yellow-200 font-bold">{prize}</span>, {organization}
                      </div>
                    )
                  })}
                </div>
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
                  className={`flex-shrink-0 px-6 py-3 rounded-full transition-all duration-500 ease-in-out snap-center ${
                    selectedYear === year
                      ? "bg-[#ff6b35] text-white scale-110 shadow-lg"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  <span className={`font-semibold transition-all duration-500 ease-in-out ${selectedYear === year ? "text-lg" : "text-base"}`}>
                    {year}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 수상 내역 */}
          <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm transition-all duration-500 ease-in-out">
            <div className="flex flex-col gap-3">
              {awardsByYear[selectedYear].map((award, index) => {
                const parts = award.split(", ")
                const title = parts[0]
                const prize = parts[1]
                const organization = parts.slice(2).join(", ")
                
                return (
                  <div
                    key={index}
                    className="bg-white/5 rounded-lg p-4 text-left hover:bg-white/10 transition-all duration-300 ease-out opacity-0 animate-slideInUp"
                    style={{ animationDelay: `${index * 0.08}s` }}
                  >
                    <div className="text-white font-medium text-sm mb-1">{title}</div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="text-yellow-200 font-bold">{prize}</span>
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
        @keyframes slideInUp {
          from { 
            opacity: 0; 
            transform: translateY(20px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0);
          }
        }
        .animate-fadeIn { 
          animation: fadeIn 0.35s ease-out forwards; 
        }
        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out forwards;
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