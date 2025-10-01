import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Trophy, Code, Brain, Rocket } from "lucide-react"

export function About() {
  const features = [
    {
      icon: BookOpen,
      title: "체계적인 교육",
      description: "기초부터 고급까지 단계별 커리큘럼으로 데이터 사이언스 전문가로 성장",
    },
    {
      icon: Code,
      title: "실무 프로젝트",
      description: "실제 데이터를 활용한 프로젝트 경험으로 포트폴리오 구축",
    },
    {
      icon: Users,
      title: "네트워킹",
      description: "다양한 대학의 동료들과 함께하는 협업과 성장의 기회",
    },
    {
      icon: Brain,
      title: "AI/ML 특화",
      description: "최신 인공지능과 머신러닝 기술을 활용한 심화 학습",
    },
    {
      icon: Trophy,
      title: "경진대회",
      description: "각종 데이터 분석 경진대회 참여를 통한 실력 검증",
    },
    {
      icon: Rocket,
      title: "취업 지원",
      description: "현직자 멘토링과 취업 정보 공유로 커리어 발전 지원",
    },
  ]

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            왜 <span className="text-black">비타민</span>인가?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            데이터 사이언스 분야의 전문가가 되기 위한 모든 것이 준비되어 있습니다
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-gray-800 border-gray-700 hover:border-[#d3431a] transition-all duration-300 hover:shadow-lg hover:shadow-[#d3431a]/20"
            >
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-gradient-to-r from-[#d3431a] to-[#ff6b35] rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-white text-center">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-center">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4">함께 성장할 준비가 되셨나요?</h3>
            <p className="text-gray-300 mb-6">비타민과 함께 데이터 사이언스의 세계로 떠나보세요</p>
            <div className="flex justify-center space-x-8 text-center">
              <div>
                <div className="text-3xl font-bold text-[#d3431a]">500+</div>
                <div className="text-gray-400">졸업생</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#d3431a]">50+</div>
                <div className="text-gray-400">프로젝트</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#d3431a]">10+</div>
                <div className="text-gray-400">기수</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
