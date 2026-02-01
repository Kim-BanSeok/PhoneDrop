import { generateMultipleVCards, type Contact } from './vcard'
import QRCode from 'qrcode'

export interface PackageOptions {
  name: string
  description: string
  logo?: string
  color: string
  background?: string
  contacts: Contact[]
  category: 'event' | 'company' | 'team' | 'parents' | 'custom'
}

export interface ContactPackage {
  id: string
  name: string
  description: string
  category: string
  contacts: Contact[]
  vcardUrl: string
  qrUrl: string
  imageUrl: string
  createdAt: Date
  options: PackageOptions
  stats: {
    downloads: number
    shares: number
  }
}

export const packageCategories = {
  event: {
    name: '이벤트',
    description: '세미나, 컨퍼런스, 워크샵 등',
    icon: '🎉',
    color: '#EC4899',
    colors: ['#EC4899', '#F472B6', '#F9A8D4', '#FBCFE8']
  },
  company: {
    name: '회사',
    description: '영업팀, 부서별, 전사원',
    icon: '🏢',
    color: '#3B82F6',
    colors: ['#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF']
  },
  team: {
    name: '팀',
    description: '프로젝트팀, 동아리',
    icon: '👥',
    color: '#10B981',
    colors: ['#10B981', '#059669', '#047857', '#065F46']
  },
  parents: {
    name: '학부모',
    description: '학급, 반별, 학부모회',
    icon: '👨‍👩‍👧‍👦',
    color: '#F59E0B',
    colors: ['#F59E0B', '#D97706', '#B45309', '#92400E']
  },
  custom: {
    name: '커스텀',
    description: '직접 정의',
    icon: '📁',
    color: '#6B7280',
    colors: ['#6B7280', '#4B5563', '#374151', '#1F2937']
  }
}

export class PackageService {
  private static instance: PackageService
  private packages: Map<string, ContactPackage> = new Map()

  static getInstance(): PackageService {
    if (!PackageService.instance) {
      PackageService.instance = new PackageService()
    }
    return PackageService.instance
  }

  async createPackage(options: PackageOptions): Promise<ContactPackage> {
    const id = this.generateId()
    
    // vCard 생성
    const vcardContent = generateMultipleVCards(options.contacts)
    const vcardBlob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8' })
    const vcardUrl = URL.createObjectURL(vcardBlob)
    
    // QR 코드 생성
    const qrUrl = await this.generateQRCodeForPackage(vcardContent)
    
    // 패키지 이미지 생성
    const imageUrl = await this.generatePackageImage(options)
    
    const pkg: ContactPackage = {
      id,
      name: options.name,
      description: options.description,
      category: options.category,
      contacts: options.contacts,
      vcardUrl,
      qrUrl,
      imageUrl,
      createdAt: new Date(),
      options,
      stats: {
        downloads: 0,
        shares: 0
      }
    }

    this.packages.set(id, pkg)
    return pkg
  }

  getPackage(id: string): ContactPackage | null {
    return this.packages.get(id) || null
  }

  recordDownload(id: string): void {
    const pkg = this.packages.get(id)
    if (pkg) {
      pkg.stats.downloads++
    }
  }

  recordShare(id: string): void {
    const pkg = this.packages.get(id)
    if (pkg) {
      pkg.stats.shares++
    }
  }

  getAllPackages(): ContactPackage[] {
    return Array.from(this.packages.values())
  }

  getPackagesByCategory(category: string): ContactPackage[] {
    return Array.from(this.packages.values()).filter(pkg => pkg.category === category)
  }

  private async generateQRCodeForPackage(vcardContent: string): Promise<string> {
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

  private async generatePackageImage(options: PackageOptions): Promise<string> {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    
    // 패키지 이미지 크기 (A4 비율)
    canvas.width = 794
    canvas.height = 1123
    
    // 배경 설정
    if (options.background) {
      const img = new Image()
      img.src = options.background
      await new Promise((resolve) => {
        img.onload = resolve
        img.src = options.background!
      })
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    } else {
      // 기본 배경
      ctx.fillStyle = options.color || '#F9FAFB'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    
    // 카테고리별 디자인
    switch (options.category) {
      case 'event':
        return this.generateEventPackageImage(ctx, options)
      case 'company':
        return this.generateCompanyPackageImage(ctx, options)
      case 'team':
        return this.generateTeamPackageImage(ctx, options)
      case 'parents':
        return this.generateParentsPackageImage(ctx, options)
      default:
        return this.generateCustomPackageImage(ctx, options)
    }
  }

  private generateEventPackageImage(ctx: CanvasRenderingContext2D, options: PackageOptions): string {
    const width = ctx.canvas.width
    const height = ctx.canvas.height
    
    // 이벤트 배너
    ctx.fillStyle = 'rgba(236, 72, 153, 0.1)'
    ctx.fillRect(0, 0, width, height * 0.3)
    
    // 이벤트 정보
    ctx.fillStyle = '#1F2937'
    ctx.font = 'bold 48px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(options.name || '', width / 2, 80)
    
    ctx.font = '24px sans-serif'
    ctx.fillStyle = '#4B5563'
    ctx.fillText(options.description || '', width / 2, 130)
    
    // 연락처 정보
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(40, height * 0.4, width - 80, height * 0.5)
    
    ctx.fillStyle = '#1F2937'
    ctx.font = 'bold 24px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`연락처 (${options.contacts.length}명)`, 60, height * 0.45)
    
    ctx.font = '18px sans-serif'
    let yPos = height * 0.5
    
    options.contacts.slice(0, 5).forEach((contact, index) => {
      ctx.fillText(`${index + 1}. ${contact.name || '미지정'} - ${contact.phone || ''}`, 60, yPos)
      yPos += 25
    })
    
    if (options.contacts.length > 5) {
      ctx.fillText(`... 외 ${options.contacts.length - 5}명`, 60, yPos)
    }
    
    // 로고
    if (options.logo) {
      const img = new Image()
      img.src = options.logo
      ctx.drawImage(img, width - 100, 20, 60, 60)
    }
    
    // 생성 정보
    ctx.fillStyle = '#9CA3AF'
    ctx.font = '14px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`PhoneDrop에서 생성 - ${new Date().toLocaleDateString()}`, width / 2, height - 30)
    
    ctx.textAlign = 'left'
    return ctx.canvas.toDataURL('image/png')
  }

  private generateCompanyPackageImage(ctx: CanvasRenderingContext2D, options: PackageOptions): string {
    const width = ctx.canvas.width
    const height = ctx.canvas.height
    
    // 회사 배경
    ctx.fillStyle = options.color || '#3B82F6'
    ctx.fillRect(0, 0, width, height)
    
    // 회사 정보
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 42px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(options.name || '', width / 2, 80)
    
    ctx.font = '24px sans-serif'
    ctx.fillText(options.description || '', width / 2, 130)
    
    // 연락처 목록
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.fillRect(40, 200, width - 80, height - 280)
    
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 20px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`연락처 목록 (${options.contacts.length}명)`, 60, 240)
    
    ctx.font = '16px sans-serif'
    let yPos = 280
    
    options.contacts.forEach((contact, index) => {
      const name = contact.name || '미지정'
      const phone = contact.phone || ''
      const title = contact.title || ''
      const company = contact.company || ''
      
      ctx.fillText(`${index + 1}. ${name}`, 60, yPos)
      yPos += 20
      
      if (phone) {
        ctx.fillText(`   📱 ${phone}`, 60, yPos)
        yPos += 20
      }
      
      if (title) {
        ctx.fillText(`   💼 ${title}`, 60, yPos)
        yPos += 20
      }
      
      if (company) {
        ctx.fillText(`   🏢 ${company}`, 60, yPos)
        yPos += 20
      }
      
      yPos += 10
    })
    
    return ctx.canvas.toDataURL('image/png')
  }

  private generateTeamPackageImage(ctx: CanvasRenderingContext2D, options: PackageOptions): string {
    const width = ctx.canvas.width
    const height = ctx.canvas.height
    
    // 팀 배경
    ctx.fillStyle = options.color || '#10B981'
    ctx.fillRect(0, 0, width, height)
    
    // 팀 정보
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 42px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(options.name || '', width / 2, 80)
    
    ctx.font = '24px sans-serif'
    ctx.fillText(options.description || '', width / 2, 130)
    
    // 팀원 그리드
    const cols = 3
    const rows = Math.ceil(options.contacts.length / cols)
    const cardWidth = (width - 80) / cols - 20
    const cardHeight = 120
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.fillRect(40, 200, width - 80, rows * cardHeight + 40)
    
    ctx.fillStyle = '#FFFFFF'
    ctx.font = '16px sans-serif'
    
    options.contacts.forEach((contact, index) => {
      const col = index % cols
      const row = Math.floor(index / cols)
      const x = 60 + col * (cardWidth + 20)
      const y = 220 + row * (cardHeight + 20)
      
      ctx.fillText(`${contact.name || '미지정'}`, x, y + 20)
      ctx.fillText(`📱 ${contact.phone || ''}`, x, y + 45)
      
      if (contact.title) {
        ctx.fillText(`💼 ${contact.title}`, x, y + 70)
      }
    })
    
    return ctx.canvas.toDataURL('image/png')
  }

  private generateParentsPackageImage(ctx: CanvasRenderingContext2D, options: PackageOptions): string {
    const width = ctx.canvas.width
    const height = ctx.canvas.height
    
    // 학부모 배경
    ctx.fillStyle = options.color || '#F59E0B'
    ctx.fillRect(0, 0, width, height)
    
    // 학부모 정보
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 42px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(options.name || '', width / 2, 80)
    
    ctx.font = '24px sans-serif'
    ctx.fillText(options.description || '', width / 2, 130)
    
    // 학부모 목록
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.fillRect(40, 200, width - 80, height - 280)
    
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 20px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`학부모 연락처 (${options.contacts.length}명)`, 60, 240)
    
    ctx.font = '16px sans-serif'
    let yPos = 280
    
    options.contacts.forEach((contact, index) => {
      const name = contact.name || '학부모'
      const phone = contact.phone || ''
      const childName = contact.memo || ''
      
      ctx.fillText(`${index + 1}. ${name}`, 60, yPos)
      yPos += 20
      
      if (childName) {
        ctx.fillText(`   👶 ${childName} 학부모`, 60, yPos)
        yPos += 20
      }
      
      if (phone) {
        ctx.fillText(`   📱 ${phone}`, 60, yPos)
        yPos += 20
      }
      
      yPos += 10
    })
    
    return ctx.canvas.toDataURL('image/png')
  }

  private generateCustomPackageImage(ctx: CanvasRenderingContext2D, options: PackageOptions): string {
    const width = ctx.canvas.width
    const height = ctx.canvas.height
    
    // 커스텀 배경
    ctx.fillStyle = options.color || '#6B7280'
    ctx.fillRect(0, 0, width, height)
    
    // 커스텀 정보
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 42px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(options.name || '', width / 2, 80)
    
    ctx.font = '24px sans-serif'
    ctx.fillText(options.description || '', width / 2, 130)
    
    // 연락처 목록
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.fillRect(40, 200, width - 80, height - 280)
    
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 20px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`연락처 목록 (${options.contacts.length}명)`, 60, 240)
    
    ctx.font = '16px sans-serif'
    let yPos = 280
    
    options.contacts.forEach((contact, index) => {
      const name = contact.name || '연락처'
      const phone = contact.phone || ''
      
      ctx.fillText(`${index + 1}. ${name}`, 60, yPos)
      yPos += 20
      
      if (phone) {
        ctx.fillText(`   📱 ${phone}`, 60, yPos)
        yPos += 20
      }
      
      yPos += 10
    })
    
    return ctx.canvas.toDataURL('image/png')
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15)
  }
}

export function downloadPackage(pkg: ContactPackage): void {
  // vCard 다운로드
  const vcardLink = document.createElement('a')
  vcardLink.href = pkg.vcardUrl
  vcardLink.download = `${pkg.name}_연락처.vcf`
  document.body.appendChild(vcardLink)
  vcardLink.click()
  document.body.removeChild(vcardLink)
  
  // QR 코드 다운로드
  const qrLink = document.createElement('a')
  qrLink.href = pkg.qrUrl
  qrLink.download = `${pkg.name}_QR.png`
  document.body.appendChild(qrLink)
  qrLink.click()
  document.body.removeChild(qrLink)
  
  // 이미지 다운로드
  const imgLink = document.createElement('a')
  imgLink.href = pkg.imageUrl
  imgLink.download = `${pkg.name}_패키지.png`
  document.body.appendChild(imgLink)
  imgLink.click()
  document.body.removeChild(imgLink)
}

export function sharePackage(pkg: ContactPackage): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${pkg.name} - 연락처 패키지`,
          text: `${pkg.contacts.length}개의 연락처가 포함된 패키지입니다.`,
          url: pkg.vcardUrl
        })
      } else {
        await navigator.clipboard.writeText(pkg.vcardUrl)
        console.log('패키지 링크가 클립보드에 복사되었습니다:', pkg.vcardUrl)
      }
      
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}
