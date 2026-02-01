import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '업데이트 소식 | PhoneDrop',
  description: 'PhoneDrop의 최신 업데이트 및 새로운 기능 소식',
}

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">업데이트 소식</h1>
        
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-8">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold">NEW</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">PhoneDrop v1.0 정식 출시!</h2>
                <p className="text-slate-600 mb-4">2024년 2월 2일</p>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-700 leading-relaxed">
                    드디어 PhoneDrop v1.0이 정식으로 출시되었습니다! 
                    PC에서 연락처를 입력하여 모바일에서 쉽게 저장할 수 있는 혁신적인 서비스를 지금 바로 경험해보세요.
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900 mt-4 mb-2">주요 기능</h3>
                  <ul className="list-disc pl-6 text-slate-700 space-y-1">
                    <li>🤖 AI 스마트 입력으로 연락처 자동 인식</li>
                    <li>📊 대량 업로드 (CSV, Excel) 지원</li>
                    <li>🎴 디지털 명함 생성</li>
                    <li>📱 QR 코드로 즉시 저장</li>
                    <li>🔗 프로필 페이지 공유</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
              <h2 className="text-xl font-bold text-slate-900">준비 중인 기능</h2>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-400 pl-4">
                <h3 className="font-semibold text-slate-900">🤖 AI 디지털 명함 디자인</h3>
                <p className="text-slate-600 text-sm mt-1">
                  AI가 연락처 정보를 분석하여 최적의 명함 디자인을 추천해주는 기능을 준비 중입니다.
                </p>
              </div>
              <div className="border-l-4 border-green-400 pl-4">
                <h3 className="font-semibold text-slate-900">🌐 다국어 지원</h3>
                <p className="text-slate-600 text-sm mt-1">
                  영어, 일본어, 중국어 등 다국어 인터페이스 지원을 계획 중입니다.
                </p>
              </div>
              <div className="border-l-4 border-purple-400 pl-4">
                <h3 className="font-semibold text-slate-900">📱 모바일 앱</h3>
                <p className="text-slate-600 text-sm mt-1">
                  iOS 및 Android 네이티브 앱 출시를 준비 중입니다.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <h2 className="text-xl font-bold text-slate-900">최근 개선 사항</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-green-600 font-medium">2024.02.02</span>
                <span className="text-slate-700">Footer 링크 모두 활성화 및 법적 고지 페이지 추가</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-green-600 font-medium">2024.02.02</span>
                <span className="text-slate-700">AI 템플릿 기능 안정화 및 사용자 경험 개선</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-green-600 font-medium">2024.02.02</span>
                <span className="text-slate-700">탭 네비게이션 중복 문제 해결</span>
              </div>
            </div>
          </div>

          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">📧 소식 구독</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-slate-700 mb-4">
                PhoneDrop의 최신 소식과 업데이트를 가장 먼저 받아보세요!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="이메일 주소를 입력하세요"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  구독하기
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                * 구독은 언제든지 해지할 수 있으며, 스팸 메일은 발송되지 않습니다.
              </p>
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">🔗 더 많은 정보</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-slate-200 rounded-lg p-6">
                <h3 className="font-semibold text-slate-900 mb-3">GitHub</h3>
                <p className="text-slate-600 mb-3">
                  오픈소스 프로젝트로 개발되고 있으며, 최신 코드와 개발 현황을 확인할 수 있습니다.
                </p>
                <a 
                  href="https://github.com/Kim-BanSeok/PhoneDrop" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  GitHub 저장소 보기
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
              
              <div className="border border-slate-200 rounded-lg p-6">
                <h3 className="font-semibold text-slate-900 mb-3">자가 해결</h3>
                <p className="text-slate-600 mb-3">
                  문제가 있으시면 FAQ 페이지나 사용 가이드를 참고해 주세요.
                </p>
                <a 
                  href="/faq" 
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  FAQ 페이지로 이동
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
