'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertTriangle, CheckCircle, Users, Filter, Merge } from 'lucide-react'
import { detectDuplicates, resolveDuplicates, type DuplicatePolicy, type DuplicateResult } from '@/lib/duplicateHandler'
import { type Contact } from '@/lib/vcard'
import { useToast } from '@/hooks/use-toast'

interface DuplicateHandlerSectionProps {
  contacts: Contact[]
  onContactsUpdate: (contacts: Contact[]) => void
}

export default function DuplicateHandlerSection({ contacts, onContactsUpdate }: DuplicateHandlerSectionProps) {
  const [duplicateResult, setDuplicateResult] = useState<DuplicateResult | null>(null)
  const [selectedPolicy, setSelectedPolicy] = useState<DuplicatePolicy>('keep_first')
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleDetectDuplicates = () => {
    if (contacts.length === 0) {
      toast({
        title: "연락처 필요",
        description: "먼저 연락처를 추가해주세요.",
      } as any)
      return
    }

    setIsProcessing(true)
    
    try {
      const result = detectDuplicates(contacts)
      setDuplicateResult(result)
      
      if (result.totalDuplicates > 0) {
        toast({
          title: "중복 탐지 완료",
          description: `${result.totalDuplicates}개의 중복 연락처를 발견했습니다.`,
        } as any)
      } else {
        toast({
          title: "중복 없음",
          description: "중복된 연락처가 없습니다.",
        } as any)
      }
    } catch (error) {
      toast({
        title: "중복 탐지 오류",
        description: "중복을 탐지하는 중 오류가 발생했습니다.",
      } as any)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleResolveDuplicates = () => {
    if (!duplicateResult) return

    setIsProcessing(true)
    
    try {
      const resolvedContacts = resolveDuplicates(contacts, duplicateResult.groups, selectedPolicy)
      onContactsUpdate(resolvedContacts)
      
      toast({
        title: "중복 처리 완료",
        description: `${contacts.length - resolvedContacts.length}개의 중복이 제거되었습니다.`,
      } as any)
      
      // 결과 초기화
      setDuplicateResult(null)
    } catch (error) {
      toast({
        title: "중복 처리 오류",
        description: "중복을 처리하는 중 오류가 발생했습니다.",
      } as any)
    } finally {
      setIsProcessing(false)
    }
  }

  const getPolicyDescription = (policy: DuplicatePolicy): string => {
    switch (policy) {
      case 'skip':
        return '중복된 연락처를 건너뜁니다'
      case 'keep_first':
        return '첫 번째 연락처만 유지합니다'
      case 'keep_longest':
        return '정보가 가장 많은 연락처를 유지합니다'
      case 'merge':
        return '모든 정보를 하나로 병합합니다'
      default:
        return ''
    }
  }

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 80) return 'bg-green-100 text-green-800'
    if (similarity >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <section className="max-w-5xl mx-auto px-4 mb-24" id="duplicate-handler">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">🔄 중복/유사 중복 탐지</h2>
            <p className="text-slate-500">실전에서 발생하는 다양한 중복 케이스를 자동으로 탐지하고 처리하세요</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* 중복 탐지 버튼 */}
          <div className="flex gap-4">
            <Button
              onClick={handleDetectDuplicates}
              disabled={isProcessing || contacts.length === 0}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  중복 탐지 중...
                </>
              ) : (
                <>
                  <Filter className="w-4 h-4 mr-2" />
                  중복 탐지 시작
                </>
              )}
            </Button>
          </div>

          {/* 통계 정보 */}
          {duplicateResult && (
            <Card className="border-orange-100">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {duplicateResult.statistics.totalProcessed}
                    </div>
                    <div className="text-sm text-slate-600">전체 처리</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {duplicateResult.statistics.duplicatesFound}
                    </div>
                    <div className="text-sm text-slate-600">중복 발견</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {duplicateResult.statistics.uniqueCount}
                    </div>
                    <div className="text-sm text-slate-600">고유 연락처</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {duplicateResult.statistics.duplicateRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-slate-600">중복률</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 중복 그룹 목록 */}
          {duplicateResult && duplicateResult.groups.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  중복 그룹 ({duplicateResult.groups.length}개)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {duplicateResult.groups.map((group, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge className={getSimilarityColor(group.similarity)}>
                            유사도: {group.similarity.toFixed(1)}%
                          </Badge>
                          <span className="text-sm text-slate-500">
                            정규화 번호: {group.normalizedPhone}
                          </span>
                        </div>
                        <Badge variant="outline">
                          {group.contacts.length}개 중복
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        {group.contacts.map((contact, contactIndex) => (
                          <div key={contactIndex} className="p-2 bg-slate-50 rounded text-sm">
                            <div className="font-medium">{contact.name}</div>
                            <div className="text-slate-600">{contact.phone}</div>
                            {contact.email && (
                              <div className="text-slate-500">{contact.email}</div>
                            )}
                          </div>
                        ))}
                      </div>

                      {group.suggestions.length > 0 && (
                        <div className="text-sm text-orange-700 bg-orange-50 p-2 rounded">
                          <div className="font-medium mb-1">제안:</div>
                          {group.suggestions.map((suggestion, suggestionIndex) => (
                            <div key={suggestionIndex}>• {suggestion}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 중복 처리 정책 */}
          {duplicateResult && duplicateResult.totalDuplicates > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Merge className="w-5 h-5" />
                  중복 처리 정책
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select value={selectedPolicy} onValueChange={(value: DuplicatePolicy) => setSelectedPolicy(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="skip">
                        <div>
                          <div className="font-medium">중복 건너뛰기</div>
                          <div className="text-sm text-slate-500">{getPolicyDescription('skip')}</div>
                        </div>
                      </SelectItem>
                      <SelectItem value="keep_first">
                        <div>
                          <div className="font-medium">첫 번째 유지</div>
                          <div className="text-sm text-slate-500">{getPolicyDescription('keep_first')}</div>
                        </div>
                      </SelectItem>
                      <SelectItem value="keep_longest">
                        <div>
                          <div className="font-medium">가장 긴 정보 유지</div>
                          <div className="text-sm text-slate-500">{getPolicyDescription('keep_longest')}</div>
                        </div>
                      </SelectItem>
                      <SelectItem value="merge">
                        <div>
                          <div className="font-medium">정보 병합</div>
                          <div className="text-sm text-slate-500">{getPolicyDescription('merge')}</div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={handleResolveDuplicates}
                    disabled={isProcessing}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        처리 중...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        중복 처리 적용 ({duplicateResult.totalDuplicates}개 제거)
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 처리 가이드 */}
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-100">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3 text-orange-900">🎯 중복 탐지 기능</h3>
              <div className="grid md:grid-cols-2 gap-y-3 gap-x-6 text-sm text-orange-800">
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 shrink-0"></span>
                  <span>정규화 중복 (010-1234-5678 vs 01012345678)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 shrink-0"></span>
                  <span>국가코드 변환 (+82 10-1234-5678)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 shrink-0"></span>
                  <span>이름만 다른 중복 (대표번호)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 shrink-0"></span>
                  <span>유사도 기반 지능 탐지</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
