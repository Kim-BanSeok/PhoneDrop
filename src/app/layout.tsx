import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://phone-drop.vercel.app'),
  title: 'PhoneDrop | 연락처 정리와 vCard 생성 도구',
  description:
    '연락처를 빠르게 정리하고 vCard(.vcf) 파일과 QR 코드로 내보내는 무료 웹 도구입니다. 대량 입력, 중복 정리, 입력 오류 수정을 지원합니다.',
  keywords: [
    '연락처 정리',
    'vCard 생성',
    'VCF 파일',
    'QR 코드 연락처',
    'CSV 연락처 가져오기',
    'Excel 연락처 변환',
    '휴대폰 주소록',
    '연락처 중복 제거',
    '연락처 관리',
    'PhoneDrop',
  ],
  openGraph: {
    title: 'PhoneDrop | 연락처를 빠르게 정리하세요',
    description:
      'PC에서 입력한 연락처를 정리해 vCard 파일, QR 코드, 공유용 링크로 내보내는 도구입니다.',
    type: 'website',
    locale: 'ko_KR',
    siteName: 'PhoneDrop',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PhoneDrop | 연락처 정리 도구',
    description:
      '연락처 입력, 중복 정리, vCard 생성, QR 코드 내보내기를 한 곳에서 처리합니다.',
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
    description:
      '연락처를 정리하고 vCard 파일로 내보내는 웹 애플리케이션입니다.',
    url: 'https://phone-drop.vercel.app',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
    featureList: [
      '연락처 입력',
      'CSV 및 Excel 가져오기',
      '중복 연락처 정리',
      'vCard 파일 생성',
      'QR 코드 내보내기',
    ],
    inLanguage: 'ko-KR',
  }

  return (
    <html lang="ko" className="scroll-smooth">
      <head>
        <meta name="google-adsense-account" content="ca-pub-7373977880685678" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7373977880685678"
          crossOrigin="anonymous"
        />
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
