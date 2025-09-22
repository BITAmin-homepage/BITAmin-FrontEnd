import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

    // 실제 환경에서는 백엔드 API 호출
    // 현재는 테스트용으로 성공 응답만 반환

    return NextResponse.json({
      success: true,
      message: "회원가입이 완료되었습니다. 운영진의 승인을 기다려주세요.",
    })
  } catch (error) {
    console.error("Register API error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "회원가입 중 오류가 발생했습니다.",
      },
      { status: 500 },
    )
  }
}
