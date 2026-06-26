'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { QrCode, Link2, Share2, Download, Copy, CheckCircle } from 'lucide-react'
import { QuickTransferService, downloadTransferQR, shareTransferLink, formatTimeRemaining, getTransferProgress, type TransferLink, type TransferOptions } from '@/lib/quickTransfer'
import { type Contact } from '@/lib/vcard'
import { useToast } from '@/hooks/use-toast'

interface QuickTransferSectionProps {
  contacts: Contact[]
}

export default function QuickTransferSection({ contacts }: QuickTransferSectionProps) {
  const [transferLink, setTransferLink] = useState<TransferLink | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [expiresIn, setExpiresIn] = useState(10)
  const [maxAccess, setMaxAccess] = useState(10)
  const [linkCopied, setLinkCopied] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined

    if (transferLink && transferLink.expiresAt.getTime() > Date.now()) {
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
    if (contacts.length === 0) return
    setIsGenerating(true)
    try {
      const service = QuickTransferService.getInstance()
      const options: TransferOptions = { expiresIn, maxAccess }
      const link = await service.createTransferLink(contacts, options)
      const qr = await service.generateTransferQR(contacts, options)
      setTransferLink(link)
      setQrCodeUrl(qr)
      setTimeRemaining(link.expiresAt.getTime() - Date.now())
      toast({ title: '전송 링크 생성 완료', description: '연락처 전송용 임시 링크를 만들었습니다.' } as any)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyLink = async () => {
    if (!transferLink) return
    await navigator.clipboard.writeText(transferLink.url)
    setLinkCopied(true)
    toast({ title: '링크 복사 완료', description: '전송 링크를 클립보드에 복사했습니다.' } as any)
    setTimeout(() => setLinkCopied(false), 3000)
  }

  const handleShareLink = async () => {
    if (!transferLink) return
    await shareTransferLink(contacts, { expiresIn, maxAccess })
    toast({ title: '공유 완료', description: '전송 링크를 공유할 수 있습니다.' } as any)
  }

  const handleDownloadQR = async () => {
    if (contacts.length === 0) return
    await downloadTransferQR(contacts, { expiresIn, maxAccess })
  }

  return (
    <section className="mx-auto mb-24 max-w-5xl px-4" id="quick-transfer">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
            <Link2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-950">PC에서 모바일로 빠르게 전송</h2>
            <p className="text-slate-500">임시 링크와 QR 코드로 연락처를 짧은 시간 안에 전달합니다.</p>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>전송 설정</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>만료 시간</Label>
                <Select value={String(expiresIn)} onValueChange={(value) => setExpiresIn(Number(value))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5분</SelectItem>
                    <SelectItem value="10">10분</SelectItem>
                    <SelectItem value="30">30분</SelectItem>
                    <SelectItem value="60">1시간</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>최대 접근 횟수</Label>
                <Select value={String(maxAccess)} onValueChange={(value) => setMaxAccess(Number(value))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1회</SelectItem>
                    <SelectItem value="5">5회</SelectItem>
                    <SelectItem value="10">10회</SelectItem>
                    <SelectItem value="20">20회</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Button onClick={handleGenerateTransfer} disabled={isGenerating || contacts.length === 0} className="w-full bg-purple-600 text-white hover:bg-purple-700">
                  <QrCode className="mr-2 h-4 w-4" />
                  전송 링크 만들기 ({contacts.length}개)
                </Button>
              </div>
            </CardContent>
          </Card>

          {transferLink ? (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>QR 코드</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img src={qrCodeUrl} alt="Transfer QR Code" className="w-full rounded-lg border" />
                  <Button onClick={handleDownloadQR} variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    QR 코드 다운로드
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>전송 링크</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>링크 주소</Label>
                    <div className="mt-1 flex gap-2">
                      <Input value={transferLink.url} readOnly />
                      <Button variant="outline" onClick={handleCopyLink}>
                        {linkCopied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-slate-500">남은 시간</div>
                      <div className="font-medium">{formatTimeRemaining(timeRemaining)}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">접근 횟수</div>
                      <div className="font-medium">{transferLink.accessCount}/{transferLink.maxAccess}</div>
                    </div>
                  </div>
                  <Progress value={getTransferProgress(transferLink).percentage} className="h-2" />
                  <Button onClick={handleShareLink} className="w-full">
                    <Share2 className="mr-2 h-4 w-4" />
                    링크 공유
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="border-dashed border-slate-200 bg-slate-50">
              <CardContent className="p-8 text-center text-slate-600">
                연락처가 있으면 전송 링크와 QR 코드를 만들 수 있습니다.
              </CardContent>
            </Card>
          )}

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
            <CardContent className="p-6">
              <h3 className="mb-3 font-semibold text-purple-900">이 기능이 유용한 이유</h3>
              <div className="grid gap-3 md:grid-cols-2 text-sm text-purple-800">
                <div>· 현장에서 파일 대신 링크만 전달</div>
                <div>· QR 코드로 모바일 열람을 단순화</div>
                <div>· 만료 시간과 접근 횟수로 공유 범위 통제</div>
                <div>· 전송 기록과 내부 안내 페이지로 구조화</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
