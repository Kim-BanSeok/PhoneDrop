'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { AlertTriangle, CheckCircle, Wrench, Zap, AlertCircle } from 'lucide-react'
import { detectAndFixErrors, applyFixes, getErrorTypeIcon, getConfidenceColor, type ErrorFixResult } from '@/lib/errorFixer'
import { type Contact } from '@/lib/vcard'
import { useToast } from '@/hooks/use-toast'

interface ErrorFixerSectionProps {
  contacts: Contact[]
  onContactsUpdate: (contacts: Contact[]) => void
}

export default function ErrorFixerSection({ contacts, onContactsUpdate }: ErrorFixerSectionProps) {
  const [errorResult, setErrorResult] = useState<ErrorFixResult | null>(null)
  const [selectedFixes, setSelectedFixes] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleDetectErrors = () => {
    if (contacts.length === 0) {
      toast({
        title: "연락처 필요",
        description: "먼저 연락처를 추가해주세요.",
      } as any)
      return
    }

    setIsProcessing(true)
    
    try {
      const result = detectAndFixErrors(contacts)
      setErrorResult(result)
      
      // 자동 수정 가능한 것들 자동 선택
      const autoFixable = result.fixes
        .filter(fix => fix.confidence >= 90)
        .map(fix => `${fix.field.split(' ')[0]}-${fix.field.split(' ')[1]}`)
      
      setSelectedFixes(autoFixable)
      
      if (result.statistics.totalErrors > 0) {
        toast({
          title: "오류 탐지 완료",
          description: `${result.statistics.totalErrors}개의 오류를 발견했습니다 (${result.statistics.autoFixed}개 자동 수정 가능)`,
        } as any)
      } else {
        toast({
          title: "오류 없음",
          description: "발견된 오류가 없습니다.",
        } as any)
      }
    } catch (error) {
      toast({
        title: "오류 탐지 실패",
        description: "오류를 탐지하는 중 문제가 발생했습니다.",
      } as any)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleApplyFixes = () => {
    if (!errorResult || selectedFixes.length === 0) {
      toast({
        title: "수정 항목 필요",
        description: "적용할 수정 항목을 선택해주세요.",
      } as any)
      return
    }

    setIsProcessing(true)
    
    try {
      const fixedContacts = applyFixes(contacts, errorResult.fixes, selectedFixes)
      onContactsUpdate(fixedContacts)
      
      toast({
        title: "오류 수정 완료",
        description: `${selectedFixes.length}개의 오류가 수정되었습니다.`,
      } as any)
      
      // 결과 초기화
      setErrorResult(null)
      setSelectedFixes([])
    } catch (error) {
      toast({
        title: "오류 수정 실패",
        description: "오류를 수정하는 중 문제가 발생했습니다.",
      } as any)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFixSelection = (fixKey: string, checked: boolean) => {
    if (checked) {
      setSelectedFixes([...selectedFixes, fixKey])
    } else {
      setSelectedFixes(selectedFixes.filter(key => key !== fixKey))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allFixes = errorResult?.fixes.map(fix => 
        `${fix.field.split(' ')[0]}-${fix.field.split(' ')[1]}`
      ) || []
      setSelectedFixes(allFixes)
    } else {
      setSelectedFixes([])
    }
  }

  return (
    <section className="max-w-5xl mx-auto px-4 mb-24" id="error-fixer">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Wrench className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">🔧 오류 자동 수정 제안</h2>
            <p className="text-slate-500">사용자 실수를 자동으로 탐지하고 원클릭 수정해드립니다</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* 오류 탐지 버튼 */}
          <div className="flex gap-4">
            <Button
              onClick={handleDetectErrors}
              disabled={isProcessing || contacts.length === 0}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  오류 탐지 중...
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  오류 탐지 시작
                </>
              )}
            </Button>
          </div>

          {/* 통계 정보 */}
          {errorResult && (
            <Card className="border-yellow-100">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {errorResult.statistics.totalErrors}
                    </div>
                    <div className="text-sm text-slate-600">전체 오류</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {errorResult.statistics.autoFixed}
                    </div>
                    <div className="text-sm text-slate-600">자동 수정 가능</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {errorResult.statistics.requiresConfirmation}
                    </div>
                    <div className="text-sm text-slate-600">확인 필요</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {errorResult.statistics.fixRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-slate-600">수정 가능률</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 오류 목록 */}
          {errorResult && errorResult.fixes.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    발견된 오류 ({errorResult.fixes.length}개)
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="select-all"
                      checked={selectedFixes.length === errorResult.fixes.length}
                      onCheckedChange={handleSelectAll}
                    />
                    <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                      전체 선택
                    </label>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {errorResult.fixes.map((fix, index) => {
                    const fixKey = `${fix.field.split(' ')[0]}-${fix.field.split(' ')[1]}`
                    const isSelected = selectedFixes.includes(fixKey)
                    
                    return (
                      <div key={index} className={`border rounded-lg p-4 ${isSelected ? 'bg-green-50 border-green-200' : 'bg-slate-50'}`}>
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked: boolean) => handleFixSelection(fixKey, checked)}
                          />
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">{getErrorTypeIcon(fix.type)}</span>
                              <Badge className={getConfidenceColor(fix.confidence)}>
                                신뢰도: {fix.confidence}%
                              </Badge>
                              <span className="text-sm text-slate-500">{fix.field}</span>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-red-600">원본:</span>
                                <span className="text-sm text-slate-700 line-through">{fix.original}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-green-600">제안:</span>
                                <span className="text-sm text-slate-700 font-medium">{fix.suggested}</span>
                              </div>
                              <div className="text-xs text-slate-500">
                                {fix.description}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 수정 적용 버튼 */}
          {errorResult && selectedFixes.length > 0 && (
            <Button
              onClick={handleApplyFixes}
              disabled={isProcessing}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  수정 적용 중...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  선택된 오류 수정 적용 ({selectedFixes.length}개)
                </>
              )}
            </Button>
          )}

          {/* 수정 가이드 */}
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-100">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3 text-yellow-900">🎯 자동 수정 기능</h3>
              <div className="grid md:grid-cols-2 gap-y-3 gap-x-6 text-sm text-yellow-800">
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-1.5 shrink-0"></span>
                  <span>앞자리 누락 (1012345678 → 01012345678)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-1.5 shrink-0"></span>
                  <span>O/0 혼동 (O10-1234-5678 → 010-1234-5678)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-1.5 shrink-0"></span>
                  <span>자리수 불일치 (010-123-4567 → 010-1234-5678)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-1.5 shrink-0"></span>
                  <span>이메일 오타 자동 수정 (gnail.com → gmail.com)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
