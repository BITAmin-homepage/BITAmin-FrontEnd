"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, Heart, Sparkles, ChevronDown } from "lucide-react"

const RECRUITMENT_CONFIG = {
  staffFormUrl: "https://forms.google.com/staff-application", // 운영진 지원 폼 URL (실제 URL로 변경 필요)
  memberFormUrl: "https://forms.google.com/member-application", // 멤버 지원 폼 URL (실제 URL로 변경 필요)
  cohort: 17,
}

interface FAQItem {
  id: number
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "Q. OT 참석이 불가능하면 무조건 불합격인가요?",
    answer: "A. OT는 1년간 비타민 활동 관련 안내 사항과 규칙을 공지하는 중요한 시간이기 때문에 필수참석이 요구되며, 불참 시 불합격 처리됩니다.<br />단, OT 예정일이 정규 세션일과 다르다는 점을 고려하여 불가피한 불참 상황을 참작할 예정입니다.<br />인턴, 계절학기, 입원 등의 상황이 있을 경우 사전에 말씀해주시고, 이후 증빙 자료를 제출해 주시기 바랍니다.",
  },
  {
    id: 2,
    question: "Q. 운영진의 역할은 무엇인가요?",
    answer:
      "A. 운영진은 동아리의 운영을 책임지며 멤버들이 원활한 학습을 할 수 있는 환경을 제공하는 역할을 하며, <br />교육부/기획홍보부/총무부로 나뉘어 있습니다. 책임감을 가지고 동아리 활동을 하실 수 있는 분들을 환영합니다.",
  },
  {
    id: 3,
    question: "Q. 코딩테스트는 어떻게 진행되나요?",
    answer:
      "A. 코딩테스트는 Python 언어로 진행되며 간단한 반복문&조건문 등 기초문법, 데이터 전처리 및 EDA 등에서 출제됩니다. <br />코딩 테스트는 최대 25분 동안 진행되며, 이후 면접 약 25분이 예정되어 있습니다. <br />코딩 테스트를 위해 개인 노트북을 필수로 지참해야한다는 점 참고 부탁드립니다.",
  },
  {
    id: 4,
    question: "Q. 경쟁률은 어느 정도 인가요?",
    answer:
      "A. 경쟁률은 기수마다 상이하기 때문에 확실하게 말씀드리기 어렵습니다. 다만, 면접 대상자는 최종 선발 인원의 2~2.5배수 정도를 선발합니다.",
  },
  {
    id: 5,
    question: "Q. 동아리 활동 시 통계나 수학적 지식이 많이 필요한지 궁금합니다.",
    answer:
      "A. 데이터 분석 및 머신러닝의 기본 원리를 이해하고, 실제 프로젝트에 효과적으로 적용하기 위해서는 기초적인 수학과 통계학 지식이 필요합니다. <br /> 선형대수, 기초 확률론, 기초 미적분한에 대한 이해가 있으면 활동에 도움이 됩니다. 수학적 지식은 미리 알고 있다면 좋지만, 정규세션과 스터디 활동을 통해 동아리원들과 함께 학습하며 성장할 수 있도록 지원할 예정입니다.",
  },
  {
    id: 6,
    question: "Q. 코딩테스트 시, 다로 정리해 두었던 코드 및 강의자료를 보는 것이 가능한가요?",
    answer:
      "A. 네 가능합니다. 코딩테스트 시에는 ChatGPT와 Colab 자동완성과 같은 생성형 AI 도구 사용은 금지되며, 직접 정리한 코드나 강의 자료는 자유롭게 <br />열람하실 수 있습니다. 구글링 역시 허용됩니다. 또한, 비타민 네이버 카페에 게시된 기출 문제를 참고하시면 충분히 합격 가능하니 이 점 참고해주세요!",
  },
  {
    id: 7,
    question: "Q. 지원할 때 학과 제한이 있나요?",
    answer:
      "A. 비타민 동아리원들은 공학계열부터 인문계열까지 다양한 학과에 재학 중이기에 학과 제한은 걱정하지 않으셔도 됩니다. <br />데이터 분석에 대한 관심과 열정을 우선으로 생각하고 있습니다.",
  },
  {
    id: 8,
    question: "Q. 지원서 재제출이 가능한가요?",
    answer:
      "A. 지원 기간 마감 전까지는 여러 번 제출이 가능합니다. 단, 중복 제출의 경우 가장 마지막에 제출된 지원서로 평가될 예정이니 참고 부탁드립니다.",
  },
  {
    id: 9,
    question: "Q. 운영진으로 지원했는데 멤버 중복 지원도 가능한가요?",
    answer: "A. 네 가능합니다. 다만 동시 지원을 원하실 경우 운영진 모집 구글폼과 멤버 모집 구글폼에 별도의 지원서를 제출해 주셔야 하는 점 참고 부탁드립니다.",
  },
  {
    id: 10,
    question: "Q. 정규 세션은 어디에서 진행되나요?",
    answer: "A. 정규 세션의 경우 서울 소재 대학교의 강의실을 대관하여 진행하고 있습니다.",
  }
]

export default function RecruitPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const schedule = {
    application: {
      title: "서류 모집",
      date: "6.2(월) ~ 6.25(수)",
    },
    staff: [
      { title: "운영진 서류 결과 발표", date: "6.26(목)" },
      { title: "운영진 면접", date: "6.28(토) ~ 6.29(일)" },
      { title: "운영진 합격자 발표", date: "6.30(월)" },
    ],
    member: [
      { title: "멤버 서류 결과 발표", date: "7.1(화)" },
      { title: "멤버 면접", date: "7.4(금) ~ 7.6(일)" },
      { title: "합격자 발표", date: "7.7(월)" },
    ],
    ot: {
      title: "OT",
      date: "7.9(수)",
      note: "OT 불참 시 입격 취소",
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Header />

      <main className="pt-48 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              <span className="text-[#d3431a]">BITAmin</span>
              <span className="text-white">의 여정에 함께할 당신을 기다립니다</span>
            </h1>

            <div className="flex justify-center mb-2">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-[#d3431a]/40 to-orange-600/30 rounded-full blur-3xl" />
                <div className="relative w-full h-full flex items-center justify-center">
                  <span className="text-[180px] md:text-[220px] font-black bg-gradient-to-br from-purple-400 via-[#d3431a] to-orange-500 bg-clip-text text-transparent">
                    B
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              {/* 버튼 클릭 시 새 탭에서 구글폼으로 이동 */}
              <Button
                onClick={() => window.open(RECRUITMENT_CONFIG.staffFormUrl, "_blank")}
                className="w-64 bg-gray-700 hover:bg-gray-600 text-white text-lg py-6 rounded-lg transition-all"
              >
                운영진 지원하기
              </Button>
              <Button
                onClick={() => window.open(RECRUITMENT_CONFIG.memberFormUrl, "_blank")}
                className="w-64 bg-gray-700 hover:bg-gray-600 text-white text-lg py-6 rounded-lg transition-all"
              >
                멤버 지원하기
              </Button>
            </div>
            <p className="text-gray-400 text-sm">운영진, 멤버 중복 지원 가능</p>
          </div>

          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">모집일정</h2>
              <p className="text-gray-400">BITAmin은 더 나은 기수 운영을 위해 운영진과 멤버 모집 절차의 차이가 있습니다</p>
            </div>

            <div className="max-w-5xl mx-auto">
              {/* 서류 모집 */}
              <div className="flex justify-center mb-8">
                <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-[#d3431a] border-2 w-80">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
                      <div className="w-6 h-6 rounded-full bg-purple-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{schedule.application.title}</h3>
                    <p className="text-[#d3431a] font-semibold text-lg">{schedule.application.date}</p>
                  </CardContent>
                </Card>
              </div>

              {/* 연결선 */}
              <div className="flex justify-center mb-8">
                <div className="w-0.5 h-12 bg-gradient-to-b from-[#d3431a] to-transparent" />
              </div>

              {/* 운영진 & 멤버 트랙 */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* 운영진 트랙 */}
                <div className="space-y-6">
                  {schedule.staff.map((item, index) => (
                    <div key={index} className="flex justify-center">
                      <Card className="bg-gray-800/50 border-gray-700 hover:border-[#d3431a] transition-all w-80">
                        <CardContent className="p-5 text-center">
                          <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                          <p className="text-gray-400 text-sm">{item.date}</p>
                        </CardContent>
                      </Card>
                      {index < schedule.staff.length - 1 && (
                        <div className="flex justify-center my-3">
                          <div className="w-0.5 h-8 bg-gray-700" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* 멤버 트랙 */}
                <div className="space-y-6">
                  {schedule.member.map((item, index) => (
                    <div key={index} className="flex justify-center">
                      <Card className="bg-gray-800/50 border-gray-700 hover:border-[#d3431a] transition-all w-80">
                        <CardContent className="p-5 text-center">
                          <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                          <p className="text-gray-400 text-sm">{item.date}</p>
                        </CardContent>
                      </Card>
                      {index < schedule.member.length - 1 && (
                        <div className="flex justify-center my-3">
                          <div className="w-0.5 h-8 bg-gray-700" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 합류 연결선 */}
              <div className="flex justify-center mb-20">
                <div className="relative w-full max-w-5xl">
                  <div className="absolute left-1/4 top-0 w-0.5 h-12 bg-gray-700" />
                  <div className="absolute right-1/4 top-0 w-0.5 h-12 bg-gray-700" />
                  <div className="absolute left-1/4 top-12 right-1/4 h-0.5 bg-gray-700" />
                  <div className="absolute left-1/2 -translate-x-1/2 top-12 w-0.5 h-12 bg-gray-700" />
                </div>
              </div>

              {/* OT */}
              <div className="flex justify-center">
                <Card className="bg-gradient-to-br from-[#d3431a] to-orange-600 border-0 w-80">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                      <div className="w-6 h-6 rounded-full bg-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{schedule.ot.title}</h3>
                    <p className="text-white font-semibold text-lg mb-2">{schedule.ot.date}</p>
                    <p className="text-white/80 text-sm">{schedule.ot.note}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">자격요건</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* 관심사 */}
              <Card className="bg-gradient-to-br from-purple-900/30 to-gray-900 border-purple-500/30 hover:border-purple-500 transition-all">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">관심과 열정</h3>
                  <p className="text-gray-300 leading-relaxed">
                    빅데이터와 AI에 관심이 있는
                    <br />
                    대학생 및 대학원생
                  </p>
                </CardContent>
              </Card>

              {/* 활동 기간 */}
              <Card className="bg-gradient-to-br from-[#d3431a]/30 to-gray-900 border-[#d3431a]/30 hover:border-[#d3431a] transition-all">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#d3431a]/20 flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="h-8 w-8 text-[#d3431a]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">활동 자격</h3>
                  <p className="text-gray-300 leading-relaxed">
                    BITAmin 활동기간(1년)동안<br />
                    대학생 및 대학원생 신분을 <br />
                    유지할 수 있는 분
                  </p>
                </CardContent>
              </Card>

              {/* 성장 의지 */}
              <Card className="bg-gradient-to-br from-orange-900/30 to-gray-900 border-orange-500/30 hover:border-orange-500 transition-all">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">함께 성장</h3>
                  <p className="text-gray-300 leading-relaxed">
                    동료들과 함께 배우고 성장하며 <br />
                    프로젝트를 완성해나갈 <br />
                    의지가 있는 분
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* 추가 안내 */}
            <Card className="mt-8 bg-gray-800/30 border-gray-700">
              <CardContent className="p-6">
                <p className="text-gray-300 text-center leading-relaxed">
                  BITAmin은 전공과 학년에 관계없이 데이터 분석과 AI에 대한 열정이 있는 모든 분들을 환영합니다
                </p>
              </CardContent>
            </Card>
          </div>

          {/* FAQ 섹션 */}
          <div className="max-w-5xl mx-auto mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">자주 묻는 질문</h2>
            </div>

            <div className="space-y-4">
              {faqData.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-700 rounded-lg overflow-hidden transition-all duration-300 hover:border-[#d3431a]"
                >
                  {/* Question Button */}
                  <button
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    className="w-full px-6 py-5 flex items-start justify-between gap-4 hover:bg-gray-900/50 transition-colors text-left"
                  >
                    <span className="text-sm md:text-base font-medium text-gray-300 flex-1">{item.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 text-gray-500 transition-transform duration-300 ${
                        expandedId === item.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Answer Section */}
                  {expandedId === item.id && (
                    <div className="border-t border-gray-700 px-6 py-5 bg-gray-900/30">
                      <p 
                        className="text-sm md:text-base leading-normal text-gray-400"
                        dangerouslySetInnerHTML={{ __html: item.answer }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
