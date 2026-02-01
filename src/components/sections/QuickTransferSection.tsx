'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { QrCode, Link2, Share2, Clock, Users, Download, Copy, CheckCircle, AlertTriangle, Settings } from 'lucide-react'
import { QuickTransferService, downloadTransferQR, shareTransferLink, formatTimeRemaining, getTransferProgress, type TransferLink, type TransferOptions } from '@/lib/quickTransfer'
import { type Contact } from '@/lib/vcard'
import { useToast } from '@/hooks/use-toast'

interface QuickTransferSectionProps {
  contacts: Contact[]
}

export default function QuickTransferSection({ contacts }: QuickTransferSectionProps) {
  const [transferLink, setTransferLink] = useState<TransferLink | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [expiresIn, setExpiresIn] = useState(10)
  const [maxAccess, setMaxAccess] = useState(10)
  const [linkCopied, setLinkCopied] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (transferLink && !isTransferExpired(transferLink)) {
      interval = setInterval(() => {
        const remaining = Math.max(0, transferLink.expiresAt.getTime() - Date.now())
        setTimeRemaining(remaining)
        
        if (remaining === 0) {
          setTransferLink(null)
          setQrCodeUrl('')
        }
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [transferLink])

  const handleGenerateTransfer = async () => {
    if (contacts.length === 0) {
      toast({
        title: "연락처 필요",
        description: "먼저 연락처를 추가해주세요.",
      } as any)
      return
    }

    setIsGenerating(true)
    
    try {
      const service = QuickTransferService.getInstance()
      const options: TransferOptions = {
        expiresIn,
        maxAccess
      }

      const link = await service.createTransferLink(contacts, options)
      const qr = await service.generateTransferQR(contacts, options)
      
      setTransferLink(link)
      setQrCodeUrl(qr)
      setTimeRemaining(link.expiresAt.getTime() - Date.now())
      
      toast({
        title: "전송 링크 생성 완료",
        description: `${contacts.length}개의 연락처를 위한 임시 링크가 생성되었습니다.`,
      } as any)
    } catch (error) {
      toast({
        title: "전송 링크 생성 실패",
        description: "링크 생성 중 오류가 발생했습니다.",
      } as any)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyLink = async () => {
    if (!transferLink) return

    try {
      await navigator.clipboard.writeText(transferLink.url)
      setLinkCopied(true)
      
      toast({
        title: "링크 복사 완료",
        description: "전송 링크가 클립보드에 복사되었습니다.",
      } as any)
      
      setTimeout(() => setLinkCopied(false), 3000)
    } catch (error) {
      toast({
        title: "링크 복사 실패",
        description: "클립보드 복사에 실패했습니다.",
      } as any)
    }
  }

  const handleShareLink = async () => {
    if (!transferLink) return

    try {
      await shareTransferLink(contacts, { expiresIn, maxAccess })
      
      toast({
        title: "공유 완료",
        description: "전송 링크가 공유되었습니다.",
      } as any)
    } catch (error) {
      toast({
        title: "공유 실패",
        description: "링크 공유에 실패했습니다.",
      } as any)
    }
  }

  const handleDownloadQR = async () => {
    if (contacts.length === 0) return

    try {
      await downloadTransferQR(contacts, { expiresIn, maxAccess })
      
      toast({
        title: "QR 코드 다운로드",
        description: "전송용 QR 코드가 다운로드되었습니다.",
      } as any)
    } catch (error) {
      toast({
        title: "QR 코드 다운로드 실패",
        description: "QR 코드 다운로드에 실패했습니다.",
      } as any)
    }
  }

  function isTransferExpired(transfer: TransferLink): boolean {
    return transfer.expiresAt < new Date()
  }

  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return 'bg-green-500'
    if (percentage < 80) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <section className="max-w-5xl mx-auto px-4 mb-24" id="quick-transfer">
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Link2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">⚡ PC→모바일 전송 압축</h2>
            <p className="text-slate-500">임시 링크와 QR 코드로 PC에서 모바일로 연락처를 순식간에 전송하세요</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* 설정 영역 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                전송 설정
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="expires-in" className="text-sm font-medium">만료 시간</Label>
                  <Select value={expiresIn.toString()} onValueChange={(value) => setExpiresIn(parseInt(value))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5분</SelectItem>
                      <SelectItem value="10">10분</SelectItem>
                      <SelectItem value="30">30분</SelectItem>
                      <SelectItem value="60">1시간</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="max-access" className="text-sm font-medium">최대 접속 횟수</Label>
                  <Select value={maxAccess.toString()} onValueChange={(value) => setMaxAccess(parseInt(value))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1회</SelectItem>
                      <SelectItem value="5">5회</SelectItem>
                      <SelectItem value="10">10회</SelectItem>
                      <SelectItem value="20">20회</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  onClick={handleGenerateTransfer}
                  disabled={isGenerating || contacts.length === 0}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      생성 중...
                    </>
                  ) : (
                    <>
                      <QrCode className="w-4 h-4 mr-2" />
                      전송 링크 생성 ({contacts.length}개 연락처)
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 결과 영역 */}
          {transferLink && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* QR 코드 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="w-5 h-5" />
                    QR 코드
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      {qrCodeUrl && (
                        <img 
                          src={qrCodeUrl} 
                          alt="Transfer QR Code" 
                          className="w-64 h-64 border rounded-lg"
                        />
                      )}
                    </div>
                    
                    <Button
                      onClick={handleDownloadQR}
                      variant="outline"
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      QR 코드 다운로드
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 링크 정보 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link2 className="w-5 h-5" />
                    전송 링크
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">링크 주소</Label>
                      <div className="mt-1 flex gap-2">
                        <Input
                          value={transferLink.url}
                          readOnly
                          className="flex-1"
                        />
                        <Button
                          onClick={handleCopyLink}
                          variant="outline"
                          size="sm"
                        >
                          {linkCopied ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-slate-500">남은 시간</div>
                        <div className="font-medium">
                          {formatTimeRemaining(timeRemaining)}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500">접속 현황</div>
                        <div className="font-medium">
                          {transferLink.accessCount}/{transferLink.maxAccess}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-slate-500 mb-2">접속 진행률</div>
                      <Progress 
                        value={getTransferProgress(transferLink).percentage} 
                        className="h-2"
                      />
                    </div>

                    <Button
                      onClick={handleShareLink}
                      className="w-full"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      링크 공유
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 상태 정보 */}
          {transferLink && (
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {contacts.length}
                    </div>
                    <div className="text-sm text-slate-600">연락처</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatTimeRemaining(timeRemaining)}
                    </div>
                    <div className="text-sm text-slate-600">남은 시간</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {transferLink.maxAccess - transferLink.accessCount}
                    </div>
                    <div className="text-sm text-slate-600">남은 접속</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.round(getTransferProgress(transferLink).percentage)}%
                    </div>
                    <div className="text-sm text-slate-600">사용률</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 사용 가이드 */}
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3 text-blue-900">🎯 빠른 전송 가이드</h3>
              <div className="grid md:grid-cols-2 gap-y-3 gap-x-6 text-sm text-blue-800">
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0"></span>
                  <span>QR 코드를 모바일로 스캔하여 바로 접속</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0"></span>
                  <span>링크를 카톡/메일로 공유하여 전송</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0"></span>
                  <span>10분 만료로 보안성 확보</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0"></span>
                  <span>접속 제한으로 무단 사용 방지</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
