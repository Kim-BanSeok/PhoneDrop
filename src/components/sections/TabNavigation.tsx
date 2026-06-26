'use client'

import { useEffect, useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { FileInput, Home, Settings, Share2 } from 'lucide-react'
import { type Contact } from '@/lib/vcard'

import HeroSection from './HeroSection'
import FeaturesSection from './FeaturesSection'
import WhyPhoneDropSection from './WhyPhoneDropSection'
import ContentHubSection from './ContentHubSection'
import SmartInputSection from './SmartInputSection'
import BulkUploadSection from './BulkUploadSection'
import ManualEntrySection from './ManualEntrySection'
import NamingTemplateSection from './NamingTemplateSection'
import DuplicateHandlerSection from './DuplicateHandlerSection'
import ErrorFixerSection from './ErrorFixerSection'
import ExportTabs from './ExportTabs'

interface TabNavigationProps {
  contacts: Contact[]
  onContactsUpdate: (contacts: Contact[]) => void
}

export default function TabNavigation({ contacts, onContactsUpdate }: TabNavigationProps) {
  const [activeTab, setActiveTab] = useState('home')

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash && ['home', 'input', 'manage', 'export'].includes(hash)) {
      setActiveTab(hash)
    }
  }, [])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    window.history.replaceState(null, '', `#${value}`)
  }

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="fixed left-0 right-0 top-16 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <TabsList className="inline-flex h-14 w-full items-center justify-start gap-1 overflow-x-auto rounded-lg bg-slate-50/50 p-1">
              <TabsTrigger
                value="home"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-slate-100 data-[state=active]:bg-blue-50 data-[state=active]:font-semibold data-[state=active]:text-blue-600 data-[state=inactive]:text-slate-600"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">홈</span>
              </TabsTrigger>
              <TabsTrigger
                value="input"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-slate-100 data-[state=active]:bg-blue-50 data-[state=active]:font-semibold data-[state=active]:text-blue-600 data-[state=inactive]:text-slate-600"
              >
                <FileInput className="h-4 w-4" />
                <span className="hidden sm:inline">입력</span>
              </TabsTrigger>
              <TabsTrigger
                value="manage"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-slate-100 data-[state=active]:bg-blue-50 data-[state=active]:font-semibold data-[state=active]:text-blue-600 data-[state=inactive]:text-slate-600"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">정리</span>
              </TabsTrigger>
              <TabsTrigger
                value="export"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all hover:bg-slate-100 data-[state=active]:bg-blue-50 data-[state=active]:font-semibold data-[state=active]:text-blue-600 data-[state=inactive]:text-slate-600"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">내보내기</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="home" className="mt-0 pt-[4.5rem] focus-visible:outline-none">
          <div className="min-h-[calc(100vh-8rem)] space-y-0">
            <HeroSection onNavigateToInput={() => handleTabChange('input')} />
            <FeaturesSection />
            <WhyPhoneDropSection />
            <ContentHubSection />
          </div>
        </TabsContent>

        <TabsContent value="input" className="mt-0 pt-[4.5rem] focus-visible:outline-none">
          <div className="min-h-[calc(100vh-8rem)] space-y-0">
            <div className="bg-gradient-to-b from-blue-50 to-white pt-24 pb-12">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950 mb-4">연락처 입력</h2>
                <p className="mx-auto max-w-2xl text-lg text-slate-600">
                  텍스트 붙여넣기, 파일 가져오기, 직접 입력 중 원하는 방식을 선택해 연락처를 채워 넣을 수 있습니다.
                </p>
              </div>
            </div>
            <SmartInputSection onContactsUpdate={onContactsUpdate} />
            <BulkUploadSection onContactsUpdate={onContactsUpdate} />
            <ManualEntrySection onContactsUpdate={onContactsUpdate} />
          </div>
        </TabsContent>

        <TabsContent value="manage" className="mt-0 pt-[4.5rem] focus-visible:outline-none">
          <div className="min-h-[calc(100vh-8rem)] space-y-0">
            <div className="bg-gradient-to-b from-emerald-50 to-white pt-24 pb-12">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950 mb-4">연락처 정리</h2>
                <p className="mx-auto max-w-2xl text-lg text-slate-600">
                  입력한 연락처를 검사하고, 중복을 줄이고, 출력하기 좋은 형식으로 다듬을 수 있습니다.
                </p>
              </div>
            </div>
            <NamingTemplateSection contacts={contacts} onContactsUpdate={onContactsUpdate} />
            <DuplicateHandlerSection contacts={contacts} onContactsUpdate={onContactsUpdate} />
            <ErrorFixerSection contacts={contacts} onContactsUpdate={onContactsUpdate} />
          </div>
        </TabsContent>

        <TabsContent value="export" className="mt-0 pt-[4.5rem] focus-visible:outline-none">
          <div className="min-h-[calc(100vh-8rem)] space-y-0">
            <div className="bg-gradient-to-b from-violet-50 to-white pt-24 pb-8">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950 mb-4">내보내기와 공유</h2>
                <p className="mx-auto max-w-2xl text-lg text-slate-600">
                  정리한 연락처를 vCard, QR 코드, 공유용 포맷으로 바꾸어 다른 기기에서 바로 사용할 수 있습니다.
                </p>
              </div>
            </div>
            <ExportTabs contacts={contacts} onNavigateToInput={() => handleTabChange('input')} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
