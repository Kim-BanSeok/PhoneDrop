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
        </div>
      </div>
    </div>
  )
}
