import { type Contact } from './vcard'

export interface NamingTemplate {
  id: string
  name: string
  description: string
  pattern: string
  example: string
}

export interface NamingOptions {
  template: string
  prefix?: string
  suffix?: string
  autoNumber?: boolean
  numberFormat?: '001' | '0001' | 'A001'
}

export const predefinedTemplates: NamingTemplate[] = [
  {
    id: 'default',
    name: '기본',
    description: '원본 이름 유지',
    pattern: '{name}',
    example: '홍길동'
  },
  {
    id: 'event',
    name: '행사 참가자',
    description: '[행사명] 이름 형식',
    pattern: '[{prefix}] {name}',
    example: '[2026세미나] 홍길동'
  },
  {
    id: 'company',
    name: '회사 동료',
    description: '회사-부서-이름 형식',
    pattern: '{company}-{department}-{name}',
    example: 'ABC영업-마케팅팀-홍길동'
  },
  {
    id: 'phone-only',
    name: '번호만 있는 경우',
    description: '미지정-번호 형식',
    pattern: '미지정-{number}',
    example: '미지정-0001'
  },
  {
    id: 'custom',
    name: '사용자 정의',
    description: '자유롭게 형식 지정',
    pattern: '{prefix} {name} {suffix}',
    example: '고객 홍길동 (VIP)'
  }
]

export function applyNamingTemplate(
  contacts: Contact[], 
  options: NamingOptions
): Contact[] {
  const { template, prefix = '', suffix = '', autoNumber = false, numberFormat = '001' } = options
  
  return contacts.map((contact, index) => {
    const newName = generateName(contact, {
      template,
      prefix,
      suffix,
      index: autoNumber ? index + 1 : undefined,
      numberFormat
    })
    
    return {
      ...contact,
      name: newName
    }
  })
}

function generateName(
  contact: Contact, 
  options: {
    template: string
    prefix: string
    suffix: string
    index?: number
    numberFormat: string
  }
): string {
  const { template, prefix, suffix, index, numberFormat } = options
  
  let result = template
  
  // 기본 변수 치환
  result = result.replace(/{name}/g, contact.name || '미지정')
  result = result.replace(/{phone}/g, contact.phone || '')
  result = result.replace(/{email}/g, contact.email || '')
  result = result.replace(/{company}/g, contact.company || '')
  result = result.replace(/{title}/g, contact.title || '')
  result = result.replace(/{memo}/g, contact.memo || '')
  
  // 접두어/접미어
  result = result.replace(/{prefix}/g, prefix)
  result = result.replace(/{suffix}/g, suffix)
  
  // 자동 번호
  if (index !== undefined) {
    const formattedNumber = formatNumber(index, numberFormat)
    result = result.replace(/{number}/g, formattedNumber)
  }
  
  // 회사-부서 분리
  if (contact.company) {
    const [company, ...departmentParts] = contact.company.split('-')
    const department = departmentParts.join('-')
    result = result.replace(/{company}/g, company)
    result = result.replace(/{department}/g, department)
  }
  
  // 전화번호 뒷자리
  if (contact.phone) {
    const phoneLast4 = contact.phone.replace(/[^0-9]/g, '').slice(-4)
    result = result.replace(/{phone_last4}/g, phoneLast4)
  }
  
  // 여러 공백 정리
  result = result.replace(/\s+/g, ' ').trim()
  
  return result
}

function formatNumber(index: number, format: string): string {
  switch (format) {
    case '001':
      return index.toString().padStart(3, '0')
    case '0001':
      return index.toString().padStart(4, '0')
    case 'A001':
      return `A${index.toString().padStart(3, '0')}`
    default:
      return index.toString()
  }
}

export function validateNamingTemplate(template: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (!template.trim()) {
    errors.push('템플릿이 비어있습니다.')
  }
  
  // 필수 변수 체크
  if (!template.includes('{name}') && !template.includes('{number}')) {
    errors.push('템플릿에 {name} 또는 {number} 변수가 포함되어야 합니다.')
  }
  
  // 중괄호 짝 체크
  const openBraces = (template.match(/{/g) || []).length
  const closeBraces = (template.match(/}/g) || []).length
  
  if (openBraces !== closeBraces) {
    errors.push('중괄호가 짝이 맞지 않습니다.')
  }
  
  // 유효한 변수 체크
  const validVariables = [
    'name', 'phone', 'email', 'company', 'title', 'memo',
    'prefix', 'suffix', 'number', 'department', 'phone_last4'
  ]
  
  const variableMatches = template.match(/{([^}]+)}/g) || []
  
  variableMatches.forEach(match => {
    const variable = match.slice(1, -1)
    if (!validVariables.includes(variable)) {
      errors.push(`유효하지 않은 변수: {${variable}}`)
    }
  })
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export function generateTemplateExample(template: string): string {
  const sampleContact: Contact = {
    name: '홍길동',
    phone: '010-1234-5678',
    email: 'hong@example.com',
    company: 'ABC주식회사-영업팀',
    title: '팀장',
    memo: 'VIP고객'
  }
  
  return generateName(sampleContact, {
    template,
    prefix: '2026세미나',
    suffix: '참가자',
    index: 1,
    numberFormat: '001'
  })
}
