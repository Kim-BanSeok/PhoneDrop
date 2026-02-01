'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Home, FileInput, Settings, Share2 } from 'lucide-react'
import { type Contact } from '@/lib/vcard'

// 섹션 컴포넌트들
import HeroSection from './HeroSection'
import FeaturesSection from './FeaturesSection'
import WhyPhoneDropSection from './WhyPhoneDropSection'
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

  // URL hash를 확인하여 초기 탭 설정
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash && ['home', 'input', 'manage', 'export'].includes(hash)) {
      setActiveTab(hash)
    }
  }, [])

  // 탭 변경 시 스크롤을 상단으로 이동
  const handleTabChange = (value: string) => {
    if (value) {
      setActiveTab(value)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      // URL hash 업데이트
      window.history.replaceState(null, '', `#${value}`)
    }
  }

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <div className="fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TabsList className="inline-flex h-14 items-center justify-start rounded-lg bg-slate-50/50 p-1 gap-1 w-full overflow-x-auto">
            <TabsTrigger 
              value="home" 
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 sm:px-6 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:font-semibold data-[state=inactive]:text-slate-600 hover:bg-slate-100 flex-shrink-0"
            >
              <Home className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">홈</span>
            </TabsTrigger>
            <TabsTrigger 
              value="input" 
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 sm:px-6 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:font-semibold data-[state=inactive]:text-slate-600 hover:bg-slate-100 flex-shrink-0"
            >
              <FileInput className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">입력</span>
            </TabsTrigger>
            <TabsTrigger 
              value="manage" 
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 sm:px-6 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:font-semibold data-[state=inactive]:text-slate-600 hover:bg-slate-100 flex-shrink-0"
            >
              <Settings className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">관리</span>
            </TabsTrigger>
            <TabsTrigger 
              value="export" 
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 sm:px-6 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:font-semibold data-[state=inactive]:text-slate-600 hover:bg-slate-100 flex-shrink-0"
            >
              <Share2 className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">내보내기</span>
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      <TabsContent value="home" className="mt-0 focus-visible:outline-none pt-[4.5rem]">
        <div className="space-y-0 min-h-[calc(100vh-8rem)]">
          <HeroSection onNavigateToInput={() => handleTabChange('input')} />
          <FeaturesSection />
          <WhyPhoneDropSection />
        </div>
      </TabsContent>

      <TabsContent value="input" className="mt-0 focus-visible:outline-none pt-[4.5rem]">
        <div className="space-y-0 min-h-[calc(100vh-8rem)]">
          <div className="pt-24 pb-12 bg-gradient-to-b from-blue-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 text-center">
                연락처 입력
              </h2>
              <p className="text-lg text-slate-600 text-center max-w-2xl mx-auto">
                다양한 방법으로 연락처를 입력하고 관리하세요
              </p>
            </div>
          </div>
          <SmartInputSection onContactsUpdate={onContactsUpdate} />
          <BulkUploadSection onContactsUpdate={onContactsUpdate} />
          <ManualEntrySection onContactsUpdate={onContactsUpdate} />
        </div>
      </TabsContent>

      <TabsContent value="manage" className="mt-0 focus-visible:outline-none pt-[4.5rem]">
        <div className="space-y-0 min-h-[calc(100vh-8rem)]">
          <div className="pt-24 pb-12 bg-gradient-to-b from-green-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 text-center">
                연락처 관리
              </h2>
              <p className="text-lg text-slate-600 text-center max-w-2xl mx-auto">
                연락처를 정리하고 최적화하세요
              </p>
            </div>
          </div>
          <NamingTemplateSection contacts={contacts} onContactsUpdate={onContactsUpdate} />
          <DuplicateHandlerSection contacts={contacts} onContactsUpdate={onContactsUpdate} />
          <ErrorFixerSection contacts={contacts} onContactsUpdate={onContactsUpdate} />
        </div>
      </TabsContent>

      <TabsContent value="export" className="mt-0 focus-visible:outline-none pt-[4.5rem]">
        <div className="space-y-0 min-h-[calc(100vh-8rem)]">
          <div className="pt-24 pb-8 bg-gradient-to-b from-purple-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 text-center">
                내보내기 및 공유
              </h2>
              <p className="text-lg text-slate-600 text-center max-w-2xl mx-auto">
                연락처를 다양한 형식으로 내보내고 공유하세요
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
