import { type NextRequest, NextResponse } from "next/server"

// 테스트용 임시 계정
const TEST_ACCOUNTS = [
  {
    id: "1",
    username: "admin",
    password: "admin",
    name: "관리자",
    email: "admin@bitamin.com",
    role: "management",
    cohort: 1,
    status: "approved",
  },
  {
    id: "2",
    username: "member",
    password: "member",
    name: "테스트 멤버",
    email: "member@bitamin.com",
    role: "member",
    cohort: 3,
    status: "approved",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // 테스트 계정 확인
    const testAccount = TEST_ACCOUNTS.find((account) => account.username === username && account.password === password)

    if (testAccount) {
      // 간단한 토큰 생성 (실제 환경에서는 JWT 사용)
      const token = `token_${testAccount.id}_${Date.now()}`

      const { password: _, ...userWithoutPassword } = testAccount

      return NextResponse.json({
        success: true,
        token,
        user: userWithoutPassword,
        message: "로그인 성공",
      })
    }

    return NextResponse.json({
      success: false,
      message: "아이디 또는 비밀번호가 올바르지 않습니다.",
    })
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "서버 오류가 발생했습니다.",
      },
      { status: 500 },
    )
  }
}
