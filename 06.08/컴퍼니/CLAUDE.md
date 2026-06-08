# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

이 디렉토리는 Agent-ai 학습 레포지토리의 06.08/컴퍼니 프로젝트 공간입니다. 동일한 날짜 폴더(`06.08`) 안에 있는 다른 스터디 프로젝트들과 동일한 기술 스택(OpenRouter API 연동, AI 기반 웹 애플리케이션)을 참고할 수 있습니다.

## 참고 프로젝트 구조 (같은 날짜 폴더 내)

### 스터디4 - FridgeChef (Python/Streamlit)
냉장고 이미지에서 재료를 인식하는 AI 앱입니다.

- **실행**: `streamlit run app.py`
- **의존성 설치**: `pip install -r requirements.txt`
- **환경 설정**: `.env.example` → `.env` 복사 후 `OPENROUTER_API_KEY` 입력
- **단계별 진행**: `app.py`(step1) → `app_step2.py` → `app_step3.py` → `app_enhanced.py` → `app_optimized.py`
- **단계별 실행**: `run_step1.bat`, `run_step2.bat`, `run_step3.bat`

**아키텍처:**
```
app.py (Streamlit UI)
└── backend/
    ├── config.py          # 환경변수 로드 및 설정값 (모델명, 이미지 제한 등)
    ├── image_service.py   # Pillow 기반 이미지 검증/리사이징/Base64 변환
    ├── openrouter_client.py  # OpenRouter API 호출 (Llama-4-maverick)
    ├── ingredient_manager.py # 재료 편집/저장 (Step 2+)
    ├── user_profile.py       # 사용자 선호 설정 (Step 3+)
    ├── auth.py               # 인증 관리 (Step 3+)
    └── cache_manager.py      # 결과 캐싱 (optimized 버전)
```

**AI 모델:**
- 이미지 인식: `meta-llama/llama-4-maverick:free`
- 레시피 생성: `deepseek/deepseek-chat-v3.1:free`

### 스터디5 - 공감 AI 다이어리 (Node.js/Vercel)
일기 텍스트에서 감정을 분석하는 AI 웹 앱입니다.

- **로컬 실행**: `index.html`을 브라우저에서 직접 열기
- **Vercel 배포**: `vercel deploy`
- **로컬 서버리스 테스트**: `vercel dev`
- **환경 설정**: `.env.example` → `.env` 복사 후 `OPENROUTER_API_KEY` 입력

**아키텍처:**
```
index.html (메인 UI)
├── app.js              # 일기 CRUD, localStorage 연동
├── backend.js          # OpenRouter API 호출, 로컬 키워드 폴백
├── styles.css          # 보라/금색 테마 반응형 디자인
└── api/
    └── analyze.js      # Vercel 서버리스 함수 (CORS, 환경변수 API 키)
```

**AI 모델:** `google/gemma-3-27b-it:free` (OpenRouter)

## 공통 환경 설정

모든 프로젝트에서 OpenRouter API 키가 필요합니다:
```bash
# .env.example을 .env로 복사
cp .env.example .env
# OPENROUTER_API_KEY=your-api-key-here 로 수정
```

## Sub-agents (.claude/agents/)

스터디4와 스터디5 모두 전문화된 Claude sub-agent 정의 파일을 보유합니다:

- **스터디4**: `code-bug-analyzer`, `performance-optimizer`, `ux-designer-korean`
- **스터디5**: `product-manager-prd`, `backend-architect`, `frontend-developer`, `ai-integration-specialist`, `qa-engineer`
