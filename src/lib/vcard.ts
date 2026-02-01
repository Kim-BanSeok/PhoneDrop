export interface Contact {
  name: string
  phone: string
  email?: string
  company?: string
  title?: string
  memo?: string
}

export function generateVCard(contact: Contact): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN;CHARSET=UTF-8:${contact.name}`,
    `TEL;TYPE=CELL:${contact.phone}`,
  ]

  if (contact.email) {
    lines.push(`EMAIL;TYPE=INTERNET:${contact.email}`)
  }

  if (contact.company) {
    lines.push(`ORG;CHARSET=UTF-8:${contact.company}`)
  }

  if (contact.title) {
    lines.push(`TITLE;CHARSET=UTF-8:${contact.title}`)
  }

  if (contact.memo) {
    lines.push(`NOTE;CHARSET=UTF-8:${contact.memo}`)
  }

  lines.push('END:VCARD')

  return lines.join('\n')
}

export function generateMultipleVCards(contacts: Contact[]): string {
  return contacts.map(contact => generateVCard(contact)).join('\n')
}

export function downloadVCard(vcardContent: string, filename: string) {
  const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.vcf') ? filename : `${filename}.vcf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function validatePhone(phone: string): boolean {
  // 모든 비숫자 제거
  const cleaned = phone.replace(/[^0-9]/g, '')
  
  // 한국 전화번호 형식 검사
  // 휴대폰: 010, 011, 016, 017, 018, 019 (10-11자리)
  // 서울: 02 (9-10자리)
  // 지방: 031, 032, 033, 041, 042, 043, 044, 051, 052, 053, 054, 055, 061, 062, 063, 064 (9-10자리)
  const phonePatterns = [
    /^01[016789]\d{7,8}$/,  // 휴대폰 (10-11자리)
    /^02\d{7,8}$/,         // 서울 (9-10자리)
    /^0[3-6][1-6]\d{6,7}$/, // 지방 (9-10자리)
    /^070\d{7,8}$/,        // 인터넷 전화 (9-10자리)
    /^080\d{7,8}$/,        // 수신자 부담 (9-10자리)
    /^15\d{7,8}$/,         // 특수번호 (9-10자리)
    /^16\d{7,8}$/,         // 특수번호 (9-10자리)
    /^18\d{7,8}$/          // 특수번호 (9-10자리)
  ]
  
  return phonePatterns.some(pattern => pattern.test(cleaned))
}

export function formatPhone(phone: string): string {
  // 모든 비숫자 제거
  const cleaned = phone.replace(/[^0-9]/g, '')
  
  // 전화번호 형식화
  if (cleaned.length < 9) return phone // 너무 짧으면 원본 반환
  
  // 휴대폰 번호 (010, 011, 016, 017, 018, 019)
  if (/^01[016789]/.test(cleaned)) {
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    } else if (cleaned.length === 11) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`
    }
  }
  
  // 서울 번호 (02)
  if (/^02/.test(cleaned)) {
    if (cleaned.length === 9) {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(5)}`
    } else if (cleaned.length === 10) {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
    }
  }
  
  // 지방 번호 (0xx)
  if (/^0[3-6][1-6]/.test(cleaned)) {
    if (cleaned.length === 9) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    } else if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`
    }
  }
  
  // 인터넷 전화 (070)
  if (/^070/.test(cleaned)) {
    if (cleaned.length === 9) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    } else if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`
    }
  }
  
  // 그 외 번호들 (080, 15xx, 16xx, 18xx)
  if (/^(080|15|16|18)/.test(cleaned)) {
    if (cleaned.length === 9) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    } else if (cleaned.length === 10) {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
    }
  }
  
  return phone // 형식화 실패 시 원본 반환
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
