'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react'
import { parseCSV, parseExcel, downloadTemplate, type ParsedData } from '@/lib/fileParser'
import { generateVCard, generateMultipleVCards, downloadVCard, type Contact } from '@/lib/vcard'
import { useToast } from '@/hooks/use-toast'

interface BulkUploadSectionProps {
  onContactsUpdate?: (contacts: Contact[]) => void
}

export default function BulkUploadSection({ onContactsUpdate }: BulkUploadSectionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setUploadedFile(file)
    setParsedData(null)

    try {
      let result: ParsedData

      if (file.name.endsWith('.csv')) {
        result = await parseCSV(file)
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        result = await parseExcel(file)
      } else {
        throw new Error('지원하지 않는 파일 형식입니다. CSV 또는 Excel 파일을 업로드해주세요.')
      }

      setParsedData(result)
      
      if (result.contacts.length > 0) {
        toast({
          title: "파일 업로드 성공",
          description: `${result.contacts.length}개의 연락처를 성공적으로 파싱했습니다.`,
        } as any)
      }
    } catch (error) {
      setParsedData({
        contacts: [],
        errors: [`파일 처리 오류: ${error}`]
      })
      toast({
        title: "파일 처리 오류",
        description: "파일을 처리하는 중 오류가 발생했습니다.",
      } as any)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadVCard = () => {
    if (!parsedData || parsedData.contacts.length === 0) return

    if (parsedData.contacts.length === 1) {
      const vcard = generateVCard(parsedData.contacts[0])
      downloadVCard(vcard, `${parsedData.contacts[0].name}.vcf`)
    } else {
      const vcard = generateMultipleVCards(parsedData.contacts)
      downloadVCard(vcard, `연락처_${parsedData.contacts.length}개.vcf`)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      const fakeEvent = {
        target: { files: [file] }
      } as any
      handleFileUpload(fakeEvent)
    }
  }

  return (
    <section className="max-w-5xl mx-auto px-4 mb-24" id="bulk-upload">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-2xl font-bold mb-2">대량 연락처 업로드</h2>
            <p className="text-slate-500">CSV 또는 Excel 파일로 수백 명의 연락처를 한 번에 추가하세요. (하이픈 없이 전화번호 입력 가능)</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => downloadTemplate('csv')}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              CSV 템플릿
            </Button>
            <Button
              variant="outline"
              onClick={() => downloadTemplate('excel')}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Excel 템플릿
            </Button>
          </div>
        </div>

        <div
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors group cursor-pointer ${
            isLoading 
              ? 'border-slate-300 bg-slate-50' 
              : 'border-slate-300 hover:border-blue-600 bg-slate-50/50'
          } mb-8`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          {isLoading ? (
            <div className="space-y-4">
              <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-lg font-medium">파일 처리 중...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <FileSpreadsheet className="w-16 h-16 text-slate-300 group-hover:text-blue-600 transition-colors mx-auto" />
              <div>
                <p className="text-lg font-medium mb-1">
                  {uploadedFile ? uploadedFile.name : 'CSV 또는 Excel 파일을 드래그하거나 클릭하여 업로드하세요'}
                </p>
                <p className="text-sm text-slate-500">지원 형식: CSV, XLSX, XLS (최대 10MB)</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                파일 선택
              </Button>
            </div>
          )}
        </div>

        {parsedData && (
          <div className="space-y-6">
            {parsedData.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="flex items-center gap-2 text-red-700 font-bold mb-3">
                  <AlertCircle className="w-5 h-5" />
                  오류 발견 ({parsedData.errors.length}개)
                </h3>
                <div className="space-y-2">
                  {parsedData.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-600">
                      • {error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {parsedData.contacts.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="flex items-center gap-2 text-green-700 font-bold mb-4">
                  <CheckCircle className="w-5 h-5" />
                  성공적으로 파싱된 연락처 ({parsedData.contacts.length}개)
                </h3>
                
                <div className="mb-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-green-200">
                          <th className="text-left py-2">이름</th>
                          <th className="text-left py-2">전화번호</th>
                          <th className="text-left py-2">이메일</th>
                          <th className="text-left py-2">회사</th>
                          <th className="text-left py-2">직책</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedData.contacts.slice(0, 5).map((contact, index) => (
                          <tr key={index} className="border-b border-green-100">
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
                  {parsedData.contacts.length > 5 && (
                    <p className="text-sm text-green-600 mt-2">
                      ... 외 {parsedData.contacts.length - 5}개 더
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => {
                      if (parsedData && parsedData.contacts.length > 0 && onContactsUpdate) {
                        onContactsUpdate(parsedData.contacts)
                        toast({
                          title: "연락처 추가 완료",
                          description: `${parsedData.contacts.length}개의 연락처가 추가되었습니다. 이제 내보내기 탭에서 사용할 수 있습니다.`,
                        } as any)
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    연락처 추가하기 ({parsedData.contacts.length}개)
                  </Button>
                  <Button
                    onClick={handleDownloadVCard}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    vCard 다운로드
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
          <h3 className="flex items-center gap-2 text-blue-700 font-bold mb-3">
            <AlertCircle className="w-5 h-5" />
            파일 형식 안내
          </h3>
          <div className="grid md:grid-cols-2 gap-y-2 gap-x-8 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0"></span>
              필수 컬럼: 이름, 전화번호
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0"></span>
              선택 컬럼: 이메일, 회사, 직책
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0"></span>
              컬럼명은 한국어 또는 영어로 사용 가능
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0"></span>
              전화번호 형식: 010-1234-5678
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
