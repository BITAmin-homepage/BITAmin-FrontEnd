import { type NextRequest, NextResponse } from "next/server"

// 프로젝트 삭제 (관리자만)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id
    
    // Authorization 헤더에서 토큰 추출
    const authHeader = request.headers.get("Authorization") || request.headers.get("authorization")
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: "인증 토큰이 필요합니다." },
        { status: 401 }
      )
    }
    
    // 요청 본문에서 key 파라미터 추출
    const body = await request.json()
    const { key } = body
    
    if (!key) {
      return NextResponse.json(
        { success: false, error: "S3 key가 필요합니다." },
        { status: 400 }
      )
    }
    
    const backendUrl = process.env.BACKEND_URL || "https://api.bitamin.ai.kr"
    // 백엔드 API 형식: DELETE /{projectId}?key={key}
    const apiUrl = `${backendUrl}/api/project/${projectId}?key=${encodeURIComponent(key)}`
    
    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json",
      },
    })
    
    if (response.ok) {
      const result = await response.text()
      
      return NextResponse.json({
        success: true,
        message: result || "프로젝트가 성공적으로 삭제되었습니다."
      })
    } else {
      const errorText = await response.text()
      
      return NextResponse.json(
        {
          success: false,
          error: errorText || "프로젝트 삭제에 실패했습니다.",
        },
        { status: response.status },
      )
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
