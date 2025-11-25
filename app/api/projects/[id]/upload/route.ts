import { type NextRequest, NextResponse } from "next/server"

// 프로젝트 파일 업로드 (썸네일, PPT)
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ success: false, error: "인증이 필요합니다." }, { status: 401 })
    }

    const { id } = params
    const formData = await request.formData()

    // 백엔드로 FormData 그대로 전달
    const response = await fetch(`${process.env.BACKEND_URL || "https://api.bitamin.ai.kr"}/api/project/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    const result = await response.text()   // S3 URL 문자열 반환

    if (response.ok) {
      return NextResponse.json({
        success: true,
        data: result,  // S3 URL 문자열
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result || "Failed to upload files",
        },
        { status: response.status },
      )
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
