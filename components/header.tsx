"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ApplyModal } from "@/components/apply-modal"
import { Menu, X, User, LogOut } from "lucide-react"
import { useAuth, isAdmin } from "@/lib/auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface HeaderProps {
  onOpenApplyModal?: () => void
}

export function Header({ onOpenApplyModal }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/10">
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
                  onClick={() => (onOpenApplyModal ? onOpenApplyModal() : setIsApplyModalOpen(true))}
                  className="text-gray-300 hover:text-[#d3431a] transition-colors"
                >
                  Recruiting
                </button>
              )}
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-white hover:text-[#d3431a] hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent"
                    >
                      <User className="h-4 w-4 mr-2" />
                      {user?.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#141414] border border-white/10 shadow-lg rounded-lg p-1 w-auto min-w-32 mt-1 flex flex-col space-y-0" align="start">
                    {user && isAdmin(user.role) && (
                      <DropdownMenuItem
                        asChild
                        className="p-0 m-0 rounded-md focus:bg-gray-800 hover:bg-gray-800 focus:text-[#ff6b35] data-[highlighted]:text-[#ff6b35]"
                      >
                        <Link 
                          href="/dashboard" 
                          className="text-gray-300 hover:text-[#ff6b35] transition-colors px-2 py-1 block"
                        >
                          대시보드
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      asChild
                      className="p-0 m-0 rounded-md focus:bg-gray-800 hover:bg-gray-800 focus:text-[#ff6b35] data-[highlighted]:text-[#ff6b35]"
                    >
                      <Link 
                        href="/mypage" 
                        className="text-gray-300 hover:text-[#ff6b35] transition-colors px-2 py-1 block"
                      >
                        마이페이지
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      asChild
                      className="p-0 m-0 rounded-md focus:bg-gray-800 hover:bg-gray-800 focus:text-[#ff6b35] data-[highlighted]:text-[#ff6b35]"
                    >
                      <button type="button" onClick={logout} className="w-full text-left text-gray-300 hover:text-[#ff6b35] transition-colors px-2 py-1 block">
                        <LogOut className="h-4 w-4 mr-2 inline-block" />
                        로그아웃
                      </button>
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
              <div className="px-2 pt-2 pb-3 space-y-0.5 sm:px-3">
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
                    onClick={() => (onOpenApplyModal ? onOpenApplyModal() : setIsApplyModalOpen(true))}
                    className="block px-3 py-2 text-left text-gray-300 hover:text-[#d3431a] w-full"
                  >
                    지원하기
                  </button>
                )}
                <div className="flex flex-col space-y-0.5 px-3 py-2">
                  {isAuthenticated ? (
                    <>
                      {user && isAdmin(user.role) && (
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

      {/* Local modal fallback so it works on any page even without prop */}
      {!onOpenApplyModal && (
        <ApplyModal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} />
      )}

    </>
  )
}
