import { type Contact, validatePhone, validateEmail } from './vcard'

export interface ErrorFix {
  field: string
  original: string
  suggested: string
  type: 'phone' | 'email' | 'name'
  confidence: number
  description: string
}

export interface ErrorFixResult {
  contacts: Contact[]
  fixes: ErrorFix[]
  statistics: {
    totalErrors: number
    autoFixed: number
    requiresConfirmation: number
    fixRate: number
  }
}

export function detectAndFixErrors(contacts: Contact[]): ErrorFixResult {
  const fixes: ErrorFix[] = []
  const fixedContacts: Contact[] = []

  contacts.forEach((contact, index) => {
    const contactFixes: ErrorFix[] = []
    const fixedContact = { ...contact }

    // 전화번호 오류 탐지 및 수정
    if (contact.phone) {
      const phoneFixes = detectPhoneErrors(contact.phone)
      contactFixes.push(...phoneFixes)
      
      if (phoneFixes.length > 0) {
        // 자동 수정 가능한 경우 첫 번째 제안 적용
        const autoFixable = phoneFixes.find(fix => fix.confidence >= 90)
        if (autoFixable) {
          fixedContact.phone = autoFixable.suggested
        }
      }
    }

    // 이메일 오류 탐지 및 수정
    if (contact.email) {
      const emailFixes = detectEmailErrors(contact.email)
      contactFixes.push(...emailFixes)
      
      if (emailFixes.length > 0) {
        const autoFixable = emailFixes.find(fix => fix.confidence >= 90)
        if (autoFixable) {
          fixedContact.email = autoFixable.suggested
        }
      }
    }

    // 이름 오류 탐지 및 수정
    if (contact.name) {
      const nameFixes = detectNameErrors(contact.name)
      contactFixes.push(...nameFixes)
      
      if (nameFixes.length > 0) {
        const autoFixable = nameFixes.find(fix => fix.confidence >= 90)
        if (autoFixable) {
          fixedContact.name = autoFixable.suggested
        }
      }
    }

    // 인덱스 정보 추가
    contactFixes.forEach(fix => {
      fixes.push({
        ...fix,
        field: `${index + 1}행 ${fix.field}`
      })
    })

    fixedContacts.push(fixedContact)
  })

  const autoFixed = fixes.filter(fix => fix.confidence >= 90).length
  const requiresConfirmation = fixes.filter(fix => fix.confidence < 90).length

  const statistics = {
    totalErrors: fixes.length,
    autoFixed,
    requiresConfirmation,
    fixRate: fixes.length > 0 ? (autoFixed / fixes.length) * 100 : 100
  }

  return {
    contacts: fixedContacts,
    fixes,
    statistics
  }
}

function detectPhoneErrors(phone: string): ErrorFix[] {
  const fixes: ErrorFix[] = []
  const cleaned = phone.replace(/[^0-9]/g, '')

  // 앞자리 누락 (1012345678 -> 01012345678)
  if (/^1\d{9}$/.test(cleaned)) {
    fixes.push({
      field: '전화번호',
      original: phone,
      suggested: `0${cleaned}`,
      type: 'phone',
      confidence: 95,
      description: '앞자리 0 누락'
    })
  }

  // O/0 혼동 (O10-1234-5678 -> 010-1234-5678)
  if (phone.includes('O10-')) {
    fixes.push({
      field: '전화번호',
      original: phone,
      suggested: phone.replace('O10-', '010-'),
      type: 'phone',
      confidence: 98,
      description: 'O를 0으로 수정'
    })
  }

  // 자리수 불일치 (010-123-4567 -> 010-1234-5678)
  if (cleaned.length === 10 && cleaned.startsWith('01')) {
    const formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    fixes.push({
      field: '전화번호',
      original: phone,
      suggested: formatted,
      type: 'phone',
      confidence: 85,
      description: '자리수 형식 수정'
    })
  }

  // 11자리 휴대폰 번호 형식화
  if (cleaned.length === 11 && cleaned.startsWith('01') && !phone.includes('-')) {
    const formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`
    fixes.push({
      field: '전화번호',
      original: phone,
      suggested: formatted,
      type: 'phone',
      confidence: 92,
      description: '휴대폰 번호 형식화'
    })
  }

  // 10자리 서울 번호 형식화
  if (cleaned.length === 10 && cleaned.startsWith('02') && !phone.includes('-')) {
    const formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
    fixes.push({
      field: '전화번호',
      original: phone,
      suggested: formatted,
      type: 'phone',
      confidence: 92,
      description: '서울 번호 형식화'
    })
  }

  // 국제 번호 형식 (+82 10-1234-5678 -> 010-1234-5678)
  if (phone.startsWith('+82') || phone.startsWith('+ 82')) {
    const normalized = phone.replace(/[+\s]/g, '').replace(/^82/, '0')
    if (normalized.length === 11 && normalized.startsWith('01')) {
      const formatted = `${normalized.slice(0, 3)}-${normalized.slice(3, 7)}-${normalized.slice(7)}`
      fixes.push({
        field: '전화번호',
        original: phone,
        suggested: formatted,
        type: 'phone',
        confidence: 90,
        description: '국제 번호를 국내 번호로 변환'
      })
    }
  }

  return fixes
}

function detectEmailErrors(email: string): ErrorFix[] {
  const fixes: ErrorFix[] = []

  // 공백 제거
  if (email.includes(' ')) {
    fixes.push({
      field: '이메일',
      original: email,
      suggested: email.replace(/\s+/g, ''),
      type: 'email',
      confidence: 85,
      description: '이메일 공백 제거'
    })
  }

  // 대문자를 소문자로
  if (email !== email.toLowerCase()) {
    fixes.push({
      field: '이메일',
      original: email,
      suggested: email.toLowerCase(),
      type: 'email',
      confidence: 75,
      description: '이메일 소문자 변환'
    })
  }

  // 흔한 오타 수정
  const commonTypos: { [key: string]: string } = {
    'gnail.com': 'gmail.com',
    'gamil.com': 'gmail.com',
    'gmial.com': 'gmail.com',
    'nate.com': 'naver.com',
    'hanmail.net': 'hanmail.net',
    'daum.net': 'daum.net'
  }

  const domain = email.split('@')[1]?.toLowerCase()
  if (domain && commonTypos[domain]) {
    const correctedEmail = email.replace(/@.+$/, `@${commonTypos[domain]}`)
    fixes.push({
      field: '이메일',
      original: email,
      suggested: correctedEmail,
      type: 'email',
      confidence: 80,
      description: `도메인 오타 수정: ${domain} → ${commonTypos[domain]}`
    })
  }

  return fixes
}

function detectNameErrors(name: string): ErrorFix[] {
  const fixes: ErrorFix[] = []

  // 괄호 정리
  if (name.includes('(') || name.includes(')') || name.includes('[') || name.includes(']')) {
    const cleaned = name.replace(/[()[\]{}]/g, '').trim()
    if (cleaned !== name) {
      fixes.push({
        field: '이름',
        original: name,
        suggested: cleaned,
        type: 'name',
        confidence: 70,
        description: '괄호 및 특수문자 제거'
      })
    }
  }

  // 여러 공백 정리
  if (name.includes('  ') || name.includes('\t')) {
    const cleaned = name.replace(/\s+/g, ' ').trim()
    if (cleaned !== name) {
      fixes.push({
        field: '이름',
        original: name,
        suggested: cleaned,
        type: 'name',
        confidence: 85,
        description: '여러 공백 정리'
      })
    }
  }

  // 양 끝 공백 제거
  if (name !== name.trim()) {
    fixes.push({
      field: '이름',
      original: name,
      suggested: name.trim(),
      type: 'name',
      confidence: 90,
      description: '양 끝 공백 제거'
    })
  }

  return fixes
}

export function applyFixes(contacts: Contact[], fixes: ErrorFix[], selectedFixes: string[]): Contact[] {
  const result = [...contacts]

  selectedFixes.forEach(fixKey => {
    const parts = fixKey.split('-')
    const rowIndex = parseInt(parts[0]) - 1
    const field = parts[1]

    if (rowIndex >= 0 && rowIndex < result.length) {
      const fix = fixes.find(f => f.field === `${rowIndex + 1}행 ${field}`)
      if (fix) {
        switch (field) {
          case '전화번호':
            result[rowIndex].phone = fix.suggested
            break
          case '이메일':
            result[rowIndex].email = fix.suggested
            break
          case '이름':
            result[rowIndex].name = fix.suggested
            break
        }
      }
    }
  })

  return result
}

export function getErrorTypeIcon(type: 'phone' | 'email' | 'name'): string {
  switch (type) {
    case 'phone':
      return '📱'
    case 'email':
      return '📧'
    case 'name':
      return '👤'
    default:
      return '⚠️'
  }
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 90) return 'bg-green-100 text-green-800'
  if (confidence >= 70) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}
