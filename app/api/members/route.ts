import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    const token = request.headers.get('authorization')
    
    const timestamp = Date.now()
    let url = `http://52.78.66.115:8080/api/members?_t=${timestamp}`
    if (status) {
      url += `&status=${status}`
    }
    
    console.log(`🔄 Fetching members with status: ${status || 'all'}`)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': token || '',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
      cache: 'no-store',
      next: { revalidate: 0 }
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