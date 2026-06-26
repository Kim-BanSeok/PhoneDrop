'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Package, Download, Share2, Plus, Trash2 } from 'lucide-react'
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
    if (selectedContacts.find(c => c.phone === contact.phone)) return
    setSelectedContacts([...selectedContacts, contact])
  }

  const handleRemoveFromPackage = (index: number) => {
    setSelectedContacts(selectedContacts.filter((_, i) => i !== index))
  }

  const handleCreatePackage = async () => {
    if (!packageName || selectedContacts.length === 0) return
    setIsGenerating(true)
    try {
      const service = PackageService.getInstance()
      const options: PackageOptions = {
        name: packageName,
        description: packageDescription,
        category: selectedCategory as any,
        color: selectedColor,
        logo: logoFile ? URL.createObjectURL(logoFile) : undefined,
        contacts: selectedContacts,
      }
      const pkg = await service.createPackage(options)
      setGeneratedPackage(pkg)
      toast({ title: '연락처 패키지 생성 완료', description: `${selectedContacts.length}개의 연락처를 묶었습니다.` } as any)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadPackage = () => {
    if (generatedPackage) downloadPackage(generatedPackage)
  }

  const handleSharePackage = async () => {
    if (generatedPackage) await sharePackage(generatedPackage)
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) setLogoFile(file)
  }

  return (
    <section className="mx-auto mb-24 max-w-5xl px-4" id="contact-package">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-950">연락처 패키지</h2>
            <p className="text-slate-500">여러 연락처를 하나의 패키지로 묶어 배포와 공유를 쉽게 만듭니다.</p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>패키지 정보</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>패키지 이름</Label>
                  <Input value={packageName} onChange={(e) => setPackageName(e.target.value)} placeholder="2026 행사 명단" className="mt-1" />
                </div>
                <div>
                  <Label>설명</Label>
                  <Textarea value={packageDescription} onChange={(e) => setPackageDescription(e.target.value)} placeholder="행사 참가자 연락처 모음" className="mt-1" rows={3} />
                </div>
                <div>
                  <Label>카테고리</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(packageCategories).map(([key, category]) => (
                        <SelectItem key={key} value={key}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>로고</Label>
                  <Input type="file" accept="image/*" onChange={handleLogoUpload} className="mt-1" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>선택한 연락처 ({selectedContacts.length}명)</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {selectedContacts.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
                    아직 연락처가 선택되지 않았습니다.
                  </div>
                ) : (
                  selectedContacts.map((contact, index) => (
                    <div key={`${contact.phone}-${index}`} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                      <div className="flex-1">
                        <div className="font-medium text-slate-950">{contact.name}</div>
                        <div className="text-sm text-slate-600">{contact.phone}</div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleRemoveFromPackage(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
                <Button onClick={() => setSelectedContacts([...contacts])} variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  전체 연락처 추가
                </Button>
              </CardContent>
            </Card>

            <Button onClick={handleCreatePackage} disabled={!packageName || selectedContacts.length === 0 || isGenerating} className="w-full bg-orange-600 text-white hover:bg-orange-700">
              <Package className="mr-2 h-4 w-4" />
              패키지 생성
            </Button>
          </div>

          <div className="space-y-6">
            {generatedPackage ? (
              <Card>
                <CardHeader><CardTitle>생성 결과</CardTitle></CardHeader>
                <CardContent className="space-y-4 text-sm text-slate-600">
                  <div>이름: {generatedPackage.name}</div>
                  <div>설명: {generatedPackage.description}</div>
                  <div>카테고리: {packageCategories[generatedPackage.category as keyof typeof packageCategories]?.name}</div>
                  <div>연락처: {generatedPackage.contacts.length}명</div>
                  <div className="grid grid-cols-2 gap-4">
                    <img src={generatedPackage.qrUrl} alt="Package QR Code" className="w-full rounded-lg border shadow-sm" />
                    <img src={generatedPackage.imageUrl} alt="Package Image" className="w-full rounded-lg border shadow-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button onClick={handleDownloadPackage} className="bg-blue-600 text-white hover:bg-blue-700">
                      <Download className="mr-2 h-4 w-4" />
                      다운로드
                    </Button>
                    <Button onClick={handleSharePackage} className="bg-green-600 text-white hover:bg-green-700">
                      <Share2 className="mr-2 h-4 w-4" />
                      공유
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-50">
                <CardContent className="p-12 text-center text-slate-600">
                  <Package className="mx-auto mb-4 h-16 w-16 text-slate-300" />
                  연락처와 카테고리를 선택하면 패키지 미리보기가 표시됩니다.
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Card className="mt-8 border-orange-100 bg-gradient-to-br from-orange-50 to-red-50">
          <CardContent className="p-6">
            <h3 className="mb-3 font-semibold text-orange-900">패키지 활용 예시</h3>
            <div className="grid gap-3 md:grid-cols-2 text-sm text-orange-800">
              <div>· 행사 참가자 명단 배포</div>
              <div>· 팀 연락처 묶음 전달</div>
              <div>· 카테고리별 주소록 정리</div>
              <div>· 내부 공유용 연락처 묶음 보관</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
