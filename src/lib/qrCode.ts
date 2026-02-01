import QRCode from 'qrcode'
import { generateVCard, generateMultipleVCards, type Contact } from './vcard'

export async function generateQRCode(contacts: Contact[]): Promise<string> {
  if (contacts.length === 0) {
    throw new Error('연락처가 없습니다.')
  }

  const vcardContent = contacts.length === 1 
    ? generateVCard(contacts[0])
    : generateMultipleVCards(contacts)

  try {
    const qrDataUrl = await QRCode.toDataURL(vcardContent, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    })
    
    return qrDataUrl
  } catch (error) {
    throw new Error(`QR 코드 생성 실패: ${error}`)
  }
}

export async function generateQRCodeForDownload(contacts: Contact[]): Promise<void> {
  try {
    const qrDataUrl = await generateQRCode(contacts)
    
    // QR 코드 이미지 다운로드
    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = contacts.length === 1 
      ? `${contacts[0].name}_QR.png` 
      : `연락처_${contacts.length}개_QR.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    throw new Error(`QR 코드 다운로드 실패: ${error}`)
  }
}

export function generateQRCodeDataURL(contacts: Contact[]): string {
  const vcardContent = contacts.length === 1 
    ? generateVCard(contacts[0])
    : generateMultipleVCards(contacts)
  
  return `data:text/vcard;charset=utf-8,${encodeURIComponent(vcardContent)}`
}
