"use client"

import type React from "react"
import { useState, useEffect, createContext, useContext } from "react"
import { API_ENDPOINTS } from "./api"

interface User {
  id: string
  name: string
  email: string
  role: "MEMBER" | "ADMIN"
  cohort: number
  status?: "PENDING" | "APPROVED" | "REJECTED"
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
        console.log("로그인 성공 응답:", result)
        
        // BE API 응답 형식에 맞게 처리
        if (result.success && result.data) {
          const userData = result.data
          localStorage.setItem("auth_token", userData.accessToken)
          localStorage.setItem("user_data", JSON.stringify({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            cohort: userData.cohort,
            status: userData.status
          }))
          setUser({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            cohort: userData.cohort,
            status: userData.status
          })
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
