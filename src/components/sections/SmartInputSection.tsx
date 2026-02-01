'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, CheckCircle, AlertTriangle, Lightbulb, Zap, Download, QrCode } from 'lucide-react'
import { smartParse, type ParsedResult } from '@/lib/smartParser'
import { generateVCard, generateMultipleVCards, downloadVCard } from '@/lib/vcard'
import { generateQRCodeForDownload } from '@/lib/qrCode'
import { useToast } from '@/hooks/use-toast'
import { type Contact } from '@/lib/vcard'

interface SmartInputSectionProps {
  onContactsUpdate?: (contacts: Contact[]) => void
}

export default function SmartInputSection({ onContactsUpdate }: SmartInputSectionProps) {
  const [inputText, setInputText] = useState('')
  const [parsedResult, setParsedResult] = useState<ParsedResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleParse = async () => {
    if (!inputText.trim()) {
      toast({
        title: "입력 필요",
        description: "연락처 정보를 입력해주세요.",
      } as any)
      return
    }

    setIsProcessing(true)
    
    try {
      const result = smartParse(inputText)
      setParsedResult(result)
      
      if (result.contacts.length > 0) {
        toast({
          title: "초지능 파싱 완료",
          description: `${result.contacts.length}개의 연락처를 인식했습니다 (신뢰도: ${result.confidence.toFixed(1)}%)`,
        } as any)
      }
    } catch (error) {
      toast({
        title: "파싱 오류",
        description: "텍스트를 파싱하는 중 오류가 발생했습니다.",
      } as any)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownloadVCard = () => {
    if (!parsedResult || parsedResult.contacts.length === 0) return

    try {
      if (parsedResult.contacts.length === 1) {
        const vcard = generateVCard(parsedResult.contacts[0])
        downloadVCard(vcard, `${parsedResult.contacts[0].name}.vcf`)
      } else {
        const vcard = generateMultipleVCards(parsedResult.contacts)
        downloadVCard(vcard, `연락처_${parsedResult.contacts.length}개.vcf`)
      }

      toast({
        title: "vCard 다운로드 완료",
        description: `${parsedResult.contacts.length}개의 연락처가 다운로드되었습니다.`,
      } as any)
    } catch (error) {
      toast({
        title: "다운로드 실패",
        description: "vCard 다운로드에 실패했습니다.",
      } as any)
    }
  }

  const handleGenerateQR = async () => {
    if (!parsedResult || parsedResult.contacts.length === 0) return

    try {
      await generateQRCodeForDownload(parsedResult.contacts)
      
      toast({
        title: "QR 코드 생성 완료",
        description: `${parsedResult.contacts.length}개의 연락처 QR 코드가 생성되었습니다.`,
      } as any)
    } catch (error) {
      toast({
        title: "QR 코드 생성 실패",
        description: "QR 코드 생성에 실패했습니다.",
      } as any)
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100 text-green-800'
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 80) return '매우 정확'
    if (confidence >= 60) return '보통'
    return '확인 필요'
  }

  return (
    <section className="max-w-5xl mx-auto px-4 mb-24" id="smart-input">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">🤖 PhoneDrop 초지능 입력기</h2>
            <p className="text-slate-500">아무거나 붙여넣어도 알아서 정리해드릴게요!</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              연락처 정보 붙여넣기
            </label>
            <Textarea
              value={inputText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputText(e.target.value)}
              placeholder="홍길동 01012345678&#10;김철수 / 010-1234-5678 / 메모: 행사&#10;01098765432(이영희)&#10;&#10;엑셀, 카톡, 메일 등에서 복사한 내용을 그대로 붙여넣으세요!&#10;(하이픈 없이 입력 가능)"
              className="min-h-[200px] border-slate-200 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <Button
            onClick={handleParse}
            disabled={isProcessing || !inputText.trim()}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                초지능 파싱 중...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                초지능 파싱 시작
              </>
            )}
          </Button>
        </div>

        {parsedResult && (
          <div className="mt-8 space-y-6">
            {/* 신뢰도 표시 */}
            <Card className="border-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold">파싱 신뢰도</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getConfidenceColor(parsedResult.confidence)}>
                      {parsedResult.confidence.toFixed(1)}% - {getConfidenceText(parsedResult.confidence)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 파싱 결과 */}
            {parsedResult.contacts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    인식된 연락처 ({parsedResult.contacts.length}개)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">이름</th>
                          <th className="text-left py-2">전화번호</th>
                          <th className="text-left py-2">이메일</th>
                          <th className="text-left py-2">회사</th>
                          <th className="text-left py-2">직책</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedResult.contacts.map((contact, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2">{contact.name}</td>
                            <td className="py-2">{contact.phone}</td>
                            <td className="py-2">{contact.email || '-'}</td>
                            <td className="py-2">{contact.company || '-'}</td>
                            <td className="py-2">{contact.title || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 오류 및 제안 */}
            {(parsedResult.errors.length > 0 || parsedResult.suggestions.length > 0) && (
              <Card className="border-yellow-100">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {parsedResult.errors.length > 0 && (
                      <div>
                        <h4 className="flex items-center gap-2 font-semibold text-red-600 mb-2">
                          <AlertTriangle className="w-4 h-4" />
                          오류 ({parsedResult.errors.length}개)
                        </h4>
                        <div className="space-y-1">
                          {parsedResult.errors.map((error, index) => (
                            <div key={index} className="text-sm text-red-600">
                              • {error}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {parsedResult.suggestions.length > 0 && (
                      <div>
                        <h4 className="flex items-center gap-2 font-semibold text-yellow-600 mb-2">
                          <Lightbulb className="w-4 h-4" />
                          수정 제안 ({parsedResult.suggestions.length}개)
                        </h4>
                        <div className="space-y-1">
                          {parsedResult.suggestions.map((suggestion, index) => (
                            <div key={index} className="text-sm text-yellow-700">
                              • {suggestion}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 액션 버튼 */}
            {parsedResult.contacts.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => {
                    if (parsedResult && parsedResult.contacts.length > 0 && onContactsUpdate) {
                      onContactsUpdate(parsedResult.contacts)
                      toast({
                        title: "연락처 추가 완료",
                        description: `${parsedResult.contacts.length}개의 연락처가 추가되었습니다. 이제 내보내기 탭에서 사용할 수 있습니다.`,
                      } as any)
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  연락처 추가하기 ({parsedResult.contacts.length}개)
                </Button>
                <Button
                  onClick={handleDownloadVCard}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  vCard 다운로드
                </Button>
                <Button
                  onClick={handleGenerateQR}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  QR 코드 생성
                </Button>
              </div>
            )}
          </div>
        )}

        {/* 사용 가이드 */}
        <Card className="mt-8 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 text-purple-900">🎯 지원 형식 (자동 감지)</h3>
            <div className="grid md:grid-cols-2 gap-y-3 gap-x-6 text-sm text-purple-800">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 shrink-0"></span>
                <span>이름 번호 (공백 구분)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 shrink-0"></span>
                <span>이름/번호/메모 (슬래시 구분)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 shrink-0"></span>
                <span>번호(이름) (괄호 구분)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 shrink-0"></span>
                <span>콤마, 탭, 세미콜론 등</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 shrink-0"></span>
                <span>카톡 복붙 형태 (줄바꿈+공백)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 shrink-0"></span>
                <span>전화번호 자동 정규화 (하이픈 없이 입력 가능)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
