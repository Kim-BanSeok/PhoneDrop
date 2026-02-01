# 환경 변수 설정 가이드

## 이미지 생성 API 키 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 아래 키들을 추가하세요.

```bash
# Replicate API (기본값, 무료 $10 크레딧)
NEXT_PUBLIC_REPLICATE_API_KEY=your_replicate_api_key_here

# xAI Grok 이미지 API
NEXT_PUBLIC_XAI_API_KEY=your_xai_api_key_here

# OpenAI Image Generation API (DALL-E)
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here

# Google Gemini Imagen API
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Provider 선택 (선택사항, 기본값: replicate)
# 가능한 값: replicate, xai, openai, gemini
NEXT_PUBLIC_IMAGE_PROVIDER=replicate
```

## API 키 발급 방법

### 1. Replicate API
- 웹사이트: https://replicate.com
- 무료 크레딧: $10
- API 키 발급: https://replicate.com/account/api-tokens

### 2. xAI Grok API
- 웹사이트: https://x.ai
- API 키 발급: https://x.ai/api
- 문서: https://docs.x.ai/docs/guides/image-generation

### 3. OpenAI API
- 웹사이트: https://platform.openai.com
- API 키 발급: https://platform.openai.com/api-keys
- 문서: https://platform.openai.com/docs/guides/image-generation
- 가격: 크레딧 기반 (유료)

### 4. Google Gemini API
- 웹사이트: https://ai.google.dev
- API 키 발급: https://aistudio.google.com/app/apikey
- 문서: https://ai.google.dev/gemini-api/docs/imagen
- 무료 티어: AI Studio에서 제한적 테스트

## Provider 우선순위

환경 변수 `NEXT_PUBLIC_IMAGE_PROVIDER`로 선택한 Provider를 사용합니다.
설정하지 않으면 기본값인 `replicate`를 사용합니다.

### 사용 가능한 Provider
- `replicate` - Replicate API (기본값)
- `xai` - xAI Grok 이미지 API
- `openai` - OpenAI Image Generation API
- `gemini` - Google Gemini Imagen API

## 작동 방식

1. `NEXT_PUBLIC_IMAGE_PROVIDER`에 설정된 Provider를 우선 시도
2. 해당 Provider의 API 키가 없으면 다음 Provider 시도
3. 모든 Provider 실패 시 그라데이션 배경으로 폴백

## 예시

```bash
# Replicate만 사용
NEXT_PUBLIC_REPLICATE_API_KEY=r8_xxxxxxxxxxxxx
NEXT_PUBLIC_IMAGE_PROVIDER=replicate

# OpenAI만 사용
NEXT_PUBLIC_OPENAI_API_KEY=sk-xxxxxxxxxxxxx
NEXT_PUBLIC_IMAGE_PROVIDER=openai

# 여러 Provider 설정 (우선순위: xai > openai > gemini > replicate)
NEXT_PUBLIC_XAI_API_KEY=xai-xxxxxxxxxxxxx
NEXT_PUBLIC_OPENAI_API_KEY=sk-xxxxxxxxxxxxx
NEXT_PUBLIC_GEMINI_API_KEY=xxxxxxxxxxxxx
NEXT_PUBLIC_REPLICATE_API_KEY=r8_xxxxxxxxxxxxx
NEXT_PUBLIC_IMAGE_PROVIDER=xai
```

## 주의사항

- `.env.local` 파일은 Git에 커밋하지 마세요 (`.gitignore`에 포함됨)
- API 키는 절대 공개 저장소에 올리지 마세요
- 각 API의 사용량 제한과 가격 정책을 확인하세요
