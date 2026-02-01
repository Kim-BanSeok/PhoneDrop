'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, BookOpen, Zap } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface HeroSectionProps {
  onNavigateToInput?: () => void
}

export default function HeroSection({ onNavigateToInput }: HeroSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleStartClick = () => {
    if (onNavigateToInput) {
      onNavigateToInput()
    } else {
      // 폴백: URL hash 변경
      window.location.hash = '#input'
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <section className="pt-32 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 hero-gradient pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-100">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          간편한 연락처 동기화
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
          전화번호를 한 번에<br/><span className="text-blue-600">저장하세요</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          PC에서 전화번호를 입력하거나 대량으로 정리하여 휴대폰 주소록에<br className="hidden md:block"/> 바로 저장 가능한 vCard 파일을 생성해드립니다.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            onClick={handleStartClick}
          >
            <Zap className="w-5 h-5" />
            지금 시작하기
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                사용 방법 보기
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">PhoneDrop 상세 사용 가이드</DialogTitle>
                <DialogDescription className="text-base">
                  PhoneDrop의 모든 기능을 단계별로 자세히 알아보세요.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 text-left">
                {/* 스마트 입력 방식 */}
                <div className="border-2 border-blue-100 rounded-xl p-5 bg-gradient-to-br from-blue-50 to-white">
                  <h3 className="text-lg font-bold mb-4 flex items-center text-blue-900">
                    <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">1</span>
                    스마트 입력 방식 (AI 자동 인식)
                  </h3>
                  <div className="space-y-3 text-gray-700 ml-11">
                    <div className="flex gap-2">
                      <span className="font-bold text-blue-600 min-w-[20px]">①</span>
                      <p><strong>입력 탭</strong> → <strong>"🤖 PhoneDrop 스마트 입력기"</strong> 섹션으로 이동</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-blue-600 min-w-[20px]">②</span>
                      <p>텍스트 입력란에 <strong>엑셀, 카카오톡, 이메일, 메모장</strong> 등에서 복사한 연락처 정보 붙여넣기</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-blue-600 min-w-[20px]">③</span>
                      <p>지원 형식 예시:
                        <br />• <code className="bg-slate-100 px-1 rounded">홍길동 010-1234-5678</code>
                        <br />• <code className="bg-slate-100 px-1 rounded">01012345678(김철수)</code>
                        <br />• <code className="bg-slate-100 px-1 rounded">이영희/010-9876-5432/이메일@example.com</code>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-blue-600 min-w-[20px]">④</span>
                      <p>AI가 자동으로 <strong>이름, 전화번호, 이메일, 메모</strong>를 분리하여 표시</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-blue-600 min-w-[20px]">⑤</span>
                      <p>인식 결과 확인 후 <strong>"연락처 추가"</strong> 버튼으로 목록에 추가</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-blue-600 min-w-[20px]">⑥</span>
                      <p><strong>"vCard 다운로드"</strong> 또는 <strong>"QR 코드 다운로드"</strong> 버튼 클릭</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-blue-600 min-w-[20px]">⑦</span>
                      <p>모바일에서 다운로드한 파일을 열거나 QR 코드를 스캔하여 주소록에 저장</p>
                    </div>
                  </div>
                </div>

                {/* 대량 업로드 방식 */}
                <div className="border-2 border-green-100 rounded-xl p-5 bg-gradient-to-br from-green-50 to-white">
                  <h3 className="text-lg font-bold mb-4 flex items-center text-green-900">
                    <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">2</span>
                    대량 업로드 방식 (CSV/Excel 파일)
                  </h3>
                  <div className="space-y-3 text-gray-700 ml-11">
                    <div className="flex gap-2">
                      <span className="font-bold text-green-600 min-w-[20px]">①</span>
                      <p><strong>입력 탭</strong> → <strong>"대량 연락처 업로드"</strong> 섹션으로 이동</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-green-600 min-w-[20px]">②</span>
                      <p><strong>"템플릿 다운로드"</strong> 버튼 클릭 (CSV 또는 Excel 선택)</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-green-600 min-w-[20px]">③</span>
                      <p>다운로드한 템플릿 파일을 열어 연락처 정보 입력</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-green-600 min-w-[20px]">④</span>
                      <p><strong>필수 컬럼:</strong> 이름, 전화번호 (반드시 입력)</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-green-600 min-w-[20px]">⑤</span>
                      <p><strong>선택 컬럼:</strong> 이메일, 회사, 직책 (선택 사항)</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-green-600 min-w-[20px]">⑥</span>
                      <p>컬럼명은 한글/영문 모두 지원: <code className="bg-slate-100 px-1 rounded">이름/name</code>, <code className="bg-slate-100 px-1 rounded">전화번호/phone</code> 등</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-green-600 min-w-[20px]">⑦</span>
                      <p>작성 완료 후 파일 저장하고 <strong>"파일 선택"</strong> 버튼으로 업로드</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-green-600 min-w-[20px]">⑧</span>
                      <p>업로드된 연락처 자동 변환 및 미리보기 확인</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-green-600 min-w-[20px]">⑨</span>
                      <p>오류가 있으면 수정 후 <strong>"vCard 다운로드"</strong> 또는 <strong>"QR 코드 다운로드"</strong></p>
                    </div>
                  </div>
                </div>

                {/* 직접 입력 방식 */}
                <div className="border-2 border-purple-100 rounded-xl p-5 bg-gradient-to-br from-purple-50 to-white">
                  <h3 className="text-lg font-bold mb-4 flex items-center text-purple-900">
                    <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">3</span>
                    직접 입력 방식 (폼 입력)
                  </h3>
                  <div className="space-y-3 text-gray-700 ml-11">
                    <div className="flex gap-2">
                      <span className="font-bold text-purple-600 min-w-[20px]">①</span>
                      <p><strong>입력 탭</strong> → <strong>"직접 입력"</strong> 섹션으로 이동</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-purple-600 min-w-[20px]">②</span>
                      <p>입력 폼에 <strong>이름, 전화번호</strong> 필수 입력 (이메일, 회사, 직책은 선택)</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-purple-600 min-w-[20px]">③</span>
                      <p>여러 연락처를 추가하려면 <strong>"연락처 추가"</strong> 버튼 클릭</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-purple-600 min-w-[20px]">④</span>
                      <p>입력한 연락처는 하단 목록에 표시되며, 개별 삭제 가능</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-purple-600 min-w-[20px]">⑤</span>
                      <p><strong>"vCard 다운로드"</strong> 또는 <strong>"QR 코드 다운로드"</strong> 버튼으로 저장</p>
                    </div>
                  </div>
                </div>

                {/* 연락처 관리 기능 */}
                <div className="border-2 border-orange-100 rounded-xl p-5 bg-gradient-to-br from-orange-50 to-white">
                  <h3 className="text-lg font-bold mb-4 flex items-center text-orange-900">
                    <span className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">4</span>
                    연락처 관리 기능
                  </h3>
                  <div className="space-y-3 text-gray-700 ml-11">
                    <div className="flex gap-2">
                      <span className="font-bold text-orange-600 min-w-[20px]">①</span>
                      <p><strong>관리 탭</strong>으로 이동하여 입력한 연락처 목록 확인</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-orange-600 min-w-[20px]">②</span>
                      <p><strong>네이밍 템플릿:</strong> 연락처 이름을 일괄 변경 (예: "이름 (회사)", "회사 - 이름" 등)</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-orange-600 min-w-[20px]">③</span>
                      <p><strong>중복 처리:</strong> 동일한 전화번호나 이름의 연락처 자동 감지 및 병합/삭제 옵션</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-orange-600 min-w-[20px]">④</span>
                      <p><strong>오류 수정:</strong> 전화번호 형식 오류, 이메일 형식 오류 자동 감지 및 수정 제안</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-orange-600 min-w-[20px]">⑤</span>
                      <p>수정 완료 후 <strong>"적용"</strong> 버튼으로 변경사항 저장</p>
                    </div>
                  </div>
                </div>

                {/* 내보내기 및 공유 */}
                <div className="border-2 border-indigo-100 rounded-xl p-5 bg-gradient-to-br from-indigo-50 to-white">
                  <h3 className="text-lg font-bold mb-4 flex items-center text-indigo-900">
                    <span className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">5</span>
                    내보내기 및 공유 기능
                  </h3>
                  <div className="space-y-3 text-gray-700 ml-11">
                    <div className="flex gap-2">
                      <span className="font-bold text-indigo-600 min-w-[20px]">①</span>
                      <p><strong>내보내기 탭</strong>으로 이동</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-indigo-600 min-w-[20px]">②</span>
                      <p><strong>vCard 파일:</strong> 표준 .vcf 파일로 다운로드하여 모바일에서 열기</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-indigo-600 min-w-[20px]">③</span>
                      <p><strong>QR 코드:</strong> QR 코드 이미지 다운로드 또는 화면에 표시하여 모바일로 스캔</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-indigo-600 min-w-[20px]">④</span>
                      <p><strong>디지털 명함:</strong> 개별 연락처를 디지털 명함 형식으로 생성 및 공유</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-indigo-600 min-w-[20px]">⑤</span>
                      <p><strong>프로필 페이지:</strong> 여러 연락처를 웹 페이지 형식으로 생성하여 URL 공유</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-indigo-600 min-w-[20px]">⑥</span>
                      <p><strong>연락처 패키지:</strong> 여러 연락처를 하나의 패키지로 묶어서 관리 및 공유</p>
                    </div>
                  </div>
                </div>

                {/* 모바일에서 저장하기 */}
                <div className="border-2 border-pink-100 rounded-xl p-5 bg-gradient-to-br from-pink-50 to-white">
                  <h3 className="text-lg font-bold mb-4 flex items-center text-pink-900">
                    <span className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">6</span>
                    모바일에서 저장하기
                  </h3>
                  <div className="space-y-3 text-gray-700 ml-11">
                    <div className="flex gap-2">
                      <span className="font-bold text-pink-600 min-w-[20px]">방법 1</span>
                      <p><strong>vCard 파일:</strong> 다운로드한 .vcf 파일을 모바일로 전송 후 열기 → 자동으로 주소록에 추가</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-pink-600 min-w-[20px]">방법 2</span>
                      <p><strong>QR 코드:</strong> PC 화면의 QR 코드를 모바일 카메라로 스캔 → 연락처 저장 옵션 선택</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-pink-600 min-w-[20px]">방법 3</span>
                      <p><strong>이메일/메신저:</strong> vCard 파일을 이메일이나 메신저로 본인에게 전송 후 모바일에서 열기</p>
                    </div>
                  </div>
                </div>

                {/* 사용 팁 */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5">
                  <h3 className="text-lg font-bold mb-4 text-blue-900 flex items-center">
                    <span className="text-2xl mr-3">💡</span>
                    유용한 사용 팁
                  </h3>
                  <div className="space-y-3 text-blue-900 ml-11">
                    <div className="flex gap-2">
                      <span className="font-bold text-blue-600 min-w-[20px]">✓</span>
                      <p><strong>전화번호 자동 정규화:</strong> <code className="bg-blue-100 px-1 rounded">01012345678</code> → <code className="bg-blue-100 px-1 rounded">010-1234-5678</code>로 자동 변환</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-blue-600 min-w-[20px]">✓</span>
                      <p><strong>다양한 형식 지원:</strong> 엑셀, 카카오톡, 이메일, 메모장 등 어디서든 복사한 내용 그대로 사용 가능</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-blue-600 min-w-[20px]">✓</span>
                      <p><strong>신뢰도 표시:</strong> 스마트 입력에서 AI 인식 정확도를 신뢰도로 표시하여 확인 가능</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-blue-600 min-w-[20px]">✓</span>
                      <p><strong>실시간 검증:</strong> 전화번호와 이메일 형식을 실시간으로 검사하여 오류 방지</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-blue-600 min-w-[20px]">✓</span>
                      <p><strong>대량 처리:</strong> 수백 개의 연락처도 한 번에 처리 가능</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-blue-600 min-w-[20px]">✓</span>
                      <p><strong>브라우저 호환:</strong> Chrome, Edge, Safari 등 모든 최신 브라우저에서 작동</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-blue-600 min-w-[20px]">✓</span>
                      <p><strong>개인정보 보호:</strong> 모든 처리는 브라우저에서만 이루어지며 서버로 전송되지 않음</p>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-20 max-w-5xl mx-auto">
          <div className="relative group">
            {/* 그라데이션 글로우 효과 */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            
            {/* 메인 카드 */}
            <div className="relative bg-white dark:bg-slate-900 p-2 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-2xl">
              {/* 핸드폰 프레임 */}
              <div className="relative w-full max-w-[320px] mx-auto">
                {/* 핸드폰 외곽 프레임 */}
                <div className="bg-slate-900 rounded-[3rem] p-2 shadow-inner">
                  {/* 상단 노치 영역 */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-10"></div>
                  
                  {/* 핸드폰 화면 */}
                  <div className="bg-white rounded-[2.5rem] overflow-hidden">
                    {/* 상단 이미지 영역 - 실제 이미지 사용 */}
                    <div className="w-full h-48 md:h-64 relative overflow-hidden">
                      <img 
                        alt="PhoneDrop Interface Preview" 
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmCVvKnVFnuXXUPgM1BLHb7V1HOCQ_GjKpcLRbYFfiY1-oT0rRyWIU4UIyuMgUDjFm3CZkcrR5hb4EfTrKdh-ISD7SBnYf_FfdI8Ls0UfFBQfhvG3BA4vka1NOlrJWIRbCig1vEtos9yvCxq_uM5n7CpRKH6O-2egpmfDO8z0IKmc_3oflutAMwGP8CAVqeLyrjVU9UYd4l2KwX93qzAynrZ1DqRZtczD45sfFLKHaVv-mMk9e2pqhrUMplqCP6q7GpJ1znJhc3A_V"
                        onError={(e) => {
                          // 이미지 로드 실패 시 폴백
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          target.parentElement!.className = 'w-full h-48 md:h-64 bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden flex items-center justify-center'
                          const fallback = document.createElement('div')
                          fallback.className = 'w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg'
                          fallback.innerHTML = '<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>'
                          target.parentElement!.appendChild(fallback)
                        }}
                      />
                    </div>
                    
                    {/* 중간 흰색 패널 - 텍스트 영역 */}
                    <div className="bg-white px-6 py-8">
                      <div className="text-center">
                        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">PhoneDrop</h3>
                        <p className="text-base text-slate-600">스마트한 연락처 저장 솔루션</p>
                      </div>
                    </div>
                    
                    {/* 하단 여백 */}
                    <div className="h-4 bg-white"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
