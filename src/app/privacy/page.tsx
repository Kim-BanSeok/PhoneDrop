import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '개인정보처리방침 | PhoneDrop',
  description: 'PhoneDrop의 개인정보처리방침 및 개인정보 보호 정책',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">개인정보처리방침</h1>
        
        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. 개인정보의 수집 및 이용</h2>
            <p className="text-slate-600 leading-relaxed">
              PhoneDrop은 사용자의 연락처 정보를 수집하며, 이 정보는 오직 vCard 파일 생성 및 다운로드 목적으로만 사용됩니다.
              수집된 개인정보는 서버에 저장되지 않으며, 사용자의 브라우저 내에서만 처리됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. 개인정보의 보관 및 파기</h2>
            <p className="text-slate-600 leading-relaxed">
              사용자의 개인정보는 서버에 저장되지 않으므로 별도의 보관 기간이 없습니다.
              브라우저 세션이 종료되면 모든 정보는 자동으로 삭제됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. 개인정보의 제3자 제공</h2>
            <p className="text-slate-600 leading-relaxed">
              PhoneDrop은 사용자의 개인정보를 제3자에게 제공하지 않습니다.
              모든 데이터 처리는 사용자의 기기 내에서 완전히 이루어집니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. 이용자의 권리</h2>
            <p className="text-slate-600 leading-relaxed">
              사용자는 언제든지 자신의 개인정보를 삭제하거나 수정할 권리가 있습니다.
              브라우저를 닫거나 페이지를 새로고침하면 모든 정보가 즉시 삭제됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. 기술적 보안 조치</h2>
            <p className="text-slate-600 leading-relaxed">
              PhoneDrop은 HTTPS 암호화를 통해 데이터 전송 시 보안을 유지하며,
              클라이언트 측에서만 데이터를 처리하므로 외부 공격으로부터 안전합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. 연락처</h2>
            <p className="text-slate-600 leading-relaxed">
              개인정보처리방침과 관련된 문의사항은 다음 연락처로 문의해 주시기 바랍니다:
            </p>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-slate-700">이메일: privacy@phonedrop.app</p>
              <p className="text-slate-700">홈페이지: https://phonedrop.app</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. 개인정보처리방침 변경</h2>
            <p className="text-slate-600 leading-relaxed">
              본 개인정보처리방침은 법률의 변경이나 회사 정책의 변경에 따라 수정될 수 있습니다.
              변경이 있을 경우 웹사이트를 통해 공지될 것입니다.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500 text-center">
              본 개인정보처리방침은 2024년 2월 2일부터 시행됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
