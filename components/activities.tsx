"use client"
import { useState } from "react"
import Image from "next/image"

export function ActivitiesSection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const activities = [
    { 
      title: "정규 세션",
      description: "BITAmin은 총 1년간 정규 세션에서 각 커리큘럼에 맞는 내용을 학습합니다.\n멤버들은 조를 나누어서 커리큘럼에 맞는 내용을 발표 및 학습합니다.",
      image: "/images/session.jpg", // 정규세션 사진
    },
    { 
      title: "스터디",
      description: "BITAmin은 관심분야가 같은 학생들이 모여 자율적으로 스터디를 진행합니다.\n현재는 논문 리뷰 스터디, SQL 코딩테스트 스터디, 알고리즘 스터디, 기술 블로그 스터디, \n강화학습 스터디 등 다양한 스터디가 활발히 운영되고 있습니다.",
      image: "/images/study.jpg",
    },
    { 
      title: "현직자 특강",
      description: "BITAmin은 데이터·AI 분야에 먼저 취업하신 BITAmin 출신 선배님들을 모셔 \n현직자 초청 강연을 개최합니다. 취업이나 대학원을 준비하고 있는 동아리원들은 \n선배님들의 실제 경험담을 들으며 진로 준비를 구체화할 수 있습니다.",
      image: "/images/careerSeminar.jpg",
    },
    { 
      title: "연합 데이터톤",
      description: "BITAmin은 타 동아리와 함께 데이터톤에 공동 기획 및 참여하여 \n실제 데이터를 활용한 분석부터 발표까지 진행합니다. \n이러한 활동을 통해 동아리원들은 단순한 기술 습득을 넘어 실무 감각과 협업 능력을 \n동시에 키워 나가고 있습니다.",
      image: "/images/datathon.jpg",
    },
    { 
      title: "컨퍼런스",
      description: "BITAmin은 동아리 기간 동안 총 5번의 프로젝트를 진행합니다. \nNLP, CV, 시계열, 추천시스템, 멀티 모달 등 본인이 원하는 분야를 정해 프로젝트를 진행하고 \n최종 성과를 발표하는 컨퍼런스를 진행합니다.",
      image: "/images/conference.jpg",
    },
    { 
      title: "홈커밍데이",
      description: "BITAmin은 매년 홈커밍데이를 개최하여 선배님들과의 유대감을 다지고 \n취업과 대학원 진학에 도움이 되는 실질적인 정보를 얻을 수 있습니다.",
      image: "/images/homecoming.jpg",
    },
    { 
      title: "네트워킹",
      description: "BITAmin은 학업적인 성장뿐만 아니라 기수 간 친목을 위한 다양한 네트워킹 활동도 \n함께 진행합니다. MT를 통해 서로 더 가까워지는 시간을 마련하고, \n소모임을 통해 같은 취미를 가진 부원들이 자유롭게 모여 즐거운 시간을 보냅니다.",
      image: "/images/network.jpg",
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
        <p className="text-center text-sm md:text-base text-gray-400 mb-2">주요활동</p>
        <h2 className="text-center text-2xl md:text-3xl font-semibold text-[#ff5722] mb-10">
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="relative bg-[#111]/60 rounded-xl shadow-2xl border border-gray-700 max-w-2xl w-full p-5 md:p-6">
            {/* 닫기 버튼 */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-400 hover:text-white text-xl md:text-2xl z-10"
            >
              ✕
            </button>

            {/* 타이틀 */}
            <div className="flex items-center mb-4 md:mb-5">
              <div className="bg-white text-black font-semibold px-3 py-1.5 rounded-md text-sm md:text-base">
                {activities[selectedIndex].title}
              </div>
            </div>

            {/* 이미지 */}
            <div className="overflow-hidden rounded-lg mb-4 md:mb-5">
              <Image
                src={activities[selectedIndex].image}
                alt={activities[selectedIndex].title}
                width={900}
                height={600}
                className="object-cover w-full h-auto"
              />
            </div>

            {/* 설명 */}
            <p className="text-gray-200 text-center text-sm md:text-base leading-relaxed whitespace-pre-line">
              {activities[selectedIndex].description}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}