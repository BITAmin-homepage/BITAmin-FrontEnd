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
        ["6주차", <>Seq2Seq,<br className="md:hidden" /> Transformer 구조 학습</>],
      ],
      project: [
        ["1~7주차", "프로젝트 수행"],
        ["8주차", "컨퍼런스"],
      ],
    },
    {
      label: "First Semester",
      regular: [
        ["1주차", <>머신러닝 개요,<br className="md:hidden" /> 전처리&EDA&시각화</>],
        ["3주차", "분류 기본 모델 및 성능 평가 학습"],
        ["5주차", <>회귀 기본 모델 및<br className="md:hidden" /> 성능 평가 학습,<br /> 군집 분석 모델 및 성능 평가 학습</>],
        ["6~8주차", "중간고사 휴회 기간"],
        ["9주차", <>Overfitting,<br className="md:hidden" /> Regularization,<br className="md:hidden" /> 앙상블 알고리즘 학습</>],
        ["11주차", "차원축소 기법 학습"],
      ],
      project: [
        ["1주차", "프로젝트 팀빌딩"],
        ["2주차", "프로젝트 회의"],
        ["4주차", "프로젝트 회의"],
        ["6~8주차", "중간고사 휴회 기간"],
        ["10주차", "프로젝트 회의"],
        ["12주차", "프로젝트 회의"],
        ["13주차", "컨퍼런스"]
      ],
    },
    {
      label: "Second Vacation Semester",
      regular: [
        ["1주차", "딥러닝 입문, 퍼셉트론, 신경망"],
        ["2주차", "오차역전파"],
        ["3주차", "매개변수 갱신, 배치정규화 학습"],
        ["4주차", "CNN 모델 구조 학습"],
        ["5주차", "RNN, LSTM 모델 구조 학습"],
        ["6주차", <>Seq2Seq,<br className="md:hidden" /> Transformer 구조 학습</>],
      ],
      project: [
        ["1~7주차", "프로젝트 수행"],
        ["8주차", "컨퍼런스"],
      ],
    },
    {
      label: "Second Semester",
      regular: [
        ["1주차", "논문 리뷰 및 발표1"],
        ["3주차", "논문 리뷰 및 발표2"],
        ["5주차", "논문 리뷰 및 발표3"],
        ["6~8주차", "중간고사 휴회 기간"],
        ["9주차", "논문 리뷰 및 발표4"],
        ["10주차", "논문 리뷰 및 발표5"],
      ],
      project: [
        ["1주차", "프로젝트 팀빌딩"],
        ["2주차", "프로젝트 회의"],
        ["4주차", "프로젝트 회의"],
        ["6~8주차", "중간고사 휴회 기간"],
        ["10주차", "프로젝트 회의"],
        ["12주차", "프로젝트 회의"],
        ["13주차", "컨퍼런스"]
      ],
    },
    {
      label: "Final Vacation Semester",
      regular: [],
      project: [
        ["1~8주차", "최종 프로젝트 수행"],
        ["9주차", "컨퍼런스"],
      ],
    },
  ]


  return (
    <section className="bg-black text-white py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-base md:text-lg text-white/60 mb-3">커리큘럼</p>
        <h2 className="text-2xl md:text-4xl font-bold text-[#ff6b35]">
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
              {curriculum[activeIndex].regular.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-8 text-center">정규세션</h3>
                  <div className="overflow-hidden rounded-xl border border-white/10 divide-y divide-white/10">
                    {curriculum[activeIndex].regular.map(([week, content], i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-6 py-4 bg-white/5 hover:bg-white/10 transition"
                      >
                        <span className="text-white/60 whitespace-nowrap">{week}</span>
                        <span className="text-white text-right">{content}</span>
                      </div>
                    ))}
                  </div>
                  {activeIndex === 0 &&(
                    <p className="text-white/50 text-base text-left mt-4 ml-6">
                      기존기수 발표 청강
                    </p>
                  )}
                  </div>
                )}
              <div className={curriculum[activeIndex].regular.length === 0 ? 'md:col-span-2' : ''}>
                <div className={curriculum[activeIndex].regular.length === 0 ? 'max-w-md mx-auto' : ''}>
                  <h3 className="text-xl font-bold mb-8 text-center">프로젝트</h3>
                  <div className="overflow-hidden rounded-xl border border-white/10 divide-y divide-white/10">
                    {curriculum[activeIndex].project.map(([week, content], i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-6 py-4 bg-white/5 hover:bg-white/10 transition"
                      >
                        <span className="text-white/60 whitespace-nowrap">{week}</span>
                        <span className="text-white text-right">{content}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}