import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'
export const revalidate = 0

// 특정 프로젝트 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id
    
    console.log("📌 [API Route] projectId:", projectId)
    
    const backendUrl = process.env.BACKEND_URL || "https://api.bitamin.ai.kr"
    const apiUrl = `${backendUrl}/api/project?projectId=${projectId}`
    
    console.log("📌 [API Route] Calling backend:", apiUrl)
    
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0MUBnbWFpbC5jb20iLCJyb2xlIjoiUk9MRV9BRE1JTiIsImlhdCI6MTc2MTEyMzI1MSwiZXhwIjoxNzYxNzI4MDUxfQ.ihX5DNgCXBh3Tnz8MZ7IpSgzwJGyj-YTFfxSogxNj9s",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
      },
      cache: 'no-store',
    })

    const result = await response.json()
    
    console.log("📌 [API Route] Backend response:", result)

    if (response.ok && result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
        message: "프로젝트 정보를 성공적으로 조회했습니다."
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.message || "Failed to fetch project",
        },
        { status: response.status },
      )
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
