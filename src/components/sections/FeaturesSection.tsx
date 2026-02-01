'use client'

import { Monitor, Download, Smartphone } from 'lucide-react'

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-slate-50" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">어떻게 작동하나요?</h2>
          <p className="text-slate-600">단 세 단계만으로 연락처를 스마트폰에 동기화할 수 있습니다.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="group p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Monitor className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">PC에서 입력</h3>
            <p className="text-slate-600 leading-relaxed">
              웹사이트에서 전화번호를 간편하게 입력하세요. 엑셀 파일 대량 업로드도 지원합니다.
            </p>
          </div>

          <div className="group p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Download className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">vCard 생성</h3>
            <p className="text-slate-600 leading-relaxed">
              클릭 한 번으로 표준 연락처 형식인 vCard 파일을 안전하게 생성합니다.
            </p>
          </div>

          <div className="group p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Smartphone className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">휴대폰에서 저장</h3>
            <p className="text-slate-600 leading-relaxed">
              모바일에서 QR을 찍거나 파일을 열어 주소록에 바로 추가하세요.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
