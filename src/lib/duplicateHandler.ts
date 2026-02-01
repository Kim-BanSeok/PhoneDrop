import { type Contact } from './vcard'

export type DuplicatePolicy = 'skip' | 'keep_first' | 'keep_longest' | 'merge'

export interface DuplicateGroup {
  contacts: Contact[]
  normalizedPhone: string
  similarity: number
  suggestions: string[]
}

export interface DuplicateResult {
  groups: DuplicateGroup[]
  totalDuplicates: number
  uniqueContacts: Contact[]
  statistics: {
    totalProcessed: number
    duplicatesFound: number
    uniqueCount: number
    duplicateRate: number
  }
}

export function detectDuplicates(contacts: Contact[]): DuplicateResult {
  const phoneMap = new Map<string, Contact[]>()
  const normalizedPhones = new Map<string, string>()

  // 전화번호 정규화 및 그룹화
  contacts.forEach(contact => {
    const normalizedPhone = normalizePhoneNumber(contact.phone)
    normalizedPhones.set(contact.phone, normalizedPhone)
    
    if (!phoneMap.has(normalizedPhone)) {
      phoneMap.set(normalizedPhone, [])
    }
    phoneMap.get(normalizedPhone)!.push(contact)
  })

  // 중복 그룹 생성
  const groups: DuplicateGroup[] = []
  let totalDuplicates = 0

  phoneMap.forEach((groupContacts, normalizedPhone) => {
    if (groupContacts.length > 1) {
      const similarity = calculateSimilarity(groupContacts)
      const suggestions = generateSuggestions(groupContacts)
      
      groups.push({
        contacts: groupContacts,
        normalizedPhone,
        similarity,
        suggestions
      })
      
      totalDuplicates += groupContacts.length - 1
    }
  })

  // 고유 연락처 생성
  const uniqueContacts = resolveDuplicates(contacts, groups, 'keep_first')

  const statistics = {
    totalProcessed: contacts.length,
    duplicatesFound: totalDuplicates,
    uniqueCount: uniqueContacts.length,
    duplicateRate: (totalDuplicates / contacts.length) * 100
  }

  return {
    groups,
    totalDuplicates,
    uniqueContacts,
    statistics
  }
}

export function resolveDuplicates(
  contacts: Contact[], 
  duplicateGroups: DuplicateGroup[], 
  policy: DuplicatePolicy
): Contact[] {
  const processedPhones = new Set<string>()
  const result: Contact[] = []

  contacts.forEach(contact => {
    const normalizedPhone = normalizePhoneNumber(contact.phone)
    
    if (processedPhones.has(normalizedPhone)) {
      return // 이미 처리된 번호는 건너뛰기
    }

    const duplicateGroup = duplicateGroups.find(g => g.normalizedPhone === normalizedPhone)
    
    if (duplicateGroup && duplicateGroup.contacts.length > 1) {
      // 중복 처리 정책 적용
      const resolvedContact = applyDuplicatePolicy(duplicateGroup.contacts, policy)
      result.push(resolvedContact)
      processedPhones.add(normalizedPhone)
    } else {
      // 중복이 아닌 경우
      result.push(contact)
      processedPhones.add(normalizedPhone)
    }
  })

  return result
}

function normalizePhoneNumber(phone: string): string {
  // 모든 비숫자 제거
  let normalized = phone.replace(/[^0-9]/g, '')
  
  // 국가코드 처리
  if (normalized.startsWith('82') && normalized.length === 12) {
    normalized = normalized.replace(/^82/, '0')
  }
  
  // +82 국제 형식 처리
  if (normalized.startsWith('8210') && normalized.length === 13) {
    normalized = '0' + normalized.slice(2)
  }
  
  return normalized
}

function calculateSimilarity(contacts: Contact[]): number {
  if (contacts.length <= 1) return 100

  let totalSimilarity = 0
  let comparisons = 0

  for (let i = 0; i < contacts.length; i++) {
    for (let j = i + 1; j < contacts.length; j++) {
      const similarity = calculateContactSimilarity(contacts[i], contacts[j])
      totalSimilarity += similarity
      comparisons++
    }
  }

  return comparisons > 0 ? totalSimilarity / comparisons : 0
}

function calculateContactSimilarity(contact1: Contact, contact2: Contact): number {
  let score = 0
  let factors = 0

  // 이름 유사도
  if (contact1.name && contact2.name) {
    const nameSimilarity = calculateStringSimilarity(contact1.name, contact2.name)
    score += nameSimilarity
    factors++
  }

  // 이메일 유사도
  if (contact1.email && contact2.email) {
    const emailSimilarity = contact1.email === contact2.email ? 100 : 0
    score += emailSimilarity
    factors++
  }

  // 회사 유사도
  if (contact1.company && contact2.company) {
    const companySimilarity = calculateStringSimilarity(contact1.company, contact2.company)
    score += companySimilarity
    factors++
  }

  // 직책 유사도
  if (contact1.title && contact2.title) {
    const titleSimilarity = calculateStringSimilarity(contact1.title, contact2.title)
    score += titleSimilarity
    factors++
  }

  return factors > 0 ? score / factors : 0
}

function calculateStringSimilarity(str1: string, str2: string): number {
  if (str1 === str2) return 100
  
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1
  
  if (longer.length === 0) return 100
  
  const editDistance = levenshteinDistance(longer, shorter)
  return ((longer.length - editDistance) / longer.length) * 100
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }

  return matrix[str2.length][str1.length]
}

function generateSuggestions(contacts: Contact[]): string[] {
  const suggestions: string[] = []
  
  if (contacts.length === 2) {
    const [c1, c2] = contacts
    
    if (c1.name !== c2.name) {
      suggestions.push(`이름 통합: ${c1.name} + ${c2.name}`)
    }
    
    if (c1.email && c2.email && c1.email !== c2.email) {
      suggestions.push(`이메일 병합: ${c1.email}, ${c2.email}`)
    }
    
    if (c1.company && c2.company && c1.company !== c2.company) {
      suggestions.push(`회사 정보 통합 필요`)
    }
  } else {
    suggestions.push(`${contacts.length}개 연락처 통합 필요`)
  }
  
  return suggestions
}

function applyDuplicatePolicy(contacts: Contact[], policy: DuplicatePolicy): Contact {
  switch (policy) {
    case 'skip':
      return contacts[0] // 첫 번째 것만 유지
    
    case 'keep_first':
      return contacts[0]
    
    case 'keep_longest':
      return contacts.reduce((longest, current) => 
        getContactInfoLength(current) > getContactInfoLength(longest) ? current : longest
      )
    
    case 'merge':
      return mergeContacts(contacts)
    
    default:
      return contacts[0]
  }
}

function getContactInfoLength(contact: Contact): number {
  return (
    (contact.name?.length || 0) +
    (contact.email?.length || 0) +
    (contact.company?.length || 0) +
    (contact.title?.length || 0) +
    (contact.memo?.length || 0)
  )
}

function mergeContacts(contacts: Contact[]): Contact {
  const merged: Contact = {
    name: contacts[0].name,
    phone: contacts[0].phone
  }

  // 가장 긴 이름 선택
  const longestName = contacts.reduce((longest, current) => 
    (current.name?.length || 0) > (longest.name?.length || 0) ? current : longest
  )
  merged.name = longestName.name

  // 이메일 병합 (쉼표로 구분)
  const emails = contacts
    .map(c => c.email)
    .filter(Boolean)
    .filter((email, index, arr) => arr.indexOf(email) === index) // 중복 제거
  
  if (emails.length > 0) {
    merged.email = emails.join(', ')
  }

  // 회사 정보 병합
  const companies = contacts
    .map(c => c.company)
    .filter(Boolean)
    .filter((company, index, arr) => arr.indexOf(company) === index)
  
  if (companies.length > 0) {
    merged.company = companies.join(' / ')
  }

  // 직책 정보 병합
  const titles = contacts
    .map(c => c.title)
    .filter(Boolean)
    .filter((title, index, arr) => arr.indexOf(title) === index)
  
  if (titles.length > 0) {
    merged.title = titles.join(' / ')
  }

  // 메모 병합
  const memos = contacts
    .map(c => c.memo)
    .filter(Boolean)
  
  if (memos.length > 0) {
    merged.memo = memos.join(' | ')
  }

  return merged
}
