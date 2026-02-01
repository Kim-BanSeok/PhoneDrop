import { type Contact, validatePhone, validateEmail } from './vcard'

export interface ParsedResult {
  contacts: Contact[]
  confidence: number
  errors: string[]
  suggestions: string[]
}

export interface SmartParseOptions {
  delimiter?: 'auto' | ',' | '\t' | ' ' | '/' | '|'
  namePosition?: 'auto' | 'first' | 'last'
  phoneFormat?: 'auto' | 'keep' | 'normalize'
}

export function smartParse(text: string, options: SmartParseOptions = {}): ParsedResult {
  const {
    delimiter = 'auto',
    namePosition = 'auto',
    phoneFormat = 'auto'
  } = options

  const lines = text.split('\n').filter(line => line.trim())
  const contacts: Contact[] = []
  const errors: string[] = []
  const suggestions: string[] = []

  lines.forEach((line, index) => {
    try {
      const parsed = parseLine(line.trim(), { delimiter, namePosition, phoneFormat })
      if (parsed) {
        contacts.push(parsed)
      }
    } catch (error) {
      errors.push(`${index + 1}행: ${error}`)
      
      // 수정 제안
      const suggestion = generateSuggestion(line.trim())
      if (suggestion) {
        suggestions.push(`${index + 1}행 제안: ${suggestion}`)
      }
    }
  })

  // 중복 탐지
  const duplicates = findDuplicates(contacts)
  if (duplicates.length > 0) {
    suggestions.push(`중복 가능성: ${duplicates.length}개의 연락처가 중복될 수 있습니다`)
  }

  // 신뢰도 계산
  const confidence = calculateConfidence(contacts, lines.length, errors.length)

  return {
    contacts,
    confidence,
    errors,
    suggestions
  }
}

function parseLine(line: string, options: SmartParseOptions): Contact | null {
  if (!line.trim()) return null

  // 구분자 자동 감지
  const delimiter = detectDelimiter(line, options.delimiter || 'auto')
  const parts = line.split(delimiter).map(part => part.trim()).filter(part => part)

  if (parts.length === 0) return null

  // 이름과 번호 위치 추정
  const { name, phone, email, company, title, memo } = extractFields(parts, options.namePosition || 'auto')

  // 이름은 필수
  if (!name) {
    throw new Error('이름을 찾을 수 없습니다')
  }

  // 전화번호 처리: 없으면 기본값 사용
  let normalizedPhone = '010-0000-0000'
  if (phone) {
    const normalized = normalizePhone(phone, options.phoneFormat || 'auto')
    if (validatePhone(normalized)) {
      normalizedPhone = normalized
    } else if (phone.trim() !== '') {
      // 형식이 잘못되었지만 값이 있으면 그대로 사용
      normalizedPhone = phone
    }
  }

  const contact: Contact = {
    name: normalizeName(name),
    phone: normalizedPhone
  }

  if (email && validateEmail(email)) {
    contact.email = email
  }

  if (company) {
    contact.company = company
  }

  if (title) {
    contact.title = title
  }

  if (memo) {
    contact.memo = memo
  }

  return contact
}

function detectDelimiter(line: string, specified: string): string {
  if (specified !== 'auto') return specified

  const delimiters = [',', '\t', ' ', '/', '|', ';']
  const counts = delimiters.map(d => ({
    delimiter: d,
    count: (line.match(new RegExp(`\\${d}`, 'g')) || []).length
  }))

  const best = counts.reduce((prev, curr) => 
    curr.count > prev.count ? curr : prev
  )

  return best.delimiter || ' '
}

function extractFields(parts: string[], namePosition: string): {
  name?: string
  phone?: string
  email?: string
  company?: string
  title?: string
  memo?: string
} {
  const result: any = {}

  parts.forEach(part => {
    // 이메일 감지
    if (part.includes('@') && validateEmail(part)) {
      result.email = part
      return
    }

    // 전화번호 감지
    if (isPhoneNumber(part)) {
      result.phone = part
      return
    }

    // 회사/직책 키워드 감지
    if (part.includes('회사') || part.includes('주식회사') || part.includes('(주)')) {
      result.company = part
      return
    }

    if (part.includes('팀장') || part.includes('매니저') || part.includes('사원') || part.includes('대표')) {
      result.title = part
      return
    }

    // 메모 키워드 감지
    if (part.includes('메모:') || part.includes('참고:') || part.includes('비고:')) {
      result.memo = part.replace(/메모:|참고:|비고:/g, '').trim()
      return
    }

    // 이름으로 추정
    if (!result.name) {
      result.name = part
    }
  })

  // 이름 위치 자동 조정
  if (namePosition === 'first' && parts.length > 1) {
    const first = parts[0]
    const last = parts[parts.length - 1]
    
    if (isPhoneNumber(first) && !result.phone) {
      result.phone = first
      result.name = last
    }
  }

  return result
}

function isPhoneNumber(text: string): boolean {
  const cleaned = text.replace(/[^0-9]/g, '')
  return cleaned.length >= 10 && cleaned.length <= 11 && 
         (cleaned.startsWith('01') || cleaned.startsWith('02') || cleaned.startsWith('1'))
}

function normalizePhone(phone: string, format: string): string {
  const cleaned = phone.replace(/[^0-9]/g, '')
  
  if (format === 'keep') return phone

  // 국가코드 처리
  if (cleaned.startsWith('82') && cleaned.length === 12) {
    return cleaned.replace(/^82/, '0')
  }

  // 자동 정규화
  if (cleaned.length === 11 && cleaned.startsWith('01')) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`
  }
  
  if (cleaned.length === 10 && cleaned.startsWith('02')) {
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
  }

  if (cleaned.length === 10 && cleaned.startsWith('01')) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }

  return phone
}

function normalizeName(name: string): string {
  return name.replace(/[(){}[\]]/g, '').trim()
}

function generateSuggestion(line: string): string {
  // 앞자리 누락 수정
  if (/^1\d{9,10}$/.test(line.replace(/[^0-9]/g, ''))) {
    return `0${line}`
  }

  // O/0 혼동 수정
  if (line.includes('O10-')) {
    return line.replace('O10-', '010-')
  }

  // 자리수 불일치 수정
  const phoneMatch = line.match(/(\d{3})-(\d{3})-(\d{4})/)
  if (phoneMatch) {
    const [_, first, middle, last] = phoneMatch
    if (middle.length === 3 && first === '010') {
      return line.replace(phoneMatch[0], `${first}-${middle.padStart(4, '0')}-${last}`)
    }
  }

  return ''
}

function findDuplicates(contacts: Contact[]): Contact[] {
  const seen = new Set<string>()
  const duplicates: Contact[] = []

  contacts.forEach(contact => {
    const normalizedPhone = contact.phone.replace(/[^0-9]/g, '')
    if (seen.has(normalizedPhone)) {
      duplicates.push(contact)
    } else {
      seen.add(normalizedPhone)
    }
  })

  return duplicates
}

function calculateConfidence(contacts: Contact[], totalLines: number, errorCount: number): number {
  if (totalLines === 0) return 0
  
  const successRate = (contacts.length / totalLines) * 100
  const errorPenalty = (errorCount / totalLines) * 20
  
  return Math.max(0, Math.min(100, successRate - errorPenalty))
}
