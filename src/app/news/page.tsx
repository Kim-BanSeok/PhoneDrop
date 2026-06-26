import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '업데이트 노트 | PhoneDrop',
  description: 'PhoneDrop의 최근 개선 사항과 향후 계획을 확인할 수 있는 업데이트 페이지입니다.',
}

const updates = [
  {
    date: '2026-06-26',
    title: '콘텐츠 허브와 안내 페이지 보강',
    body: '가이드, FAQ, 개인정보처리방침, 이용약관 페이지를 정리하고 홈 화면에 정보성 링크를 추가했습니다.',
  },
  {
    date: '2026-06-26',
    title: '심사용 콘텐츠 구조 개선',
    body: '도구 중심 화면에도 사용법과 실제 활용 예시를 함께 보여주도록 섹션을 재배치했습니다.',
  },
  {
    date: '2026-06-26',
    title: '정보 페이지 가독성 개선',
    body: '깨진 문구를 정리하고, 한국어로 바로 읽을 수 있는 문장 구조로 다시 작성했습니다.',
  },
]

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Updates</p>
          <h1 className="mt-3 text-4xl font-black text-slate-950 md:text-5xl">업데이트 노트</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">
            최근 바뀐 내용과 앞으로의 개선 방향을 요약합니다. 사용자가 사이트의 상태를 이해하는 데 도움이 되도록 유지합니다.
          </p>
        </div>

        <div className="space-y-5">
          {updates.map((update) => (
            <article key={update.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-semibold text-blue-600">{update.date}</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">{update.title}</h2>
              <p className="mt-3 leading-relaxed text-slate-600">{update.body}</p>
            </article>
          ))}
        </div>

        <section className="mt-12 rounded-3xl border border-emerald-100 bg-emerald-50 p-8">
          <h2 className="text-2xl font-bold text-slate-950">다음 개선 방향</h2>
          <ul className="mt-5 space-y-3 text-slate-700">
            <li>· 더 많은 입력 예시와 샘플 데이터를 추가</li>
            <li>· 중복 정리와 필드 매핑 가이드를 보강</li>
            <li>· 모바일 저장 절차를 별도 짧은 튜토리얼로 분리</li>
          </ul>
        </section>

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
