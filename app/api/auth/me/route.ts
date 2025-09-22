import { type NextRequest, NextResponse } from "next/server"

// 테스트용 임시 계정 (로그인 API와 동일)
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

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "인증 토큰이 없습니다.",
        },
        { status: 401 },
      )
    }

    const token = authHeader.substring(7) // "Bearer " 제거

    // 간단한 토큰 검증 (실제 환경에서는 JWT 검증)
    if (token.startsWith("token_")) {
      const userId = token.split("_")[1]
      const testAccount = TEST_ACCOUNTS.find((account) => account.id === userId)

      if (testAccount) {
        const { password: _, ...userWithoutPassword } = testAccount
        return NextResponse.json({
          success: true,
          data: userWithoutPassword,
        })
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "유효하지 않은 토큰입니다.",
      },
      { status: 401 },
    )
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "서버 오류가 발생했습니다.",
      },
      { status: 500 },
    )
  }
}
