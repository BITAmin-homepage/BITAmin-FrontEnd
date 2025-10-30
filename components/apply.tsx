"use client"

export function ApplyProcessSection() {
  const steps = [
    { step: "STEP 1", title: "서류 지원 접수" },
    { step: "STEP 2", title: "서류 결과 발표" },
    { step: "STEP 3", title: "코딩 테스트 & 면접 심사" },
    { step: "STEP 4", title: "최종 결과 발표" },
  ]

  return (
    <section className="relative py-20 md:py-28 bg-transparent text-white overflow-hidden">
      {/* 제목 */}
      <div className="text-center mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">지원절차</h2>
        <p className="text-gray-300 text-base md:text-lg">
          하반기 모집 - 6월~7월 중 │ 상반기 모집 - 12~1월 중
        </p>
      </div>

      {/* 타임라인 전체 */}
      <div className="max-w-6xl mx-auto px-4 relative">
        {/* 데스크톱 레이아웃 */}
        <div className="hidden md:block">
          <div className="absolute top-[calc(100%-10px)] left-0 right-0 h-[2px] bg-gray-600 z-0"></div>

          {/* STEP 박스들 */}
          <div className="relative flex justify-between items-start z-10">
            {steps.map((item, i) => (
              <div key={i} className="relative flex flex-col items-center w-1/4">
                {/* STEP 박스 */}
                <div className="bg-[#1b1b1b] border border-[#444] rounded-lg px-4 py-4 md:px-8 md:py-6 lg:px-10 lg:py-8 text-center shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                  <h3 className="text-lg md:text-xl lg:text-2xl font-extrabold mb-1 md:mb-2 text-white">
                    {item.step}
                  </h3>
                  <p className="text-xs md:text-sm lg:text-base text-gray-300">{item.title}</p>
                </div>

                <div className="relative mt-1 flex flex-col items-center">
                  <div className="w-[2px] h-5 bg-gray-500"></div>
                  <div className="w-4 h-4 rounded-full border-2 border-gray-400 bg-[#0d0d0d] mt-1"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 모바일 레이아웃 - 세로 타임라인 */}
        <div className="md:hidden space-y-6">
          {steps.map((item, i) => (
            <div key={i} className="relative flex items-start gap-4">
              {/* 세로 라인과 점 */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full border-2 border-[#ff6b35] bg-[#1b1b1b] flex items-center justify-center text-white font-bold text-xs">
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-[2px] h-16 bg-gray-600 mt-2"></div>
                )}
              </div>
              
              {/* STEP 박스 */}
              <div className="flex-1 bg-[#1b1b1b] border border-[#444] rounded-lg px-4 py-4 shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                <h3 className="text-base font-extrabold mb-1 text-white">
                  {item.step}
                </h3>
                <p className="text-sm text-gray-300">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}