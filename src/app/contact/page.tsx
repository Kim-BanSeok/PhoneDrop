import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '문의하기 | PhoneDrop',
  description: 'PhoneDrop 서비스 문의 및 지원',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">문의하기</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">연락처</h2>
            <div className="bg-slate-50 rounded-lg p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">이메일</h3>
                  <p className="text-slate-600">support@phonedrop.app</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">홈페이지</h3>
                  <p className="text-slate-600">https://phonedrop.app</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">문의 유형</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-slate-200 rounded-lg p-6">
                <h3 className="font-semibold text-slate-900 mb-2">🔧 기술 지원</h3>
                <ul className="text-slate-600 space-y-1 text-sm">
                  <li>사용 방법 문의</li>
                  <li>오류 및 버그 신고</li>
                  <li>기능 개선 제안</li>
                </ul>
              </div>
              <div className="border border-slate-200 rounded-lg p-6">
                <h3 className="font-semibold text-slate-900 mb-2">💼 비즈니스 문의</h3>
                <ul className="text-slate-600 space-y-1 text-sm">
                  <li>대량 계약 문의</li>
                  <li>API 연동 문의</li>
                  <li>파트너십 제안</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">문의 전 확인사항</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">문의 전에 확인해 주세요</h3>
              <ul className="list-disc pl-6 text-blue-800 space-y-2 text-sm">
                <li>FAQ 페이지에서 답변을 찾아보세요</li>
                <li>사용 가이드를 먼저 확인해 주세요</li>
                <li>브라우저를 최신 버전으로 업데이트해 주세요</li>
                <li>캐시를 삭제하고 다시 시도해 보세요</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">응답 시간</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <ul className="list-disc pl-6 text-green-800 space-y-2">
                <li>일반 문의: 영업일 기준 24시간 내</li>
                <li>긴급 기술 문제: 영업일 기준 12시간 내</li>
                <li>비즈니스 문의: 영업일 기준 48시간 내</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">운영 시간</h2>
            <div className="bg-slate-50 rounded-lg p-6">
              <ul className="text-slate-600 space-y-2">
                <li><strong>평일:</strong> 09:00 - 18:00</li>
                <li><strong>주말 및 공휴일:</strong> 휴무</li>
                <li><strong>응답 가능 시간:</strong> 운영 시간 내 우선 응답</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
