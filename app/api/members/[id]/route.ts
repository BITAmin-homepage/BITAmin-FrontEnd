import { type NextRequest, NextResponse } from "next/server"

// 멤버 정보 수정
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ success: false, error: "인증이 필요합니다." }, { status: 401 })
    }

    const { id } = params
    const memberData = await request.json()

    const response = await fetch(`${process.env.BACKEND_URL}/api/members/${id}`, {
      method: "PUT",
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
          error: result.message || "Failed to update member",
        },
        { status: response.status },
      )
    }
  } catch (error) {
    console.error("Update member API error:", error)
    return NextResponse.json({ success: false, error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

// 멤버 삭제
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ success: false, error: "인증이 필요합니다." }, { status: 401 })
    }

    const { id } = params

    const response = await fetch(`${process.env.BACKEND_URL}/api/members/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const result = await response.json()

    if (response.ok && result.success) {
      return NextResponse.json({
        success: true,
        message: "Member deleted successfully",
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.message || "Failed to delete member",
        },
        { status: response.status },
      )
    }
  } catch (error) {
    console.error("Delete member API error:", error)
    return NextResponse.json({ success: false, error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
