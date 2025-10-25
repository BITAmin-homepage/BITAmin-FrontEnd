import { type NextRequest, NextResponse } from "next/server"

// 프로젝트 정보 업로드 (백엔드 API 경로에 맞게 수정)
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ success: false, error: "인증이 필요합니다." }, { status: 401 })
    }

    let projectData
    try {
      projectData = await request.json()
      console.log("Project data to send:", projectData)
    } catch (jsonError) {
      console.error("Request JSON parsing error:", jsonError)
      const errorMessage = jsonError instanceof Error ? jsonError.message : String(jsonError)
      return NextResponse.json({ 
        success: false, 
        error: `요청 데이터를 파싱할 수 없습니다: ${errorMessage}` 
      }, { status: 400 })
    }
    
    // 필수 필드 검증
    if (!projectData.title || !projectData.description) {
      return NextResponse.json({ 
        success: false, 
        error: "필수 필드(title, description)가 누락되었습니다." 
      }, { status: 400 })
    }
    
    // 데이터 정규화 (projectId 제외)
    const normalizedData = {
      title: String(projectData.title).trim(),
      category: String(projectData.category || "").trim(),
      description: String(projectData.description).trim(),
      cohort: Array.isArray(projectData.cohort) ? projectData.cohort : [],
      startDate: String(projectData.startDate || "").trim(),
      endDate: String(projectData.endDate || "").trim(),
      award: projectData.award === "GRAND_PRIZE" ? "GRAND_PRIZE" : 
             projectData.award === "EXCELLENCE_AWARD" ? "GOLD_PRIZE" : 
             projectData.award === "MERIT_AWARD" ? "MERIT_AWARD" : 
             projectData.award === "EXCELLENCE_PRIZE" ? "GOLD_PRIZE" : 
             projectData.award === "MERIT_PRIZE" ? "MERIT_AWARD" : "GRAND_PRIZE",
      member: String(projectData.member || "").trim(),
      period: String(projectData.period || "").trim()
    }
    
    // projectId가 포함되어 있으면 제거
    if ('projectId' in normalizedData) {
      delete normalizedData.projectId
    }
    
    console.log("Normalized data:", normalizedData)

    // 백엔드의 올바른 API 엔드포인트로 전송
    const backendUrl = process.env.BACKEND_URL || "https://api.bitamin.ai.kr"
    console.log("Backend URL:", backendUrl)
    console.log("Full URL:", `${backendUrl}/api/project/uploadInfo`)
    
    const response = await fetch(`${backendUrl}/api/project/uploadInfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(normalizedData),
    }).catch(fetchError => {
      console.error("Fetch error:", fetchError)
      throw new Error(`백엔드 서버에 연결할 수 없습니다: ${fetchError.message}`)
    })
    
    console.log("Backend response status:", response.status)
    console.log("Backend response headers:", Object.fromEntries(response.headers.entries()))

    let result
    try {
      result = await response.json()
      console.log("Backend response:", result)
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError)
      const errorMessage = jsonError instanceof Error ? jsonError.message : String(jsonError)
      throw new Error(`백엔드 응답을 파싱할 수 없습니다: ${errorMessage}`)
    }
    
    console.log("Response status:", response.status)
    console.log("Response ok:", response.ok)

    if (response.ok) {
      // 백엔드 응답에서 projectId 추출
      let projectId = null
      if (result.data && result.data.projectId) {
        projectId = result.data.projectId
      } else if (result.projectId) {
        projectId = result.projectId
      } else if (result.id) {
        projectId = result.id
      }
      
      console.log("Extracted projectId from backend:", projectId)
      console.log("Backend result.data:", result.data)
      
      // projectId가 없으면 에러
      if (!projectId) {
        console.error("No projectId from backend:", result)
        return NextResponse.json({
          success: false,
          error: "백엔드에서 프로젝트 ID를 반환하지 않았습니다."
        }, { status: 500 })
      }
      
      return NextResponse.json({
        success: true,
        data: {
          projectId: projectId,
          ...result.data
        },
        message: "프로젝트 정보가 성공적으로 저장되었습니다."
      })
    } else {
      console.error("Backend error:", result)
      console.error("Backend error details:", {
        status: response.status,
        message: result.message,
        error: result.error,
        data: result.data
      })
      
      // 백엔드에서 500 에러가 발생하면 에러 반환
      if (response.status === 500) {
        console.error("Backend 500 error - server issue")
        return NextResponse.json({
          success: false,
          error: "백엔드 서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        }, { status: 500 })
      }
      
      return NextResponse.json(
        {
          success: false,
          error: result.message || result.error || "Failed to upload project info",
        },
        { status: response.status },
      )
    }
  } catch (error) {
    console.error("Upload project info API error:", error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    const errorName = error instanceof Error ? error.name : undefined
    
    console.error("Error details:", {
      message: errorMessage,
      stack: errorStack,
      name: errorName
    })
    
    return NextResponse.json({ 
      success: false, 
      error: `서버 오류가 발생했습니다: ${errorMessage}` 
    }, { status: 500 })
  }
}
