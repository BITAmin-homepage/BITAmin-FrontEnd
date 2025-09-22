import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ success: false, message: "인증 토큰이 필요합니다." }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (files.length === 0) {
      return NextResponse.json({ success: false, message: "파일이 필요합니다." }, { status: 400 })
    }

    // 실제 환경에서는 파일을 서버에 저장하고 데이터베이스에 정보 업데이트
    const uploadedFiles = files.map((file) => ({
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      type: file.name.split(".").pop() || "file",
    }))

    return NextResponse.json({
      success: true,
      message: "파일이 성공적으로 업로드되었습니다.",
      data: { files: uploadedFiles },
    })
  } catch (error) {
    console.error("File upload error:", error)
    return NextResponse.json({ success: false, message: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
