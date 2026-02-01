'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CreditCard, Download, QrCode, Upload, Palette, Eye, CheckCircle, Sparkles } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { generateDigitalCard, downloadDigitalCardPackage, cardTemplates, type DigitalCardOptions, type DigitalCardPackage } from '@/lib/digitalCard'
import { recommendCardDesign, generateDesignDescription } from '@/lib/aiCardDesigner'
import { type Contact } from '@/lib/vcard'
import { useToast } from '@/hooks/use-toast'

interface DigitalCardSectionProps {
  contacts: Contact[]
}

export default function DigitalCardSection({ contacts }: DigitalCardSectionProps) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState('modern') // 기본값을 modern으로 변경
  const [selectedColor, setSelectedColor] = useState('#3B82F6')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [generatedCard, setGeneratedCard] = useState<DigitalCardPackage | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiFullCard, setAiFullCard] = useState(true) // AI가 명함 전체 생성 (기본값: true)
  const { toast } = useToast()
  
  // AI 템플릿 선택 시 색상 자동 업데이트 (AI 제외)
  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template)
    // AI 템플릿이 아닌 경우에만 색상 업데이트
    if (template !== 'ai') {
      const colors = cardTemplates[template as keyof typeof cardTemplates]?.colors || ['#3B82F6']
      setSelectedColor(colors[0])
    }
  }
  
  // 연락처 선택 처리 (AI 기능 제거)
  const handleContactChange = (contactName: string) => {
    const contact = contacts.find(c => c.name === contactName)
    setSelectedContact(contact || null)
  }

  const handleGenerateCard = async () => {
    if (!selectedContact) {
      toast({
        title: "연락처 선택 필요",
        description: "명함을 생성할 연락처를 선택해주세요.",
      } as any)
      return
    }

    setIsGenerating(true)
    
    try {
      // 환경 변수에서 API 키 가져오기 (Replicate API)
      const apiKey = process.env.NEXT_PUBLIC_REPLICATE_API_KEY
      
      // 환경 변수에서 OpenAI API 키 가져오기
      const openaiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
      
      const options: DigitalCardOptions = {
        template: selectedTemplate as any,
        color: selectedColor,
        logo: logoFile ? URL.createObjectURL(logoFile) : undefined,
        includeQR: true,
        qrSize: 256,
        useAI: false, // AI 기능 완전 비활성화
        aiFullCard: false // AI 전체 생성 비활성화
      }

      const cardPackage = await generateDigitalCard(selectedContact, options)
      setGeneratedCard(cardPackage)
      
      toast({
        title: "디지털 명함 생성 완료",
        description: `${selectedContact.name}님의 명함이 생성되었습니다.`,
      } as any)
    } catch (error) {
      console.error('명함 생성 오류:', error)
      toast({
        title: "명함 생성 실패",
        description: `명함 생성 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`,
      } as any)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadPackage = () => {
    if (!generatedCard) return

    try {
      downloadDigitalCardPackage(generatedCard)
      
      toast({
        title: "패키지 다운로드",
        description: "명함 이미지, QR 코드, vCard 파일이 다운로드되었습니다.",
      } as any)
    } catch (error) {
      toast({
        title: "다운로드 실패",
        description: "다운로드 중 오류가 발생했습니다.",
      } as any)
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB 제한
        toast({
          title: "파일 크기 초과",
          description: "로고는 5MB 이하로 업로드해주세요.",
        } as any)
        return
      }
      setLogoFile(file)
    }
  }

  const getTemplatePreview = (template: string) => {
    const colors = cardTemplates[template as keyof typeof cardTemplates]?.colors || ['#3B82F6']
    return colors[0]
  }

  return (
    <section className="max-w-5xl mx-auto px-4 mb-24" id="digital-card">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">🎴 디지털 명함 생성</h2>
            <p className="text-slate-500">연락처 정보로 명함 이미지 + QR 코드 + vCard를 한 번에 생성하세요</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 설정 영역 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">연락처 선택</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedContact?.name || ''} onValueChange={handleContactChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="연락처를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {contacts.map((contact, index) => (
                      <SelectItem key={index} value={contact.name}>
                        {contact.name} ({contact.phone})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">명함 디자인</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">템플릿</Label>
                  <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(cardTemplates)
                        .filter(([key]) => key !== 'ai') // AI 템플릿 완전 제외
                        .map(([key, template]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded" 
                              style={{ backgroundColor: template.colors[0] }}
                            />
                            <div>
                              <div className="font-medium">{template.name}</div>
                              <div className="text-sm text-slate-500">{template.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedTemplate !== 'ai' && (
                  <div>
                    <Label className="text-sm font-medium">색상</Label>
                    <div className="flex gap-2 mt-2">
                      {cardTemplates[selectedTemplate as keyof typeof cardTemplates]?.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded border-2 ${
                            selectedColor === color ? 'border-slate-900' : 'border-slate-300'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {/* AI 관련 기능 완전 제거 */}

                <div>
                  <Label className="text-sm font-medium">로고 (선택사항)</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="mt-1"
                  />
                  {logoFile && (
                    <div className="mt-2 text-sm text-slate-600">
                      선택된 파일: {logoFile.name}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleGenerateCard}
              disabled={!selectedContact || isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  생성 중...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  디지털 명함 생성
                </>
              )}
            </Button>
          </div>

          {/* 미리보기 영역 */}
          <div className="space-y-6">
            {generatedCard ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    생성된 명함
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">명함 이미지</h4>
                    <img 
                      src={generatedCard.imageUrl} 
                      alt="Digital Card" 
                      className="w-full border rounded-lg shadow-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">QR 코드</h4>
                      <img 
                        src={generatedCard.qrUrl} 
                        alt="QR Code" 
                        className="w-full border rounded-lg shadow-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">정보</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <div>이름: {generatedCard.contact.name}</div>
                        <div>전화번호: {generatedCard.contact.phone}</div>
                        {generatedCard.contact.email && (
                          <div>이메일: {generatedCard.contact.email}</div>
                        )}
                        {generatedCard.contact.company && (
                          <div>회사: {generatedCard.contact.company}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleDownloadPackage}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    전체 패키지 다운로드
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-50">
                <CardContent className="p-12 text-center">
                  <CreditCard className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-lg font-medium text-slate-600 mb-2">명함 미리보기</h3>
                  <p className="text-sm text-slate-500">
                    연락처를 선택하고 템플릿을 설정하면<br/>
                    디지털 명함이 여기에 표시됩니다
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* 기능 설명 */}
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3 text-blue-900">🎯 디지털 명함의 강점</h3>
            <div className="grid md:grid-cols-2 gap-y-3 gap-x-6 text-sm text-blue-800">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0"></span>
                <span><strong>오프라인 ↔ 온라인 연결</strong>: 명함 이미지와 QR 코드로 오프라인에서도 연락처 저장</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0"></span>
                <span><strong>디자인이 아닌 연결 중심</strong>: Canva와 경쟁하지 않고 연락처 저장에 특화</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0"></span>
                <span><strong>한 번에 3가지 생성</strong>: 명함 이미지 + QR 코드 + vCard 파일</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0"></span>
                <span><strong>브랜드 로고 지원</strong>: 기업/개인 브랜딩을 위한 로고 삽입 기능</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
