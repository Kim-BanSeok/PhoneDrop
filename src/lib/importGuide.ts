import { generateVCard, generateMultipleVCards, type Contact } from './vcard'

export type Platform = 'ios' | 'android' | 'web'

export interface ImportStep {
  id: string
  title: string
  description: string
  image?: string
  tips?: string[]
  troubleshooting?: string[]
}

export interface ImportGuide {
  platform: Platform
  steps: ImportStep[]
  tips: string[]
  commonIssues: { issue: string; solution: string }[]
}

export const importGuides: Record<Platform, ImportGuide> = {
  ios: {
    platform: 'ios',
    steps: [
      {
        id: '1',
        title: 'VCF 파일 다운로드',
        description: 'PhoneDrop에서 생성된 VCF 파일을 다운로드합니다.',
        tips: [
          '파일이 다운로드 폴더에 저장됩니다',
          '파일 이름을 확인하세요'
        ]
      },
      {
        id: '2',
        title: '파일 앱 열기',
        description: 'iPhone에서 "파일" 앱을 열고 다운로드 폴더로 이동합니다.',
        tips: [
          '홈 화면에서 아래로 스와이프하여 검색',
          '"파일" 앱을 찾아 실행'
        ]
      },
      {
        id: '3',
        title: 'VCF 파일 선택',
        description: '다운로드한 VCF 파일을 찾아 탭합니다.',
        tips: [
          '파일 확장자가 .vcf인지 확인',
          '파일이 보이지 않으면 새로고침'
        ]
      },
      {
        id: '4',
        title: '연락처 앱으로 공유',
        description: '파일을 길게 누르고 "공유" → "연락처"를 선택합니다.',
        tips: [
          '공유 메뉴에서 "연락처" 앱을 찾으세요',
          '연락처 앱이 없으면 "더 보기"에서 확인'
        ]
      },
      {
        id: '5',
        title: '연락처 가져오기',
        description: '"모두 추가" 또는 원하는 연락처만 선택하여 가져옵니다.',
        tips: [
          '중복된 연락처가 있으면 확인 메시지가 표시됩니다',
          '필요시 개별적으로 선택 가능'
        ]
      }
    ],
    tips: [
      'iOS 16 이상에서는 더 쉬워졌습니다',
      '파일 용량이 크면 여러 번에 나눠서 가져오세요',
      'iCloud 동기화가 설정되어 있으면 자동으로 동기화됩니다'
    ],
    commonIssues: [
      {
        issue: '파일이 보이지 않아요',
        solution: '파일 앱에서 새로고침하거나 Safari 다운로드 폴더를 확인하세요'
      },
      {
        issue: '공유 메뉴에 연락처가 없어요',
        solution: '공유 메뉴에서 "더 보기"를 눌러 연락처 앱을 찾으세요'
      },
      {
        issue: '연락처 가져오기 실패',
        solution: '파일이 손상되었을 수 있습니다. 다시 다운로드하세요'
      }
    ]
  },
  
  android: {
    platform: 'android',
    steps: [
      {
        id: '1',
        title: 'VCF 파일 다운로드',
        description: 'PhoneDrop에서 생성된 VCF 파일을 다운로드합니다.',
        tips: [
          '파일이 "다운로드" 폴더에 저장됩니다',
          'Chrome 브라우저에서 다운로드하는 것을 추천합니다'
        ]
      },
      {
        id: '2',
        title: '연락처 앱 열기',
        description: '연락처 앱을 실행하고 설정 메뉴로 이동합니다.',
        tips: [
          '연락처 앱 우측 상단의 점 3개 메뉴',
          '"설정" 또는 "가져오기/내보내기" 선택'
        ]
      },
      {
        id: '3',
        'title': '가져오기 선택',
        description: '"가져오기" → "저장소에서 가져오기"를 선택합니다.',
        tips: [
          '기종에 따라 메뉴 이름이 다를 수 있습니다',
          '.vcf 파일 가져오기 선택'
        ]
      },
      {
        id: '4',
        title: '파일 찾기',
        description: '다운로드 폴더로 이동하여 VCF 파일을 선택합니다.',
        tips: [
          '파일 관리자 앱이 열릴 수 있습니다',
          '내부 저장소 > Download 폴더 확인'
        ]
      },
      {
        id: '5',
        title: '연락처 가져오기',
        description: '파일을 선택하고 가져오기를 완료합니다.',
        tips: [
          '중복 처리 옵션을 선택할 수 있습니다',
          '가져오기 완료까지 시간이 걸릴 수 있습니다'
        ]
      }
    ],
    tips: [
      'Samsung 휴대폰은 "연락처" → "설정" → "가져오기" 경로를 따르세요',
      'Google 연락처 동기화가 설정되어 있으면 자동으로 동기화됩니다',
      '대용량 파일은 Wi-Fi 환경에서 처리하세요'
    ],
    commonIssues: [
      {
        issue: '파일을 찾을 수 없어요',
        solution: '파일 관리자 앱에서 직접 다운로드 폴더를 확인하세요'
      },
      {
        issue: '가져오기 메뉴가 없어요',
        solution: '연락처 앱의 3점 메뉴에서 "설정" → "가져오기/내보내기"를 찾으세요'
      },
      {
        issue: '가져오기 중 오류 발생',
        solution: '파일 용량이 너무 크면 여러 개로 나눠서 다시 시도하세요'
      }
    ]
  },
  
  web: {
    platform: 'web',
    steps: [
      {
        id: '1',
        title: 'Google 계정 로그인',
        description: 'Google 연락처 웹사이트에 로그인합니다.',
        tips: [
          'contacts.google.com 접속',
          'Google 계정으로 로그인'
        ]
      },
      {
        id: '2',
        title: '가져오기 메뉴',
        description: '왼쪽 메뉴에서 "가져오기"를 선택합니다.',
        tips: [
          '왼쪽 상단의 3선 메뉴 클릭',
          '"가져오기" 옵션 선택'
        ]
      },
      {
        id: '3',
        title: 'CSV 파일 선택',
        description: 'VCF 파일 대신 CSV 파일로 변환하여 가져옵니다.',
        tips: [
          'Google은 VCF보다 CSV를 더 잘 지원합니다',
          'PhoneDrop에서 CSV 다운로드 기능 사용'
        ]
      },
      {
        id: '4',
        title: '필드 매핑',
        description: 'CSV 파일의 필드를 Google 연락처 필드에 매핑합니다.',
        tips: [
          '이름, 전화번호, 이메일 필드 확인',
          '필요시 직접 매핑 조정'
        ]
      },
      {
        id: '5',
        title: '가져오기 완료',
        description: '가져오기를 실행하고 결과를 확인합니다.',
        tips: [
          '중복 처리 옵션 선택 가능',
          '가져오기 후 모바일에서 동기화 확인'
        ]
      }
    ],
    tips: [
      'Chrome 브라우저 사용을 권장합니다',
      '대용량 파일은 시간이 오래 걸릴 수 있습니다',
      '가져오기 후 Google 계정에 자동 동기화됩니다'
    ],
    commonIssues: [
      {
        issue: 'CSV 파일로 변환해야 하나요?',
        solution: 'Google 연락처는 VCF보다 CSV를 더 잘 지원합니다. PhoneDrop에서 CSV 다운로드를 이용하세요.'
      },
      {
        issue: '필드 매핑이 복잡해요',
        solution: '기본 매핑을 사용하고 필요한 필드만 선택하세요'
      },
      {
        issue: '가져오기가 너무 느려요',
        solution: '파일을 여러 개로 나눠서 가져오거나 인터넷 연결을 확인하세요'
      }
    ]
  }
}

export function generateTestVCard(): string {
  const testContacts: Contact[] = [
    {
      name: '테스트 사용자1',
      phone: '010-1234-5678',
      email: 'test1@example.com',
      company: '테스트 회사',
      title: '테스트 직책'
    },
    {
      name: '테스트 사용자2',
      phone: '010-9876-5432',
      email: 'test2@example.com'
    },
    {
      name: '테스트 사용자3',
      phone: '010-5555-6666',
      memo: '테스트 메모'
    }
  ]

  return generateMultipleVCards(testContacts)
}

export function downloadTestVCard() {
  const vcardContent = generateTestVCard()
  const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'PhoneDrop_테스트_연락처_3개.vcf'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function getPlatformName(platform: Platform): string {
  switch (platform) {
    case 'ios':
      return 'iPhone/iPad'
    case 'android':
      return '안드로이드'
    case 'web':
      return 'Google 연락처 (웹)'
    default:
      return '알 수 없음'
  }
}

export function getPlatformIcon(platform: Platform): string {
  switch (platform) {
    case 'ios':
      return '🍎'
    case 'android':
      return '🤖'
    case 'web':
      return '🌐'
    default:
      return '📱'
  }
}
