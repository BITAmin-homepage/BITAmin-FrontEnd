import { type NextRequest, NextResponse } from "next/server"

// 프로젝트 파일 업로드 (썸네일, PPT)
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ success: false, error: "인증이 필요합니다." }, { status: 401 })
    }

    const formData = await request.formData()
    
    // FormData 내용 로깅
    console.log("FormData contents:")
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value)
    }

    // 백엔드로 FormData 그대로 전달
    const backendUrl = process.env.BACKEND_URL || "http://bitamin.ai.kr:8080"
    console.log("Backend URL:", backendUrl)
    
    const response = await fetch(`${backendUrl}/api/project/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    console.log("Backend response status:", response.status)
    console.log("Backend response headers:", Object.fromEntries(response.headers.entries()))
    
    // 백엔드에서 S3 URL을 텍스트로 반환하므로 텍스트로 처리
    const responseText = await response.text()
    console.log("Backend response text:", responseText)
    
    let result
    try {
      // JSON으로 파싱 시도
      result = JSON.parse(responseText)
      console.log("Backend response JSON:", result)
    } catch (jsonError) {
      // JSON이 아닌 경우 S3 URL로 처리
      console.log("Backend returned S3 URL (not JSON):", responseText)
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
    console.error("Upload files API error:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("Error details:", {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    return NextResponse.json({ 
      success: false, 
      error: `서버 오류가 발생했습니다: ${errorMessage}` 
    }, { status: 500 })
  }
}
