'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, Download, Smartphone, Monitor, Globe, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react'
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
    if (contacts.length === 0) {
      toast({
        title: "연락처 필요",
        description: "먼저 연락처를 추가해주세요.",
      } as any)
      return
    }

    try {
      if (contacts.length === 1) {
        const vcard = generateVCard(contacts[0])
        downloadVCard(vcard, `${contacts[0].name}.vcf`)
      } else {
        const vcard = generateMultipleVCards(contacts)
        downloadVCard(vcard, `연락처_${contacts.length}개.vcf`)
      }

      toast({
        title: "VCF 다운로드 완료",
        description: `${contacts.length}개의 연락처 VCF 파일이 다운로드되었습니다.`,
      } as any)
    } catch (error) {
      toast({
        title: "다운로드 실패",
        description: "VCF 파일 다운로드에 실패했습니다.",
      } as any)
    }
  }

  const handleGenerateQR = async () => {
    if (contacts.length === 0) {
      toast({
        title: "연락처 필요",
        description: "먼저 연락처를 추가해주세요.",
      } as any)
      return
    }

    try {
      await generateQRCodeForDownload(contacts)
      
      toast({
        title: "QR 코드 생성 완료",
        description: `${contacts.length}개의 연락처 QR 코드가 생성되었습니다.`,
      } as any)
    } catch (error) {
      toast({
        title: "QR 코드 생성 실패",
        description: "QR 코드 생성에 실패했습니다.",
      } as any)
    }
  }

  const handleDownloadTest = () => {
    try {
      downloadTestVCard()
      
      toast({
        title: "테스트 파일 다운로드",
        description: "3개의 테스트 연락처 VCF 파일이 다운로드되었습니다.",
      } as any)
    } catch (error) {
      toast({
        title: "테스트 파일 다운로드 실패",
        description: "테스트 파일 다운로드에 실패했습니다.",
      } as any)
    }
  }

  const currentGuide = importGuides[selectedPlatform]

  return (
    <section className="max-w-5xl mx-auto px-4 mb-24" id="import-guide">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">📱 VCF 미리보기 + Import 가이드</h2>
            <p className="text-slate-500">OS별 구체적인 Import 가이드와 테스트 기능으로 완주율을 높이세요</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* VCF 다운로드 영역 */}
          <Card className="border-green-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-green-600" />
                VCF 파일 생성
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">현재 연락처 ({contacts.length}개)</h4>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-sm text-slate-600">
                      {contacts.length > 0 ? (
                        <div>
                          <div>• 첫 번째: {contacts[0]?.name} ({contacts[0]?.phone})</div>
                          {contacts.length > 1 && <div>• 마지막: {contacts[contacts.length - 1]?.name} ({contacts[contacts.length - 1]?.phone})</div>}
                        </div>
                      ) : (
                        <div>연락처가 없습니다</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">다운로드 옵션</h4>
                  <div className="space-y-2">
                    <Button
                      onClick={handleDownloadVCard}
                      disabled={contacts.length === 0}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      VCF 파일 다운로드
                    </Button>
                    <Button
                      onClick={handleGenerateQR}
                      disabled={contacts.length === 0}
                      className="w-full"
                    >
                      <Smartphone className="w-4 h-4 mr-2" />
                      QR 코드 생성
                    </Button>
                  </div>
                </div>
              </div>

              {/* 테스트 다운로드 */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-900">테스트용 3개 다운로드</h4>
                    <p className="text-sm text-blue-700">먼저 성공 경험을 해보세요!</p>
                  </div>
                  <Button
                    onClick={handleDownloadTest}
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    테스트 다운로드
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 플랫폼별 가이드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                플랫폼별 Import 가이드
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedPlatform} onValueChange={(value: string) => setSelectedPlatform(value as Platform)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="ios" className="flex items-center gap-2">
                    <span>🍎</span>
                    iPhone/iPad
                  </TabsTrigger>
                  <TabsTrigger value="android" className="flex items-center gap-2">
                    <span>🤖</span>
                    안드로이드
                  </TabsTrigger>
                  <TabsTrigger value="web" className="flex items-center gap-2">
                    <span>🌐</span>
                    Google 웹
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={selectedPlatform} className="mt-6">
                  <div className="space-y-6">
                    {/* 플랫폼 정보 */}
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                      <span className="text-2xl">{getPlatformIcon(selectedPlatform)}</span>
                      <div>
                        <h3 className="font-semibold">{getPlatformName(selectedPlatform)}</h3>
                        <p className="text-sm text-slate-600">
                          {selectedPlatform === 'ios' && '파일 앱을 통한 VCF 가져오기'}
                          {selectedPlatform === 'android' && '연락처 앱 설정에서 가져오기'}
                          {selectedPlatform === 'web' && 'Google 연락처 웹사이트에서 가져오기'}
                        </p>
                      </div>
                    </div>

                    {/* 단계별 가이드 */}
                    <div className="space-y-4">
                      <h4 className="font-semibold">단계별 가이드</h4>
                      {currentGuide.steps.map((step, index) => (
                        <div key={step.id} className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-800 rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium">{step.title}</h5>
                            <p className="text-sm text-slate-600 mb-2">{step.description}</p>
                            {step.tips && step.tips.length > 0 && (
                              <div className="text-xs text-blue-700 bg-blue-50 p-2 rounded">
                                <div className="font-medium mb-1">💡 팁:</div>
                                {step.tips.map((tip, tipIndex) => (
                                  <div key={tipIndex}>• {tip}</div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 일반 팁 */}
                    {currentGuide.tips.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-yellow-500" />
                          유용한 팁
                        </h4>
                        <div className="grid md:grid-cols-2 gap-3">
                          {currentGuide.tips.map((tip, index) => (
                            <div key={index} className="flex items-start gap-2 text-sm text-slate-700">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                              <span>{tip}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 문제 해결 */}
                    {currentGuide.commonIssues.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                          문제 해결
                        </h4>
                        <div className="space-y-3">
                          {currentGuide.commonIssues.map((issue, index) => (
                            <div key={index} className="border rounded-lg p-3">
                              <div className="font-medium text-red-700 mb-1">❓ {issue.issue}</div>
                              <div className="text-sm text-green-700">✅ {issue.solution}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* 완주율 향상 팁 */}
          <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-100">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3 text-green-900">🎯 완주율 향상 전략</h3>
              <div className="grid md:grid-cols-2 gap-y-3 gap-x-6 text-sm text-green-800">
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 shrink-0"></span>
                  <span>테스트용 3개로 먼저 성공 경험 제공</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 shrink-0"></span>
                  <span>OS별 맞춤 가이드로 이탈 방지</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 shrink-0"></span>
                  <span>문제 해결 가이드로 장벽 제거</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 shrink-0"></span>
                  <span>QR 코드로 PC→모바일 전송 간소화</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
