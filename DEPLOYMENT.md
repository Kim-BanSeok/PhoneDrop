# PhoneDrop 배포 가이드

## Vercel 배포

### 1. Vercel 계정 설정
1. [Vercel](https://vercel.com)에 가입/로그인
2. GitHub 계정 연동

### 2. 프로젝트 배포
1. Vercel 대시보드에서 "New Project" 클릭
2. GitHub 리포지토리 선택
3. 빌드 설정 확인:
   - **Framework**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `out`
   - **Install Command**: `npm install`

### 3. 환경 변수 설정
현재는 필요한 환경 변수가 없습니다.

### 4. 도메인 설정
1. 배포 후 자동 도메인 할당 (예: `phonedrop.vercel.app`)
2. 커스텀 도메인 설정 가능
   - `phonedrop.app`
   - `www.phonedrop.app`

## 다른 호스팅 서비스 배포

### Netlify
1. 빌드: `npm run build`
2. `out` 폴더를 Netlify에 업로드
3. 리디렉션 설정 필요

### GitHub Pages
1. `next.config.js`에서 `output: 'export'` 설정됨
2. 빌드 후 `out` 폴더를 `gh-pages` 브랜치에 배포

### 자체 서버
```bash
npm run build
npm start
```

## 성능 최적화

### 1. 이미지 최적화
- Next.js Image 컴포넌트 사용
- WebP 형식 자동 변환

### 2. 코드 분할
- 동적 임포트 사용
- 페이지별 로딩 최적화

### 3. 캐싱
- 정적 자산 캐싱
- CDN 활용

## SEO 최적화

### 1. 메타 태그
```tsx
export const metadata: Metadata = {
  title: 'PhoneDrop - 전화번호 한번에 저장',
  description: 'PC에서 전화번호를 입력하여 vCard 파일을 생성하고, 모바일에서 바로 저장하세요.',
  keywords: ['전화번호', 'vCard', '연락처', '모바일', '대량저장'],
  openGraph: {
    title: 'PhoneDrop - 전화번호 한번에 저장',
    description: 'PC에서 전화번호를 입력하여 vCard 파일을 생성하고, 모바일에서 바로 저장하세요.',
    type: 'website',
    locale: 'ko_KR',
  },
}
```

### 2. 구조화된 데이터
- JSON-LD 형식으로 서비스 정보 제공
- 검색 엔진 최적화

## 모니터링

### 1. Vercel Analytics
- 페이지 뷰 추적
- 성능 메트릭

### 2. Google Analytics
- 사용자 행동 분석
- 트래픽 소스 분석

## 보안

### 1. HTTPS
- 모든 트래픽 암호화
- SSL 인증서 자동 갱신

### 2. CSP (Content Security Policy)
- XSS 방지
- 신뢰할 수 있는 소스만 허용

## 문제 해결

### 1. 빌드 오류
```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install

# Next.js 캐시 삭제
rm -rf .next
npm run build
```

### 2. 배포 후 문제
- 브라우저 캐시 삭제
- 네트워크 탭에서 404 오류 확인
- 콘솔 에러 확인

### 3. 성능 문제
- Lighthouse 점수 확인
- Core Web Vitals 최적화
- 이미지 크기 최적화

## 롤백

### Vercel 롤백
1. Vercel 대시보드 접속
2. Deployments 탭에서 이전 버전 선택
3. "Promote to Production" 클릭

### Git 롤백
```bash
git log --oneline
git revert <commit-hash>
git push origin main
```
