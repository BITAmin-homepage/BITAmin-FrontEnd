import { type NextRequest, NextResponse } from "next/server"

// 프로젝트 정보 업로드 (새로운 API)
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ success: false, error: "인증이 필요합니다." }, { status: 401 })
    }

    const projectData = await request.json()

    // 백엔드의 새로운 API 엔드포인트로 전송
    const backendUrl = "https://api.bitamin.ai.kr"
    const response = await fetch(`${backendUrl}/api/project/uploadInfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(projectData),
    })

    const result = await response.json()

    if (response.ok) {
      return NextResponse.json({
        success: true,
        data: result,
        message: "프로젝트 정보가 성공적으로 저장되었습니다."
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.message || "Failed to upload project info",
        },
        { status: response.status },
      )
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
