'use client'

import { Download, Monitor, Smartphone, Sparkles } from 'lucide-react'

export default function FeaturesSection() {
  return (
    <section className="bg-slate-50 py-24" id="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950">
            왜 PhoneDrop을 쓰는가
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            단순히 광고를 보여주는 화면이 아니라, 실제로 연락처를 정리하고 재사용할 수 있는 정보와 작업 흐름을
            제공합니다.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <article className="group rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <Monitor className="h-8 w-8" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-950">PC에서 빠르게 입력</h3>
            <p className="text-slate-600 leading-relaxed">
              복사한 연락처를 붙여 넣거나 파일을 불러와서 한 번에 정리할 수 있습니다. 수동 입력보다 훨씬 빠르고,
              대량 작업에도 맞습니다.
            </p>
          </article>

          <article className="group rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-950">정리와 검증</h3>
            <p className="text-slate-600 leading-relaxed">
              전화번호 포맷, 이메일 형식, 이름 중복을 점검하고 수정할 수 있습니다. 저장 전에 데이터를 다듬는
              단계가 들어가면 이후 관리가 쉬워집니다.
            </p>
          </article>

          <article className="group rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
              <Download className="h-8 w-8" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-950">바로 내보내기</h3>
            <p className="text-slate-600 leading-relaxed">
              vCard 파일과 QR 코드로 바로 전달할 수 있어 모바일 저장이 간단합니다. 연락처를 한 번 만든 뒤 바로
              공유할 수 있다는 점이 핵심입니다.
            </p>
          </article>
        </div>

        <div className="mt-10 rounded-3xl border border-blue-100 bg-white p-6 text-slate-700 shadow-sm">
          <p className="font-semibold text-slate-950">이 페이지가 제공하는 정보</p>
          <p className="mt-2 leading-relaxed">
            연락처 정리, 입력 방식, 파일 형식, 모바일 저장 방법, 개인정보 처리 방침까지 함께 확인할 수 있어
            검색 유입 사용자에게 실질적인 도움을 줍니다.
          </p>
        </div>
      </div>
    </section>
  )
}
