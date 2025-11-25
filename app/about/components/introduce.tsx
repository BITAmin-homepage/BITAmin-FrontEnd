import { BookOpen, CheckCircle, TrendingUp } from "lucide-react";

export default function IntroductionSection() {
  return (
    <section className="bg-black text-white py-28">
      <div className="max-w-6xl mx-auto px-4">
        {/* 제목 */}
        <div className="text-center mb-12">
          <p className="text-gray-400 text-base md:text-lg mb-4 tracking-wide">BITAmin은</p>
          <h2 className="text-2xl md:text-4xl font-bold text-[#ff6b35] tracking-wide">
            함께 배우고 도전하며<br className="md:hidden" /> 성장해나갑니다
          </h2>
        </div>

        {/* 소개 텍스트 */}
        <div className="max-w-4xl mx-auto mb-20 px-4">
          <div className="text-center space-y-3 leading-relaxed">
            <p className="text-lg md:text-xl text-white/90 font-medium">
              데이터로 세상을 읽고,<br className="md:hidden" /> AI로 내일을 상상합니다.
            </p>
            
            <p className="text-sm md:text-base text-white/70 leading-loose">
              BITAmin은 빅데이터와 인공지능이 만들어낸<br className="md:hidden" /> 변화의 흐름 속에서 미래를 능동적으로 만들어가기 위해<br className="md:hidden" /> 모인 연합 학술동아리입니다.
            </p>
            
            <p className="text-sm md:text-base text-white/70 leading-loose">
              우리는 데이터를 이해하는 능력과 AI를 설계하는 창의성을 확장하여 스스로 문제를 발견하고<br className="md:hidden" /> 답을 만들어가는 여정을 이어갑니다.
            </p>
            
            <p className="text-lg md:text-xl text-white/90 font-medium !mt-12">
              BITAmin은 혼자가 아닌 '함께하는 성장'을<br className="md:hidden" /> 믿습니다.
            </p>
            
            <p className="text-sm md:text-base text-white/70 leading-loose">
              서로 다른 전공과 시각을 가진 학생들이 모여 의견을 나누고 아이디어를 확장하며 작은 배움이 큰 변화로 이어지는<br className="md:hidden" /> 경험을 만들어갑니다.
            </p>
            
            <p className="text-base md:text-lg text-white/70 font-medium mt-8">
              작은 시작이 큰 가능성으로 자라날 그 길 위에<br className="md:hidden" /> 여러분의 흔적이 더해지길 기대합니다.
            </p>
          </div>
        </div>

        {/* 화살표와 카드 영역 */}
        <div className="relative max-w-5xl mx-auto">
          {/* 화살표 백그라운드 */}
          <div className="flex justify-center px-2 sm:px-4">
            <img src="/images/arrow_v2.png" alt="화살표" className="w-full" />
          </div>

          {/* 아이콘 카드 3개 - absolute로 화살표 위에 배치 */}
          <div className="absolute inset-0 flex justify-between items-center px-20 sm:px-24 md:px-28 lg:px-32">
            
            {/* Learning */}
            <div className="flex flex-col items-center">
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white mb-1 sm:mb-2 md:mb-3" />
              <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold tracking-wide whitespace-nowrap">Learning</h3>
              <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-400 mb-0 sm:mb-1 tracking-wider whitespace-nowrap">활동 멤버</p>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-wide">500+</p>
            </div>

            {/* Doing */}
            <div className="flex flex-col items-center">
              <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white mb-1 sm:mb-2 md:mb-3" />
              <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold tracking-wide whitespace-nowrap">Doing</h3>
              <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-400 mb-0 sm:mb-1 tracking-wider whitespace-nowrap">진행 프로젝트 수</p>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-wide">500+</p>
            </div>

            {/* Growing */}
            <div className="flex flex-col items-center">
              <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white mb-1 sm:mb-2 md:mb-3" />
              <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold tracking-wide whitespace-nowrap">Growing</h3>
              <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-400 mb-0 sm:mb-1 tracking-wider whitespace-nowrap">공모전 수상</p>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold tracking-wide">50+</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}