import { BookOpen, CheckCircle, TrendingUp } from "lucide-react";

export default function IntroductionSection() {
  return (
    <section className="bg-black text-white py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* 제목 */}
        <div className="text-center mb-16">
          <p className="text-gray-400 text-base mb-4 tracking-wide">BITAmin은</p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#d3431a] tracking-wide">
            함께 배우고 도전하며 성장해나갑니다
          </h2>
        </div>

        {/* 화살표와 카드 영역 */}
        <div className="relative max-w-5xl mx-auto">
          {/* 화살표 백그라운드 */}
          <div className="flex justify-center px-2 sm:px-4">
            <img src="/images/arrow.png" alt="화살표" className="w-full" />
          </div>

          {/* 아이콘 카드 3개 - absolute로 화살표 위에 배치 */}
          <div className="absolute inset-0 flex justify-between items-center px-2 sm:px-4 md:px-8 lg:px-16">
            
            {/* Learning */}
            <div className="flex flex-col items-center ml-0 sm:ml-4 md:ml-8 lg:ml-16">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white mb-1 sm:mb-2 md:mb-3" />
              <h3 className="text-[10px] sm:text-xs md:text-sm lg:text-lg font-bold tracking-wide whitespace-nowrap">Learning</h3>
              <p className="text-[8px] sm:text-[10px] md:text-xs lg:text-base text-gray-400 mb-0 sm:mb-1 tracking-wider whitespace-nowrap">활동 멤버</p>
              <p className="text-xs sm:text-sm md:text-base lg:text-xl font-bold tracking-wide">500+</p>
            </div>

            {/* Doing */}
            <div className="flex flex-col items-center">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white mb-1 sm:mb-2 md:mb-3" />
              <h3 className="text-[10px] sm:text-xs md:text-sm lg:text-lg font-bold tracking-wide whitespace-nowrap">Doing</h3>
              <p className="text-[8px] sm:text-[10px] md:text-xs lg:text-base text-gray-400 mb-0 sm:mb-1 tracking-wider whitespace-nowrap">진행 프로젝트 수</p>
              <p className="text-xs sm:text-sm md:text-base lg:text-xl font-bold tracking-wide">500+</p>
            </div>

            {/* Growing */}
            <div className="flex flex-col items-center mr-0 sm:mr-4 md:mr-8 lg:mr-16">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white mb-1 sm:mb-2 md:mb-3" />
              <h3 className="text-[10px] sm:text-xs md:text-sm lg:text-lg font-bold tracking-wide whitespace-nowrap">Growing</h3>
              <p className="text-[8px] sm:text-[10px] md:text-xs lg:text-base text-gray-400 mb-0 sm:mb-1 tracking-wider whitespace-nowrap">공모전 수상</p>
              <p className="text-xs sm:text-sm md:text-base lg:text-xl font-bold tracking-wide">50+</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}