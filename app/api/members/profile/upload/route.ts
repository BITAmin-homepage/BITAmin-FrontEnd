import { type NextRequest, NextResponse } from "next/server"

// 프로필 이미지 업로드
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ success: false, message: "인증이 필요합니다." }, { status: 401 })
    }

    const formData = await request.formData()
    
    // FormData 내용 로깅
    console.log("Profile upload FormData contents:")
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value)
    }

    // 백엔드로 FormData 그대로 전달
    const backendUrl = process.env.BACKEND_URL || "http://bitamin.ai.kr:8080"
    console.log("Backend URL:", `${backendUrl}/api/members/upload/profile`)
    
    const response = await fetch(`${backendUrl}/api/members/upload/profile`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    console.log("Backend response status:", response.status)
    console.log("Backend response headers:", Object.fromEntries(response.headers.entries()))
    
    // 백엔드 응답을 텍스트로 먼저 받기
    const responseText = await response.text()
    console.log("Backend response text:", responseText)
    
    let result
    try {
      // JSON으로 파싱 시도
      result = JSON.parse(responseText)
      console.log("Backend response JSON:", result)
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError)
      console.log("Response was not JSON, treating as plain text")
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
    console.error("Profile upload API error:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("Error details:", {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
      cause: error instanceof Error ? error.cause : undefined,
    })
    
    // 더 자세한 에러 정보 반환
    return NextResponse.json({ 
      success: false, 
      message: `알 수 없는 서버 에러 발생`,
      error: errorMessage,
      details: error instanceof Error ? error.stack : String(error)
    }, { status: 500 })
  }
}

