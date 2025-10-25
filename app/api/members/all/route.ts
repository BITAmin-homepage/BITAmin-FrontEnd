import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log("🔄 Fetching members from backend...")
    const timestamp = Date.now()
    const response = await fetch(`https://api.bitamin.ai.kr/api/members/all?_t=${timestamp}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
      cache: 'no-store'
    })

    console.log("📡 Backend response status:", response.status)

    let data
    const contentType = response.headers.get("content-type")
    
    if (contentType && contentType.includes("application/json")) {
      data = await response.json()
      console.log("📦 Backend data received:")
      console.log("  - success:", data.success)
      console.log("  - message:", data.message)
      console.log("  - data length:", data.data?.length)
      if (data.data && data.data.length > 0) {
        console.log("  - First member (RAW):", JSON.stringify(data.data[0], null, 2))
        console.log("  - First member keys:", Object.keys(data.data[0]))
        console.log("  - Has image field?:", 'image' in data.data[0])
        console.log("  - Image value:", data.data[0].image)
      }
    } else {
      const text = await response.text()
      data = { message: text }
      console.log("⚠️ Non-JSON response:", text)
    }

    return NextResponse.json(data, { 
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })
  } catch (error) {
    console.error('Members fetch error:', error)
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
