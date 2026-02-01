# API 지원 여부 확인 결과

## OpenRouter API

### 확인 결과
- ✅ OpenRouter는 **텍스트 생성 모델만** 제공합니다
- ❌ **이미지 생성 API는 지원하지 않습니다**

### API 엔드포인트
- 텍스트: `https://openrouter.ai/api/v1/chat/completions`
- 이미지: **지원하지 않음**

### 결론
**❌ 사용 불가**: OpenRouter는 이미지 생성 기능을 제공하지 않습니다. 텍스트 생성 전용 서비스입니다.

---

## 나노바나나 (Nano Banana / Google Gemini) API

### 확인 결과 (2024년 최신 문서 기준)
- ✅ **이미지 생성 가능** ✅
- ✅ Google Gemini API 문서에 **Native Image Generation (Nano Banana)** 명시

### API 정보
- **제공사**: Google
- **실제 구현**: **Gemini API의 이미지 생성 기능**
- **문서**: https://ai.google.dev/gemini-api/docs
- **기능**: Gemini API의 `imagesmode: Native Image Generation (Nano Banana)`
- **상태**: 공식 capability로 노출

### 실무 포인트
- "Nano Banana"는 제품명/별칭
- 실제 호출은 **Gemini API의 이미지 생성 가이드/모델 지정**으로 진행
- **Gemini 이미지 생성 범주 안에서 구현**하는 것이 정석

### 결론
**✅ 사용 가능**: 
- Google Gemini API의 Native Image Generation (Nano Banana)로 이미지 생성 가능
- 이전에 "확인 필요"로 표시했으나, 실제로는 공식 문서에 명시되어 있음

---

## Google Gemini (Imagen) API

### 확인 결과 (2024년 최신 문서 기준)
- ✅ **이미지 생성 API 가능** ✅
- ✅ Gemini API에서 Imagen으로 이미지 생성 가능

### API 정보
- **제공사**: Google
- **API 선택지**:
  1. **Gemini API의 Imagen** (AI Studio / Gemini API)
  2. **Vertex AI Imagen API** (GCP Vertex 기반)
- **문서**: 
  - https://ai.google.dev/gemini-api/docs/imagen
  - https://developers.googleblog.com/imagen-4-now-available-in-the-gemini-api-and-google-ai-studio/
  - https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/imagen-api

### 가격
- **무료 티어**: AI Studio에서 제한적 테스트
- **실서비스**: Vertex AI 사용량 기반 과금 (계정/지역/시점 따라 변동)

### 결론
**✅ 사용 가능**: Gemini API의 Imagen으로 이미지 생성 가능

---

---

## 그록 (Grok / xAI) API

### 확인 결과 (2024년 최신 문서 기준)
- ✅ **이미지 생성 API 지원함** ✅
- ✅ 공식 문서에 이미지 생성 엔드포인트 명시

### API 정보
- **제공사**: xAI
- **API 엔드포인트**: `https://api.x.ai/v1/images/generations`
- **모델**: `grok-imagine-image` (문서 예시)
- **기능**: 텍스트 생성 + **이미지 생성**
- **문서**: https://docs.x.ai/docs/guides/image-generation

### 결론
**✅ 사용 가능**: xAI는 이미지 생성 API를 제공합니다. 이전에 "텍스트 전용"으로 오해했으나, 실제로는 이미지 생성 가이드가 별도로 존재합니다.

---

## 소라 (Sora / OpenAI) API

### 확인 결과 (2024년 최신 문서 기준)
- ⚠️ 소라는 **비디오 생성 모델**입니다
- ❌ **이미지 생성 목적으로는 부적합**
- ⚠️ Sora 자체를 "이미지 생성 API"로 사용하는 개념은 아님

### API 정보
- **제공사**: OpenAI
- **모델**: Sora (비디오/오디오 생성)
- **기능**: 텍스트 → 비디오 생성
- **문서**: https://openai.com/index/sora-2/

### OpenAI의 이미지 생성 모델 (대안)
- **OpenAI Image Generation API**: 이미지 생성 전용
- **API**: `https://api.openai.com/v1/images/generations`
- **모델**: `gpt-image-1`, Responses API의 image tool
- **문서**: https://platform.openai.com/docs/guides/image-generation
- **가격**: 유료 (크레딧 기반)

### 결론
**⚠️ 사용 불가 (이미지 생성 목적)**: 
- 소라는 비디오 생성 중심 모델
- 이미지 생성은 **OpenAI Image Generation API** 사용 권장
- **대안**: OpenAI의 이미지 생성 API 사용 가능 (아래 OpenAI 섹션 참조)

---

## OpenAI Image Generation API

### 확인 결과 (2024년 최신 문서 기준)
- ✅ **이미지 생성 API 가능** ✅
- ✅ 공식 문서에 Image generation 가이드 존재

### API 정보
- **제공사**: OpenAI
- **API**: `https://api.openai.com/v1/images/generations`
- **모델**: `gpt-image-1`, Responses API의 image tool
- **문서**: https://platform.openai.com/docs/guides/image-generation
- **기능**: 
  - 이미지 생성 전용 API
  - Responses API에서 도구로 이미지 생성 (멀티턴 편집/워크플로우 지원)

### 가격
- 유료 (크레딧 기반)

### 결론
**✅ 사용 가능**: OpenAI는 이미지 생성 전용 API와 Responses API 모두 제공

## 추가 고려사항

### DALL-E 3 (OpenAI)
- ✅ 이미지 생성 가능
- ❌ 유료 (크레딧 기반)
- **API**: `https://api.openai.com/v1/images/generations`
- **가격**: $0.040 ~ $0.120 per image

### 결론
현재 프로젝트에서는 **Replicate API**가 가장 적합합니다:
- 무료 크레딧 제공 ($10)
- 안정적인 API
- 다양한 모델 지원
- 명확한 문서화

## Midjourney API

### 확인 결과 (2024년 최신 문서 기준)
- ❌ **공식 API 없음** ❌
- ⚠️ 비공식 자동화만 존재 (디스코드/웹 자동화 기반)

### 실무 리스크
- 계정 정지/약관 위반 리스크
- 안정성/지연/유지보수 문제
- 웹서비스 백엔드에 사용 비추천

### 결론
**❌ 사용 불가**: 공식적인 API 기반 이미지 생성 옵션으로는 탈락

---

## 최종 체크 결과 요약표 (2024년 최신 문서 기준)

| 대상 | 이미지 생성 | 공식 API로 가능 | 코멘트 |
|------|------------|----------------|--------|
| **Grok (xAI)** | ✅ | ✅ | `images/generations` 문서 존재 |
| **Sora (OpenAI)** | ⚠️ (본질은 비디오) | ⚠️ (이미지 목적은 OpenAI 이미지 API로) | Sora는 비디오 생성 중심 |
| **나노바나나** | ✅ | ✅ (Gemini capability로 노출) | Gemini 문서에 명시 |
| **Gemini (Google)** | ✅ | ✅ | Imagen으로 생성 가능 |
| **Midjourney** | ✅ (서비스는 가능) | ❌ | 공식 API 없음, 비공식 리스크 |
| **OpenAI** | ✅ | ✅ | 이미지 생성 가이드/모델 제공 |
| **Replicate** | ✅ | ✅ | 현재 사용 중, 가장 안정적 ⭐ |

---

## 최종 권장 사항 (우선순위)

### 1. **Replicate** ⭐ (현재 사용 중)
- ✅ 무료 크레딧 $10
- ✅ 안정적이고 문서화 잘 되어 있음
- ✅ 다양한 모델 선택 가능
- **추천 모델**: 
  - `bytedance/seedream-4.5` - 비용 대비 품질 우수
  - `ideogram-ai/ideogram-v3-turbo` - 텍스트 렌더링 우수
  - `black-forest-labs/flux-schnell` - 빠른 속도

### 2. **OpenAI Image Generation API**
- ✅ 문서/SDK/안정성 강점
- ✅ Responses API로 멀티턴 워크플로우 지원
- ❌ 유료

### 3. **Google Gemini Imagen**
- ✅ 구글 생태계/Vertex로 확장 가능
- ✅ AI Studio에서 제한적 테스트 가능
- ❌ 실서비스는 Vertex AI 사용량 기반 과금

### 4. **xAI Grok 이미지**
- ✅ 가능하지만 정책/모델/요금 구조는 추가 확인 필요

### 5. **나노바나나 (Gemini Native)**
- ✅ Gemini API의 Native Image Generation으로 사용 가능

### 제외
- **Midjourney**: 공식 API 부재
- **OpenRouter**: 이미지 생성 불가 (텍스트 전용)

---

## 코드 수정 사항

- OpenRouter는 이미지 생성 불가로 명확히 표시
- 그록 (xAI): 이미지 생성 API 추가 가능 (이전 오류 수정)
- 나노바나나: Gemini API의 Native Image Generation으로 구현 가능
- 소라: 비디오 생성이므로 이미지 생성 목적으로는 OpenAI Image API 사용
- 실패 시 그라데이션 폴백 사용 (기존과 동일)
