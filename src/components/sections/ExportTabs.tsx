'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Download, QrCode, CreditCard, Globe, Package, AlertCircle, ArrowRight } from 'lucide-react'
import { type Contact } from '@/lib/vcard'
import ImportGuideSection from './ImportGuideSection'
import QuickTransferSection from './QuickTransferSection'
import DigitalCardSection from './DigitalCardSection'
import ProfilePageSection from './ProfilePageSection'
import ContactPackageSection from './ContactPackageSection'

interface ExportTabsProps {
  contacts: Contact[]
  onNavigateToInput?: () => void
}

export default function ExportTabs({ contacts, onNavigateToInput }: ExportTabsProps) {
  const [activeTab, setActiveTab] = useState('guide')
  
  const EmptyState = () => (
    <Card className="border-2 border-dashed border-purple-200 bg-purple-50/50">
      <CardContent className="p-12 text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">연락처가 없습니다</h3>
        <p className="text-slate-600 mb-6 max-w-md mx-auto">
          내보내기 기능을 사용하려면 먼저 연락처를 입력해야 합니다.<br />
          입력 탭에서 연락처를 추가한 후 다시 시도해주세요.
        </p>
        <Button
          onClick={() => {
            if (onNavigateToInput) {
              onNavigateToInput()
            } else {
              window.location.hash = '#input'
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          입력 탭으로 이동
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="sticky top-[8rem] z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <TabsList className="inline-flex h-12 items-center justify-start rounded-lg bg-slate-50/50 p-1 gap-1 w-full overflow-x-auto">
              <TabsTrigger 
                value="guide" 
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 sm:px-5 py-2 text-sm font-medium transition-all data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600 data-[state=active]:font-semibold data-[state=inactive]:text-slate-600 hover:bg-slate-100 flex-shrink-0"
              >
                <Download className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">가이드 & 다운로드</span>
                <span className="sm:hidden">가이드</span>
              </TabsTrigger>
              <TabsTrigger 
                value="transfer" 
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 sm:px-5 py-2 text-sm font-medium transition-all data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600 data-[state=active]:font-semibold data-[state=inactive]:text-slate-600 hover:bg-slate-100 flex-shrink-0"
              >
                <QrCode className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">빠른 전송</span>
                <span className="sm:hidden">전송</span>
              </TabsTrigger>
              <TabsTrigger 
                value="digital-card" 
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 sm:px-5 py-2 text-sm font-medium transition-all data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600 data-[state=active]:font-semibold data-[state=inactive]:text-slate-600 hover:bg-slate-100 flex-shrink-0"
              >
                <CreditCard className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">디지털 명함</span>
                <span className="sm:hidden">명함</span>
              </TabsTrigger>
              <TabsTrigger 
                value="profile" 
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 sm:px-5 py-2 text-sm font-medium transition-all data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600 data-[state=active]:font-semibold data-[state=inactive]:text-slate-600 hover:bg-slate-100 flex-shrink-0"
              >
                <Globe className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">프로필 페이지</span>
                <span className="sm:hidden">프로필</span>
              </TabsTrigger>
              <TabsTrigger 
                value="package" 
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 sm:px-5 py-2 text-sm font-medium transition-all data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600 data-[state=active]:font-semibold data-[state=inactive]:text-slate-600 hover:bg-slate-100 flex-shrink-0"
              >
                <Package className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">연락처 패키지</span>
                <span className="sm:hidden">패키지</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="guide" className="mt-0 focus-visible:outline-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            {contacts.length === 0 ? (
              <EmptyState />
            ) : (
              <ImportGuideSection contacts={contacts} />
            )}
          </div>
        </TabsContent>

        <TabsContent value="transfer" className="mt-0 focus-visible:outline-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            {contacts.length === 0 ? (
              <EmptyState />
            ) : (
              <QuickTransferSection contacts={contacts} />
            )}
          </div>
        </TabsContent>

        <TabsContent value="digital-card" className="mt-0 focus-visible:outline-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            {contacts.length === 0 ? (
              <EmptyState />
            ) : (
              <DigitalCardSection contacts={contacts} />
            )}
          </div>
        </TabsContent>

        <TabsContent value="profile" className="mt-0 focus-visible:outline-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            {contacts.length === 0 ? (
              <EmptyState />
            ) : (
              <ProfilePageSection contacts={contacts} />
            )}
          </div>
        </TabsContent>

        <TabsContent value="package" className="mt-0 focus-visible:outline-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            {contacts.length === 0 ? (
              <EmptyState />
            ) : (
              <ContactPackageSection contacts={contacts} />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
