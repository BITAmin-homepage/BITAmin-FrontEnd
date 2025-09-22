import { NextResponse } from "next/server"

// 승인 대기 멤버 목록 조회
export async function GET() {
  try {
    // 실제로는 데이터베이스에서 status가 'pending'인 멤버들을 조회
    const pendingMembers = [] // 데이터베이스 쿼리 결과

    return NextResponse.json({
      success: true,
      data: pendingMembers,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch pending members" }, { status: 500 })
  }
}
