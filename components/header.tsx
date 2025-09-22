"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Menu, X, User, LogOut, UserPlus } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ApplyModal } from "./apply-modal"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <>
      <header className="bg-gradient-to-r from-black to-[#d3431a] border-b border-orange-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/images/bitamin-logo-main.png"
                  alt="비타민 로고"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/about" className="text-gray-300 hover:text-[#d3431a] transition-colors">
                동아리 소개
              </Link>
              <Link href="/members" className="text-gray-300 hover:text-[#d3431a] transition-colors">
                멤버
              </Link>
              <div className="flex items-center space-x-4">
                <Link href="/projects" className="text-gray-300 hover:text-[#d3431a] transition-colors">
                  프로젝트
                </Link>
                {!isAuthenticated && (
                  <Button
                    onClick={() => setIsApplyModalOpen(true)}
                    className="bg-gradient-to-r from-[#d3431a] to-[#ff6b35] hover:from-[#b8371a] hover:to-[#e55a2b] text-white text-sm px-3 py-1 h-8"
                  >
                    <UserPlus className="h-3 w-3 mr-1" />
                    지원하기
                  </Button>
                )}
              </div>
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
                  <Link href="/login">
                    <Button className="bg-white text-[#d3431a] hover:bg-gray-100 border border-[#d3431a]">
                      로그인
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-[#d3431a] hover:bg-[#b8371a] text-white">회원가입</Button>
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
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black border-t border-gray-800">
                <Link href="/about" className="block px-3 py-2 text-gray-300 hover:text-[#d3431a]">
                  동아리 소개
                </Link>
                <Link href="/members" className="block px-3 py-2 text-gray-300 hover:text-[#d3431a]">
                  멤버
                </Link>
                <div className="flex items-center justify-between px-3 py-2">
                  <Link href="/projects" className="text-gray-300 hover:text-[#d3431a]">
                    프로젝트
                  </Link>
                  {!isAuthenticated && (
                    <Button
                      onClick={() => setIsApplyModalOpen(true)}
                      className="bg-gradient-to-r from-[#d3431a] to-[#ff6b35] hover:from-[#b8371a] hover:to-[#e55a2b] text-white text-sm px-3 py-1 h-8 ml-2"
                    >
                      <UserPlus className="h-3 w-3 mr-1" />
                      지원하기
                    </Button>
                  )}
                </div>
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
                      <Link href="/login">
                        <Button
                          variant="outline"
                          className="w-full border-[#d3431a] text-[#d3431a] hover:bg-[#d3431a] hover:text-white bg-transparent"
                        >
                          로그인
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button className="w-full bg-[#d3431a] hover:bg-[#b8371a] text-white">회원가입</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Apply Modal */}
      <ApplyModal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} />
    </>
  )
}
