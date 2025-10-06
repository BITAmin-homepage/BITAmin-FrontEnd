"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Menu, X, User, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface HeaderProps {
  onOpenApplyModal?: () => void
}

export function Header({ onOpenApplyModal }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <>
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/bitamin-logo-white.png"
                  alt="비타민 로고"
                  width={150}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/about" className="text-gray-300 hover:text-[#d3431a] transition-colors">
                About
              </Link>
              <Link href="/members" className="text-gray-300 hover:text-[#d3431a] transition-colors">
                Members
              </Link>
              <Link href="/projects" className="text-gray-300 hover:text-[#d3431a] transition-colors">
                Project
              </Link>
              {!isAuthenticated && (
                <button
                  type="button"
                  onClick={() => onOpenApplyModal && onOpenApplyModal()}
                  className="text-gray-300 hover:text-[#d3431a] transition-colors"
                >
                  Recruiting
                </button>
              )}
              {isAuthenticated && (
                <>
                  <Link href="/sessions" className="text-gray-300 hover:text-[#d3431a] transition-colors">
                    세션 자료
                  </Link>
                  <Link href="/assignments" className="text-gray-300 hover:text-[#d3431a] transition-colors">
                    과제
                  </Link>
                </>
              )}
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-white hover:text-[#d3431a]">
                      <User className="h-4 w-4 mr-2" />
                      {user?.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-900 border-gray-700">
                    {user?.role === "management" && (
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="text-white hover:text-[#d3431a]">
                          대시보드
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/mypage" className="text-white hover:text-[#d3431a]">
                        마이페이지
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="text-white hover:text-[#d3431a]">
                      <LogOut className="h-4 w-4 mr-2" />
                      로그아웃
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href="/login" className="text-gray-300 hover:text-[#d3431a] transition-colors">
                    Login
                  </Link>
                  <Link href="/register" className="text-gray-300 hover:text-[#d3431a] transition-colors">
                    Signup
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link href="/about" className="block px-3 py-2 text-gray-300 hover:text-[#d3431a]">
                  동아리 소개
                </Link>
                <Link href="/members" className="block px-3 py-2 text-gray-300 hover:text-[#d3431a]">
                  멤버
                </Link>
                <Link href="/projects" className="block px-3 py-2 text-gray-300 hover:text-[#d3431a]">
                  프로젝트
                </Link>
                {!isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => onOpenApplyModal && onOpenApplyModal()}
                    className="block px-3 py-2 text-left text-gray-300 hover:text-[#d3431a] w-full"
                  >
                    지원하기
                  </button>
                )}
                {isAuthenticated && (
                  <>
                    <Link href="/sessions" className="block px-3 py-2 text-gray-300 hover:text-[#d3431a]">
                      세션 자료
                    </Link>
                    <Link href="/assignments" className="block px-3 py-2 text-gray-300 hover:text-[#d3431a]">
                      과제
                    </Link>
                  </>
                )}
                <div className="flex flex-col space-y-2 px-3 py-2">
                  {isAuthenticated ? (
                    <>
                      {user?.role === "management" && (
                        <Link href="/dashboard">
                          <Button variant="ghost" className="w-full text-white hover:text-[#d3431a] justify-start">
                            대시보드
                          </Button>
                        </Link>
                      )}
                      <Link href="/mypage">
                        <Button variant="ghost" className="w-full text-white hover:text-[#d3431a] justify-start">
                          마이페이지
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        onClick={logout}
                        className="w-full text-white hover:text-[#d3431a] justify-start"
                      >
                        로그아웃
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="block px-3 py-2 text-gray-300 hover:text-[#d3431a]">
                        로그인
                      </Link>
                      <Link href="/register" className="block px-3 py-2 text-gray-300 hover:text-[#d3431a]">
                        회원가입
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

    </>
  )
}
