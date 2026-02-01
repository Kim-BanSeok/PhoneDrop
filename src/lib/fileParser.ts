import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { type Contact, validatePhone, validateEmail, formatPhone } from './vcard'

export interface ParsedData {
  contacts: Contact[]
  errors: string[]
}

export function parseCSV(file: File): Promise<ParsedData> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      encoding: 'UTF-8',
      complete: (results) => {
        const contacts: Contact[] = []
        const errors: string[] = []

        results.data.forEach((row: any, index: number) => {
          try {
            const contact = parseRowToContact(row, index + 2)
            if (contact) {
              contacts.push(contact)
            }
          } catch (error) {
            errors.push(`CSV ${index + 2}행: ${error}`)
          }
        })

        resolve({ contacts, errors })
      },
      error: (error) => {
        resolve({ contacts: [], errors: [`CSV 파싱 오류: ${error.message}`] })
      }
    })
  })
}

export function parseExcel(file: File): Promise<ParsedData> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        
        // 헤더를 포함한 객체 배열로 변환
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          defval: '', // 빈 셀을 빈 문자열로 처리
          raw: false // 날짜 등을 문자열로 변환
        })

        const contacts: Contact[] = []
        const errors: string[] = []

        jsonData.forEach((row: any, index: number) => {
          try {
            const contact = parseRowToContact(row, index + 2) // Excel은 1행이 헤더이므로 +2
            if (contact) {
              contacts.push(contact)
            }
          } catch (error: any) {
            errors.push(`Excel ${index + 2}행: ${error.message || error}`)
          }
        })

        resolve({ contacts, errors })
      } catch (error: any) {
        resolve({ contacts: [], errors: [`Excel 파싱 오류: ${error.message || error}`] })
      }
    }

    reader.onerror = () => {
      resolve({ contacts: [], errors: ['파일 읽기 오류'] })
    }

    reader.readAsArrayBuffer(file)
  })
}

function parseRowToContact(row: any, rowNumber: number): Contact | null {
  // 다양한 컬럼명 지원
  const nameField = findField(row, ['이름', 'name', 'Name', '성명'])
  const phoneField = findField(row, ['전화번호', 'phone', 'Phone', '연락처', 'tel'])
  const emailField = findField(row, ['이메일', 'email', 'Email', '메일'])
  const companyField = findField(row, ['회사', 'company', 'Company', '소속'])
  const titleField = findField(row, ['직책', 'title', 'Title', '직급'])

  // 이름은 필수
  if (!nameField) {
    throw new Error('이름은 필수 항목입니다')
  }

  const name = String(nameField).trim()
  if (!name) {
    throw new Error('이름은 필수 항목입니다')
  }

  // 전화번호 처리: 자동 형식화 적용
  let phone = '010-0000-0000'
  if (phoneField) {
    const phoneValue = String(phoneField).trim()
    if (phoneValue && phoneValue !== '') {
      // 전화번호 자동 형식화
      const formattedPhone = formatPhone(phoneValue)
      phone = formattedPhone
    }
  }

  const contact: Contact = {
    name,
    phone,
  }

  // 이메일 처리: 없거나 형식이 잘못되었으면 건너뛰기 (에러 없이)
  if (emailField) {
    const email = String(emailField).trim()
    if (email && email !== '' && validateEmail(email)) {
      contact.email = email
    }
    // 이메일이 없거나 형식이 잘못되었으면 그냥 건너뛰기 (에러 발생 안 함)
  }

  if (companyField) {
    const company = String(companyField).trim()
    if (company) {
      contact.company = company
    }
  }

  if (titleField) {
    const title = String(titleField).trim()
    if (title) {
      contact.title = title
    }
  }

  return contact
}

function findField(row: any, possibleNames: string[]): any {
  // 객체 형태인 경우
  if (typeof row === 'object' && !Array.isArray(row)) {
    for (const name of possibleNames) {
      // 정확한 키 매칭
      if (row[name] !== undefined && row[name] !== null && row[name] !== '') {
        return row[name]
      }
      // 대소문자 무시 매칭
      const foundKey = Object.keys(row).find(key => 
        key.toLowerCase() === name.toLowerCase() || 
        key.trim() === name.trim()
      )
      if (foundKey && row[foundKey] !== undefined && row[foundKey] !== null && row[foundKey] !== '') {
        return row[foundKey]
      }
    }
  }
  // 배열 형태인 경우 (fallback)
  if (Array.isArray(row)) {
    // 첫 번째 행이 헤더라고 가정하고 처리
    return null
  }
  return null
}

export function downloadTemplate(type: 'csv' | 'excel') {
  const templateData = [
    {
      '이름': '홍길동',
      '전화번호': '01012345678',
      '이메일': 'hong@example.com',
      '회사': 'ABC회사',
      '직책': '팀장'
    },
    {
      '이름': '김철수',
      '전화번호': '01098765432',
      '이메일': 'kim@example.com',
      '회사': 'XYZ회사',
      '직책': '매니저'
    }
  ]

  if (type === 'csv') {
    const csv = Papa.unparse(templateData)
    downloadFile(csv, '연락처_템플릿.csv', 'text/csv;charset=utf-8')
  } else {
    const ws = XLSX.utils.json_to_sheet(templateData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '연락처')
    XLSX.writeFile(wb, '연락처_템플릿.xlsx')
  }
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([`\ufeff${content}`], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
