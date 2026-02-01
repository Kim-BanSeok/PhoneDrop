import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '이용약관 | PhoneDrop',
  description: 'PhoneDrop 서비스 이용약관 및 이용 조건',
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">이용약관</h1>
        
        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. 서비스의 목적</h2>
            <p className="text-slate-600 leading-relaxed">
              PhoneDrop은 사용자가 PC에서 연락처 정보를 입력하여 vCard(.vcf) 파일을 생성하고,
              모바일 기기에서 쉽게 저장할 수 있도록 하는 웹 기반 서비스입니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. 서비스 이용 조건</h2>
            <p className="text-slate-600 leading-relaxed">
              본 서비스를 이용하기 위해서는 다음 조건에 동의해야 합니다:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>만 14세 이상이어야 합니다.</li>
              <li>본 이용약관의 모든 조항에 동의해야 합니다.</li>
              <li>타인의 개인정보를 무단으로 수집하거나 이용해서는 안 됩니다.</li>
              <li>서비스를 불법적인 목적으로 사용해서는 안 됩니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. 사용자의 책임</h2>
            <p className="text-slate-600 leading-relaxed">
              사용자는 다음 사항에 대한 책임을 집니다:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>입력하는 연락처 정보의 정확성</li>
              <li>수집된 연락처의 적법적인 사용</li>
              <li>타인의 개인정보 보호</li>
              <li>서비스 약관 준수</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. 서비스 제공</h2>
            <p className="text-slate-600 leading-relaxed">
              PhoneDrop은 다음 서비스를 제공합니다:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>연락처 정보 입력 및 관리</li>
              <li>vCard 파일 생성 및 다운로드</li>
              <li>QR 코드 생성</li>
              <li>디지털 명함 생성</li>
              <li>연락처 패키지 기능</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. 데이터 처리</h2>
            <p className="text-slate-600 leading-relaxed">
              모든 데이터 처리는 사용자의 브라우저에서 클라이언트 측으로 이루어집니다.
              서버에는 어떠한 개인정보도 저장되지 않으며, 사용자가 브라우저를 닫으면 모든 데이터는 즉시 삭제됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. 지적재산권</h2>
            <p className="text-slate-600 leading-relaxed">
              PhoneDrop의 모든 콘텐츠, 디자인, 기술은 지적재산권으로 보호됩니다.
              사용자는 서비스를 이용하면서 생성된 vCard 파일에 대해서만 소유권을 가집니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. 서비스의 변경 및 중단</h2>
            <p className="text-slate-600 leading-relaxed">
              PhoneDrop은 사전 고지 없이 서비스의 일부 또는 전부를 변경하거나 중단할 수 있습니다.
              다만, 중단 시 사용자에게 최소 30일 전에 공지합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. 면책 조항</h2>
            <p className="text-slate-600 leading-relaxed">
              PhoneDrop은 다음 경우에 대해 책임을 지지 않습니다:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>사용자가 입력한 정보의 정확성</li>
              <li>사용자의 불법적인 서비스 이용</li>
              <li>기술적 문제로 인한 서비스 중단</li>
              <li>제3자의 불법적인 행위</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. 분쟁 해결</h2>
            <p className="text-slate-600 leading-relaxed">
              서비스 이용 중 발생하는 분쟁은 당사자 간의 협의를 통해 해결하는 것을 원칙으로 합니다.
              협의가 불가능할 경우 대한민국 법률에 따라 해결합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. 약관의 변경</h2>
            <p className="text-slate-600 leading-relaxed">
              본 이용약관은 필요에 따라 변경될 수 있으며, 변경 시 웹사이트를 통해 공지합니다.
              변경된 약관은 공지 후 7일이 경과하면 효력이 발생합니다.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500 text-center">
              본 이용약관은 2024년 2월 2일부터 시행됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
