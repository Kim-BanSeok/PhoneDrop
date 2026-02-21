import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PhoneDrop - 연락처 vCard 생성기',
  description: 'PC에서 연락처를 스마트하게 입력하고 QR 코드로 공유하세요. 대량 연락처도 한 번에 휴대폰에 저장 가능합니다.',
  keywords: [
    '전화번호 저장',
    '연락처 저장',
    'vCard 생성',
    '주소록 동기화',
    '전화번호 대량 저장',
    '연락처 관리',
    'QR 코드 연락처',
    '모바일 주소록',
    '전화번호 정리',
    '연락처 파일 생성',
    '휴대폰 주소록',
    '연락처 백업',
    '전화번호 입력',
    'vCard 파일',
    '연락처 동기화',
    '전화번호 관리',
    '주소록 저장',
    '연락처 공유',
    '전화번호 정리 도구',
    '연락처 변환',
  ],
  openGraph: {
    title: 'PhoneDrop - 연락처 vCard 생성기',
    description: 'PC에서 연락처를 스마트하게 입력하고 QR 코드로 공유하세요. 대량 연락처도 한 번에 휴대폰에 저장 가능합니다.',
    type: 'website',
    locale: 'ko_KR',
    siteName: 'PhoneDrop',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PhoneDrop - 연락처 vCard 생성기',
    description: 'PC에서 연락처를 스마트하게 입력하고 QR 코드로 공유하세요.',
  },
  verification: {
    google: 'lSJTeWuV8EZQIBkHAfSRPQlK59uyaYjsnYH_DhIv2r4',
  },
  other: {
    'naver-site-verification': '8d0c723eeac04b6aaed0b94c2212551da61f0ae4',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'PhoneDrop',
    description: 'PC에서 연락처를 스마트하게 입력하고 QR 코드로 공유하세요. 대량 연락처도 한 번에 휴대폰에 저장 가능합니다.',
    url: 'https://phone-drop.vercel.app',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
    featureList: [
      '전화번호 대량 입력',
      'vCard 파일 생성',
      'QR 코드 공유',
      '연락처 동기화',
      '모바일 주소록 저장',
    ],
    keywords: '전화번호 저장, 연락처 저장, vCard 생성, 주소록 동기화, 전화번호 대량 저장, 연락처 관리, QR 코드 연락처, 모바일 주소록',
  }

  return (
    <html lang="ko" className="scroll-smooth">
      <head>
        <meta name="google-adsense-account" content="ca-pub-7373977880685678" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
