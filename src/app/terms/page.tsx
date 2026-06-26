import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '이용약관 | PhoneDrop',
  description: 'PhoneDrop 서비스 이용 조건과 책임 범위를 안내하는 약관 페이지입니다.',
}

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Terms</p>
          <h1 className="mt-3 text-4xl font-black text-slate-950 md:text-5xl">이용약관</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">
            이 서비스는 연락처 정리와 파일 변환을 돕기 위한 웹 도구입니다. 아래 약관은 사용 범위와 책임을 간단하게
            정리한 문서입니다.
          </p>
        </div>

        <div className="space-y-8">
          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-2xl font-bold text-slate-950">1. 서비스 목적</h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              PhoneDrop은 연락처를 입력, 정리, 변환, 내보내기 할 수 있도록 돕는 도구입니다.
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-2xl font-bold text-slate-950">2. 사용자 책임</h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              사용자는 입력하는 연락처 정보의 정확성과 합법적 사용 여부를 스스로 확인해야 합니다.
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-2xl font-bold text-slate-950">3. 금지 행위</h2>
            <ul className="mt-4 space-y-3 text-slate-600">
              <li>· 타인의 개인정보를 무단 수집하거나 유포하는 행위</li>
              <li>· 시스템에 과도한 부하를 주거나 정상 동작을 방해하는 행위</li>
              <li>· 법령이나 제3자의 권리를 침해하는 방식의 사용</li>
            </ul>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-2xl font-bold text-slate-950">4. 서비스 변경</h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              기능은 개선 또는 변경될 수 있으며, 중요한 변경이 있을 경우 안내 페이지를 통해 공지하는 것을 원칙으로 합니다.
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-2xl font-bold text-slate-950">5. 책임 제한</h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              사용자가 입력한 데이터의 정확성, 외부 기기에서의 최종 동작, 브라우저 환경 차이로 인한 문제는 사용자의
              확인이 필요합니다. 서비스는 가능한 범위 안에서 안정적으로 동작하도록 유지합니다.
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-2xl font-bold text-slate-950">6. 광고 정책</h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              광고는 본문 콘텐츠를 보조하는 형태로만 사용합니다. 설명 페이지, FAQ, 정책 문서, 사용 가이드가 먼저 보이도록
              구성하고, 광고만 있는 화면이 되지 않도록 유지합니다.
            </p>
          </section>
        </div>

        <div className="mt-10 flex flex-wrap gap-3 text-sm">
          <Link className="text-blue-700 hover:underline" href="/">홈</Link>
          <Link className="text-blue-700 hover:underline" href="/guide">사용 가이드</Link>
          <Link className="text-blue-700 hover:underline" href="/faq">FAQ</Link>
          <Link className="text-blue-700 hover:underline" href="/privacy">개인정보처리방침</Link>
        </div>
      </div>
    </main>
  )
}
