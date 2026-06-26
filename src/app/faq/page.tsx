import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '자주 묻는 질문 | PhoneDrop',
  description: 'vCard, QR 코드, CSV 가져오기, 개인정보 처리에 대한 PhoneDrop FAQ입니다.',
}

const faqs = [
  {
    q: 'PhoneDrop은 어떤 용도인가요?',
    a: '연락처를 정리하고 vCard(.vcf) 파일이나 QR 코드로 내보내는 도구입니다. 명함 관리, 주소록 이전, 행사 명단 정리에 적합합니다.',
  },
  {
    q: 'CSV나 Excel 파일도 불러올 수 있나요?',
    a: '가능합니다. 표 형태 데이터에서 이름, 전화번호, 이메일, 회사명 같은 열을 매핑해 가져오는 흐름을 지원합니다.',
  },
  {
    q: 'vCard 파일은 무엇인가요?',
    a: '대부분의 휴대폰과 주소록 앱에서 읽을 수 있는 표준 연락처 파일 형식입니다.',
  },
  {
    q: 'QR 코드는 언제 쓰면 좋나요?',
    a: '파일 전송이 번거로운 현장이나, 상대방이 바로 휴대폰으로 저장해야 하는 상황에서 유용합니다.',
  },
  {
    q: '중복 연락처는 어떻게 처리하나요?',
    a: '이름과 전화번호를 기준으로 중복 가능성을 확인하고, 사용자가 삭제 또는 병합할 수 있도록 돕습니다.',
  },
  {
    q: '개인정보는 서버에 저장되나요?',
    a: '기본적인 입력과 정리 작업은 브라우저에서 처리되도록 설계되어 있습니다. 일부 외부 API 기능을 사용할 때만 별도 요청이 생길 수 있습니다.',
  },
  {
    q: '모바일에서도 열 수 있나요?',
    a: '네. iPhone과 Android 모두에서 열 수 있는 형식으로 내보내기를 지원합니다.',
  },
  {
    q: '문제가 생기면 어디를 보면 되나요?',
    a: '먼저 FAQ와 사용 가이드를 확인하고, 그래도 해결되지 않으면 입력 형식과 브라우저 호환성을 점검하는 것이 좋습니다.',
  },
]

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">FAQ</p>
          <h1 className="mt-3 text-4xl font-black text-slate-950 md:text-5xl">자주 묻는 질문</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">
            처음 쓰는 사용자가 헷갈릴 만한 내용을 모았습니다. 입력 방식, 파일 형식, 개인정보 처리 방침까지 빠르게 확인할 수
            있습니다.
          </p>
        </div>

        <div className="space-y-5">
          {faqs.map((faq) => (
            <article key={faq.q} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-bold text-slate-950">{faq.q}</h2>
              <p className="mt-3 leading-relaxed text-slate-600">{faq.a}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3 text-sm">
          <Link className="text-blue-700 hover:underline" href="/">홈</Link>
          <Link className="text-blue-700 hover:underline" href="/guide">사용 가이드</Link>
          <Link className="text-blue-700 hover:underline" href="/news">업데이트 노트</Link>
          <Link className="text-blue-700 hover:underline" href="/privacy">개인정보처리방침</Link>
        </div>
      </div>
    </main>
  )
}
