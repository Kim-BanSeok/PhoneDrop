'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { User, Globe, Download, Share2, Eye, BarChart, Upload } from 'lucide-react'
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
    { value: 'professional', label: '프로페셔널', color: '#3B82F6' },
    { value: 'casual', label: '캐주얼', color: '#667eea' },
    { value: 'minimal', label: '미니멀', color: '#6B7280' },
    { value: 'creative', label: '크리에이티브', color: '#EC4899' }
  ]

  const handleGenerateProfile = async () => {
    if (!selectedContact) {
      toast({
        title: "연락처 선택 필요",
        description: "프로필을 생성할 연락처를 선택해주세요.",
      } as any)
      return
    }

    setIsGenerating(true)
    
    try {
      const service = ProfilePageService.getInstance()
      const options: ProfilePageOptions = {
        theme: selectedTheme as any,
        color: selectedColor,
        logo: logoFile ? URL.createObjectURL(logoFile) : undefined,
        includeSocial: false,
        customMessage: customMessage || undefined
      }

      const profile = await service.createProfilePage(selectedContact, options)
      setGeneratedProfile(profile)
      
      toast({
        title: "프로필 페이지 생성 완료",
        description: `${selectedContact.name}님의 미니 프로필이 생성되었습니다.`,
      } as any)
    } catch (error) {
      toast({
        title: "프로필 생성 실패",
        description: "프로필 생성 중 오류가 발생했습니다.",
      } as any)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadQR = () => {
    if (!generatedProfile) return

    try {
      downloadProfileQR(generatedProfile)
      
      toast({
        title: "QR 코드 다운로드",
        description: "프로필 QR 코드가 다운로드되었습니다.",
      } as any)
    } catch (error) {
      toast({
        title: "QR 코드 다운로드 실패",
        description: "QR 코드 다운로드에 실패했습니다.",
      } as any)
    }
  }

  const handleShareProfile = async () => {
    if (!generatedProfile) return

    try {
      await shareProfileLink(generatedProfile)
      
      toast({
        title: "프로필 공유",
        description: "프로필 링크가 공유되었습니다.",
      } as any)
    } catch (error) {
      toast({
        title: "프로필 공유 실패",
        description: "프로필 공유에 실패했습니다.",
      } as any)
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB 제한
        toast({
          title: "파일 크기 초과",
          description: "로고는 2MB 이하로 업로드해주세요.",
        } as any)
        return
      }
      setLogoFile(file)
    }
  }

  const openProfilePreview = () => {
    if (!generatedProfile) return
    
    // 프로필 HTML 생성
    const profileHTML = generateProfileHTML(generatedProfile)
    
    // 새 창으로 미리보기 열기
    const previewWindow = window.open('', '_blank', 'width=800,height=1000,scrollbars=yes')
    if (previewWindow) {
      previewWindow.document.write(profileHTML)
      previewWindow.document.close()
      
      // 통계 기록
      const profileService = ProfilePageService.getInstance()
      profileService.getProfile(generatedProfile.id) // 조회수 증가
    }
  }

  return (
    <section className="max-w-5xl mx-auto px-4 mb-24" id="profile-page">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">👤 연락처 공유용 랜딩 페이지</h2>
            <p className="text-slate-500">전화번호를 중심으로 한 개의 링크로 저장, 공유, 재사용이 가능한 미니 프로필</p>
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
                <Select value={selectedContact?.name || ''} onValueChange={(value) => {
                  const contact = contacts.find(c => c.name === value)
                  setSelectedContact(contact || null)
                }}>
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
                <CardTitle className="text-lg">프로필 디자인</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">테마</Label>
                  <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map((theme) => (
                        <SelectItem key={theme.value} value={theme.value}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded" 
                              style={{ backgroundColor: theme.color }}
                            />
                            <div>
                              <div className="font-medium">{theme.label}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">색상</Label>
                  <div className="flex gap-2 mt-2">
                    {themes.map((theme) => (
                      <button
                        key={theme.value}
                        onClick={() => setSelectedColor(theme.color)}
                        className={`w-8 h-8 rounded border-2 transition-colors ${
                          selectedColor === theme.color ? 'border-slate-900' : 'border-slate-300 hover:border-slate-500'
                        }`}
                        style={{ backgroundColor: theme.color }}
                      />
                    ))}
                  </div>
                </div>

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

                <div>
                  <Label className="text-sm font-medium">커스텀 메시지 (선택사항)</Label>
                  <Textarea
                    value={customMessage}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCustomMessage(e.target.value)}
                    placeholder="프로필에 추가하고 싶은 메시지를 입력하세요"
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleGenerateProfile}
              disabled={!selectedContact || isGenerating}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  생성 중...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  미니 프로필 생성
                </>
              )}
            </Button>
          </div>

          {/* 결과 영역 */}
          <div className="space-y-6">
            {generatedProfile ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Globe className="w-5 h-5 text-green-600" />
                      생성된 프로필
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">프로필 정보</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <div>이름: {generatedProfile.contact.name}</div>
                        <div>전화번호: {generatedProfile.contact.phone}</div>
                        {generatedProfile.contact.email && (
                          <div>이메일: {generatedProfile.contact.email}</div>
                        )}
                        {generatedProfile.contact.company && (
                          <div>회사: {generatedProfile.contact.company}</div>
                        )}
                        <div>프로필 URL: {generatedProfile.url}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">QR 코드</h4>
                      <img 
                        src={generatedProfile.qrUrl} 
                        alt="Profile QR Code" 
                        className="w-full border rounded-lg shadow-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        onClick={openProfilePreview}
                        variant="outline"
                        className="flex items-center gap-2 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        미리보기
                      </Button>
                      <Button
                        onClick={handleDownloadQR}
                        variant="outline"
                        className="flex items-center gap-2 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        QR 다운로드
                      </Button>
                    </div>

                    <Button
                      onClick={handleShareProfile}
                      className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      프로필 공유
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3 text-purple-900 flex items-center gap-2">
                      <BarChart className="w-4 h-4" />
                      프로필 통계
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {generatedProfile.stats.views}
                        </div>
                        <div className="text-sm text-slate-600">조회</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {generatedProfile.stats.downloads}
                        </div>
                        <div className="text-sm text-slate-600">다운로드</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {generatedProfile.stats.shares}
                        </div>
                        <div className="text-sm text-slate-600">공유</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-slate-50">
                <CardContent className="p-12 text-center">
                  <User className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-lg font-medium text-slate-600 mb-2">미니 프로필 미리보기</h3>
                  <p className="text-sm text-slate-500">
                    연락처를 선택하고 테마를 설정하면<br/>
                    미니 프로필 페이지가 여기에 표시됩니다
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* 기능 설명 */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3 text-purple-900">🎯 미니 프로필의 강점</h3>
            <div className="grid md:grid-cols-2 gap-y-3 gap-x-6 text-sm text-purple-800">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 shrink-0"></span>
                <span><strong>링크 하나로 모든 기능</strong>: 저장, 공유, 재사용이 한 번에 가능</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 shrink-0"></span>
                <span><strong>SNS 프로필과 차별화</strong>: 연락처 저장에만 특화된 전문성</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 shrink-0"></span>
                <span><strong>B2B/영업에 강력</strong>: 행사/영업용으로 완벽한 활용 가능</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 shrink-0"></span>
                <span><strong>실시간 통계 제공</strong>: 조회, 다운로드, 공유 데이터 추적</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
