'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Download, QrCode } from 'lucide-react'
import { generateVCard, generateMultipleVCards, downloadVCard, validatePhone, validateEmail, formatPhone, type Contact } from '@/lib/vcard'
import { generateQRCodeForDownload } from '@/lib/qrCode'
import { useToast } from '@/hooks/use-toast'
import { CheckCircle } from 'lucide-react'

interface ManualEntrySectionProps {
  onContactsUpdate?: (contacts: Contact[]) => void
}

export default function ManualEntrySection({ onContactsUpdate }: ManualEntrySectionProps) {
  const [contacts, setContacts] = useState<Contact[]>([
    { name: '', phone: '', email: '', company: '', title: '' }
  ])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const addContact = () => {
    setContacts([...contacts, { name: '', phone: '', email: '', company: '', title: '' }])
    toast({
      title: "연락처 추가",
      description: "새로운 연락처 입력 필드가 추가되었습니다.",
    } as any)
  }

  const removeContact = (index: number) => {
    const removedContact = contacts[index]
    setContacts(contacts.filter((_, i) => i !== index))
    toast({
      title: "연락처 삭제",
      description: `${removedContact.name || '연락처'}가 삭제되었습니다.`,
    } as any)
  }

  const updateContact = (index: number, field: keyof Contact, value: string) => {
    const newContacts = [...contacts]
    
    // 전화번호 필드인 경우 자동 형식화
    if (field === 'phone') {
      const formattedPhone = formatPhone(value)
      newContacts[index] = { ...newContacts[index], [field]: formattedPhone }
    } else {
      newContacts[index] = { ...newContacts[index], [field]: value }
    }
    
    setContacts(newContacts)
    
    // 실시간 유효성 검사
    const newErrors = { ...errors }
    if (field === 'phone' && value) {
      if (!validatePhone(value)) {
        newErrors[`phone-${index}`] = '올바른 전화번호 형식이 아닙니다 (예: 01012345678 또는 010-1234-5678)'
      } else {
        delete newErrors[`phone-${index}`]
      }
    } else if (field === 'email' && value) {
      if (!validateEmail(value)) {
        newErrors[`email-${index}`] = '올바른 이메일 형식이 아닙니다'
      } else {
        delete newErrors[`email-${index}`]
      }
    }
    
    setErrors(newErrors)
  }

  const handleDownloadVCard = () => {
    // 유효성 검사
    const newErrors: Record<string, string> = {}
    let hasError = false

    contacts.forEach((contact, index) => {
      if (!contact.name.trim()) {
        newErrors[`name-${index}`] = '이름을 입력해주세요'
        hasError = true
      }
      if (!contact.phone.trim()) {
        newErrors[`phone-${index}`] = '전화번호를 입력해주세요'
        hasError = true
      } else if (!validatePhone(contact.phone)) {
        newErrors[`phone-${index}`] = '올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)'
        hasError = true
      }
    })

    if (hasError) {
      setErrors(newErrors)
      return
    }

    // vCard 생성 및 다운로드
    const validContacts = contacts.filter(contact => contact.name && contact.phone)
    if (validContacts.length === 1) {
      const vcard = generateVCard(validContacts[0])
      downloadVCard(vcard, `${validContacts[0].name}.vcf`)
    } else {
      const vcard = validContacts.map(contact => generateVCard(contact)).join('\n')
      downloadVCard(vcard, `연락처_${validContacts.length}개.vcf`)
    }

    toast({
      title: "vCard 다운로드 완료",
      description: `${validContacts.length}개의 연락처가 vCard 파일로 다운로드되었습니다.`,
    } as any)
  }

  const handleGenerateQRCode = async () => {
    // 유효성 검사
    const newErrors: Record<string, string> = {}
    let hasError = false

    contacts.forEach((contact, index) => {
      if (!contact.name.trim()) {
        newErrors[`name-${index}`] = '이름을 입력해주세요'
        hasError = true
      }
      if (!contact.phone.trim()) {
        newErrors[`phone-${index}`] = '전화번호를 입력해주세요'
        hasError = true
      } else if (!validatePhone(contact.phone)) {
        newErrors[`phone-${index}`] = '올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)'
        hasError = true
      }
    })

    if (hasError) {
      setErrors(newErrors)
      return
    }

    try {
      const validContacts = contacts.filter(contact => contact.name && contact.phone)
      await generateQRCodeForDownload(validContacts)
      
      toast({
        title: "QR 코드 생성 완료",
        description: `${validContacts.length}개의 연락처 QR 코드가 생성되었습니다.`,
      } as any)
    } catch (error) {
      console.error('QR 코드 생성 실패:', error)
      toast({
        title: "QR 코드 생성 실패",
        description: "QR 코드 생성에 실패했습니다. 다시 시도해주세요.",
      } as any)
    }
  }

  const validContacts = contacts.filter(contact => contact.name && contact.phone)

  return (
    <section className="max-w-5xl mx-auto px-4" id="manual-entry">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-2">연락처 직접 입력</h2>
          <p className="text-slate-500">한 명씩 정보를 입력하고 vCard 또는 QR 코드로 바로 저장하세요.</p>
        </div>

        <div className="space-y-6">
          {contacts.map((contact, index) => (
            <div key={index} className="border border-slate-100 bg-slate-50/30 rounded-2xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <span className="text-lg font-bold">연락처 {index + 1}</span>
                {contacts.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeContact(index)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={contact.name}
                    onChange={(e) => updateContact(index, 'name', e.target.value)}
                    placeholder="예: 홍길동"
                    className={`w-full bg-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-2 ${
                      errors[`name-${index}`] ? 'border-red-300' : 'border-slate-200'
                    }`}
                  />
                  {errors[`name-${index}`] && (
                    <p className="text-xs text-red-500 mt-1">{errors[`name-${index}`]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    전화번호 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => updateContact(index, 'phone', e.target.value)}
                    placeholder="01000000000 또는 010-0000-0000"
                    className={`w-full bg-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-2 ${
                      errors[`phone-${index}`] ? 'border-red-300' : 'border-slate-200'
                    }`}
                  />
                  {errors[`phone-${index}`] && (
                    <p className="text-xs text-red-500 mt-1">{errors[`phone-${index}`]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">이메일</label>
                  <input
                    type="email"
                    value={contact.email || ''}
                    onChange={(e) => updateContact(index, 'email', e.target.value)}
                    placeholder="example@mail.com"
                    className={`w-full bg-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-2 ${
                      errors[`email-${index}`] ? 'border-red-300' : 'border-slate-200'
                    }`}
                  />
                  {errors[`email-${index}`] && (
                    <p className="text-xs text-red-500 mt-1">{errors[`email-${index}`]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">회사</label>
                  <input
                    type="text"
                    value={contact.company || ''}
                    onChange={(e) => updateContact(index, 'company', e.target.value)}
                    placeholder="소속 회사명"
                    className="w-full bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">직책</label>
                  <input
                    type="text"
                    value={contact.title || ''}
                    onChange={(e) => updateContact(index, 'title', e.target.value)}
                    placeholder="예: 팀장, 매니저"
                    className="w-full bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-2"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={addContact}
            className="flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            연락처 추가
          </Button>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <Button
              onClick={() => {
                if (validContacts.length > 0 && onContactsUpdate) {
                  onContactsUpdate(validContacts)
                  toast({
                    title: "연락처 추가 완료",
                    description: `${validContacts.length}개의 연락처가 추가되었습니다. 이제 내보내기 탭에서 사용할 수 있습니다.`,
                  } as any)
                }
              }}
              disabled={validContacts.length === 0}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              연락처 추가하기
            </Button>
            <Button
              onClick={handleDownloadVCard}
              disabled={validContacts.length === 0}
              variant="outline"
              className="flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              vCard 다운로드
            </Button>
            <Button
              onClick={handleGenerateQRCode}
              disabled={validContacts.length === 0}
              variant="outline"
              className="flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <QrCode className="w-4 h-4" />
              QR 코드 생성
            </Button>
          </div>
        </div>

        <div className="mt-8 p-6 bg-slate-100/50 rounded-2xl border border-slate-200">
          <p className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wider">사용 방법</p>
          <div className="grid md:grid-cols-4 gap-4 text-sm text-slate-600 leading-relaxed">
            <div className="flex gap-2">
              <span className="font-bold text-blue-600">01</span>
              <p>정보를 입력하세요 (이름과 번호 필수)</p>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-blue-600">02</span>
              <p>여러 명 추가하려면 &apos;연락처 추가&apos; 클릭</p>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-blue-600">03</span>
              <p>&apos;vCard 다운로드&apos;로 파일을 저장하세요</p>
            </div>
            <div className="flex gap-2">
              <span className="font-bold text-blue-600">04</span>
              <p>모바일에서 파일을 열어 바로 저장하세요</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
