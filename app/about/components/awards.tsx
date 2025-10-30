"use client"

import { useState } from "react"

export default function AwardSection() {
  const [showAll, setShowAll] = useState(false)

  const awards = [
    ["2025 SW 경진대회 대상 | 정보통신기획평가원", "2025 도서관 데이터 활용 공모전 우수상 | 국립중앙도서관"],
    ["2025 날씨 빅데이터 콘테스트 장려상 | 기상청", "2025 제 3회 BDA 채용 연계 공모전 우수상 | BDA × 세일링스톤"],
    ["2025 날씨 빅데이터 콘테스트 장려상 | 기상청", "2025 DB 보험금융공모전 장려상 | DB 김준기문화재단"],
    ["2025 공공주택 공유차량 적정규모 산정 공모전 최우수상 | LH한국토지주택공사", "2024 제 1회 화성시 공공데이터분석 공모전 장려상 | 화성시"],
    ["2024 제조 빅데이터 분석 경진대회 장려상 | 경상국립대학교", "2024 DATA:AI 분석 경진대회 우수문제 해결상 | 한국과학기술정보연구원"],
    ["2024 NH 투자증권 빅데이터 경진대회 대상 | NH 투자증권", "2024 한국관광 데이터랩 활용사례 경진대회 장려상 | 문화체육관광부"],
    ["2024 도서관 빅데이터 활용 공모전 최우수상 | 국립중앙도서관", "2024 사회문제 해결을 위한 해커톤 우수상 | 한국정책학회"],
    ["2023 디지털IT 학회 연계 프로그램 대상 | 삼성증권", "2023 디지털IT 학회 연계 프로그램 우수상 | 삼성증권"],
    ["2023 제 5회 대구 빅데이터 분석 경진대회 최우수상 | 대구디지털혁신진흥원", "2023 NH투자증권 빅데이터 경진대회 입선 | NH 투자증권"],
    ["2023 K-water 대국민 물 빅데이터 공모전 우수상 | 한국수자원공사", "2022 통계데이터 인공지능 활용대회 우수상 | 한국통계진흥원"],
    ["2022 공공조달 빅데이터 경진대회 최우수상 | 한국지능시스템학회", "2022 미래기술 챌린지 최우수상 | CJ 대한통운"],
    ["2021 신용카드 대금 연체 예측 3위 | 데이터온", "2021 데이터 크리에이터 캠프 우수상 | 과학기술정보통신부"],
    ["2021 데이터 기반 코로나 19 예측 공모전 우수상 | 경기도경제과학진흥원", "2020 Y&Z세대 투자자 프로파일링 시각화 경진대회 입선 | 데이터온"],
    ["2020 제 1회 삼성카드 데이터 분석&아이디어 공모전 2위 | 삼성카드", "2020 문화관광 빅데이터 분석대회 금상 | 한국문화관광연구원"],
    ["2019 KCB 금융스타일 시각화 경진대회 1위 | KCB", "2019 KCB 금융스타일 시각화 경진대회 3위 | KCB"],
    ["2019 L.POINT 빅데이터 컴피티션 최우수상 | 롯데멤버스", ""],
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
                    <p className="text-base md:text-lg leading-relaxed" style={{ wordBreak: 'keep-all' }}>
                      {pair[0].split('|').map((part, i, arr) => (
                        <span key={i} className="inline-block">
                          {part.trim()}
                          {i < arr.length - 1 && ' | '}
                        </span>
                      ))}
                    </p>
                  )}
                </div>

                {/* 중앙 점 */}
                <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
                  <div className="relative w-5 h-5">
                    <div className="absolute inset-0 bg-[#ff6b35] rounded-full shadow-[0_0_10px_#ff6b35aa]" />
                    <div className="absolute inset-[4px] bg-black rounded-full" />
                  </div>
                </div>

                {/* 오른쪽 */}
                <div className="md:pl-8 md:text-left text-white/90">
                  {pair[1] && (
                    <p className="text-base md:text-lg leading-relaxed" style={{ wordBreak: 'keep-all' }}>
                      {pair[1].split('|').map((part, i, arr) => (
                        <span key={i} className="inline-block">
                          {part.trim()}
                          {i < arr.length - 1 && ' | '}
                        </span>
                      ))}
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