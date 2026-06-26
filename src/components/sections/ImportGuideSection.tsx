'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, Download, Globe, AlertTriangle, Lightbulb, Smartphone } from 'lucide-react'
import { importGuides, downloadTestVCard, getPlatformName, getPlatformIcon, type Platform } from '@/lib/importGuide'
import { generateVCard, generateMultipleVCards, downloadVCard } from '@/lib/vcard'
import { generateQRCodeForDownload } from '@/lib/qrCode'
import { type Contact } from '@/lib/vcard'
import { useToast } from '@/hooks/use-toast'

interface ImportGuideSectionProps {
  contacts: Contact[]
}

export default function ImportGuideSection({ contacts }: ImportGuideSectionProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('ios')
  const { toast } = useToast()

  const handleDownloadVCard = () => {
    if (contacts.length === 0) return
    const vcard = contacts.length === 1 ? generateVCard(contacts[0]) : generateMultipleVCards(contacts)
    downloadVCard(vcard, contacts.length === 1 ? `${contacts[0].name}.vcf` : `PhoneDrop-${contacts.length}.vcf`)
  }

  const handleGenerateQR = async () => {
    if (contacts.length === 0) return
    await generateQRCodeForDownload(contacts)
    toast({ title: 'QR 코드 생성 완료', description: '연락처를 QR 코드로 만들었습니다.' } as any)
  }

  const handleDownloadTest = () => downloadTestVCard()

  const currentGuide = importGuides[selectedPlatform]

  return (
    <section className="mx-auto mb-24 max-w-5xl px-4" id="import-guide">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-teal-500">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-950">VCF 가져오기와 기기별 안내</h2>
            <p className="text-slate-500">iPhone, Android, Google 연락처에서 가져오는 방법을 한 곳에 모았습니다.</p>
          </div>
        </div>

        <div className="space-y-8">
          <Card className="border-green-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-green-600" />
                VCF 파일 생성
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="font-medium text-slate-900">현재 연락처: {contacts.length}개</p>
                <p className="mt-2 text-sm text-slate-600">
                  연락처가 있으면 바로 VCF 파일과 QR 코드를 만들 수 있습니다.
                </p>
              </div>
              <div className="space-y-2">
                <Button onClick={handleDownloadVCard} disabled={contacts.length === 0} className="w-full bg-green-600 text-white hover:bg-green-700">
                  VCF 파일 다운로드
                </Button>
                <Button onClick={handleGenerateQR} disabled={contacts.length === 0} className="w-full">
                  <Smartphone className="mr-2 h-4 w-4" />
                  QR 코드 생성
                </Button>
              </div>
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 md:col-span-2">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-blue-900">테스트 파일</p>
                    <p className="text-sm text-blue-700">샘플 연락처 3개로 가져오기 흐름을 먼저 확인해 보세요.</p>
                  </div>
                  <Button variant="outline" onClick={handleDownloadTest}>
                    테스트 다운로드
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                플랫폼별 가져오기
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedPlatform} onValueChange={(value) => setSelectedPlatform(value as Platform)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="ios">iPhone/iPad</TabsTrigger>
                  <TabsTrigger value="android">Android</TabsTrigger>
                  <TabsTrigger value="web">Google 연락처</TabsTrigger>
                </TabsList>

                <TabsContent value={selectedPlatform} className="mt-6 space-y-6">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">{getPlatformName(selectedPlatform)}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {selectedPlatform === 'ios' && '파일 앱에서 VCF를 열어 연락처 앱으로 가져옵니다.'}
                      {selectedPlatform === 'android' && '연락처 앱의 가져오기 기능으로 VCF를 불러옵니다.'}
                      {selectedPlatform === 'web' && 'Google 연락처에서 가져오기 기능을 사용합니다.'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {currentGuide.steps.map((step, index) => (
                      <div key={step.id} className="flex gap-4 rounded-xl border border-slate-200 p-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-800">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-slate-950">{step.title}</h3>
                          <p className="text-sm text-slate-600">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {currentGuide.tips.length > 0 && (
                    <div>
                      <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-950">
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        자주 쓰는 팁
                      </h4>
                      <div className="grid gap-3 md:grid-cols-2">
                        {currentGuide.tips.map((tip, index) => (
                          <div key={index} className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
                            {tip}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentGuide.commonIssues.length > 0 && (
                    <div>
                      <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-950">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        문제 해결
                      </h4>
                      <div className="space-y-3">
                        {currentGuide.commonIssues.map((issue, index) => (
                          <div key={index} className="rounded-lg border border-slate-200 p-3">
                            <div className="font-medium text-red-700">문제: {issue.issue}</div>
                            <div className="text-sm text-green-700">해결: {issue.solution}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="border-green-100 bg-gradient-to-br from-green-50 to-teal-50">
            <CardContent className="p-6">
              <h3 className="mb-3 font-semibold text-green-900">이 섹션이 제공하는 정보</h3>
              <div className="grid gap-3 md:grid-cols-2 text-sm text-green-800">
                <div>· 테스트 파일로 먼저 저장 흐름을 확인</div>
                <div>· 기기별 가져오기 방법을 빠르게 선택</div>
                <div>· FAQ와 정책 페이지로 이어지는 내부 링크 제공</div>
                <div>· 문제 해결 정보로 오류 원인을 좁힘</div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-3 text-sm">
            <Link className="text-green-700 hover:underline" href="/guide">가이드 전체 보기</Link>
            <Link className="text-green-700 hover:underline" href="/faq">FAQ 보기</Link>
            <Link className="text-green-700 hover:underline" href="/privacy">개인정보처리방침</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
