'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Settings, Sparkles, CheckCircle, AlertTriangle } from 'lucide-react'
import { predefinedTemplates, applyNamingTemplate, validateNamingTemplate, generateTemplateExample, type NamingOptions } from '@/lib/namingTemplate'
import { type Contact } from '@/lib/vcard'
import { useToast } from '@/hooks/use-toast'

interface NamingTemplateSectionProps {
  contacts: Contact[]
  onContactsUpdate: (contacts: Contact[]) => void
}

export default function NamingTemplateSection({ contacts, onContactsUpdate }: NamingTemplateSectionProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('default')
  const [customTemplate, setCustomTemplate] = useState('')
  const [prefix, setPrefix] = useState('')
  const [suffix, setSuffix] = useState('')
  const [autoNumber, setAutoNumber] = useState(false)
  const [numberFormat, setNumberFormat] = useState<'001' | '0001' | 'A001'>('001')
  const [previewContacts, setPreviewContacts] = useState<Contact[]>([])
  const { toast } = useToast()

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId)
    
    const template = predefinedTemplates.find(t => t.id === templateId)
    if (template) {
      setCustomTemplate(template.pattern)
    }
  }

  const handleApplyTemplate = () => {
    if (contacts.length === 0) {
      toast({
        title: "연락처 필요",
        description: "먼저 연락처를 추가해주세요.",
      } as any)
      return
    }

    const template = selectedTemplate === 'custom' ? customTemplate : 
                   predefinedTemplates.find(t => t.id === selectedTemplate)?.pattern || '{name}'

    const validation = validateNamingTemplate(template)
    if (!validation.isValid) {
      toast({
        title: "템플릿 오류",
        description: validation.errors.join(', '),
      } as any)
      return
    }

    const options: NamingOptions = {
      template,
      prefix,
      suffix,
      autoNumber,
      numberFormat
    }

    const updatedContacts = applyNamingTemplate(contacts, options)
    setPreviewContacts(updatedContacts.slice(0, 3)) // 미리보기는 3개만

    toast({
      title: "템플릿 적용 완료",
      description: `${contacts.length}개의 연락처 이름이 변경되었습니다.`,
    } as any)
  }

  const handleSaveChanges = () => {
    if (previewContacts.length === 0) {
      toast({
        title: "변경사항 없음",
        description: "적용할 변경사항이 없습니다.",
      } as any)
      return
    }

    const template = selectedTemplate === 'custom' ? customTemplate : 
                   predefinedTemplates.find(t => t.id === selectedTemplate)?.pattern || '{name}'

    const options: NamingOptions = {
      template,
      prefix,
      suffix,
      autoNumber,
      numberFormat
    }

    const updatedContacts = applyNamingTemplate(contacts, options)
    onContactsUpdate(updatedContacts)

    toast({
      title: "저장 완료",
      description: `${updatedContacts.length}개의 연락처가 저장되었습니다.`,
    } as any)
  }

  const currentExample = generateTemplateExample(
    selectedTemplate === 'custom' ? customTemplate : 
    predefinedTemplates.find(t => t.id === selectedTemplate)?.pattern || '{name}'
  )

  return (
    <section className="max-w-5xl mx-auto px-4 mb-24" id="naming-template">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">🏷️ 연락처 이름 자동 생성 규칙</h2>
            <p className="text-slate-500">PhoneDrop만의 규칙으로 이름을 자동 생성하고 정규화하세요</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 설정 영역 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">템플릿 선택</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="템플릿을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {predefinedTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        <div>
                          <div className="font-medium">{template.name}</div>
                          <div className="text-sm text-slate-500">{template.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedTemplate === 'custom' && (
                  <div>
                    <Label className="text-sm font-medium">사용자 정의 템플릿</Label>
                    <Textarea
                      value={customTemplate}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCustomTemplate(e.target.value)}
                      placeholder="{prefix} {name} {suffix}"
                      className="mt-2"
                    />
                    <div className="text-xs text-slate-500 mt-1">
                      사용 가능한 변수: {'{name}'}, {'{phone}'}, {'{email}'}, {'{company}'}, {'{title}'}, {'{memo}'}, {'{prefix}'}, {'{suffix}'}, {'{number}'}, {'{department}'}, {'{phone_last4}'}
                    </div>
                  </div>
                )}

                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="text-sm font-medium mb-1">예시 결과:</div>
                  <div className="text-sm text-slate-700">{currentExample}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">추가 옵션</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="prefix" className="text-sm font-medium">접두어</Label>
                  <Input
                    id="prefix"
                    value={prefix}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrefix(e.target.value)}
                    placeholder="2026세미나"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="suffix" className="text-sm font-medium">접미어</Label>
                  <Input
                    id="suffix"
                    value={suffix}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSuffix(e.target.value)}
                    placeholder="참가자"
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-number" className="text-sm font-medium">자동 번호</Label>
                  <Switch
                    id="auto-number"
                    checked={autoNumber}
                    onCheckedChange={setAutoNumber}
                  />
                </div>

                {autoNumber && (
                  <div>
                    <Label className="text-sm font-medium">번호 형식</Label>
                    <Select value={numberFormat} onValueChange={(value: '001' | '0001' | 'A001') => setNumberFormat(value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="001">001, 002, 003...</SelectItem>
                        <SelectItem value="0001">0001, 0002, 0003...</SelectItem>
                        <SelectItem value="A001">A001, A002, A003...</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 미리보기 영역 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  미리보기
                </CardTitle>
              </CardHeader>
              <CardContent>
                {previewContacts.length > 0 ? (
                  <div className="space-y-3">
                    {previewContacts.map((contact, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">변경됨</Badge>
                          <div className="text-sm text-slate-500">#{index + 1}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="font-medium">{contact.name}</div>
                          <div className="text-sm text-slate-600">{contact.phone}</div>
                          {contact.email && (
                            <div className="text-sm text-slate-500">{contact.email}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Settings className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <div>템플릿을 적용하면 미리보기가 표시됩니다</div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                onClick={handleApplyTemplate}
                disabled={contacts.length === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                템플릿 적용
              </Button>
              <Button
                onClick={handleSaveChanges}
                disabled={previewContacts.length === 0}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                변경사항 저장
              </Button>
            </div>

            {/* 템플릿 가이드 */}
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3 text-blue-900">🎯 템플릿 활용 팁</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0"></span>
                    <span><strong>[행사명] 이름</strong> 형식으로 행사 참가자 관리</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0"></span>
                    <span><strong>회사-부서-이름</strong>으로 조직 구조 유지</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0"></span>
                    <span><strong>미지정-번호</strong>로 정보 없는 연락처 관리</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0"></span>
                    <span>접두어/접미어로 연락처 출처 표시</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
