# PhoneDrop

전화번호를 한 번에 저장하세요 - PC에서 전화번호를 입력하여 vCard 파일을 생성하고, 모바일에서 바로 저장하세요.

## 🚀 주요 기능

- **간편한 입력**: 웹에서 전화번호 정보를 직접 입력
- **대량 처리**: 여러 연락처를 한 번에 관리
- **vCard 생성**: 표준 vCard(.vcf) 파일로 다운로드
- **모바일 호환**: 모든 스마트폰에서 지원
- **실시간 검증**: 전화번호, 이메일 형식 자동 검사

## 🛠️ 기술 스택 

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Icons**: Lucide React
- **File Processing**: SheetJS (Excel), Papa Parse (CSV)
- **QR Code**: qrcode.js

## 📱 사용법

1. PC에서 PhoneDrop 웹사이트 접속
2. 전화번호 정보 입력 (이름, 전화번호 필수)
3. vCard 파일 다운로드
4. 모바일에서 파일 열어 주소록에 저장

## 🚀 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

### 빌드

```bash
npm run build
```

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   └── input.tsx
│   └── sections/
│       ├── HeroSection.tsx
│       ├── ContactForm.tsx
│       └── FeaturesSection.tsx
└── lib/
    ├── utils.ts
    └── vcard.ts
```

## 🎯 개발 로드맵

### Phase 1: 기본 구조 
- [x] 프로젝트 설정
- [x] 기본 컴포넌트 구조
- [x] vCard 생성 라이브러리

### Phase 2: MVP 개발
- [ ] 기본 vCard 생성 기능
- [ ] 실시간 유효성 검사
- [ ] 단일/다중 연락처 처리

### Phase 3: 대량 처리
- [ ] CSV 파일 업로드
- [ ] Excel 파일 업로드
- [ ] QR 코드 생성

### Phase 4: 고급 기능
- [ ] 그룹 관리
- [ ] 템플릿 기능
- [ ] 클라우드 동기화

### Phase 5: 배포 및 최적화
- [ ] 성능 최적화
- [ ] SEO 최적화
- [ ] 배포 자동화

## 📄 라이선스

MIT License
