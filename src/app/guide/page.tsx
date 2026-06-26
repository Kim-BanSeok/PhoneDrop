import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '사용 가이드 | PhoneDrop',
  description: 'PhoneDrop의 입력, 정리, 내보내기 과정을 단계별로 안내하는 페이지입니다.',
}

const steps = [
  {
    title: '1. 연락처를 입력합니다',
    body: '텍스트를 붙여 넣거나 CSV·Excel 파일을 불러오거나, 직접 한 줄씩 입력할 수 있습니다.',
  },
  {
    title: '2. 형식을 정리합니다',
    body: '전화번호 표기, 이메일 형식, 이름 중복을 점검하고 저장 전에 필요한 수정을 합니다.',
  },
  {
    title: '3. 내보내기 방식을 고릅니다',
    body: 'vCard(.vcf)는 주소록 앱으로 가져오기 좋고, QR 코드는 현장에서 빠르게 공유하기 좋습니다.',
  },
  {
    title: '4. 모바일에서 확인합니다',
    body: '내보낸 파일을 iPhone 또는 Android에서 열어 최종 결과를 확인합니다.',
  },
]

const tips = [
  '한 줄에 하나씩 적으면 대량 정리가 쉬워집니다.',
  '회사명과 직함이 있다면 함께 적어두면 검색이 편합니다.',
  '같은 사람의 연락처가 여러 개면 정리 단계에서 먼저 합치는 편이 좋습니다.',
  '번호 형식은 가능한 한 국내 표준 또는 국제 표준으로 맞추는 것이 좋습니다.',
]

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Guide</p>
          <h1 className="mt-3 text-4xl font-black text-slate-950 md:text-5xl">PhoneDrop 사용 가이드</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">
            이 페이지는 PhoneDrop의 실제 사용 흐름을 설명합니다. 입력 방식, 정리 방법, 파일 내보내기, 모바일 확인 순서로 보면
            바로 익힐 수 있습니다.
          </p>
        </div>

        <section className="grid gap-6 md:grid-cols-2">
          {steps.map((step) => (
            <article key={step.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-bold text-slate-950">{step.title}</h2>
              <p className="mt-3 leading-relaxed text-slate-600">{step.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-12 rounded-3xl border border-blue-100 bg-blue-50 p-8">
          <h2 className="text-2xl font-bold text-slate-950">입력 팁</h2>
          <ul className="mt-5 space-y-3 text-slate-700">
            {tips.map((tip) => (
              <li key={tip} className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-950">권장 작업 순서</h2>
            <ol className="mt-5 space-y-3 text-slate-600">
              <li>1. 복사한 연락처를 붙여 넣는다.</li>
              <li>2. 중복이나 오탈자를 수정한다.</li>
              <li>3. vCard 또는 QR 코드로 내보낸다.</li>
              <li>4. 모바일에서 열어 최종 확인한다.</li>
            </ol>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-slate-950 p-8 text-white">
            <h2 className="text-2xl font-bold">이 페이지가 주는 정보</h2>
            <p className="mt-5 leading-relaxed text-slate-300">
              PhoneDrop은 단순 다운로드 페이지가 아니라, 연락처를 사람이 읽을 수 있는 형태로 정리하고 다시 사용할 수 있는
              파일로 바꾸는 도구입니다.
            </p>
          </article>
        </section>

        <div className="mt-10 flex flex-wrap gap-3 text-sm">
          <Link className="text-blue-700 hover:underline" href="/">홈</Link>
          <Link className="text-blue-700 hover:underline" href="/faq">FAQ</Link>
          <Link className="text-blue-700 hover:underline" href="/news">업데이트 노트</Link>
          <Link className="text-blue-700 hover:underline" href="/privacy">개인정보처리방침</Link>
        </div>
      </div>
    </main>
  )
}
