import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Image src="/images/logo_2.png" alt="비타민 로고" width={40} height={40} className="h-10 w-10" />
              <span className="text-white font-bold text-xl">비타민</span>
            </div>
            <p className="text-gray-400 mb-4">
              대학생 연합 빅데이터 동아리 비타민입니다.
              <br />
              함께 성장하고 배우며 미래를 만들어가요.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">메뉴</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-[#d3431a] transition-colors">
                  동아리 소개
                </Link>
              </li>
              <li>
                <Link href="/members" className="text-gray-400 hover:text-[#d3431a] transition-colors">
                  멤버
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-gray-400 hover:text-[#d3431a] transition-colors">
                  프로젝트
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">계정</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-gray-400 hover:text-[#d3431a] transition-colors">
                  로그인
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-400 hover:text-[#d3431a] transition-colors">
                  회원가입
                </Link>
              </li>
              <li>
                <Link href="/mypage" className="text-gray-400 hover:text-[#d3431a] transition-colors">
                  마이페이지
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">© 2025 비타민(Bitamin). All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
