'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BookOpen, Download, FileText, ShieldCheck, Sparkles, Zap } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface HeroSectionProps {
  onNavigateToInput?: () => void
}

export default function HeroSection({ onNavigateToInput }: HeroSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleStartClick = () => {
    if (onNavigateToInput) {
      onNavigateToInput()
      return
    }

    window.location.hash = '#input'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="pt-32 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 hero-gradient pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 mb-6">
            <Sparkles className="h-4 w-4" />
            연락처 정리, vCard 생성, QR 공유를 한 번에
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-950 leading-tight">
            연락처를 빠르게 정리하고
            <span className="block text-blue-600">바로 내보내세요</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-slate-600 leading-relaxed">
            PhoneDrop은 PC에서 입력한 연락처를 정리하고, 중복을 줄이고, vCard(.vcf) 파일이나 QR 코드로 내보내는
            무료 웹 도구입니다. 대량 입력, 직접 입력, 오류 수정까지 한 화면에서 처리할 수 있습니다.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold shadow-xl shadow-blue-600/25 hover:bg-blue-700 transition-all"
              onClick={handleStartClick}
            >
              <Zap className="mr-2 h-5 w-5" />
              지금 시작하기
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  사용 가이드
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl">PhoneDrop 사용 가이드</DialogTitle>
                  <DialogDescription className="text-base">
                    입력 방식, 정리 방식, 내보내기 방식을 빠르게 확인할 수 있는 요약입니다.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 text-left">
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-blue-900">
                      <FileText className="h-5 w-5" />
                      입력 방법
                    </h3>
                    <ul className="space-y-2 text-sm text-blue-900">
                      <li>· 텍스트 박스에 이름, 전화번호, 이메일을 붙여 넣기</li>
                      <li>· CSV 또는 Excel 파일을 불러와 대량 입력하기</li>
                      <li>· 직접 한 줄씩 추가해서 간단한 목록 만들기</li>
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5">
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-emerald-900">
                      <ShieldCheck className="h-5 w-5" />
                      정리 기능
                    </h3>
                    <ul className="space-y-2 text-sm text-emerald-900">
                      <li>· 전화번호 형식을 자동으로 정리</li>
                      <li>· 중복 연락처를 찾아 병합하거나 삭제</li>
                      <li>· 잘못된 이메일, 번호, 이름을 바로 수정</li>
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-violet-100 bg-violet-50/70 p-5">
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-violet-900">
                      <Download className="h-5 w-5" />
                      내보내기
                    </h3>
                    <ul className="space-y-2 text-sm text-violet-900">
                      <li>· .vcf 파일로 내보내 모바일 주소록에 바로 저장</li>
                      <li>· QR 코드로 공유해서 현장에서 바로 등록</li>
                      <li>· 정리한 연락처를 다시 편집 화면으로 넘겨 추가 작업</li>
                    </ul>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="mt-16 mx-auto max-w-5xl">
          <div className="grid gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/50 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-semibold text-blue-600">핵심 기능</p>
              <p className="mt-2 text-slate-700">연락처 입력, 정리, 내보내기를 한 흐름으로 연결합니다.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-semibold text-blue-600">권장 사용</p>
              <p className="mt-2 text-slate-700">명함 관리, 행사 명단 정리, 모바일 주소록 이전에 적합합니다.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-semibold text-blue-600">개인정보</p>
              <p className="mt-2 text-slate-700">입력한 연락처는 브라우저에서 처리되며, 저장 여부는 사용 기능에 따라 달라집니다.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
