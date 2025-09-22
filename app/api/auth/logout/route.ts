import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // 실제 환경에서는 토큰을 블랙리스트에 추가하거나 무효화
    // 현재는 클라이언트에서 토큰을 제거하는 것으로 충분

    return NextResponse.json({
      success: true,
      message: "로그아웃 되었습니다.",
    })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "로그아웃 중 오류가 발생했습니다.",
      },
      { status: 500 },
    )
  }
}
