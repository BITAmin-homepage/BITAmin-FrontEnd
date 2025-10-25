"use client"

import type React from "react"
import { useState, useEffect, createContext, useContext } from "react"
import { API_ENDPOINTS } from "./api"

interface User {
  id: string
  memberId?: number
  name: string
  email: string
  phone?: string
  school?: string
  gender?: string
  birthDate?: string
  role: "ROLE_MEMBER" | "ROLE_ADMIN" | "MEMBER" | "ADMIN"
  cohort: number
  status?: "PENDING" | "APPROVED" | "REJECTED"
  link1?: string
  link2?: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 페이지 로드 시 토큰 확인
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      const userData = localStorage.getItem("user_data")
      
      
      if (!token || !userData) {
        setLoading(false)
        return
      }

      // 토큰이 있으면 사용자 정보를 복원
      try {
        const user = JSON.parse(userData)
        console.log("Restored user from localStorage:", user)
        console.log("Restored user role:", user.role)
        setUser(user)
      } catch (error) {
        console.error("Failed to parse user data:", error)
        localStorage.removeItem("auth_token")
        localStorage.removeItem("user_data")
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user_data")
    } finally {
      setLoading(false)
    }
  }

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      console.log("로그인 응답 상태:", response.status)

      if (response.ok) {
        const result = await response.json()
        
        // BE API 응답 형식에 맞게 처리
        if (result.success && result.data) {
          const userData = result.data
          console.log("BE 응답 userData:", userData)
          
          // 다양한 가능한 필드명 확인
          const token = userData.accessToken || userData.access_token || userData.token || userData.jwt
          
          const userToStore = {
            id: userData.id,
            memberId: userData.memberId || userData.id, // memberId가 없으면 id 사용
            name: userData.name,
            email: userData.email,
            phone: userData.phone || "010-1234-5678",
            school: userData.school || "00대학교",
            gender: userData.gender || "female",
            birthDate: userData.birthDate || "2025-10-01",
            role: userData.role,
            cohort: userData.cohort,
            status: userData.status,
            link1: userData.link1 || "",
            link2: userData.link2 || ""
          }
          
          console.log("저장할 userToStore:", userToStore)
          
          localStorage.setItem("auth_token", token)
          localStorage.setItem("user_data", JSON.stringify(userToStore))
          setUser(userToStore)
          return true
        } else {
          alert(result.message || "로그인에 실패했습니다.")
          return false
        }
      } else {
        // 에러 응답 처리
        let errorMessage = "로그인에 실패했습니다."
        try {
          const result = await response.json()
          errorMessage = result.message || errorMessage
        } catch (e) {
          // JSON 파싱 실패 시 상태 코드별 기본 메시지
          if (response.status === 403) {
            errorMessage = "아직 승인되지 않은 유저입니다. 운영진의 승인을 기다려주세요."
          } else if (response.status === 404) {
            errorMessage = "사용자를 찾을 수 없습니다."
          } else if (response.status === 500) {
            errorMessage = "아직 승인대기 중인 유저입니다."
          }
        }
        alert(errorMessage)
        return false
      }
    } catch (error) {
      console.error("Login failed:", error)
      alert("로그인 중 오류가 발생했습니다.")
      return false
    }
  }

  const logout = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      if (token) {
        await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user_data")
      setUser(null)
      
      // 메인 페이지로 리다이렉트
      window.location.href = "/"
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// 역할 체크 헬퍼 함수
export function isAdmin(role: string | undefined): boolean {
  if (!role) {
    console.log(`isAdmin check - role: undefined/null, result: false`)
    return false
  }
  
  const normalizedRole = role.toUpperCase()
  const result = normalizedRole === "ROLE_ADMIN" || normalizedRole === "ADMIN"
  console.log(`isAdmin check - original role: "${role}", normalized: "${normalizedRole}", result: ${result}`)
  return result
}

export function isMember(role: string | undefined): boolean {
  return role === "ROLE_MEMBER" || role === "MEMBER"
}
