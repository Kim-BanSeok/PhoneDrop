import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '개인정보처리방침 | PhoneDrop',
  description: 'PhoneDrop이 개인정보를 어떻게 처리하는지 설명하는 정책 페이지입니다.',
}

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Privacy</p>
          <h1 className="mt-3 text-4xl font-black text-slate-950 md:text-5xl">개인정보처리방침</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">
            PhoneDrop은 사용자가 어떤 정보를 입력하고 그 정보가 어디에서 처리되는지 명확하게 설명하는 것을 목표로 합니다.
          </p>
        </div>

        <div className="space-y-8">
          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-2xl font-bold text-slate-950">1. 수집하는 정보</h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              연락처 입력 화면에 사용자가 직접 넣는 이름, 전화번호, 이메일, 회사명 같은 정보가 처리 대상이 될 수 있습니다.
              기본적인 정리와 변환은 브라우저에서 이루어지도록 설계되어 있습니다.
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-2xl font-bold text-slate-950">2. 정보의 사용 목적</h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              입력된 정보는 연락처 정리, vCard 생성, QR 코드 생성, 중복 검사, 파일 다운로드를 위한 처리 목적에만 사용됩니다.
              별도 동의 없이 마케팅 용도로 재사용하지 않습니다.
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-2xl font-bold text-slate-950">3. 외부 API 사용</h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              일부 AI 관련 기능을 사용할 경우 사용자가 입력한 프롬프트와 선택한 설정값이 외부 이미지 생성 API로 전송될 수
              있습니다. 이 경우에도 실제 연락처 데이터를 그대로 전송하지 않도록 설계하는 것이 원칙입니다.
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-2xl font-bold text-slate-950">4. 저장과 보관</h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              가능한 한 브라우저에서 처리하고, 서버에 장기 저장하지 않는 방향을 기본으로 합니다. 사용자가 파일을
              다운로드하면 그 파일은 사용자의 기기에서 관리됩니다.
            </p>
          </section>

          <section id="ads" className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-2xl font-bold text-slate-950">5. 광고와 콘텐츠 분리</h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              광고가 표시되더라도 본문 콘텐츠보다 앞에 배치하지 않으며, 안내 페이지와 도움말 페이지를 통해 실제 사용
              정보가 먼저 보이도록 구성합니다. 광고는 콘텐츠를 보조하는 수단입니다.
            </p>
          </section>

          <section id="cookies" className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-2xl font-bold text-slate-950">6. 쿠키 안내</h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              서비스 운영에 필요한 최소한의 세션 정보나 환경 설정이 사용될 수 있습니다. 광고나 분석 기능을 추가할
              경우에는 별도 고지와 동의를 우선합니다.
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-2xl font-bold text-slate-950">7. 문의</h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              개인정보 관련 문의나 삭제 요청이 있으면 사이트의 문의 채널을 통해 알려 주십시오. 가능한 범위 안에서
              확인 후 안내하겠습니다.
            </p>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-3 text-sm">
          <Link className="text-blue-700 hover:underline" href="/">홈</Link>
          <Link className="text-blue-700 hover:underline" href="/guide">사용 가이드</Link>
          <Link className="text-blue-700 hover:underline" href="/faq">FAQ</Link>
          <Link className="text-blue-700 hover:underline" href="/terms">이용약관</Link>
        </div>
      </div>
    </main>
  )
}
