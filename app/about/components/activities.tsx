"use client"

import { useState } from "react"

export default function ActivitiesSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  const activities = [
    {
      title: "정규 세션",
      desc: `BITAmin은 총 1년간 각 정규 세션을 통해 커리큘럼이 진행됩니다.

    정규세션은 시험기간을 제외하고 매주 1회씩 진행되며 
    학기 중에는 19시~21시, 방학 중에는 토요일 15시~18시에 진행됩니다.

    학기 Wed 7:00 PM ~ 9:00 PM
    방학 Sat 3:00 PM ~ 6:00 PM

    커리큘럼은 커리큘럼에 따라 조원들이 해당 범위를 직접 공부하여 
    발표를 진행하는 형식입니다.`,
      image: "/images/session.jpg",
    },
    {
      title: "컨퍼런스",
      desc: `BITAmin기간 동안 총 5번의 프로젝트를 진행합니다.
      
      학기 시작 전, 관심 있는 분야를 선택해 4~6인이 팀을 구성하고 
      프로젝트를 진행합니다. 방학과 학기 말마다 프로젝트 결과물을 
      공유하는 컨퍼런스를 진행하여, 성과를 발표하는 시간을 갖습니다. 
      
      NLP, CV, 시계열, 추천시스템, 멀티모달 등 본인이 자유롭게 분야를 
      선택할 수 있으며, 정해진 분야 외에도 원하는 주제를 직접 제안해 
      팀을 꾸릴 수 있습니다.`,
      image: "/images/conference.jpg",
    },
    {
      title: "스터디",
      desc: `
      BITAmin에는 관심 분야가 같은 학생들이 모여 
      자율적으로 스터디를 진행합니다. 스터디 참여는 필수가 아니며, 
      원하는 주제를 자유롭게 선택해 팀을 꾸릴 수 있습니다. 
      
      현재는 논문 리뷰 스터디, SQL 코딩테스트 스터디, 
      알고리즘 스터디, 기술 블로그 스터디, 강화학습 스터디 등 
      다양한 스터디가 활발히 운영되고 있습니다. 
      
      팀원들과 함께 공부할 내용을 정하고, 서로의 지식을 공유하며, 
      개인의 역량 뿐만 아니라 함께 성장하는 경험을 만들어갈 수 있습니다.
      `,
      image: "/images/gang.jpg",
    },
    {
      title: "현직자 특강",
      desc: `
      BITAmin은 데이터·AI 분야 취업이나 대학원 진학을 희망하는 
      동아리원들을 위해 정기적으로 현직자 초청 강연을 개최합니다. 
      특히 BITAmin 출신 선배님들을 모셔 실제 경험담과 진로 준비 
      과정을 직접 들을 수 있습니다. 
      
      강연을 통히 취업 및 대학원 진학에 필요한 실질적인 정보를 얻고 
      선배들과의 네트워킹을 통한 멘토링 기회도 가질 수 있습니다. 
      
      현직자 특강은 단순한 정보 전달을 넘어 
      동아리원들이 앞으로의 진로를 구체적으로 설계하고 
      준비할 수 있는 소중한 성장의 장이 됩니다.
      `,
      image: "/images/gang.jpg",
    },
    {
      title: "연합 데이터톤",
      desc: `
      BITAmin은 동아리 내부에서의 학습과 성장 뿐 아니라 
      외부 커뮤니티 및 기업과의 협업에도 다양한 활동을 이어가고 있습니다. 
      
      타 연합 동아리들과 함께 AI Datathon에 공동 참여하여 
      데이터 분석이나 AI의 이론적 학습을 넘어 실제 데이터를 활용한 
      분석부터 발표까지의 전 과정을 경험합니다. 
      
      이러한 활동을 통해 동아리원들은 단순한 기술 습득을 넘어
      실무 감각과 협업 능력을 동시에 키워 나가고 있습니다.
      `,
      image: "/images/datathon.jpg",
    },
    {
      title: "홈커밍데이",
      desc: `
      BITAmin은 매년 한 차례 홈커밍데이를 개최하여 선배님들과 
      네트워킹할 수 있는 시간을 마련합니다. 
      
      이 자리에서는 이전 학기의 우수팀 발표와 함께 다양한 
      레크리에이션이 진행되며 선배님들과의 식사 자리를 통해 
      자유롭게 교류할 수 있습니다. 
      
      이를 통해 동아리원들은 선후배 간의 유대감을 다지는 
      동시에 취업과 대학원 진학에 도움이 되는 실질적인 정보도 
      얻을 수 있습니다.
      `,
      image: "/images/gang.jpg",
    },
    {
      title: "네트워킹",
      desc: `
      BITAmin은 학업적인 성장뿐만 아니라 기수 간 친목을 
      위한 다양한 네트워킹 활동도 함께 진행합니다. 
      
      반기마다 전체 MT를 열어 서로 더 가까워질 수 있는 
      시간을 마련하고 소모임을 통해 같은 취미를 가진 
      부원들이 자유롭게 모여 즐거운 시간을 보냅니다. 
      
      단순한 동아리 활동을 넘어 함께 학업에 정진하고 
      같은 꿈을 향해 나아가는 소중한 동료를 얻을 수 있는 
      절호의 기회입니다.
      `,
      image: "/images/network.jpg",
    },
  ]

  return (
    <section className="bg-black text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-white/60 mb-3">주요활동</p>
        <h2 className="text-2xl md:text-3xl font-bold text-[#ff6b35] mb-12">
          BITAmin에서는 이러한 활동들을 할 수 있습니다
        </h2>

        {/* polygon 버튼 영역 */}
        <div className="flex justify-center items-center flex-wrap gap-1 mb-16">
          {activities.map((item, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className="relative w-40 aspect-[6/3.5] flex items-center justify-center text-base font-semibold transition-all"
              style={{
                backgroundImage: `url(${
                  activeIndex === i
                    ? "/images/polygon1.png" // 클릭 시
                    : "/images/polygon2.png" // 기본
                })`,
                backgroundSize: "contain", // ✅ 원본 비율 유지
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                color: activeIndex === i ? "#ff6b35" : "#ffffffcc",
                transform: activeIndex === i ? "scale(1.05)" : "scale(1)",
              }}
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* 하단 콘텐츠 카드 */}
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 border border-white/10 rounded-2xl bg-[#111]/80 p-6 md:p-10 shadow-md transition-all duration-300">
          {/* 왼쪽 텍스트 */}
          <div className="flex-1 text-left whitespace-pre-line">
            <h3 className="text-xl font-bold mb-4">{activities[activeIndex].title}</h3>
            <p className="text-white/70 leading-relaxed text-sm md:text-base">
              {activities[activeIndex].desc}
            </p>
          </div>

          {/* 오른쪽 이미지 */}
          <div className="flex-1">
            <img
              src={activities[activeIndex].image}
              alt={activities[activeIndex].title}
              className="rounded-xl border border-white/10 shadow-lg object-cover w-full h-auto max-h-[340px]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}