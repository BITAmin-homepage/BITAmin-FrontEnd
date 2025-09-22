import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ success: false, message: "인증 토큰이 필요합니다." }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, week, content } = body

    if (!title || !description) {
      return NextResponse.json({ success: false, message: "제목과 설명은 필수입니다." }, { status: 400 })
    }

    // 실제 환경에서는 데이터베이스에 저장
    const sessionData = {
      id: Date.now().toString(),
      title,
      description,
      week: Number.parseInt(week) || 0,
      content,
      author: "운영진",
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      message: "세션 정보가 저장되었습니다.",
      data: sessionData,
    })
  } catch (error) {
    console.error("Session creation error:", error)
    return NextResponse.json({ success: false, message: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // 실제 환경에서는 데이터베이스에서 조회
    const sessions = [
      {
        id: "1",
        title: "Python 기초",
        description: "파이썬 기본 문법 학습",
        week: 1,
        author: "운영진",
        date: "2024-03-01",
        files: [{ name: "python_basics.pdf", size: "2.5MB", type: "pdf" }],
        views: 45,
      },
    ]

    return NextResponse.json({
      success: true,
      data: sessions,
    })
  } catch (error) {
    console.error("Sessions fetch error:", error)
    return NextResponse.json({ success: false, message: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
