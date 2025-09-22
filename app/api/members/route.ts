import { type NextRequest, NextResponse } from "next/server"

// 승인된 멤버 목록 조회
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status") || "approved"

    const response = await fetch(`${process.env.BACKEND_URL}/api/members?status=${status}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })

    const result = await response.json()

    if (response.ok && result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.message || "Failed to fetch members",
        },
        { status: response.status },
      )
    }
  } catch (error) {
    console.error("Members API error:", error)
    return NextResponse.json({ success: false, error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

// 새 멤버 추가
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ success: false, error: "인증이 필요합니다." }, { status: 401 })
    }

    const memberData = await request.json()

    const response = await fetch(`${process.env.BACKEND_URL}/api/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(memberData),
    })

    const result = await response.json()

    if (response.ok && result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.message || "Failed to create member",
        },
        { status: response.status },
      )
    }
  } catch (error) {
    console.error("Create member API error:", error)
    return NextResponse.json({ success: false, error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
