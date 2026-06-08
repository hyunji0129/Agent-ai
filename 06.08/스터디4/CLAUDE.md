# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**냉장고를 부탁해 (FridgeChef)** — AI 기반 냉장고 재료 인식 및 레시피 추천 앱. VibeCoding Study-04 프로젝트로, 두 개의 독립적인 프론트엔드가 공존한다:
- **Streamlit 앱** (`app_step3.py`): 인증·대시보드·프로필 포함 완성형 UI (포트 8503)
- **Web 앱** (`web/`): Vercel 배포용 정적 프론트엔드, OpenRouter API를 브라우저에서 직접 호출

## 실행 방법

### Streamlit 앱 (Step 3 — 권장)
```bash
# .env 파일에 OPENROUTER_API_KEY 설정 필수
cp .env.example .env
py -m streamlit run app_step3.py --server.port 8503
# 또는
run_step3.bat
```
데모 계정: `demo@fridgechef.com` / `demo123`

### 정적 Web 앱 (로컬 개발)
```bash
cd web
npx serve -p 8080
# 브라우저에서 ⚙️ 설정 버튼 → OpenRouter API 키 입력
```

### 의존성 설치
```bash
pip install -r requirements_step2.txt   # Step 1+2 기반
pip install streamlit plotly pandas      # Step 3 추가 패키지
```

## 아키텍처

### 단계별 앱 파일 관계
| 파일 | 설명 |
|------|------|
| `app.py` | Step 1: 재료 인식만 (기본) |
| `app_step2.py` | Step 2: DB 저장 추가 |
| `app_step3.py` | Step 3: 인증·프로필·대시보드 (현재 기준) |
| `app_enhanced.py` / `app_optimized.py` | 실험적 변형, 프로덕션 미사용 |

### backend/ 모듈 구조
```
openrouter_client.py  ← 모든 AI 호출 진입점 (재료 인식 + 레시피 생성)
config.py             ← 환경변수, 모델 이름, 경로 상수 중앙 관리
image_service.py      ← 이미지 유효성 검사, base64 변환, 경로 조작 방지
recipe_generator.py   ← RecipeGenerator: AI 응답 파싱 + 점수화
ingredient_manager.py ← 세션 내 재료 상태 관리 (DB 미사용)
database.py           ← RecipeDatabase: SQLite (recipes.db)
auth.py               ← AuthManager: JSON 파일 기반 사용자 저장 (users.json)
auth_optimized.py     ← PBKDF2 해싱, LRU 세션, 레이트 리밋 포함 개선판
user_profile.py       ← UserProfileManager: JSON 파일로 프로필·북마크 저장
cache_manager.py      ← TTL 캐시 + L1/L2 멀티레이어 캐시
rate_limiter.py       ← 다단계 레이트 리밋 (IP·사용자별 LRU 1000개 제한)
performance_monitor.py← psutil 기반 시스템 메트릭 수집
```

### Web 앱 (web/) 구조
- `index.html` — 단일 페이지, CSP 메타 태그 포함
- `app.js` — `FridgeRecipeApp` 클래스: 이미지 업로드·재료 인식·레시피 생성 UI
- `backend.js` — `FridgeRecipeBackend` 클래스: OpenRouter API 호출 및 응답 파싱
- `styles.css` — 버튼 로딩 스피너, 드래그앤드롭 피드백, Toast 타입별 색상 포함
- `api/recipe.js` — Vercel Serverless Function (프로덕션 API 프록시)

### AI 호출 흐름
```
이미지 업로드
  → ImageProcessor.process_image() (base64 변환)
  → OpenRouterClient.recognize_ingredients() (llama-4-maverick:free)
  → IngredientManager.set_ingredients()
  → RecipeGenerator.generate_recipes() (deepseek-chat-v3.1:free)
```

### 데이터 저장
- `recipes.db` — SQLite: 레시피·재료·세션 이력
- `users.json` — JSON: 사용자 계정 (auth.py), 프로덕션 미적합
- `user_profiles/` — JSON 파일별 사용자 프로필 (user_profile.py)

## 핵심 설정

### 환경변수 (`.env`)
```
OPENROUTER_API_KEY=sk-or-...   # 필수
DEBUG=False
```

### 모델 설정 (`backend/config.py`)
- 재료 인식: `meta-llama/llama-4-maverick:free`
- 레시피 생성: `deepseek/deepseek-chat-v3.1:free`

## 주의사항

- **`auth.py` vs `auth_optimized.py`**: `auth.py`는 SHA256 단순 해싱(취약), `auth_optimized.py`는 PBKDF2 사용. `app_step3.py`는 현재 `auth.py`를 import하므로 보안이 필요한 경우 교체 필요.
- **Web 앱 API 키**: `backend.js`의 `useServerlessAPI = true`가 기본값. `false`로 바꾸면 API 키가 브라우저에 노출되므로 로컬 개발 외 사용 금지.
- **`_optimized.py` 파일들**: 성능 개선 실험 버전으로 메인 앱에서 직접 import하지 않음. 기능 대체 시 import 경로 수정 필요.
- **Windows 실행**: `py` 명령어 사용 (`python` 아님). `performance_monitor.py`는 Windows에서 `C:\` 경로로 disk_usage를 측정하도록 분기 처리됨.
