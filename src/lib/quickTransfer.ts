import { generateVCard, generateMultipleVCards, type Contact } from './vcard'
import QRCode from 'qrcode'

export interface TransferLink {
  id: string
  url: string
  expiresAt: Date
  accessCount: number
  maxAccess: number
  contacts: Contact[]
  createdAt: Date
}

export interface TransferOptions {
  expiresIn?: number // minutes
  maxAccess?: number
  password?: string
}

export class QuickTransferService {
  private static instance: QuickTransferService
  private transfers: Map<string, TransferLink> = new Map()

  static getInstance(): QuickTransferService {
    if (!QuickTransferService.instance) {
      QuickTransferService.instance = new QuickTransferService()
    }
    return QuickTransferService.instance
  }

  async createTransferLink(
    contacts: Contact[], 
    options: TransferOptions = {}
  ): Promise<TransferLink> {
    const {
      expiresIn = 10, // 10 minutes default
      maxAccess = 10, // 10 accesses default
      password
    } = options

    const id = this.generateId()
    const expiresAt = new Date(Date.now() + expiresIn * 60 * 1000)
    
    const transferLink: TransferLink = {
      id,
      url: `${window.location.origin}/transfer/${id}`,
      expiresAt,
      accessCount: 0,
      maxAccess,
      contacts,
      createdAt: new Date()
    }

    this.transfers.set(id, transferLink)
    
    // 자동 정리 (만료된 링크 삭제)
    this.scheduleCleanup(expiresAt)
    
    return transferLink
  }

  async generateTransferQR(contacts: Contact[], options: TransferOptions = {}): Promise<string> {
    const transferLink = await this.createTransferLink(contacts, options)
    
    try {
      const qrDataUrl = await QRCode.toDataURL(transferLink.url, {
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

  getTransfer(id: string): TransferLink | null {
    const transfer = this.transfers.get(id)
    
    if (!transfer) {
      return null
    }

    // 만료 확인
    if (transfer.expiresAt < new Date()) {
      this.transfers.delete(id)
      return null
    }

    // 접근 횟수 확인
    if (transfer.accessCount >= transfer.maxAccess) {
      return null
    }

    // 접근 횟수 증가
    transfer.accessCount++
    
    return transfer
  }

  getTransferStatus(id: string): {
    exists: boolean
    expired: boolean
    accessCount: number
    maxAccess: number
    remainingAccess: number
    timeRemaining: number
  } | null {
    const transfer = this.transfers.get(id)
    
    if (!transfer) {
      return null
    }

    const now = new Date()
    const expired = transfer.expiresAt < now
    const timeRemaining = Math.max(0, transfer.expiresAt.getTime() - now.getTime())
    const remainingAccess = Math.max(0, transfer.maxAccess - transfer.accessCount)

    return {
      exists: true,
      expired,
      accessCount: transfer.accessCount,
      maxAccess: transfer.maxAccess,
      remainingAccess,
      timeRemaining
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15)
  }

  private scheduleCleanup(expiresAt: Date): void {
    const cleanupTime = expiresAt.getTime() - Date.now() + 60000 // 1분 후 정리
    
    setTimeout(() => {
      this.cleanupExpired()
    }, cleanupTime)
  }

  private cleanupExpired(): void {
    const now = new Date()
    const expiredIds: string[] = []
    
    this.transfers.forEach((transfer, id) => {
      if (transfer.expiresAt < now) {
        expiredIds.push(id)
      }
    })
    
    expiredIds.forEach(id => {
      this.transfers.delete(id)
    })
  }

  // 테스트용 메소드
  getActiveTransfers(): TransferLink[] {
    return Array.from(this.transfers.values())
      .filter(transfer => transfer.expiresAt > new Date())
  }

  clearAllTransfers(): void {
    this.transfers.clear()
  }
}

export async function generateVCardDownloadUrl(contacts: Contact[]): Promise<string> {
  const vcardContent = contacts.length === 1 
    ? generateVCard(contacts[0])
    : generateMultipleVCards(contacts)
  
  const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  
  return url
}

export function downloadTransferQR(contacts: Contact[], options: TransferOptions = {}): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const service = QuickTransferService.getInstance()
      const qrDataUrl = await service.generateTransferQR(contacts, options)
      
      const link = document.createElement('a')
      link.href = qrDataUrl
      link.download = `PhoneDrop_전송_QR_${contacts.length}개.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

export function shareTransferLink(contacts: Contact[], options: TransferOptions = {}): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const service = QuickTransferService.getInstance()
      const transferLink = await service.createTransferLink(contacts, options)
      
      if (navigator.share) {
        await navigator.share({
          title: 'PhoneDrop 연락처',
          text: `${contacts.length}개의 연락처를 공유합니다`,
          url: transferLink.url
        })
      } else {
        // 클립보드에 복사
        await navigator.clipboard.writeText(transferLink.url)
        
        // 알림 표시 (호출하는 쪽에서 처리)
        console.log('전송 링크가 클립보드에 복사되었습니다:', transferLink.url)
      }
      
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

export function formatTimeRemaining(milliseconds: number): string {
  const minutes = Math.floor(milliseconds / (1000 * 60))
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000)
  
  if (minutes > 0) {
    return `${minutes}분 ${seconds}초`
  }
  
  return `${seconds}초`
}

export function isTransferExpired(transfer: TransferLink): boolean {
  return transfer.expiresAt < new Date()
}

export function getTransferProgress(transfer: TransferLink): {
  percentage: number
  remaining: number
  total: number
} {
  const remaining = Math.max(0, transfer.maxAccess - transfer.accessCount)
  const percentage = (transfer.accessCount / transfer.maxAccess) * 100
  
  return {
    percentage,
    remaining,
    total: transfer.maxAccess
  }
}
