'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { User, Globe, Download, Share2, Eye, BarChart } from 'lucide-react'
import { ProfilePageService, generateProfileHTML, downloadProfileQR, shareProfileLink, type ProfilePage, type ProfilePageOptions } from '@/lib/profilePage'
import { type Contact } from '@/lib/vcard'
import { useToast } from '@/hooks/use-toast'

interface ProfilePageSectionProps {
  contacts: Contact[]
}

export default function ProfilePageSection({ contacts }: ProfilePageSectionProps) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [selectedTheme, setSelectedTheme] = useState('professional')
  const [selectedColor, setSelectedColor] = useState('#3B82F6')
  const [customMessage, setCustomMessage] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [generatedProfile, setGeneratedProfile] = useState<ProfilePage | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const themes = [
    { value: 'professional', label: '전문형', color: '#3B82F6' },
    { value: 'casual', label: '친근형', color: '#667eea' },
    { value: 'minimal', label: '미니멀', color: '#6B7280' },
    { value: 'creative', label: '크리에이티브', color: '#EC4899' },
  ]

  const handleGenerateProfile = async () => {
    if (!selectedContact) return
    setIsGenerating(true)
    try {
      const service = ProfilePageService.getInstance()
      const options: ProfilePageOptions = {
        theme: selectedTheme as any,
        color: selectedColor,
        logo: logoFile ? URL.createObjectURL(logoFile) : undefined,
        includeSocial: false,
        customMessage: customMessage || undefined,
      }
      const profile = await service.createProfilePage(selectedContact, options)
      setGeneratedProfile(profile)
      toast({ title: '프로필 페이지 생성 완료', description: `${selectedContact.name}의 프로필 페이지를 만들었습니다.` } as any)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadQR = () => {
    if (generatedProfile) downloadProfileQR(generatedProfile)
  }

  const handleShareProfile = async () => {
    if (generatedProfile) await shareProfileLink(generatedProfile)
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) setLogoFile(file)
  }

  const openProfilePreview = () => {
    if (!generatedProfile) return
    const profileHTML = generateProfileHTML(generatedProfile)
    const previewWindow = window.open('', '_blank', 'width=800,height=1000,scrollbars=yes')
    if (previewWindow) {
      previewWindow.document.write(profileHTML)
      previewWindow.document.close()
    }
  }

  return (
    <section className="mx-auto mb-24 max-w-5xl px-4" id="profile-page">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-950">개인 프로필 페이지</h2>
            <p className="text-slate-500">연락처를 중심으로 한 단일 프로필 페이지와 QR 코드를 생성합니다.</p>
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
                      <SelectItem key={contact.phone} value={contact.name}>{contact.name} ({contact.phone})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>프로필 설정</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>테마</Label>
                  <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {themes.map((theme) => (
                        <SelectItem key={theme.value} value={theme.value}>{theme.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>색상</Label>
                  <div className="mt-2 flex gap-2">
                    {themes.map((theme) => (
                      <button
                        key={theme.value}
                        onClick={() => setSelectedColor(theme.color)}
                        className={`h-8 w-8 rounded border-2 ${selectedColor === theme.color ? 'border-slate-900' : 'border-slate-300'}`}
                        style={{ backgroundColor: theme.color }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <Label>로고</Label>
                  <Input type="file" accept="image/*" onChange={handleLogoUpload} className="mt-1" />
                </div>
                <div>
                  <Label>추가 메시지</Label>
                  <Textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="프로필 페이지 상단에 넣을 메시지를 적습니다."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleGenerateProfile} disabled={!selectedContact || isGenerating} className="w-full bg-purple-600 text-white hover:bg-purple-700">
              <Eye className="mr-2 h-4 w-4" />
              프로필 페이지 생성
            </Button>
          </div>

          <div className="space-y-6">
            {generatedProfile ? (
              <>
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-green-600" />생성된 프로필</CardTitle></CardHeader>
                  <CardContent className="space-y-4 text-sm text-slate-600">
                    <div>이름: {generatedProfile.contact.name}</div>
                    <div>전화: {generatedProfile.contact.phone}</div>
                    {generatedProfile.contact.email && <div>이메일: {generatedProfile.contact.email}</div>}
                    {generatedProfile.contact.company && <div>회사: {generatedProfile.contact.company}</div>}
                    <div>URL: {generatedProfile.url}</div>
                    <img src={generatedProfile.qrUrl} alt="Profile QR Code" className="w-full rounded-lg border shadow-sm" />
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" onClick={openProfilePreview}><Eye className="mr-2 h-4 w-4" />미리보기</Button>
                      <Button variant="outline" onClick={handleDownloadQR}><Download className="mr-2 h-4 w-4" />QR 다운로드</Button>
                    </div>
                    <Button onClick={handleShareProfile} className="w-full bg-green-600 text-white hover:bg-green-700">
                      <Share2 className="mr-2 h-4 w-4" />
                      프로필 공유
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
                  <CardContent className="p-6">
                    <h3 className="mb-3 flex items-center gap-2 font-semibold text-purple-900">
                      <BarChart className="h-4 w-4" />
                      프로필 통계
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{generatedProfile.stats.views}</div>
                        <div className="text-sm text-slate-600">조회</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{generatedProfile.stats.downloads}</div>
                        <div className="text-sm text-slate-600">다운로드</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{generatedProfile.stats.shares}</div>
                        <div className="text-sm text-slate-600">공유</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-slate-50">
                <CardContent className="p-12 text-center text-slate-600">
                  <User className="mx-auto mb-4 h-16 w-16 text-slate-300" />
                  연락처를 선택하면 프로필 페이지와 QR 코드가 생성됩니다.
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Card className="mt-8 border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <h3 className="mb-3 font-semibold text-purple-900">활용 예시</h3>
            <div className="grid gap-3 md:grid-cols-2 text-sm text-purple-800">
              <div>· 개인 소개 페이지를 하나의 링크로 정리</div>
              <div>· 행사나 네트워킹 상황에서 QR로 공유</div>
              <div>· 조회와 공유 통계로 사용 여부 확인</div>
              <div>· FAQ와 정책 페이지로 사이트 신뢰도 보강</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
