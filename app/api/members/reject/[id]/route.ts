import { type NextRequest, NextResponse } from "next/server"

// 멤버 거부
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ success: false, error: "인증이 필요합니다." }, { status: 401 })
    }

    const { id } = params

    const response = await fetch(`${process.env.BACKEND_URL}/api/members/${id}/reject`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const result = await response.json()

    if (response.ok && result.success) {
      return NextResponse.json({
        success: true,
        message: "Member rejected successfully",
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.message || "Failed to reject member",
        },
        { status: response.status },
      )
    }
  } catch (error) {
    console.error("Reject member API error:", error)
    return NextResponse.json({ success: false, error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
