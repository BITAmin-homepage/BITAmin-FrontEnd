"use client"
import { useState } from "react"
import Image from "next/image"

export function ActivitiesSection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const activities = [
    { 
      title: "정규 세션",
      description: "머신러닝과 딥러닝에 대한 발표 및 과제",
      image: "/images/session.png", // 정규세션 사진
    },
    { 
      title: "스터디",
      description: "개발자 스터디 및 알고리즘 학습",
      image: "/images/gang.jpg",
    },
    { 
      title: "현직자 특강",
      description: "업계 전문가와의 실무 중심 세미나",
      image: "/images/gang.jpg",
    },
    { 
      title: "데이터톤",
      description: "실무형 데이터톤 및 기업 연계 프로젝트",
      image: "/images/gang.jpg",
    },
    { 
      title: "컨퍼런스",
      description: "BITAmin Tech Conference 및 발표 행사",
      image: "/images/gang.jpg",
    },
    { 
      title: "소모임",
      description: "관심사별 친목 및 협업 활동",
      image: "/images/gang.jpg",
    },
    { 
      title: "MT",
      description: "학기 초·말 단체 MT 및 네트워킹",
      image: "/images/gang.jpg",
    },
  ]

  const handleSelect = (index: number) => {
    setSelectedIndex(index)
  }

  const closeModal = () => {
    setSelectedIndex(null)
  }

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* 좌우 네트워크 장식 */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex justify-between items-center">
        <div
          className="w-[75vw] sm:w-[68vw] md:w-[61vw] lg:w-[51vw] max-w-[1180px] aspect-[520/280] bg-no-repeat bg-contain opacity-90"
          style={{
            backgroundImage: "url(/images/net_left.png)",
            backgroundPosition: "left center",
          }}
        />
        <div
          className="w-[75vw] sm:w-[68vw] md:w-[61vw] lg:w-[51vw] max-w-[1180px] aspect-[520/280] bg-no-repeat bg-contain opacity-90"
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
          {[[0, 1], [2, 3, 4], [5, 6]].map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center space-x-8 md:space-x-12">
              {row.map((i) => (
                <div
                  key={i}
                  onClick={() => handleSelect(i)}
                  className="cursor-pointer w-24 h-24 md:w-32 md:h-32 bg-no-repeat bg-contain flex items-center justify-center text-white hover:scale-105 transition-transform"
                  style={{
                    backgroundImage: "url(/images/polygon2.png)",
                  }}
                >
                  <span className="text-[13px] md:text-base lg:text-lg leading-tight text-center whitespace-pre-line font-medium inline-block -translate-y-1 md:-translate-y-1.5 lg:-translate-y-2">
                    {activities[i].title}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 팝업 모달 */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="relative bg-[#111]/60 rounded-xl shadow-2xl border border-gray-700 max-w-md w-[90%] p-4">
            {/* 닫기 버튼 */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>

            {/* 타이틀 */}
            <div className="flex items-center mb-4">
              <div className="bg-white text-black font-semibold px-3 py-1 rounded-md text-sm">
                {activities[selectedIndex].title}
              </div>
            </div>

            {/* 이미지 */}
            <div className="overflow-hidden rounded-lg mb-3">
              <Image
                src={activities[selectedIndex].image}
                alt={activities[selectedIndex].title}
                width={600}
                height={400}
                className="object-cover w-full h-auto"
              />
            </div>

            {/* 설명 */}
            <p className="text-gray-200 text-center text-sm md:text-base">
              {activities[selectedIndex].description}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}