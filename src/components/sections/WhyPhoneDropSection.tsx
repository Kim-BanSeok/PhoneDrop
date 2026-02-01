'use client'

import { Layers, QrCode, Shield, Smartphone } from 'lucide-react'

export default function WhyPhoneDropSection() {
  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">왜 PhoneDrop인가요?</h2>
            <p className="text-lg text-slate-600 mb-10">전화번호 관리를 가장 쉽고 빠르게 만들어드립니다. 복잡한 동기화 과정 없이 즉시 완료하세요.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">대량 처리</h4>
                  <p className="text-sm text-slate-500">수백 명의 연락처를 한 번에 업로드</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">QR 코드 공유</h4>
                  <p className="text-sm text-slate-500">파일 다운로드 없이 스캔으로 즉시 저장</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">안전한 처리</h4>
                  <p className="text-sm text-slate-500">개인정보는 서버에 저장되지 않습니다</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">모든 기기 호환</h4>
                  <p className="text-sm text-slate-500">iPhone 및 Android 완벽 지원</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="relative z-10 p-6 bg-white rounded-3xl shadow-2xl border border-slate-100">
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-blue-600 uppercase">사용 시나리오 #1</span>
                    <span className="text-xs text-slate-400">기업 영업팀</span>
                  </div>
                  <p className="text-sm text-slate-600 font-medium">신입사원에게 고객 연락처를 빠르고 정확하게 전달하세요.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-green-600 uppercase">사용 시나리오 #2</span>
                    <span className="text-xs text-slate-400">이벤트 주최자</span>
                  </div>
                  <p className="text-sm text-slate-600 font-medium">참가자 명단을 참석자들에게 쉽게 공유할 수 있습니다.</p>
                </div>
              </div>
            </div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-400/10 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
