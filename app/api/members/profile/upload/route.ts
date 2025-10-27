import { type NextRequest, NextResponse } from "next/server"

// 프로필 이미지 업로드
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ success: false, message: "인증이 필요합니다." }, { status: 401 })
    }

    const formData = await request.formData()

    // 백엔드로 FormData 그대로 전달
    const backendUrl = process.env.BACKEND_URL || "https://api.bitamin.ai.kr"
    
    const response = await fetch(`${backendUrl}/api/members/upload/profile`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    
    // 백엔드 응답을 텍스트로 먼저 받기
    const responseText = await response.text()
    
    let result
    try {
      // JSON으로 파싱 시도
      result = JSON.parse(responseText)
    } catch (jsonError) {
      // JSON이 아닌 경우 (S3 URL 직접 반환)
      if (response.ok) {
        return NextResponse.json({
          success: true,
          data: responseText, // S3 URL
          message: "프로필 이미지가 성공적으로 업로드되었습니다.",
        })
      } else {
        return NextResponse.json(
          {
            success: false,
            message: responseText || "프로필 이미지 업로드에 실패했습니다.",
          },
          { status: response.status },
        )
      }
    }

    if (response.ok && result.success) {
      return NextResponse.json({
        success: true,
        data: result.data, // S3 URL
        message: result.message || "프로필 이미지가 성공적으로 업로드되었습니다.",
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "프로필 이미지 업로드에 실패했습니다.",
        },
        { status: response.status },
      )
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: "알 수 없는 서버 에러 발생"
    }, { status: 500 })
  }
}

