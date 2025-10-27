import { type NextRequest, NextResponse } from "next/server"

// 프로젝트 파일 업로드 (썸네일, PPT)
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ success: false, error: "인증이 필요합니다." }, { status: 401 })
    }

    const formData = await request.formData()

    // 백엔드로 FormData 그대로 전달
    const backendUrl = process.env.BACKEND_URL || "https://api.bitamin.ai.kr"
    
    const response = await fetch(`${backendUrl}/api/project/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    
    // 백엔드에서 S3 URL을 텍스트로 반환하므로 텍스트로 처리
    const responseText = await response.text()
    
    let result
    try {
      // JSON으로 파싱 시도
      result = JSON.parse(responseText)
    } catch (jsonError) {
      // JSON이 아닌 경우 S3 URL로 처리
      result = {
        success: true,
        url: responseText,
        message: "File uploaded successfully"
      }
    }

    if (response.ok) {
      return NextResponse.json({
        success: true,
        data: result,
        url: result.url || result, // S3 URL 포함
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.message || "Failed to upload files",
        },
        { status: response.status },
      )
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: "서버 오류가 발생했습니다" 
    }, { status: 500 })
  }
}
