import { Phone, Share, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-6 text-white">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <Phone className="w-3 h-3 text-white" />
              </div>
              <span className="text-lg font-bold">PhoneDrop</span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              전화번호를 한 번에 저장하세요. PC에서 연락처를 입력하여 vCard 파일을 생성하고, 모바일에서 바로 저장하는 가장 쉬운 방법입니다.
            </p>
            <div className="flex gap-4">
              <a className="hover:text-white transition-colors" href="#">
                <Share className="w-5 h-5" />
              </a>
              <a className="hover:text-white transition-colors" href="#">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">빠른 링크</h4>
            <ul className="space-y-4 text-sm">
              <li><a className="hover:text-white transition-colors" href="#features">기능 소개</a></li>
              <li><a className="hover:text-white transition-colors" href="#bulk-upload">대량 업로드</a></li>
              <li><a className="hover:text-white transition-colors" href="#manual-entry">직접 입력</a></li>
              <li><a className="hover:text-white transition-colors" href="#">vCard 템플릿</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">지원</h4>
            <ul className="space-y-4 text-sm">
              <li><a className="hover:text-white transition-colors" href="#">사용 방법</a></li>
              <li><a className="hover:text-white transition-colors" href="#">자주 묻는 질문</a></li>
              <li><a className="hover:text-white transition-colors" href="#">문의하기</a></li>
              <li><a className="hover:text-white transition-colors" href="#">업데이트 소식</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">법적 고지</h4>
            <ul className="space-y-4 text-sm">
              <li><a className="hover:text-white transition-colors" href="#">개인정보처리방침</a></li>
              <li><a className="hover:text-white transition-colors" href="#">이용약관</a></li>
              <li><a className="hover:text-white transition-colors" href="#">쿠키 정책</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2024 PhoneDrop. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="hover:text-white" href="#">개인정보처리방침</a>
            <a className="hover:text-white" href="#">이용약관</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
