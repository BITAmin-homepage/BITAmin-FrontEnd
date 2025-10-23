import { type NextRequest, NextResponse } from "next/server"

// 모든 프로젝트 조회
export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.BACKEND_URL || "http://bitamin.ai.kr:8080"
    const response = await fetch(`${backendUrl}/api/project/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0MUBnbWFpbC5jb20iLCJyb2xlIjoiUk9MRV9BRE1JTiIsImlhdCI6MTc2MTEyMzI1MSwiZXhwIjoxNzYxNzI4MDUxfQ.ihX5DNgCXBh3Tnz8MZ7IpSgzwJGyj-YTFfxSogxNj9s",
      },
    })

    const result = await response.json()
    console.log("Backend projects response:", result)

    if (response.ok && result.success) {
      // 백엔드 응답에 projectId가 없으면 임시로 추가
      const projectsWithId = result.data.map((project: any, index: number) => ({
        ...project,
        projectId: project.projectId || (15 + index) // 임시로 15, 16으로 설정
      }))
      
      return NextResponse.json({
        success: true,
        data: projectsWithId,
        message: "프로젝트 목록을 성공적으로 조회했습니다."
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.message || "Failed to fetch projects",
        },
        { status: response.status },
      )
    }
  } catch (error) {
    console.error("Projects API error:", error)
    return NextResponse.json({ success: false, error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
