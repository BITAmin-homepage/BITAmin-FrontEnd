import { type NextRequest, NextResponse } from "next/server"

// 프로젝트 목록 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = searchParams.get("page") || "1"
    const limit = searchParams.get("limit") || "10"
    const search = searchParams.get("search") || ""
    const cohort = searchParams.get("cohort") || ""
    const period = searchParams.get("period") || ""
    const award = searchParams.get("award") || ""

    const queryParams = new URLSearchParams({
      page,
      limit,
      search,
      cohort,
      period,
      award,
    })

    const backendUrl = process.env.BACKEND_URL || "https://api.bitamin.ai.kr"
    const response = await fetch(`${backendUrl}/api/project?${queryParams}`)
    const result = await response.json()

    if (response.ok && result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
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

// 프로젝트 기본 정보 생성
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ success: false, error: "인증이 필요합니다." }, { status: 401 })
    }

    const projectData = await request.json()

    const backendUrl = process.env.BACKEND_URL || "https://api.bitamin.ai.kr"
    const response = await fetch(`${backendUrl}/api/project`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(projectData),
    })

    const result = await response.json()
    console.log("Backend project creation response:", result)
    console.log("Response status:", response.status)

    if (response.ok && result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.message || "Failed to create project",
        },
        { status: response.status },
      )
    }
  } catch (error) {
    console.error("Create project API error:", error)
    return NextResponse.json({ success: false, error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
