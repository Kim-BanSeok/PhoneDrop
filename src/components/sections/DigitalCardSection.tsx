'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CreditCard, Download, Eye, CheckCircle, Sparkles } from 'lucide-react'
import { generateDigitalCard, downloadDigitalCardPackage, cardTemplates, type DigitalCardOptions, type DigitalCardPackage } from '@/lib/digitalCard'
import { type Contact } from '@/lib/vcard'
import { useToast } from '@/hooks/use-toast'

interface DigitalCardSectionProps {
  contacts: Contact[]
}

export default function DigitalCardSection({ contacts }: DigitalCardSectionProps) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [selectedColor, setSelectedColor] = useState('#3B82F6')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [generatedCard, setGeneratedCard] = useState<DigitalCardPackage | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template)
    const colors = cardTemplates[template as keyof typeof cardTemplates]?.colors || ['#3B82F6']
    setSelectedColor(colors[0])
  }

  const handleGenerateCard = async () => {
    if (!selectedContact) return
    setIsGenerating(true)
    try {
      const options: DigitalCardOptions = {
        template: selectedTemplate as any,
        color: selectedColor,
        logo: logoFile ? URL.createObjectURL(logoFile) : undefined,
        includeQR: true,
        qrSize: 256,
        useAI: false,
        aiFullCard: false,
      }
      const cardPackage = await generateDigitalCard(selectedContact, options)
      setGeneratedCard(cardPackage)
      toast({ title: '디지털 명함 생성 완료', description: `${selectedContact.name}의 명함을 만들었습니다.` } as any)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadPackage = () => {
    if (!generatedCard) return
    downloadDigitalCardPackage(generatedCard)
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) setLogoFile(file)
  }

  return (
    <section className="mx-auto mb-24 max-w-5xl px-4" id="digital-card">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-950">디지털 명함 만들기</h2>
            <p className="text-slate-500">연락처를 이미지, QR 코드, vCard 패키지로 한 번에 내보냅니다.</p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>연락처 선택</CardTitle></CardHeader>
              <CardContent>
                <Select value={selectedContact?.name || ''} onValueChange={(value) => setSelectedContact(contacts.find(c => c.name === value) || null)}>
                  <SelectTrigger><SelectValue placeholder="연락처를 선택하세요" /></SelectTrigger>
                  <SelectContent>
                    {contacts.map((contact) => (
                      <SelectItem key={contact.phone} value={contact.name}>
                        {contact.name} ({contact.phone})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>디자인 설정</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>템플릿</Label>
                  <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(cardTemplates)
                        .filter(([key]) => key !== 'ai')
                        .map(([key, template]) => (
                          <SelectItem key={key} value={key}>
                            {template.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>색상</Label>
                  <div className="mt-2 flex gap-2">
                    {cardTemplates[selectedTemplate as keyof typeof cardTemplates]?.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`h-8 w-8 rounded border-2 ${selectedColor === color ? 'border-slate-900' : 'border-slate-300'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label>로고(선택)</Label>
                  <Input type="file" accept="image/*" onChange={handleLogoUpload} className="mt-1" />
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleGenerateCard} disabled={!selectedContact || isGenerating} className="w-full bg-blue-600 text-white hover:bg-blue-700">
              <Eye className="mr-2 h-4 w-4" />
              명함 생성
            </Button>
          </div>

          <div className="space-y-6">
            {generatedCard ? (
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-600" />생성 결과</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <img src={generatedCard.imageUrl} alt="Digital Card" className="w-full rounded-lg border shadow-sm" />
                  <div className="grid grid-cols-2 gap-4">
                    <img src={generatedCard.qrUrl} alt="QR Code" className="w-full rounded-lg border shadow-sm" />
                    <div className="text-sm text-slate-600">
                      <div className="font-medium text-slate-900">연락처</div>
                      <div>이름: {generatedCard.contact.name}</div>
                      <div>전화: {generatedCard.contact.phone}</div>
                      {generatedCard.contact.email && <div>이메일: {generatedCard.contact.email}</div>}
                      {generatedCard.contact.company && <div>회사: {generatedCard.contact.company}</div>}
                    </div>
                  </div>
                  <Button onClick={handleDownloadPackage} className="w-full bg-green-600 text-white hover:bg-green-700">
                    <Download className="mr-2 h-4 w-4" />
                    패키지 다운로드
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-50">
                <CardContent className="p-12 text-center text-slate-600">
                  <CreditCard className="mx-auto mb-4 h-16 w-16 text-slate-300" />
                  연락처를 선택하고 템플릿을 정하면 디지털 명함 미리보기가 표시됩니다.
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Card className="mt-8 border-blue-100 bg-gradient-to-br from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <h3 className="mb-3 font-semibold text-blue-900">활용 예시</h3>
            <div className="grid gap-3 md:grid-cols-2 text-sm text-blue-800">
              <div>· 행사 참가자에게 명함 이미지를 빠르게 제공</div>
              <div>· 웹 링크 없이 QR만으로 명함 공유</div>
              <div>· 브랜드 색상과 로고로 간단한 개인 브랜딩</div>
              <div>· vCard와 함께 모바일 저장까지 연결</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
