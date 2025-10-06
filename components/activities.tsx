"use client"
import { useState } from "react"

export function ActivitiesSection() {
  const [selected, setSelected] = useState(Array(7).fill(false))

  const handleClick = (index: number) => {
    const updated = [...selected]
    updated[index] = !updated[index]
    setSelected(updated)
  }

  const activities = [
    "정규 세션",
    "스터디",
    "현직자\n특강",
    "인턴·데이터톤",
    "컨퍼런스",
    "소모임",
    "MT",
  ]

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* 좌우 네트워크 장식 — 반응형 크기 + 자연스러운 확장 */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex justify-between items-center">
        <div
          className="w-[75vw] sm:w-[68vw] md:w-[61vw] lg:w-[51vw] max-w-[1180px] aspect-[520/280] bg-no-repeat bg-contain opacity-90 transition-all duration-500"
          style={{
            backgroundImage: "url(/images/net_left.png)",
            backgroundPosition: "left center",
          }}
        />
        <div
          className="w-[75vw] sm:w-[68vw] md:w-[61vw] lg:w-[51vw] max-w-[1180px] aspect-[520/280] bg-no-repeat bg-contain opacity-90 transition-all duration-500"
          style={{
            backgroundImage: "url(/images/net_right.png)",
            backgroundPosition: "right center",
          }}
        />
      </div>

      {/* 내용 */}
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <p className="text-center text-sm text-gray-400 mb-2">주요활동</p>
        <h2 className="text-center text-2xl md:text-3xl font-semibold text-white mb-10">
          BITAmin에서는 이러한 활동들을 할 수 있습니다
        </h2>

        {/* 2-3-2 구조 */}
        <div className="flex flex-col items-center space-y-6 md:space-y-8">
          {/* 1줄 (2개) */}
          <div className="flex justify-center space-x-8 md:space-x-12">
            {activities.slice(0, 2).map((activity, i) => (
              <div
                key={i}
                onClick={() => handleClick(i)}
                className="cursor-pointer w-24 h-24 md:w-32 md:h-32 bg-no-repeat bg-contain flex items-center justify-center text-white transition-transform hover:scale-105"
                style={{
                  backgroundImage: selected[i]
                    ? "url(/images/polygon1.png)"
                    : "url(/images/polygon2.png)",
                }}
              >
                <span className="text-[13px] md:text-base lg:text-lg leading-tight text-center whitespace-pre-line font-medium -translate-y-1 md:-translate-y-1.5 lg:-translate-y-2 inline-block">
                  {activity}
                </span>
              </div>
            ))}
          </div>

          {/* 2줄 (3개) */}
          <div className="flex justify-center space-x-8 md:space-x-12">
            {activities.slice(2, 5).map((activity, i) => (
              <div
                key={i + 2}
                onClick={() => handleClick(i + 2)}
                className="cursor-pointer w-24 h-24 md:w-32 md:h-32 bg-no-repeat bg-contain flex items-center justify-center text-white transition-transform hover:scale-105"
                style={{
                  backgroundImage: selected[i + 2]
                    ? "url(/images/polygon1.png)"
                    : "url(/images/polygon2.png)",
                }}
              >
                <span className="text-[13px] md:text-base lg:text-lg leading-tight text-center whitespace-pre-line font-medium -translate-y-1 md:-translate-y-1.5 lg:-translate-y-2 inline-block">
                  {activity}
                </span>
              </div>
            ))}
          </div>

          {/* 3줄 (2개) */}
          <div className="flex justify-center space-x-8 md:space-x-12">
            {activities.slice(5, 7).map((activity, i) => (
              <div
                key={i + 5}
                onClick={() => handleClick(i + 5)}
                className="cursor-pointer w-24 h-24 md:w-32 md:h-32 bg-no-repeat bg-contain flex items-center justify-center text-white transition-transform hover:scale-105"
                style={{
                  backgroundImage: selected[i + 5]
                    ? "url(/images/polygon1.png)"
                    : "url(/images/polygon2.png)",
                }}
              >
                <span className="text-[13px] md:text-base lg:text-lg leading-tight text-center whitespace-pre-line font-medium -translate-y-1 md:-translate-y-1.5 lg:-translate-y-2 inline-block">
                  {activity}
                </span>
              </div>
            ))}
          </div>
        </div>

         {/* 버튼 */}
        <div className="mt-10 flex justify-center">
          <button
              type="button"
              className="bg-black/50 hover:bg-black/90 text-white font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 rounded-md"
          >
            더 많은 활동 보기
          </button>
        </div>
      </div>
    </section>
  )
}