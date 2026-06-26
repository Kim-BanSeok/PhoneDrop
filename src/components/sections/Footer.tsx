import { Phone, Share } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-950 py-20 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 grid grid-cols-2 gap-12 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-6 flex items-center gap-2 text-white">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600">
                <Phone className="h-3 w-3 text-white" />
              </div>
              <span className="text-lg font-bold">PhoneDrop</span>
            </div>
            <p className="mb-6 text-sm leading-relaxed">
              연락처를 입력하고 정리한 뒤 vCard 파일이나 QR 코드로 내보내는 웹 도구입니다. 가이드와 FAQ를 함께
              제공해 처음 방문한 사용자도 바로 사용할 수 있게 구성했습니다.
            </p>
            <div className="flex gap-4">
              <a
                className="transition-colors hover:text-white"
                href="https://github.com/Kim-BanSeok/PhoneDrop"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
              >
                <Share className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-6 font-bold text-white">도움말</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <a className="transition-colors hover:text-white" href="/guide">
                  사용 가이드
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-white" href="/faq">
                  자주 묻는 질문
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-white" href="/news">
                  업데이트
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-bold text-white">정책</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <a className="transition-colors hover:text-white" href="/privacy">
                  개인정보처리방침
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-white" href="/terms">
                  이용약관
                </a>
              </li>
              <li>
                <a className="transition-colors hover:text-white" href="/privacy#cookies">
                  쿠키 안내
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-xs md:flex-row">
          <p>© 2026 PhoneDrop. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="hover:text-white" href="/privacy">
              개인정보처리방침
            </a>
            <a className="hover:text-white" href="/terms">
              이용약관
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
