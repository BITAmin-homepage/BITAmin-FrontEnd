"use client"

import { useAuth } from "@/lib/auth"
import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy, Calendar, Users, BookOpen, Edit, Save, X, ImageIcon, Plus, Trash2 } from "lucide-react"
import Image from "next/image"

interface AboutContent {
  introduction: string
  vision: string
  achievements: string[]
  activityReviews: string[]
  curriculum: {
    firstSemester: string[]
    secondSemester: string[]
  }
  recruitment: {
    schedule: string
    contact: string
  }
  activities: {
    regularSession: string
    projectConference: string
    groupStudy: string
    mtAndSocial: string
    datathon: string
    seniorLecture: string
  }
  images: {
    regularSession?: string
    projectConference?: string
    groupStudy?: string
    mtAndSocial?: string
    datathon?: string
    seniorLecture?: string
    groupPhoto?: string
  }
}

const defaultContent: AboutContent = {
  introduction: `지금 우리는 빅데이터의 시대에 살고 있습니다.
데이터는 더 이상 특정 전공의 전유물이 아닙니다.
AI, 자율주행, 스마트시티, ESG 경영, 마케팅 등
우리가 마주하는 거의 모든 영역의 핵심에는 데이터가 존재합니다.
그리고 이제는 데이터를 해석하고, 연결하며, 활용하는 사람이
미래를 바꾸는 시대입니다.

BiTAmin은 이런 시대의 흐름 속에서
빅데이터에 관심 있는 전국의 대학생들이 모여 활동하는 연합 학술동아리입니다.
우리는 단순한 이론 학습에 그치지 않고,
데이터 분석, 기계학습, 시각화 등 다양한 주제를 함께 공부하여
실제 문제를 탐구하고, 프로젝트로 연결하며, 서로의 성장을 지극하는 활동을 해나갑니다.
BiTAmin이라는 이름처럼, 우리는 각자의 분야에서
작지만 결정적인 인사이트를 더해주는 존재가 되고자 합니다.

2025-2학기는 본격적으로 데이터 분석과 머신러닝에 대하여 공부합니다. 
지도학습과 비지도학습, 데이터 시각화, 모델 성능 평가 등의 주제를 다루게 되며, 
실제 데이터를 활용하여 실습하는 시간을 가지게 됩니다.

2026-1학기는 ML과 함께 딥러닝을 본격적으로 공부합니다. 
딥러닝의 기초를 공부하며 현업에서 필요로 하는 분야 별 필요한 알고리즘시에 대해 발표합니다. 
또한, 논문과 프로젝트에 대한 발표도 진행합니다.

방학 중에는 세션과 프로젝트를 동시에 진행하며, 학기 중에는 세션과 프로젝트를 매주 번갈아가며 진행합니다. 
4번의 기간 동안 한번 분야에 따라 다양한 프로젝트를 구성하고 목적을 세워 도전할 수 있습니다.

방학 혹은 학기가 마무리될 때 팀별로 진행한 프로젝트를 발표하는 컨퍼런스를 준비하게 됩니다. 
자연어처리, 컴퓨터 비전, 추천시스템, 강화학습, 딥러닝 등 여러 분야별로 스포츠, 금융, 
법률 등 다양한 주제를 가지고 결과물을 선보입니다.`,
  vision: `우리는 묻습니다.
변화를 따라잡을 것인가, 변화를 이끌 것인가.
기술의 흐름에 수동적으로 적응하는 팔로워가 아닌,
문제의 본질을 파악하고 데이터를 통해 해결책을 시도하는
데이터 리더로 성장하고 싶다면, 지금 바로 함께하세요.
BiTAmin은, 혼자서가 아닌 '함께하는 성장'을 말합니다.
그 여정에 당신이 함께하길 기다립니다.`,
  achievements: [
    "2023 NH투자증권 빅데이터 경진대회 입선상 (11기)",
    "2023 제5회 대구 빅데이터분석 경진대회 최우수상 (11기)",
    "2023 NH 투자증권 빅데이터 경진대회 대상 (10기/11기)",
    "2023 삼성증권 디지털/IT 학회 연계 프로그램 대상 (11기/12기)",
    "2023 삼성증권 디지털/IT 학회 연계 프로그램 우수상 (12기/13기)",
    "2024 한국정책학회 시민문제 해결을 위한 해커톤 우수상 (12기)",
    "2024 경기도청 해커톤 혁명의 포용적 기술정책 장려상 (12기/13기)",
    "2024 한국관광 데이터랩 활용사례 경진대회 장려상 (13기)",
    "2024 도서관 빅데이터 활용 및 아이디어 최우수상 (13기/14기)",
    "2024 DATA•AI 분석 경진대회 우수문제 해결상 (13기/14기)",
  ],
  activityReviews: [
    "15기 김민수: 비타민에서 머신러닝을 체계적으로 배우면서 데이터 사이언티스트로서의 기초를 다질 수 있었습니다. 특히 프로젝트를 통해 실무 경험을 쌓을 수 있어서 좋았어요.",
    "14기 이지은: 정규 세션뿐만 아니라 다양한 스터디와 소모임을 통해 많은 사람들과 네트워킹할 수 있었습니다. 현직자 강연도 진로 결정에 큰 도움이 되었어요.",
  ],
  curriculum: {
    firstSemester: [
      "데이터 전처리 (Missing Value / Data Imbalance / Categorical data / Scaling / Feature Engineering)",
      "EDA (데이터 분석 기초 / Pandas, Numpy / Matplotlib, Seaborn)",
      "ML 기초 (Regression / Classification / KNN, SVM / Clustering / Anomaly Detection)",
      "Ensemble (Bagging / Boosting / Stacking / 실습)",
      "복습 과제",
    ],
    secondSemester: [
      "딥러닝 기초 (Pytorch / Perceptron / Backpropagation)",
      "Computer Vision (Image Data / CNN / ResNet, EfficientNet)",
      "NLP (Text Data / RNN, LSTM / Seq2Seq / Transformer / GPT, BERT)",
      "추천 시스템 (A, B Test / 딥러닝 / 콘텐츠 기반 추천 시스템)",
      "컨퍼런스 (조별 심화 스터디 / 조별 컨퍼런스 준비)",
    ],
  },
  recruitment: {
    schedule: `운영진
지원서 접수기간: 2025년 6월 2일(월) ~ 2025년 6월 25일(수)
서류 합격 발표: 2025년 6월 26일(목)
면접 및 코딩테스트: 2025년 6월 28일(토) ~ 2024년 6월 29일(일)
운영진 OT: 2025년 7월 1일 (수)

멤버
지원서 접수 기간: 2025년 6월 2일(월) ~ 2025년 6월 25일(수)
서류 합격 발표: 2025년 7월 1일(수)
면접 및 코딩테스트: 2025년 7월 4일(금) ~ 2025년 7월 6일(일)

최종 합격자 발표: 2025년 7월 7일(월)
멤버 OT: 2025년 7월 9일(수)
16기 세션 시작: 2025년 7월 12일(토)`,
    contact: `문의 메일: bitamin1815@gmail.com
인스타그램: @bitamin_official
문의 번호: 010-8561-6147`,
  },
  activities: {
    regularSession: `BiTAmin은 총 1년에 걸쳐 정규 세션을 통해 커리큘럼을 진행합니다.

정규세션은 시험기간을 제외하고 매주 1회씩 진행되며
학기 중에는 수요일 19시 ~ 21시, 방학 중에는 토요일 15시 ~ 18시에 진행됩니다.

학기  Wed  7:00 PM ~ 9:00 PM
방학  Sat   3:00 PM ~ 6:00 PM

정규세션은 운영진이 계획한 커리큘럼에 따라 조원들이 해당 범위를 직접 공부하여
발표자료를 준비하고 발표로 진행하는 형식입니다.
따라서 모든 조원의 능동적인 참여와 공부가 필요 합니다.`,
    projectConference: `방학과 학기가 시작하기 전, 배우거나 다루고 싶은 분야를 선택하여 5~6인 규모로 팀을 구성하게 됩니다. 그리고 방학과 학기가 종료될 때마다, 그간의 프로젝트 결과를 바탕으로 컨퍼런스를 개최합니다.

방학 중에는 매주 발표가 끝난 후 프로젝트 회의 시간을 가지며, 학기 중에는 격주로 만나 회의를 진행합니다.

프로젝트를 위하는 것은 미리 시작할 수 있으며 팀원들의 경험 격차를 완화하기 위해 사전에 의사를 전달받고 있습니다.

동아리원들은 NLP, CV, 추천시스템, 시계열, 강화학습, 딥러닝 등 본인이 관심 있는 분야를 선택해 자유롭게 팀을 구성하여 프로젝트를 준비합니다. 팀원들의 의사에 따라 공모전 참여도 있습니다.

직접 데이터를 수집하고 분석하며 프로젝트를 진행하게 되고, 컨퍼런스를 통해 프로젝트 발표 및 우수팀을 선정합니다.`,
    groupStudy: `BiTAmin에는 정규 세션 외에도 그룹 스터디를 구성할 수 있습니다. 정규 세션과 무관하게, 관심 있는 분야와 스킬을 단련하기 위해 필수가 아닌 자율적으로 참여할 수 있습니다.

현재 14기와 15기 동아리원들은 코딩테스트 스터디를 개설하여 프로그래머스 플랫폼을 통해 공부한 내용과 문제풀이를 단체 채팅에 게시하는 등의 방식으로 진행하고 있습니다.

또한, 기술 블로그, 논문 구현, 위키북스, Tableau, 자기계발 등 다양한 스터디가 이루어지고 있으며 분야와 스터디 진행 방식을 자유롭게 선택하여 노션 및 깃허브 등을 통해 기록을 남기고 있습니다.

스터디는 개별 희망자에 한하여 조율을 통해 일정이 진행됩니다. 스터디가 개설되면 모두 다양한 분야를 공부할 수 있는 환경을 조성해 드리도록 지원할 것입니다.`,
    mtAndSocial: `BiTAmin은 정규 세션과 별개로 MT와 소모임이 있습니다. 소모임은 운영진, 동아리 구분 없이 희망자들에 한해 개최 및 참가할 수 있습니다.

MT는 매 기수 진행하게 되며 15기의 경우 가평군 펜션에서 1박 2일로 다녀왔습니다. 게임, 레크레이션, 바베큐 파티를 하며 한층 더 친해지는 시간을 가질 수 있었습니다.

소모임은 빅데이터 및 인공지능에 국한되지 않고 서로의 취미와 관심사를 공유하는 목적으로 시작되었습니다. 등산 및 산책, 야구 직관, IT 자격증, 맛집 탐방 등 다양한 주제의 소모임이 열렸습니다.

소모임은 누구나 자신이 희망하는 분야에서 자유롭게 만들고 참여할 수 있습니다. 비슷한 관심사를 가진 동아리원들과 함께 자기계발, 취미 도모를 하는 시간을 가져보세요.`,
    datathon: `BiTAmin은 동아리 내부에서의 학습과 성장뿐 아니라, 외부 커뮤니티 및 기업과의 협업에 열린 자세로 다양한 활동을 이어가고 있습니다.

상반기에는 타 연합 동아리들과 함께 2025 MixUp AI Datathon에 공동 참여하여 단순한 데이터 분석이나 인공지능 학습을 넘어 실제 데이터를 활용한 분석부터 발표까지의 전 과정을 경험하며 협업 역량을 기를 수 있습니다.

또한, 해당 대회의 운영진으로서 Upstage, Wizcore, KPC 등 협력사와의 커뮤니케이션, 기획 및 운영, 참가자 지원, 현장 진행자의 역할까지 직접적으로 기여하고 참여하여 단순한 참가를 넘어, 실전 프로젝트의 전 과정을 주도적으로 경험해볼 수 있었습니다.

특히, 분석 이후 문제 해결 테스트 및 검증 과정에 참여하거나 공정 산업 현장의 품질 데이터 분석 및 공정 최적화 과제에 참여를 통한 문제 고도화를 진행하는 등 기업 및 동아리와의 협업 과정에 적극적으로 기여하였습니다.

향후에도 BiTAmin은 외부 단체와 협력하거나 연계하여 서로 다른 전공과 배경이 섞어 만들어내는 시너지를 체감할 수 있는 프로젝트 기반 활동들을 이어갈 예정입니다.`,
    seniorLecture: `BiTAmin은 데이터 관련 직무 혹은 대학원 진학을 희망하고 있는 동아리 원들을 위해 상반기에 졸업생 데이, 하반기에 현직자 초청 강연을 진행하고 있습니다. 데이터 관련 직무에 종사하시는 현직자분들과 대학원에 재학 중인 선배님들을 초청하여 동아리 원들은 취업과 진학을 위한 정보를 얻을 수 있습니다.

강연을 통해 배우는 현직 정보들은 취업 혹은 진학을 준비하는 동아리 원들의 시야를 넓히는 데 큰 기여가 됩니다. 또한, 설문조사를 통해 받은 사전 질문과 현장에서의 질의응답을 통해 현직 관련 궁금증을 해결할 수 있습니다.

BiTAmin 동아리원들은 누구나 현직자 초청 강연 준비에 참여할 수 있습니다. 현직자 초청 강연에 참여 요청을 받아 온라인 중계를 통해 참석할 수도 있고 현장 스터디룸에서 근무하고 계시는 선배님들께서 강연을 진행해 주셨습니다.

2024년 현직자 초청 강연에는 현재 빅픽 코리아 추천시스템 팀에서 근무 중이신 선배님과 대학원과 취업을 모두 경험하신 선배님 두 분께서 강연을 진행해 주셨습니다.`,
  },
  images: {},
}

export default function AboutPage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState<AboutContent>(defaultContent)
  const [editContent, setEditContent] = useState<AboutContent>(defaultContent)
  const [isLoading, setIsLoading] = useState(true)
  const [uploadingImages, setUploadingImages] = useState<{ [key: string]: File }>({})
  const [newAchievement, setNewAchievement] = useState("")
  const [newActivityReview, setNewActivityReview] = useState("")

  useEffect(() => {
    // 로컬 스토리지에서 저장된 내용 불러오기
    try {
      const savedContent = localStorage.getItem("bitamin_about_content")
      if (savedContent) {
        const parsed = JSON.parse(savedContent)
        // 기본값과 병합하여 누락된 필드 방지
        const mergedContent = {
          ...defaultContent,
          ...parsed,
          activities: {
            ...defaultContent.activities,
            ...(parsed.activities || {}),
          },
          curriculum: {
            ...defaultContent.curriculum,
            ...(parsed.curriculum || {}),
          },
          recruitment: {
            ...defaultContent.recruitment,
            ...(parsed.recruitment || {}),
          },
          images: {
            ...defaultContent.images,
            ...(parsed.images || {}),
          },
          achievements: parsed.achievements || defaultContent.achievements,
          activityReviews: parsed.activityReviews || defaultContent.activityReviews,
        }
        setContent(mergedContent)
        setEditContent(mergedContent)
      }
    } catch (error) {
      console.error("Error loading saved content:", error)
      // 에러 발생 시 기본값 사용
      setContent(defaultContent)
      setEditContent(defaultContent)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleImageUpload = (key: string, file: File) => {
    const imageUrl = URL.createObjectURL(file)
    setUploadingImages((prev) => ({ ...prev, [key]: file }))
    setEditContent((prev) => ({
      ...prev,
      images: {
        ...prev.images,
        [key]: imageUrl,
      },
    }))
  }

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setEditContent((prev) => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()],
      }))
      setNewAchievement("")
    }
  }

  const removeAchievement = (index: number) => {
    setEditContent((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }))
  }

  const addActivityReview = () => {
    if (newActivityReview.trim()) {
      setEditContent((prev) => ({
        ...prev,
        activityReviews: [...prev.activityReviews, newActivityReview.trim()],
      }))
      setNewActivityReview("")
    }
  }

  const removeActivityReview = (index: number) => {
    setEditContent((prev) => ({
      ...prev,
      activityReviews: prev.activityReviews.filter((_, i) => i !== index),
    }))
  }

  const handleSave = () => {
    setContent(editContent)
    localStorage.setItem("bitamin_about_content", JSON.stringify(editContent))
    setIsEditing(false)
    setUploadingImages({})
    alert("내용이 저장되었습니다!")
  }

  const handleCancel = () => {
    setEditContent(content)
    setIsEditing(false)
    setUploadingImages({})
    setNewAchievement("")
    setNewActivityReview("")
    // 업로드된 이미지 URL 정리
    Object.values(uploadingImages).forEach((file) => {
      if (file) URL.revokeObjectURL(URL.createObjectURL(file))
    })
  }

  const ImageUploadSection = ({ imageKey, title }: { imageKey: string; title: string }) =>
    isEditing ? (
      <div className="space-y-2">
        <Label>{title} 이미지</Label>
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleImageUpload(imageKey, file)
            }}
            className="hidden"
            id={`image-${imageKey}`}
          />
          <label
            htmlFor={`image-${imageKey}`}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            이미지 선택
          </label>
          {editContent.images?.[imageKey as keyof typeof editContent.images] && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setEditContent((prev) => ({
                  ...prev,
                  images: {
                    ...prev.images,
                    [imageKey]: undefined,
                  },
                }))
              }}
            >
              <X className="h-4 w-4 mr-1" />
              제거
            </Button>
          )}
        </div>
      </div>
    ) : null

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">로딩 중...</div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">동아리 소개</h1>
            <p className="text-gray-600">대학생 연합 빅데이터 동아리 비타민을 소개합니다</p>
          </div>
          {user?.role === "management" && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} className="bg-[#d3431a] hover:bg-[#b8371a] text-white">
                    <Save className="h-4 w-4 mr-2" />
                    저장
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    <X className="h-4 w-4 mr-2" />
                    취소
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  편집
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="space-y-8">
          {/* 소개 섹션 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#d3431a]" />
                비타민 소개
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editContent.introduction}
                  onChange={(e) => setEditContent({ ...editContent, introduction: e.target.value })}
                  rows={20}
                  className="w-full"
                />
              ) : (
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">{content.introduction}</div>
              )}
            </CardContent>
          </Card>

          {/* 활동 소개 섹션 */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>정규 세션 Regular Session</CardTitle>
                <CardDescription>체계적인 커리큘럼을 통한 학습</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isEditing && (
                    <>
                      <Textarea
                        value={editContent.activities?.regularSession || ""}
                        onChange={(e) =>
                          setEditContent({
                            ...editContent,
                            activities: {
                              ...editContent.activities,
                              regularSession: e.target.value,
                            },
                          })
                        }
                        rows={8}
                        className="w-full"
                      />
                      <ImageUploadSection imageKey="regularSession" title="정규 세션" />
                    </>
                  )}
                  {!isEditing && (
                    <div className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">
                      {content.activities?.regularSession || "정규 세션 정보를 불러오는 중..."}
                    </div>
                  )}
                  <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-200">
                    <Image
                      src={content.images?.regularSession || "/placeholder.svg?height=200&width=400&text=정규+세션"}
                      alt="정규 세션 모습"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>프로젝트 컨퍼런스</CardTitle>
                <CardDescription>팀 프로젝트와 발표의 기회</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isEditing && (
                    <>
                      <Textarea
                        value={editContent.activities?.projectConference || ""}
                        onChange={(e) =>
                          setEditContent({
                            ...editContent,
                            activities: {
                              ...editContent.activities,
                              projectConference: e.target.value,
                            },
                          })
                        }
                        rows={8}
                        className="w-full"
                      />
                      <ImageUploadSection imageKey="projectConference" title="프로젝트 컨퍼런스" />
                    </>
                  )}
                  {!isEditing && (
                    <div className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">
                      {content.activities?.projectConference || "프로젝트 컨퍼런스 정보를 불러오는 중..."}
                    </div>
                  )}
                  <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-200">
                    <Image
                      src={
                        content.images?.projectConference ||
                        "/placeholder.svg?height=200&width=400&text=프로젝트+컨퍼런스" ||
                        "/placeholder.svg"
                      }
                      alt="프로젝트 컨퍼런스"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>그룹 스터디 Group Study</CardTitle>
                <CardDescription>자율적인 학습 그룹 활동</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isEditing && (
                    <>
                      <Textarea
                        value={editContent.activities?.groupStudy || ""}
                        onChange={(e) =>
                          setEditContent({
                            ...editContent,
                            activities: {
                              ...editContent.activities,
                              groupStudy: e.target.value,
                            },
                          })
                        }
                        rows={8}
                        className="w-full"
                      />
                      <ImageUploadSection imageKey="groupStudy" title="그룹 스터디" />
                    </>
                  )}
                  {!isEditing && (
                    <div className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">
                      {content.activities?.groupStudy || "그룹 스터디 정보를 불러오는 중..."}
                    </div>
                  )}
                  <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-200">
                    <Image
                      src={content.images?.groupStudy || "/placeholder.svg?height=200&width=400&text=그룹+스터디"}
                      alt="그룹 스터디 모습"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>MT & 소모임</CardTitle>
                <CardDescription>친목과 네트워킹의 시간</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isEditing && (
                    <>
                      <Textarea
                        value={editContent.activities?.mtAndSocial || ""}
                        onChange={(e) =>
                          setEditContent({
                            ...editContent,
                            activities: {
                              ...editContent.activities,
                              mtAndSocial: e.target.value,
                            },
                          })
                        }
                        rows={8}
                        className="w-full"
                      />
                      <ImageUploadSection imageKey="mtAndSocial" title="MT & 소모임" />
                    </>
                  )}
                  {!isEditing && (
                    <div className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">
                      {content.activities?.mtAndSocial || "MT & 소모임 정보를 불러오는 중..."}
                    </div>
                  )}
                  <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-200">
                    <Image
                      src={content.images?.mtAndSocial || "/placeholder.svg?height=200&width=400&text=MT+소모임"}
                      alt="MT 및 소모임 활동"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>연합 데이터톤 AI Datathon</CardTitle>
                <CardDescription>외부 협업과 경진대회 참여</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isEditing && (
                    <>
                      <Textarea
                        value={editContent.activities?.datathon || ""}
                        onChange={(e) =>
                          setEditContent({
                            ...editContent,
                            activities: {
                              ...editContent.activities,
                              datathon: e.target.value,
                            },
                          })
                        }
                        rows={8}
                        className="w-full"
                      />
                      <ImageUploadSection imageKey="datathon" title="AI 데이터톤" />
                    </>
                  )}
                  {!isEditing && (
                    <div className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">
                      {content.activities?.datathon || "AI 데이터톤 정보를 불러오는 중..."}
                    </div>
                  )}
                  <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-200">
                    <Image
                      src={content.images?.datathon || "/placeholder.svg?height=200&width=400&text=AI+데이터톤"}
                      alt="AI 데이터톤 참여"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>현직자 초청 강연 Senior Lecture</CardTitle>
                <CardDescription>진로와 취업 정보 제공</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isEditing && (
                    <>
                      <Textarea
                        value={editContent.activities?.seniorLecture || ""}
                        onChange={(e) =>
                          setEditContent({
                            ...editContent,
                            activities: {
                              ...editContent.activities,
                              seniorLecture: e.target.value,
                            },
                          })
                        }
                        rows={8}
                        className="w-full"
                      />
                      <ImageUploadSection imageKey="seniorLecture" title="현직자 초청 강연" />
                    </>
                  )}
                  {!isEditing && (
                    <div className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">
                      {content.activities?.seniorLecture || "현직자 초청 강연 정보를 불러오는 중..."}
                    </div>
                  )}
                  <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-200">
                    <Image
                      src={content.images?.seniorLecture || "/placeholder.svg?height=200&width=400&text=현직자+강연"}
                      alt="현직자 초청 강연"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 활동 후기 */}
          <Card>
            <CardHeader>
              <CardTitle>활동 후기</CardTitle>
              <CardDescription>비타민 멤버들의 생생한 후기</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isEditing && (
                  <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                    <div className="flex gap-2">
                      <Input
                        placeholder="예: 15기 김민수: 후기 내용..."
                        value={newActivityReview}
                        onChange={(e) => setNewActivityReview(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={addActivityReview} size="sm" className="bg-[#d3431a] hover:bg-[#b8371a]">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                <div className="max-h-48 overflow-y-auto space-y-3">
                  {(isEditing ? editContent.activityReviews : content.activityReviews.slice(0, 2)).map(
                    (review, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-[#d3431a] rounded-full flex-shrink-0 mt-2"></div>
                        <span className="text-gray-700 flex-1">{review}</span>
                        {isEditing && (
                          <Button
                            onClick={() => removeActivityReview(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ),
                  )}
                  {!isEditing && content.activityReviews.length > 2 && (
                    <div className="space-y-3">
                      {content.activityReviews.slice(2).map((review, index) => (
                        <div key={index + 2} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-[#d3431a] rounded-full flex-shrink-0 mt-2"></div>
                          <span className="text-gray-700">{review}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 비전 섹션 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#d3431a]" />
                우리의 비전
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editContent.vision}
                  onChange={(e) => setEditContent({ ...editContent, vision: e.target.value })}
                  rows={8}
                  className="w-full"
                />
              ) : (
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">{content.vision}</div>
              )}
            </CardContent>
          </Card>

          {/* 수상 실적 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-[#d3431a]" />
                수상 실적
              </CardTitle>
              <CardDescription>비타민 동아리의 주요 대회 수상 실적입니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isEditing && (
                  <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                    <div className="flex gap-2">
                      <Input
                        placeholder="예: 2024 데이터 분석 경진대회 대상 (15기)"
                        value={newAchievement}
                        onChange={(e) => setNewAchievement(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={addAchievement} size="sm" className="bg-[#d3431a] hover:bg-[#b8371a]">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                <div className="max-h-80 overflow-y-auto space-y-3">
                  {(isEditing ? editContent.achievements : content.achievements.slice(0, 10)).map(
                    (achievement, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-[#d3431a] rounded-full flex-shrink-0 mt-2"></div>
                        <span className="text-gray-700 flex-1">{achievement}</span>
                        {isEditing && (
                          <Button
                            onClick={() => removeAchievement(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ),
                  )}
                  {!isEditing && content.achievements.length > 10 && (
                    <div className="space-y-3">
                      {content.achievements.slice(10).map((achievement, index) => (
                        <div key={index + 10} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-[#d3431a] rounded-full flex-shrink-0 mt-2"></div>
                          <span className="text-gray-700">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 커리큘럼 */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>1학기 커리큘럼</CardTitle>
                <CardDescription>기초부터 시작하는 데이터 사이언스</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(content.curriculum?.firstSemester || []).map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1 flex-shrink-0">
                        {index + 1}
                      </Badge>
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2학기 커리큘럼</CardTitle>
                <CardDescription>심화 학습과 실전 프로젝트</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(content.curriculum?.secondSemester || []).map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1 flex-shrink-0">
                        {index + 1}
                      </Badge>
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 모집 일정 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#d3431a]" />
                모집 일정 및 연락처
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">모집 일정</h4>
                  {isEditing ? (
                    <Textarea
                      value={editContent.recruitment?.schedule || ""}
                      onChange={(e) =>
                        setEditContent({
                          ...editContent,
                          recruitment: { ...editContent.recruitment, schedule: e.target.value },
                        })
                      }
                      rows={12}
                      className="w-full"
                    />
                  ) : (
                    <div className="whitespace-pre-line text-gray-700 text-sm leading-relaxed">
                      {content.recruitment?.schedule || "모집 일정 정보를 불러오는 중..."}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold mb-3">연락처</h4>
                  {isEditing ? (
                    <Textarea
                      value={editContent.recruitment?.contact || ""}
                      onChange={(e) =>
                        setEditContent({
                          ...editContent,
                          recruitment: { ...editContent.recruitment, contact: e.target.value },
                        })
                      }
                      rows={4}
                      className="w-full"
                    />
                  ) : (
                    <div className="whitespace-pre-line text-gray-700 text-sm leading-relaxed">
                      {content.recruitment?.contact || "연락처 정보를 불러오는 중..."}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 단체 사진 */}
          <Card>
            <CardHeader>
              <CardTitle>비타민 16기</CardTitle>
              <CardDescription>함께 성장하는 비타민 가족들</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isEditing && <ImageUploadSection imageKey="groupPhoto" title="단체 사진" />}
                <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden bg-gray-200">
                  <Image
                    src={
                      content.images?.groupPhoto || "/placeholder.svg?height=400&width=800&text=비타민+16기+단체사진"
                    }
                    alt="비타민 16기 단체 사진"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
