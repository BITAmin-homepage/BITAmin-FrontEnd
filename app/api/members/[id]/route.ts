import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

// 멤버 단건 조회
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tokenHeader = request.headers.get("Authorization") || request.headers.get("authorization") || ""
    const backendBase = process.env.BACKEND_URL || "https://api.bitamin.ai.kr" || "http://52.78.66.115:8080"
    const { id } = params

    console.log(`🔄 Fetching member detail for ID: ${id}`)
    
    const timestamp = Date.now()
    const response = await fetch(`${backendBase}/api/members/${id}?_t=${timestamp}`, {
      method: "GET",
      headers: {
        Authorization: tokenHeader,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
      cache: 'no-store'
    })

    console.log("📡 Backend response status:", response.status)

    let data: any
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      data = await response.json()
      console.log("📦 Backend member data received:")
      console.log("  - success:", data.success)
      console.log("  - Member data:", data.data)
      if (data.data) {
        console.log("  - Has image field?:", 'image' in data.data)
        console.log("  - Image value:", data.data.image)
        console.log("  - ProfileImage value:", data.data.profileImage)
        
        // image 필드를 profileImage로 매핑
        if (data.data.image && !data.data.profileImage) {
          data.data.profileImage = data.data.image
          console.log("  ✅ Mapped image to profileImage:", data.data.profileImage)
        }
      }
    } else {
      const text = await response.text()
      data = { message: text }
      console.log("⚠️ Non-JSON response:", text)
    }

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  } catch (error) {
    console.error("Get member API error:", error)
    return NextResponse.json({ success: false, error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

// 멤버 정보 수정
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ success: false, error: "인증이 필요합니다." }, { status: 401 })
    }

    const { id } = params
    const memberData = await request.json()

    const response = await fetch(`${process.env.BACKEND_URL || "https://api.bitamin.ai.kr"}/api/members/${id}`, {
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

    const response = await fetch(`${process.env.BACKEND_URL || "https://api.bitamin.ai.kr"}/api/members/${id}`, {
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
