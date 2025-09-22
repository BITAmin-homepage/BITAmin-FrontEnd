import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ success: false, message: "인증 토큰이 필요합니다." }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, week, type, dueDate, content, submissionLink } = body

    if (!title || !description || !type || !dueDate) {
      return NextResponse.json({ success: false, message: "필수 정보를 모두 입력해주세요." }, { status: 400 })
    }

    // 실제 환경에서는 데이터베이스에 저장
    const assignmentData = {
      id: Date.now().toString(),
      title,
      description,
      week: Number.parseInt(week) || 0,
      type,
      dueDate,
      content,
      submissionLink,
      author: "운영진",
      date: new Date().toISOString().split("T")[0],
      status: "active",
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      message: "과제 정보가 저장되었습니다.",
      data: assignmentData,
    })
  } catch (error) {
    console.error("Assignment creation error:", error)
    return NextResponse.json({ success: false, message: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // 실제 환경에서는 데이터베이스에서 조회
    const assignments = [
      {
        id: "1",
        title: "Python 기초 과제",
        description: "변수와 자료형 연습",
        week: 1,
        type: "preview",
        dueDate: "2024-03-15",
        author: "운영진",
        date: "2024-03-01",
        status: "active",
        files: [{ name: "assignment_1.ipynb", size: "1.2MB", type: "ipynb" }],
        submissionLink: "https://forms.google.com/example",
      },
    ]

    return NextResponse.json({
      success: true,
      data: assignments,
    })
  } catch (error) {
    console.error("Assignments fetch error:", error)
    return NextResponse.json({ success: false, message: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
