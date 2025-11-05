# 🎯 BITAmin 모집 기간 설정 가이드

## 📝 개요
BITAmin 웹사이트의 모집 상태를 쉽게 관리할 수 있도록 설정 시스템이 구축되어 있습니다.
**단 한 줄의 코드만 수정하면 전체 사이트의 모집 상태가 자동으로 변경됩니다.**

---

## 🔧 설정 방법

### 1. 설정 파일 위치
```
/lib/recruit-config.ts
```

### 2. 설정 변경하기

파일을 열고 `IS_RECRUITING_ACTIVE` 값을 변경하세요:

```typescript
// 모집 시작할 때
export const IS_RECRUITING_ACTIVE = true

// 모집 종료할 때
export const IS_RECRUITING_ACTIVE = false
```

---

## 동작 방식

### `IS_RECRUITING_ACTIVE = true` (모집 중)
- **헤더의 "Recruiting" 버튼** → `/api/recruit` 페이지로 이동
- **메인 페이지의 "지원하기" 버튼** → `/api/recruit` 페이지로 이동
- 사용자가 지원서를 작성하고 제출할 수 있음

### `IS_RECRUITING_ACTIVE = false` (모집 마감)
- **헤더의 "Recruiting" 버튼** → 모집 마감 안내 모달 표시
- **메인 페이지의 "지원하기" 버튼** → 모집 마감 안내 모달 표시
- 비로그인 사용자에게만 버튼 표시 (로그인 사용자에게는 버튼 자체가 숨겨짐)

---

## 📁 영향받는 파일들

설정을 변경하면 아래 파일들이 자동으로 반응합니다:

1. `/components/header.tsx` - 상단 헤더의 Recruiting 버튼
2. `/components/hero.tsx` - 메인 페이지의 지원하기 버튼
3. `/app/page.tsx` - 메인 페이지 전체

---


### 모집 시작하기
```bash
# 1. 설정 파일 열기
code lib/recruit-config.ts

# 2. 값 변경
export const IS_RECRUITING_ACTIVE = true

# 3. 저장 후 배포
git add lib/recruit-config.ts
git commit -m "feat: 모집 시작"
git push
```

### 모집 종료하기
```bash
# 1. 설정 파일 열기
code lib/recruit-config.ts

# 2. 값 변경
export const IS_RECRUITING_ACTIVE = false

# 3. 저장 후 배포
git add lib/recruit-config.ts
git commit -m "[feat] 모집 종료"
git push
```

---

## 참고사항

1. **기존 코드는 삭제되지 않았습니다**
   - 모달 방식과 페이지 방식이 모두 유지되어 있습니다
   - 설정에 따라 자동으로 전환됩니다

2. **로그인 사용자**
   - 로그인한 사용자에게는 모집 마감 시 버튼이 표시되지 않습니다
   - 이미 회원인 사용자는 지원할 필요가 없기 때문입니다

3. **유지보수**
   - 매 기수마다 `lib/recruit-config.ts` 파일 하나만 수정하면 됩니다
   - 다른 파일은 수정할 필요가 없습니다

---


