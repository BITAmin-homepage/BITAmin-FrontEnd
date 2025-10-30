"use client"

import { useState } from "react"

export default function Curriculum() {
  const [activeIndex, setActiveIndex] = useState(0)

  const curriculum = [
    {
      label: "First Vacation Semester",
      regular: [
        ["1주차", "딥러닝 입문, 퍼셉트론, 신경망"],
        ["2주차", "오차역전파"],
        ["3주차", "매개변수 갱신, 배치정규화 학습"],
        ["4주차", "CNN 모델 구조 학습"],
        ["5주차", "RNN, LSTM 모델 구조 학습"],
        ["6주차", "Seq2Seq, Transformer 구조 학습"],
      ],
      project: [
        ["1주차", "프로젝트 팀빌딩"],
        ["2주차", "주제 탐색 및 기획"],
        ["3주차", "데이터 수집/전처리"],
        ["4주차", "모델링/평가"],
        ["5~7주차", "프로젝트 수행"],
        ["8주차", "컨퍼런스"],
      ],
    },
    {
      label: "First Semester",
      regular: [
        ["1주차", "Python 및 AI 기초 복습"],
        ["2주차", "EDA와 데이터 시각화"],
        ["3주차", "통계적 모델링"],
        ["4주차", "Feature Engineering"],
        ["5~6주차", "ML 알고리즘 심화"],
      ],
      project: [
        ["1주차", "프로젝트 주제 선정"],
        ["2~3주차", "데이터 탐색 및 분석"],
        ["4~6주차", "모델 개발 및 결과 정리"],
        ["7주차", "최종 발표"],
      ],
    },
    {
      label: "Second Vacation Semester",
      regular: [
        ["1주차", "딥러닝 복습 및 실전 코드 작성"],
        ["2~3주차", "Vision/Transformer 응용"],
        ["4~5주차", "LLM, ChatGPT API 실습"],
      ],
      project: [
        ["1주차", "RAG 구조 이해"],
        ["2~4주차", "LLM 기반 미니 프로젝트"],
        ["5~6주차", "결과 정리 및 발표"],
      ],
    },
    {
      label: "Second Semester",
      regular: [
        ["1~2주차", "데이터 엔지니어링 기본"],
        ["3~5주차", "MLOps 실습 (Docker, FastAPI)"],
        ["6주차", "AWS 배포 및 모니터링"],
      ],
      project: [
        ["1~2주차", "프로젝트 인프라 구축"],
        ["3~5주차", "MLOps 프로젝트 개발"],
        ["6주차", "결과 공유"],
      ],
    },
    {
      label: "Final Vacation Semester",
      regular: [
        ["1~2주차", "졸업 프로젝트 기획"],
        ["3~4주차", "기술 문서 및 포트폴리오 정리"],
      ],
      project: [
        ["1~2주차", "최종 프로젝트 수행"],
        ["3주차", "데모데이 및 평가"],
      ],
    },
  ]


  return (
    <section className="min-h-screen bg-black text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-white/60 mb-3">커리큘럼</p>
        <h2 className="text-2xl md:text-3xl font-bold text-[#ff6b35]">
          탄탄한 기초와 다양한 실무역량을 통합적으로 기를 수 있습니다
        </h2>

        {/* 타임라인 */}
        <div className="w-full border-t border-white/20 mt-10 relative">
          <div className="flex justify-between text-[10px] sm:text-xs md:text-sm font-medium text-white/70 mt-1 relative">
            {curriculum.map((item, i) => (
              <div
                key={i}
                onClick={() => setActiveIndex(i)}
                className="relative flex flex-col items-center w-full cursor-pointer group"
              >
                <div
                  className={`absolute -top-[10px] w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    activeIndex === i
                      ? "bg-[#ff6b35] ring-2 sm:ring-4 ring-[#ff6b35]/20 scale-110"
                      : "bg-white/30 group-hover:bg-white/50"
                  }`}
                />
                <span
                  className={`mt-4 sm:mt-6 transition text-center px-1 leading-tight ${
                    activeIndex === i
                      ? "text-[#ff6b35] font-semibold"
                      : "text-white/60"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 정규세션 / 프로젝트 */}
        <div className="max-w-6xl mx-auto mt-20">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#111]/80 to-[#0a0a0a]/90 shadow-lg p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-bold mb-8 text-center">정규세션</h3>
                <div className="overflow-hidden rounded-xl border border-white/10 divide-y divide-white/10">
                  {curriculum[activeIndex].regular.map(([week, content], i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-6 py-4 bg-white/5 hover:bg-white/10 transition"
                    >
                      <span className="text-white/60">{week}</span>
                      <span className="text-white text-right">{content}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-white/50 text-left">
                  신입기수의 경우 기존기수 발표 청강
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-8 text-center">프로젝트</h3>
                <div className="overflow-hidden rounded-xl border border-white/10 divide-y divide-white/10">
                  {curriculum[activeIndex].project.map(([week, content], i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-6 py-4 bg-white/5 hover:bg-white/10 transition"
                    >
                      <span className="text-white/60">{week}</span>
                      <span className="text-white text-right">{content}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}