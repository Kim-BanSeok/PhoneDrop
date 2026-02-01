import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '자주 묻는 질문 | PhoneDrop',
  description: 'PhoneDrop 사용에 관한 자주 묻는 질문 및 답변',
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">자주 묻는 질문</h1>
        
        <div className="space-y-8">
          <div className="border-b border-slate-200 pb-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Q: PhoneDrop은 어떤 서비스인가요?</h3>
            <p className="text-slate-600 leading-relaxed">
              A: PhoneDrop은 PC에서 연락처 정보를 입력하여 vCard(.vcf) 파일을 생성하고, 
              모바일 기기에서 쉽게 저장할 수 있도록 하는 웹 기반 서비스입니다.
            </p>
          </div>

          <div className="border-b border-slate-200 pb-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Q: 개인정보는 안전한가요?</h3>
            <p className="text-slate-600 leading-relaxed">
              A: 네, 모든 데이터 처리는 사용자의 브라우저에서만 이루어집니다. 
              서버에는 어떠한 개인정보도 저장되지 않으며, 브라우저를 닫으면 모든 정보가 즉시 삭제됩니다.
            </p>
          </div>

          <div className="border-b border-slate-200 pb-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Q: 어떤 파일 형식을 지원하나요?</h3>
            <p className="text-slate-600 leading-relaxed">
              A: CSV, Excel 파일을 직접 업로드할 수 있으며, 텍스트 형태로 복사한 내용도 
              스마트 입력 기능으로 자동 인식할 수 있습니다.
            </p>
          </div>

          <div className="border-b border-slate-200 pb-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Q: vCard 파일이란 무엇인가요?</h3>
            <p className="text-slate-600 leading-relaxed">
              A: vCard(.vcf)는 전자명함 표준 파일 형식으로, 대부분의 스마트폰과 
              주소록 애플리케이션에서 지원합니다. 파일을 열기만 하면 자동으로 연락처를 추가할 수 있습니다.
            </p>
          </div>

          <div className="border-b border-slate-200 pb-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Q: QR 코드는 어떻게 사용하나요?</h3>
            <p className="text-slate-600 leading-relaxed">
              A: 생성된 QR 코드를 모바일 카메라로 스캔하면 vCard 파일을 다운로드할 수 있는 링크가 나타납니다. 
              링크를 클릭하면 자동으로 연락처를 추가할 수 있습니다.
            </p>
          </div>

          <div className="border-b border-slate-200 pb-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Q: 한 번에 몇 개의 연락처를 처리할 수 있나요?</h3>
            <p className="text-slate-600 leading-relaxed">
              A: 기술적으로는 수백 개의 연락처도 처리 가능합니다. 
              하지만 브라우저 성능에 따라 제한될 수 있으며, 대용량의 경우 여러 번에 나누어 처리하는 것을 권장합니다.
            </p>
          </div>

          <div className="border-b border-slate-200 pb-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Q: 중복된 연락처는 어떻게 처리하나요?</h3>
            <p className="text-slate-600 leading-relaxed">
              A: 관리 탭의 &apos;중복 처리&apos; 기능을 통해 동일한 전화번호나 이름의 연락처를 
              자동으로 감지하고 병합하거나 삭제할 수 있습니다.
            </p>
          </div>

          <div className="border-b border-slate-200 pb-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Q: iPhone에서도 사용할 수 있나요?</h3>
            <p className="text-slate-600 leading-relaxed">
              A: 네, iPhone과 Android 모두 지원합니다. vCard 파일은 iOS와 Android 모두에서 
              표준으로 지원하는 형식입니다.
            </p>
          </div>

          <div className="border-b border-slate-200 pb-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Q: 서비스 비용은 어떻게 되나요?</h3>
            <p className="text-slate-600 leading-relaxed">
              A: PhoneDrop의 기본 기능은 무료로 제공됩니다. 
              향후 유료 기능이 추가될 수 있지만, 현재 모든 기능은 무료로 이용할 수 있습니다.
            </p>
          </div>

          <div className="border-b border-slate-200 pb-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Q: 오프라인에서도 사용할 수 있나요?</h3>
            <p className="text-slate-600 leading-relaxed">
              A: 기본적인 연락처 입력과 vCard 생성은 오프라인에서도 가능합니다. 
              하지만 QR 코드 생성이나 일부 고급 기능은 인터넷 연결이 필요할 수 있습니다.
            </p>
          </div>

          <div className="border-b border-slate-200 pb-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Q: 생성된 파일은 어디에 저장되나요?</h3>
            <p className="text-slate-600 leading-relaxed">
              A: 파일은 사용자의 기기 다운로드 폴더에 저장됩니다. 
              서버에는 저장되지 않으므로 안심하셔도 됩니다.
            </p>
          </div>

          <div className="border-b border-slate-200 pb-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Q: 지원하는 브라우저는 무엇인가요?</h3>
            <p className="text-slate-600 leading-relaxed">
              A: Chrome, Edge, Safari, Firefox 등 모든 최신 브라우저에서 지원됩니다. 
              최신 버전의 브라우저 사용을 권장합니다.
            </p>
          </div>

          <div className="border-b border-slate-200 pb-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Q: 문제가 발생했을 때 어떻게 하나요?</h3>
            <p className="text-slate-600 leading-relaxed">
              A: 먼저 브라우저를 새로고침하고, 캐시를 삭제해보세요. 
              문제가 지속되면 FAQ 페이지에서 해결책을 찾아보세요.
            </p>
          </div>

          <div className="border-b border-slate-200 pb-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Q: 추가로 궁금한 점이 있으면 어떻게 하나요?</h3>
            <p className="text-slate-600 leading-relaxed">
              A: FAQ 페이지에서 자주 묻는 질문을 확인해 보시거나, 
              사용 가이드를 참고해 주세요.
            </p>
          </div>

          <div className="pt-8">
          </div>
        </div>
      </div>
    </div>
  )
}
