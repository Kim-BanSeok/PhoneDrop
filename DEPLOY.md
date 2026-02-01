# PhoneDrop Vercel 배포 가이드

## 🚀 Vercel 배포 방법

### 방법 1: 웹 대시보드 (추천)

1. **Vercel 대시보드 접속**
   - [vercel.com](https://vercel.com) 접속
   - GitHub 계정으로 로그인

2. **새 프로젝트 생성**
   - "New Project" 클릭
   - GitHub 리포지토리 선택 (`Kim-BanSeok/PhoneDrop`)
   - "Import" 클릭

3. **빌드 설정 확인**
   ```
   Framework: Next.js
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **환경 변수 설정**
   - Environment Variables 섹션에서 추가
   - `NEXT_PUBLIC_APP_URL`: 배포된 URL 입력

5. **배포 시작**
   - "Deploy" 클릭
   - 2-3분 후 배포 완료

### 방법 2: Vercel CLI

1. **Vercel CLI 설치**
   ```bash
   npm install -g vercel
   ```

2. **로그인**
   ```bash
   vercel login
   ```

3. **배포**
   ```bash
   vercel --prod
   ```

## 📋 배포 전 체크리스트

- [ ] GitHub에 최신 코드 푸시
- [ ] `package.json` 빌드 스크립트 확인
- [ ] `vercel.json` 설정 확인
- [ ] 환경 변수 준비
- [ ] 도메인 설정 (선택사항)

## 🔧 배포 후 설정

### 1. 도메인 연결
- Vercel 대시보드 → Settings → Domains
- 커스텀 도메인 추가
- DNS 설정 안내 따르기

### 2. 환경 변수 설정
```env
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 3. 성능 최적화
- 이미지 최적화 확인
- 캐시 설정 확인
- 빌드 시간 모니터링

## 🚨 문제 해결

### 빌드 실패 시
1. `npm run build` 로컬에서 테스트
2. Node.js 버전 확인 (18+ 권장)
3. 의존성 설치 확인

### 배포 후 오류 시
1. Vercel 로그 확인
2. 환경 변수 확인
3. 브라우저 콘솔 확인

## 📊 배포 확인

### 배포 성공 확인
- [ ] 사이트 접속 가능
- [ ] 모든 페이지 정상 작동
- [ ] 모바일 반응형 확인
- [ ] 성능 점수 확인

### 성능 모니터링
- Vercel Analytics
- Google PageSpeed Insights
- Lighthouse 점수 확인

## 🎯 최적화 팁

1. **이미지 최적화**
   - Next.js Image 컴포넌트 사용
   - WebP 형식 사용
   - 적절한 크기로 리사이징

2. **코드 분할**
   - 동적 import 사용
   - 페이지별 코드 분할

3. **캐시 전략**
   - 정적 자원 캐싱
   - API 응답 캐싱

## 📞 지원

- Vercel 공식 문서: [vercel.com/docs](https://vercel.com/docs)
- Next.js 배포 가이드: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- GitHub Issues: 프로젝트 리포지토리
