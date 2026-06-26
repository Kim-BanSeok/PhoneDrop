'use client'

import { CheckCircle2, Layers, QrCode, Shield, Smartphone } from 'lucide-react'

export default function WhyPhoneDropSection() {
  return (
    <section className="overflow-hidden py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950">
              PhoneDrop이 유용한 상황
            </h2>
            <p className="mt-5 text-lg text-slate-600 leading-relaxed">
              연락처를 한 번에 정리해야 하거나, 명함을 모바일 주소록으로 옮겨야 하거나, CSV와 Excel을 vCard로
              바꿔야 할 때 빠르게 쓸 수 있습니다.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <article className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-950">대량 정리</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    여러 명의 연락처를 한 번에 불러와 구조를 맞추고 필요한 항목만 남길 수 있습니다.
                  </p>
                </div>
              </article>

              <article className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <QrCode className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-950">QR 공유</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    파일을 직접 주고받지 않아도 QR 코드만 보여 주면 모바일에서 바로 등록할 수 있습니다.
                  </p>
                </div>
              </article>

              <article className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-950">개인정보 관리</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    입력값을 정리한 뒤 필요한 파일만 만들어 저장 범위를 줄일 수 있습니다.
                  </p>
                </div>
              </article>

              <article className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-950">모바일 호환</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    iPhone과 Android 모두에서 열 수 있는 형식으로 내보내기를 지원합니다.
                  </p>
                </div>
              </article>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-blue-400/10 blur-3xl" />
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600">사용 시나리오 1</p>
                  <p className="mt-2 text-sm text-slate-600">
                    행사 현장에서 받은 명함 목록을 빠르게 정리해 팀 주소록으로 배포
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">사용 시나리오 2</p>
                  <p className="mt-2 text-sm text-slate-600">
                    CSV 파일을 vCard로 바꿔서 휴대폰 주소록에 바로 가져오기
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-violet-600">사용 시나리오 3</p>
                  <p className="mt-2 text-sm text-slate-600">
                    중복 연락처를 정리한 뒤 파일로 저장하고, 필요한 사람에게 QR로 공유
                  </p>
                </div>
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold text-blue-800">
                    <CheckCircle2 className="h-4 w-4" />
                    사용자가 바로 얻는 결과
                  </p>
                  <p className="mt-2 text-sm text-blue-900">
                    정리된 연락처 목록, 모바일 호환 파일, 공유 가능한 QR 코드, 그리고 설명 페이지까지 함께 확보할 수
                    있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
