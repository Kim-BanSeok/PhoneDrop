import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '사용 방법 | PhoneDrop',
  description: 'PhoneDrop의 상세 사용 가이드 및 튜토리얼',
}

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">PhoneDrop 사용 방법</h1>
        
        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">🚀 시작하기</h2>
            <p className="text-slate-600 leading-relaxed">
              PhoneDrop은 PC에서 연락처를 입력하여 모바일에서 쉽게 저장할 수 있는 웹 서비스입니다.
              다음 단계를 따라 쉽게 시작해보세요.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">📝 연락처 입력 방법</h2>
            
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">1. 스마트 입력 (AI 자동 인식)</h3>
                <ol className="list-decimal pl-6 text-blue-800 space-y-2">
                  <li>입력 탭에서 &quot;🤖 PhoneDrop 스마트 입력기&quot; 섹션으로 이동</li>
                  <li>텍스트 입력란에 연락처 정보 붙여넣기 (엑셀, 카톡, 이메일 등)</li>
                  <li>AI가 자동으로 이름, 전화번호, 이메일 등을 분리</li>
                  <li>인식 결과 확인 후 &quot;연락처 추가&quot; 버튼 클릭</li>
                </ol>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">2. 대량 업로드 (CSV/Excel)</h3>
                <ol className="list-decimal pl-6 text-green-800 space-y-2">
                  <li>&quot;대량 연락처 업로드&quot; 섹션에서 템플릿 다운로드</li>
                  <li>다운로드한 템플릿 파일에 연락처 정보 입력</li>
                  <li>파일 선택 버튼으로 업로드</li>
                  <li>변환된 연락처 확인 및 추가</li>
                </ol>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">3. 직접 입력</h3>
                <ol className="list-decimal pl-6 text-purple-800 space-y-2">
                  <li>&quot;직접 입력&quot; 섹션에서 폼에 정보 입력</li>
                  <li>이름, 전화번호는 필수, 나머지는 선택</li>
                  <li>&quot;연락처 추가&quot; 버튼으로 목록에 추가</li>
                  <li>여러 연락처를 계속 입력 가능</li>
                </ol>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">🔧 연락처 관리</h2>
            
            <div className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-900 mb-3">관리 탭 기능</h3>
                <ul className="list-disc pl-6 text-orange-800 space-y-2">
                  <li><strong>네이밍 템플릿:</strong> 연락처 이름을 일괄 변경</li>
                  <li><strong>중복 처리:</strong> 동일 연락처 자동 감지 및 병합</li>
                  <li><strong>오류 수정:</strong> 전화번호/이메일 형식 자동 수정</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">📤 내보내기 및 공유</h2>
            
            <div className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-indigo-900 mb-3">내보내기 탭 옵션</h3>
                <ul className="list-disc pl-6 text-indigo-800 space-y-2">
                  <li><strong>vCard 파일:</strong> 표준 .vcf 파일로 다운로드</li>
                  <li><strong>QR 코드:</strong> 스캔하여 바로 저장</li>
                  <li><strong>디지털 명함:</strong> 개별 연락처 명함 생성</li>
                  <li><strong>프로필 페이지:</strong> 웹 페이지 형태로 공유</li>
                  <li><strong>연락처 패키지:</strong> 여러 연락처를 하나로 묶기</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">📱 모바일에서 저장하기</h2>
            
            <div className="space-y-4">
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-pink-900 mb-3">저장 방법</h3>
                <div className="space-y-3">
                  <div>
                    <strong>방법 1: vCard 파일</strong>
                    <p className="text-pink-800 mt-1">다운로드한 .vcf 파일을 모바일로 전송 후 열기 → 자동으로 주소록에 추가</p>
                  </div>
                  <div>
                    <strong>방법 2: QR 코드</strong>
                    <p className="text-pink-800 mt-1">PC 화면의 QR 코드를 모바일 카메라로 스캔 → 연락처 저장</p>
                  </div>
                  <div>
                    <strong>방법 3: 이메일/메신저</strong>
                    <p className="text-pink-800 mt-1">vCard 파일을 본인에게 전송 후 모바일에서 열기</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">💡 유용한 팁</h2>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <ul className="list-disc pl-6 text-blue-900 space-y-2">
                <li><strong>전화번호 자동 정규화:</strong> 01012345678 → 010-1234-5678로 자동 변환</li>
                <li><strong>다양한 형식 지원:</strong> 엑셀, 카톡, 이메일 등 어디서든 복사한 내용 그대로 사용</li>
                <li><strong>실시간 검증:</strong> 전화번호와 이메일 형식을 실시간으로 검사</li>
                <li><strong>대량 처리:</strong> 수백 개의 연락처도 한 번에 처리 가능</li>
                <li><strong>개인정보 보호:</strong> 모든 처리는 브라우저에서만 이루어짐</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">🆘 문의 및 지원</h2>
            <p className="text-slate-600 leading-relaxed">
              사용 중 문제가 있거나 궁금한 점이 있으시면 FAQ 페이지나 사용 가이드를 참고해 주세요.
            </p>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-slate-700">홈페이지: https://phone-drop.vercel.app</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
