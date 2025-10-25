import { type NextRequest, NextResponse } from "next/server"

// PPT 슬라이드 미리보기 API
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id
    console.log("Fetching PPT preview for project ID:", projectId)
    
    const backendUrl = process.env.BACKEND_URL || "https://api.bitamin.ai.kr"
    const apiUrl = `${backendUrl}/api/project/${projectId}/ppt/preview`
    console.log("Backend URL:", apiUrl)
    
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0MUBnbWFpbC5jb20iLCJyb2xlIjoiUk9MRV9BRE1JTiIsImlhdCI6MTc2MTEyMzI1MSwiZXhwIjoxNzYxNzI4MDUxfQ.ihX5DNgCXBh3Tnz8MZ7IpSgzwJGyj-YTFfxSogxNj9s",
      },
    })

    console.log("Backend response status:", response.status)
    const result = await response.json()
    console.log("Backend PPT preview response:", result)

    if (response.ok && result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
        message: "PPT 미리보기 정보를 성공적으로 조회했습니다."
      })
    } else {
      console.error("Backend error:", result)
      return NextResponse.json(
        {
          success: false,
          error: result.message || "Failed to fetch PPT preview",
        },
        { status: response.status },
      )
    }
  } catch (error) {
    console.error("PPT preview API error:", error)
    return NextResponse.json({ success: false, error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
