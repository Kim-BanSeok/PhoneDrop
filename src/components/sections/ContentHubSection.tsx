import Link from 'next/link'
import { ArrowRight, BookText, FileQuestion, Newspaper, ShieldCheck } from 'lucide-react'

const articles = [
  {
    href: '/guide',
    title: '사용 가이드',
    description: '입력 방식, 정리 방법, 모바일 저장 순서를 단계별로 정리했습니다.',
    icon: BookText,
  },
  {
    href: '/faq',
    title: '자주 묻는 질문',
    description: 'vCard, QR 코드, 중복 제거, 파일 형식에 대한 질문을 모았습니다.',
    icon: FileQuestion,
  },
  {
    href: '/news',
    title: '업데이트 노트',
    description: '최근 추가된 기능과 개선 방향을 한눈에 확인할 수 있습니다.',
    icon: Newspaper,
  },
  {
    href: '/privacy',
    title: '개인정보처리방침',
    description: '어떤 데이터가 어디에서 처리되는지 투명하게 설명합니다.',
    icon: ShieldCheck,
  },
]

export default function ContentHubSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950">도움이 되는 콘텐츠</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            PhoneDrop은 도구만 있는 화면이 아니라, 사용법과 정책, FAQ, 업데이트 내용을 함께 제공하는 정보 허브로
            구성했습니다.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {articles.map((article) => {
            const Icon = article.icon
            return (
              <Link
                key={article.href}
                href={article.href}
                className="group rounded-3xl border border-slate-200 bg-slate-50 p-6 transition-all hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-xl"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-950">{article.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{article.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                  읽기
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            )
          })}
        </div>

        <div className="mt-12 rounded-3xl border border-slate-200 bg-slate-950 p-8 text-white">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-300">바로 확인</p>
              <h3 className="mt-2 text-2xl font-bold">vCard와 QR 코드의 차이</h3>
            </div>
            <div className="md:col-span-2 text-sm leading-relaxed text-slate-300">
              vCard는 연락처 데이터를 표준 파일로 저장하는 방식이고, QR 코드는 파일 없이 빠르게 공유할 때 적합합니다.
              두 방법 모두 같은 연락처를 다른 환경에서 쉽게 사용할 수 있게 해 주지만, 사용 상황은 다릅니다.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
