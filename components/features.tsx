import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Trophy, Upload } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: BookOpen,
      title: "세션 자료",
      description: "매주 업로드되는 고품질 학습 자료와 PDF 파일을 통해 체계적으로 학습하세요.",
    },
    {
      icon: Upload,
      title: "과제 시스템",
      description: "예습과 복습 과제를 통해 실력을 향상시키고 구글폼으로 간편하게 제출하세요.",
    },
    {
      icon: Trophy,
      title: "컨퍼런스",
      description: "정기적인 컨퍼런스를 통해 프로젝트 발표와 네트워킹 기회를 제공합니다.",
    },
    {
      icon: Users,
      title: "커뮤니티",
      description: "동료들과 함께 성장하며 빅데이터 분야의 전문가로 발전해나가세요.",
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">비타민에서 제공하는 서비스</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            체계적인 교육 시스템과 활발한 커뮤니티를 통해 빅데이터 전문가로 성장하세요
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-[#d3431a] rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
