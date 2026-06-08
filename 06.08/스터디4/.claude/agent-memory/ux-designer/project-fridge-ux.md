---
name: project-fridge-ux
description: 냉장고를 부탁해 웹 앱의 UX 개선 작업 내역 및 주요 패턴
metadata:
  type: project
---

AI 레시피 추천 웹앱 (냉장고를 부탁해)의 UX 개선 작업을 2026-06-08에 수행.

주요 수정 파일: `web/app.js`, `web/backend.js`, `web/index.html`, `web/styles.css`

**개선 내역:**
- null 참조 방어: `updateGenerateButton`, `displayRecipe`, `_applyLoadedImage`에 옵셔널 체이닝 / 명시적 null 체크 추가
- Toast 타이머 누적 방지: `_toastTimer` 인스턴스 변수로 `clearTimeout` 패턴 적용
- 코드 중복 제거: `loadSampleImage`와 `handleImageFile`의 공통 로직을 `_applyLoadedImage()` 헬퍼로 추출
- 재료 파싱 개선: `isValidIngredient()` 헬퍼 함수로 30자 초과 + 동사/조사 포함 문장 필터링
- CSP 메타 태그 추가 (index.html `<head>`)
- 드래그앤드롭: `drag-over` CSS 클래스 + `relatedTarget` 체크로 자식 요소 진입 시 flicker 방지
- Toast 타입별 색상: `toast-success/error/warning/info` CSS 클래스 분기
- 버튼 로딩 스피너: `.btn-loading::after` pseudo-element 스피너

**Why:** 사용자 인터랙션 중 TypeError crash 방지 및 시각적 피드백 명확화
**How to apply:** 동일 앱 추가 개선 시 위 패턴 참고. 특히 DOM 조작 전 null 체크는 이 프로젝트 전반에 적용 필요.
