import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PhoneDrop - 스마트한 연락처 저장 솔루션',
  description: 'PC에서 전화번호를 입력하거나 대량으로 정리하여 휴대폰 주소록에 바로 저장 가능한 vCard 파일을 생성해드립니다.',
  other: {
    'google-adsense-account': 'ca-pub-7373977880685678',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
