'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Package, Users, Download, Upload, Plus, Trash2, Share2 } from 'lucide-react'
import { PackageService, packageCategories, downloadPackage, sharePackage, type ContactPackage, type PackageOptions } from '@/lib/contactPackage'
import { type Contact } from '@/lib/vcard'
import { useToast } from '@/hooks/use-toast'

interface ContactPackageSectionProps {
  contacts: Contact[]
}

export default function ContactPackageSection({ contacts }: ContactPackageSectionProps) {
  const [packageName, setPackageName] = useState('')
  const [packageDescription, setPackageDescription] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('event')
  const [selectedColor, setSelectedColor] = useState('#EC4899')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([])
  const [generatedPackage, setGeneratedPackage] = useState<ContactPackage | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleAddToPackage = (contact: Contact) => {
    if (selectedContacts.find(c => c.phone === contact.phone)) {
      toast({
        title: "이미 추가됨",
        description: "이미 추가된 연락처입니다.",
      } as any)
      return
    }
    setSelectedContacts([...selectedContacts, contact])
  }

  const handleRemoveFromPackage = (index: number) => {
    setSelectedContacts(selectedContacts.filter((_, i) => i !== index))
  }

  const handleCreatePackage = async () => {
    if (!packageName || selectedContacts.length === 0) {
      toast({
        title: "필수 정보 부족",
        description: "패키지 이름과 연락처를 추가해주세요.",
      } as any)
      return
    }

    setIsGenerating(true)
    
    try {
      const service = PackageService.getInstance()
      const options: PackageOptions = {
        name: packageName,
        description: packageDescription,
        category: selectedCategory as any,
        color: selectedColor,
        logo: logoFile ? URL.createObjectURL(logoFile) : undefined,
        contacts: selectedContacts
      }

      const pkg = await service.createPackage(options)
      setGeneratedPackage(pkg)
      
      toast({
        title: "연락처 패키지 생성 완료",
        description: `${selectedContacts.length}개의 연락처가 포함된 패키지가 생성되었습니다.`,
      } as any)
    } catch (error) {
      toast({
        title: "패키지 생성 실패",
        description: "패키지 생성 중 오류가 발생했습니다.",
      } as any)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadPackage = () => {
    if (!generatedPackage) return

    try {
      downloadPackage(generatedPackage)
      
      toast({
        title: "패키지 다운로드",
        description: "패키지 이미지, QR 코드, vCard 파일이 다운로드되었습니다.",
      } as any)
    } catch (error) {
      toast({
        title: "다운로드 실패",
        description: "패키지 다운로드 중 오류가 발생했습니다.",
      } as any)
    }
  }

  const handleSharePackage = async () => {
    if (!generatedPackage) return

    try {
      await sharePackage(generatedPackage)
      
      toast({
        title: "패키지 공유",
        description: "패키지 링크가 공유되었습니다.",
      } as any)
    } catch (error) {
      toast({
        title: "공유 실패",
        description: "패키지 공유 중 오류가 발생했습니다.",
      } as any)
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 3 * 1024 * 1024) { // 3MB 제한
        toast({
          title: "파일 크기 초과",
          description: "로고는 3MB 이하로 업로드해주세요.",
        } as any)
        return
      }
      setLogoFile(file)
    }
  }

  const handleContactSelect = (contact: Contact) => {
    // 기존 연락처인지 확인
    const existingIndex = selectedContacts.findIndex(c => c.phone === contact.phone)
    if (existingIndex >= 0) {
      setSelectedContacts(selectedContacts.map((c, index) => 
        index === existingIndex ? contact : c
      ))
    } else {
      handleAddToPackage(contact)
    }
  }

  return (
    <section className="max-w-5xl mx-auto px-4 mb-24" id="contact-package">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">📦 연락처 패키지</h2>
            <p className="text-slate-500">연락처 묶음을 하나의 &apos;패키지&apos;로 만들어 배포하세요</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 설정 영역 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">패키지 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">패키지 이름</Label>
                  <Input
                    value={packageName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPackageName(e.target.value)}
                    placeholder="예: 2026 세미나 참가자"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">설명</Label>
                  <Textarea
                    value={packageDescription}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPackageDescription(e.target.value)}
                    placeholder="패키지에 대한 설명을 입력하세요"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">카테고리</Label>
                  <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(packageCategories).map(([key, category]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <span>{category.icon}</span>
                            <div>
                              <div className="font-medium">{category.name}</div>
                              <div className="text-sm text-slate-500">{category.description}</div>
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
                    {(packageCategories[selectedCategory as keyof typeof packageCategories]?.colors || []).map((color) => (
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

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  연락처 목록 ({selectedContacts.length}명)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedContacts.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <Package className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                      <h3 className="text-lg font-medium text-slate-600 mb-2">패키지 미리보기</h3>
                      <p className="text-sm text-slate-500">
                        연락처를 선택하고 카테고리를 설정하면<br/>
                        패키지가 여기에 표시됩니다
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedContacts.map((contact, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium">{contact.name}</div>
                            <div className="text-sm text-slate-600">{contact.phone}</div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveFromPackage(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => setSelectedContacts([...contacts])}
                  variant="outline"
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  전체 연락처 추가
                </Button>
              </CardContent>
            </Card>

            <Button
              onClick={handleCreatePackage}
              disabled={!packageName || selectedContacts.length === 0 || isGenerating}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  생성 중...
                </>
              ) : (
                <>
                  <Package className="w-4 h-4 mr-2" />
                  패키지 생성
                </>
              )}
            </Button>
          </div>

          {/* 결과 영역 */}
          <div className="space-y-6">
            {generatedPackage ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Package className="w-5 h-5 text-green-600" />
                      생성된 패키지
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">패키지 정보</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <div><strong>이름:</strong> {generatedPackage.name}</div>
                        <div><strong>설명:</strong> {generatedPackage.description}</div>
                        <div><strong>카테고리:</strong> {(packageCategories[generatedPackage.category as keyof typeof packageCategories]?.name || '')}</div>
                        <div><strong>연락처:</strong> {generatedPackage.contacts.length}명</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">QR 코드</h4>
                        <img 
                          src={generatedPackage.qrUrl} 
                          alt="Package QR Code" 
                          className="w-full border rounded-lg shadow-sm"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">패키지 이미지</h4>
                        <img 
                          src={generatedPackage.imageUrl} 
                          alt="Package Image" 
                          className="w-full border rounded-lg shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        onClick={handleDownloadPackage}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        전체 다운로드
                      </Button>
                      <Button
                        onClick={handleSharePackage}
                        className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        공유하기
                      </Button>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-100 rounded-lg p-6">
                      <h3 className="font-semibold mb-3 text-orange-900">📊 패키지 통계</h3>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-orange-600">
                            {generatedPackage.stats.downloads}
                          </div>
                          <div className="text-sm text-slate-600">다운로드</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            {generatedPackage.stats.shares}
                          </div>
                          <div className="text-sm text-slate-600">공유</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">
                            {generatedPackage.contacts.length}
                          </div>
                          <div className="text-sm text-slate-600">연락처</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                </>
            ) : (
              <Card className="bg-slate-50">
                <CardContent className="p-12 text-center">
                  <Package className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-lg font-medium text-slate-600 mb-2">패키지 미리보기</h3>
                  <p className="text-sm text-slate-500">
                    연락처를 선택하고 카테고리를 설정하면<br/>
                    패키지가 여기에 표시됩니다
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* 기능 설명 */}
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-100">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3 text-orange-900">🎯 연락처 패키지의 강점</h3>
            <div className="grid md:grid-cols-2 gap-y-3 gap-x-6 text-sm text-orange-800">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 shrink-0"></span>
                <span><strong>연락처 배포 도구</strong>: 한 번에 여러 명의 연락처를 묶음으로 배포 가능</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 shrink-0"></span>
                <span><strong>브랜드 기능</strong>: 로고 삽입으로 조직 인지 표시</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 shrink-0"></span>
                <span><strong>B2B/영업에 강력</strong>: 행사/팀별 연락처 관리에 최적화</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 shrink-0"></span>
                <span><strong>재사용 가능</strong>: 링크 하나로 계속해서 재사용하고 관리</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
