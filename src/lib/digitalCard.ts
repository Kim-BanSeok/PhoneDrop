import { generateVCard, type Contact } from './vcard'
import QRCode from 'qrcode'
import { recommendCardDesign, generateAIBackground, type AICardDesign } from './aiCardDesigner'

export interface DigitalCardOptions {
  template: 'modern' | 'classic' | 'minimal' | 'business' | 'personal' | 'ai'
  color: string
  logo?: string
  background?: string
  includeQR: boolean
  qrSize?: number
  useAI?: boolean
  apiKey?: string // Replicate API 키 (선택사항, 현재 사용 안 함)
  aiFullCard?: boolean // AI가 명함 전체 생성 (텍스트 포함) vs 배경만 생성
}

export interface DigitalCardPackage {
  id: string
  contact: Contact
  imageUrl: string
  qrUrl: string
  vcardUrl: string
  createdAt: Date
  options: DigitalCardOptions
}

export const cardTemplates = {
  ai: {
    name: '🤖 AI 추천',
    description: 'AI가 최적의 디자인을 추천합니다',
    colors: ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B']
  },
  modern: {
    name: '모던',
    description: '세련된 현대 디자인',
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']
  },
  classic: {
    name: '클래식',
    description: '전통적인 명함 디자인',
    colors: ['#1F2937', '#374151', '#6B7280', '#9CA3AF']
  },
  minimal: {
    name: '미니멀',
    description: '심플하고 깔끔한 디자인',
    colors: ['#FFFFFF', '#F9FAFB', '#F3F4F6', '#E5E7EB']
  },
  business: {
    name: '비즈니스',
    description: '전문적인 비즈니스 디자인',
    colors: ['#1E40AF', '#1E3A8A', '#1E293B', '#0F172A']
  },
  personal: {
    name: '개인',
    description: '친근한 개인 디자인',
    colors: ['#EC4899', '#F472B6', '#F9A8D4', '#FBCFE8']
  }
}

export async function generateDigitalCard(
  contact: Contact,
  options: DigitalCardOptions
): Promise<DigitalCardPackage> {
  const id = generateId()
  
  // vCard 생성
  const vcardContent = generateVCard(contact)
  const vcardBlob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8' })
  const vcardUrl = URL.createObjectURL(vcardBlob)
  
  // QR 코드 생성
  const qrUrl = await generateQRCodeForCard(vcardContent, options.qrSize || 256)
  
  // 명함 이미지 생성
  const imageUrl = await generateCardImage(contact, options)
  
  return {
    id,
    contact,
    imageUrl,
    qrUrl,
    vcardUrl,
    createdAt: new Date(),
    options
  }
}

async function generateQRCodeForCard(vcardContent: string, size: number): Promise<string> {
  try {
    const qrDataUrl = await QRCode.toDataURL(vcardContent, {
      width: size,
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

async function generateCardImage(contact: Contact, options: DigitalCardOptions): Promise<string> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  
  // 캔버스 크기 설정 (명함 표준: 90mm x 50mm, 300dpi)
  canvas.width = 1063
  canvas.height = 591
  
  // AI 템플릿인 경우 AI 디자인 추천 사용
  if (options.template === 'ai' || options.useAI) {
    const aiDesign = recommendCardDesign(contact)
    // API 키는 옵션에서 가져오거나 환경 변수에서 가져옴
    const apiKey = options.apiKey || (typeof window !== 'undefined' ? undefined : process.env.REPLICATE_API_KEY)
    const clientApiKey = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_REPLICATE_API_KEY : undefined
    const finalApiKey = apiKey || clientApiKey
    
    // 다른 Provider API 키들
    const openRouterApiKey = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_OPENROUTER_API_KEY : undefined
    const nanobanaApiKey = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_NANOBANA_API_KEY : undefined
    const xaiApiKey = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_XAI_API_KEY : undefined
    const openaiApiKey = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_OPENAI_API_KEY : undefined
    const geminiApiKey = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_GEMINI_API_KEY : undefined
    
    // Provider 선택 (OpenAI만 사용)
    const provider = 'openai' as const
    
    // AI가 명함 전체를 생성할지, 배경만 생성할지 결정
    const aiFullCard = options.aiFullCard !== false // 기본값: true (명함 전체 생성)
    
    const aiCardImage = await generateAIBackground(
      aiDesign.style, 
      aiDesign.colorScheme.primary,
      contact,
      finalApiKey,
      provider,
      openRouterApiKey,
      nanobanaApiKey,
      xaiApiKey,
      openaiApiKey,
      geminiApiKey,
      aiFullCard // 명함 전체 생성 여부
    )
    
    // AI가 명함 전체를 생성한 경우
    if (aiCardImage && aiFullCard) {
      console.log('✅ AI가 명함 전체를 생성했습니다. 텍스트 오버레이 없이 사용합니다.')
      const cardImg = await loadImage(aiCardImage)
      ctx.drawImage(cardImg, 0, 0, canvas.width, canvas.height)
      
      // QR 코드만 추가 (옵션에 따라)
      if (options.includeQR) {
        const qrSize = options.qrSize || 120
        const qrX = canvas.width - qrSize - 40
        const qrY = canvas.height - qrSize - 40
        const vcardContent = generateVCard(contact)
        const qrUrl = await generateQRCodeForCard(vcardContent, qrSize)
        const qrImg = await loadImage(qrUrl)
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)
      }
      
      return ctx.canvas.toDataURL('image/png')
    }
    
    // AI가 배경만 생성한 경우 (기존 방식)
    if (aiCardImage) {
      const bgImg = await loadImage(aiCardImage)
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height)
      
      // 반투명 오버레이 (AI 생성 이미지의 경우 덜 투명하게)
      const overlayOpacity = 0.2
      ctx.fillStyle = `rgba(255, 255, 255, ${overlayOpacity})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    } else {
      // 배경이 없으면 AI 추천 색상 사용
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, aiDesign.colorScheme.primary)
      gradient.addColorStop(1, aiDesign.colorScheme.secondary)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    
    // AI 디자인으로 명함 생성 (배경은 이미 그려짐, 텍스트 오버레이)
    return await generateAICard(ctx, contact, aiDesign, options)
  }
  
  // 배경 설정
  if (options.background) {
    const img = await loadImage(options.background)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  } else {
    // 기본 배경
    ctx.fillStyle = options.color || '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  
  // 템플릿별 디자인 적용
  switch (options.template) {
    case 'modern':
      return await generateModernCard(ctx, contact, options)
    case 'classic':
      return await generateClassicCard(ctx, contact, options)
    case 'minimal':
      return await generateMinimalCard(ctx, contact, options)
    case 'business':
      return await generateBusinessCard(ctx, contact, options)
    case 'personal':
      return await generatePersonalCard(ctx, contact, options)
    default:
      return await generateModernCard(ctx, contact, options)
  }
}

async function generateModernCard(ctx: CanvasRenderingContext2D, contact: Contact, options: DigitalCardOptions): Promise<string> {
  const width = ctx.canvas.width
  const height = ctx.canvas.height
  
  // 배경 그라데이션
  const bgGradient = ctx.createLinearGradient(0, 0, width, height)
  bgGradient.addColorStop(0, '#FFFFFF')
  bgGradient.addColorStop(1, '#F8FAFC')
  ctx.fillStyle = bgGradient
  ctx.fillRect(0, 0, width, height)
  
  // 왼쪽 컬러 블록 (그라데이션)
  const leftGradient = ctx.createLinearGradient(0, 0, width * 0.4, height)
  leftGradient.addColorStop(0, options.color || '#3B82F6')
  leftGradient.addColorStop(1, adjustBrightness(options.color || '#3B82F6', -20))
  ctx.fillStyle = leftGradient
  ctx.fillRect(0, 0, width * 0.4, height)
  
  // 왼쪽 상단 장식 원
  ctx.beginPath()
  ctx.arc(width * 0.2, height * 0.15, 80, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.fill()
  
  // 로고 (둥근 모서리)
  if (options.logo) {
    const logoSize = 80
    const logoX = 40
    const logoY = 40
    const logoImg = await loadImage(options.logo)
    ctx.save()
    ctx.beginPath()
    ctx.roundRect(logoX, logoY, logoSize, logoSize, 12)
    ctx.clip()
    ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize)
    ctx.restore()
  }
  
  // 이름 (왼쪽, 흰색, 큰 폰트)
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 56px "Noto Sans KR", "Malgun Gothic", sans-serif'
  ctx.textBaseline = 'top'
  ctx.fillText(contact.name || '', 40, 150)
  
  // 직책/회사 (왼쪽, 반투명 흰색)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
  ctx.font = '28px "Noto Sans KR", "Malgun Gothic", sans-serif'
  let leftY = 230
  if (contact.title) {
    ctx.fillText(contact.title, 40, leftY)
    leftY += 45
  }
  if (contact.company) {
    ctx.fillText(contact.company, 40, leftY)
  }
  
  // 오른쪽 정보 영역 배경
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.roundRect(width * 0.45, 40, width * 0.5, height - 80, 16)
  ctx.fill()
  
  // 그림자 효과
  ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
  ctx.shadowBlur = 20
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 4
  
  // 전화번호 아이콘 + 텍스트
  const rightX = width * 0.5
  let rightY = 120
  ctx.fillStyle = '#1F2937'
  ctx.font = 'bold 36px "Noto Sans KR", "Malgun Gothic", sans-serif'
  ctx.fillText('📱', rightX, rightY)
  ctx.fillText(contact.phone, rightX + 50, rightY)
  rightY += 70
  
  // 이메일 아이콘 + 텍스트
  if (contact.email) {
    ctx.font = '28px "Noto Sans KR", "Malgun Gothic", sans-serif'
    ctx.fillStyle = '#4B5563'
    ctx.fillText('✉️', rightX, rightY)
    ctx.fillText(contact.email, rightX + 50, rightY)
    rightY += 60
  }
  
  // QR 코드 (오른쪽 하단)
  if (options.includeQR) {
    const qrSize = 120
    const qrX = width - qrSize - 40
    const qrY = height - qrSize - 40
    const qrUrl = await generateQRCodeForCard(generateVCard(contact), qrSize)
    const qrImg = await loadImage(qrUrl)
    ctx.shadowBlur = 0
    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)
    
    // QR 코드 라벨
    ctx.fillStyle = '#6B7280'
    ctx.font = '16px "Noto Sans KR", "Malgun Gothic", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('스캔하여 저장', qrX + qrSize / 2, qrY + qrSize + 20)
    ctx.textAlign = 'left'
  }
  
  ctx.shadowBlur = 0
  
  return ctx.canvas.toDataURL('image/png')
}

async function generateClassicCard(ctx: CanvasRenderingContext2D, contact: Contact, options: DigitalCardOptions): Promise<string> {
  const width = ctx.canvas.width
  const height = ctx.canvas.height
  
  // 배경 (크림색)
  ctx.fillStyle = '#FEF9F3'
  ctx.fillRect(0, 0, width, height)
  
  // 장식 테두리
  ctx.strokeStyle = '#D97706'
  ctx.lineWidth = 4
  ctx.strokeRect(30, 30, width - 60, height - 60)
  
  // 내부 테두리
  ctx.strokeStyle = '#FCD34D'
  ctx.lineWidth = 2
  ctx.strokeRect(50, 50, width - 100, height - 100)
  
  // 이름 (클래식 폰트)
  ctx.fillStyle = '#1F2937'
  ctx.font = 'bold 52px "Times New Roman", serif'
  ctx.textAlign = 'center'
  ctx.fillText(contact.name, width / 2, 140)
  
  // 구분선 (장식)
  ctx.beginPath()
  ctx.moveTo(width * 0.2, 200)
  ctx.lineTo(width * 0.8, 200)
  ctx.strokeStyle = '#D97706'
  ctx.lineWidth = 2
  ctx.stroke()
  
  // 정보 (중앙 정렬)
  ctx.font = '32px "Times New Roman", serif'
  ctx.fillStyle = '#374151'
  
  let yPos = 260
  if (contact.title) {
    ctx.fillText(contact.title, width / 2, yPos)
    yPos += 50
  }
  if (contact.company) {
    ctx.fillText(contact.company, width / 2, yPos)
    yPos += 50
  }
  
  ctx.font = '28px "Times New Roman", serif'
  ctx.fillText(contact.phone, width / 2, yPos)
  
  if (contact.email) {
    ctx.fillText(contact.email, width / 2, yPos + 50)
  }
  
  ctx.textAlign = 'left'
  
  return ctx.canvas.toDataURL('image/png')
}

async function generateMinimalCard(ctx: CanvasRenderingContext2D, contact: Contact, options: DigitalCardOptions): Promise<string> {
  const width = ctx.canvas.width
  const height = ctx.canvas.height
  
  // 배경 (미니멀 그라데이션)
  const bgGradient = ctx.createLinearGradient(0, 0, width, height)
  bgGradient.addColorStop(0, '#FFFFFF')
  bgGradient.addColorStop(1, '#F9FAFB')
  ctx.fillStyle = bgGradient
  ctx.fillRect(0, 0, width, height)
  
  // 이름 (중앙 정렬, 큰 폰트)
  ctx.fillStyle = '#111827'
  ctx.font = 'bold 64px "Noto Sans KR", "Malgun Gothic", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(contact.name, width / 2, height * 0.35)
  
  // 전화번호 (색상 강조)
  ctx.font = '36px "Noto Sans KR", "Malgun Gothic", sans-serif'
  ctx.fillStyle = options.color || '#3B82F6'
  ctx.fillText(contact.phone, width / 2, height * 0.5)
  
  // 구분선
  ctx.beginPath()
  ctx.moveTo(width * 0.25, height * 0.6)
  ctx.lineTo(width * 0.75, height * 0.6)
  ctx.strokeStyle = '#E5E7EB'
  ctx.lineWidth = 1
  ctx.stroke()
  
  // 기타 정보 (작은 폰트)
  ctx.font = '24px "Noto Sans KR", "Malgun Gothic", sans-serif'
  ctx.fillStyle = '#6B7280'
  
  let infoY = height * 0.68
  if (contact.title || contact.company) {
    const text = contact.title ? contact.title : contact.company || ''
    ctx.fillText(text, width / 2, infoY)
    infoY += 40
  }
  
  if (contact.email) {
    ctx.fillText(contact.email, width / 2, infoY)
  }
  
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  return ctx.canvas.toDataURL('image/png')
}

async function generateBusinessCard(ctx: CanvasRenderingContext2D, contact: Contact, options: DigitalCardOptions): Promise<string> {
  const width = ctx.canvas.width
  const height = ctx.canvas.height
  
  // 배경
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, width, height)
  
  // 상단 바 (그라데이션)
  const topGradient = ctx.createLinearGradient(0, 0, width, height * 0.25)
  topGradient.addColorStop(0, options.color || '#1E40AF')
  topGradient.addColorStop(1, adjustBrightness(options.color || '#1E40AF', -30))
  ctx.fillStyle = topGradient
  ctx.fillRect(0, 0, width, height * 0.25)
  
  // 로고 (둥근 모서리)
  if (options.logo) {
    const logoSize = 100
    const logoX = 50
    const logoY = 30
    const logoImg = await loadImage(options.logo)
    ctx.save()
    ctx.beginPath()
    ctx.roundRect(logoX, logoY, logoSize, logoSize, 16)
    ctx.clip()
    ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize)
    ctx.restore()
    
    // 로고 배경
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.beginPath()
    ctx.roundRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10, 18)
    ctx.fill()
  }
  
  // 회사명 (상단 바)
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 32px "Noto Sans KR", "Malgun Gothic", sans-serif'
  ctx.fillText(contact.company || '', 170, 80)
  
  // 이름 (큰 폰트)
  ctx.fillStyle = '#111827'
  ctx.font = 'bold 48px "Noto Sans KR", "Malgun Gothic", sans-serif'
  ctx.fillText(contact.name, 50, 200)
  
  // 직책
  ctx.fillStyle = '#4B5563'
  ctx.font = '28px "Noto Sans KR", "Malgun Gothic", sans-serif'
  ctx.fillText(contact.title || '', 50, 250)
  
  // 구분선
  ctx.beginPath()
  ctx.moveTo(50, 290)
  ctx.lineTo(width - 50, 290)
  ctx.strokeStyle = '#E5E7EB'
  ctx.lineWidth = 1
  ctx.stroke()
  
  // 연락처 정보 (아이콘 + 텍스트)
  ctx.fillStyle = '#374151'
  ctx.font = '26px "Noto Sans KR", "Malgun Gothic", sans-serif'
  
  let yPos = 340
  ctx.fillText('📱', 50, yPos)
  ctx.fillText(contact.phone, 90, yPos)
  yPos += 45
  
  if (contact.email) {
    ctx.fillText('✉️', 50, yPos)
    ctx.fillText(contact.email, 90, yPos)
  }
  
  // QR 코드 (오른쪽 하단)
  if (options.includeQR) {
    const qrSize = 140
    const qrX = width - qrSize - 40
    const qrY = height - qrSize - 40
    const qrUrl = await generateQRCodeForCard(generateVCard(contact), qrSize)
    const qrImg = await loadImage(qrUrl)
    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)
  }
  
  return ctx.canvas.toDataURL('image/png')
}

async function generatePersonalCard(ctx: CanvasRenderingContext2D, contact: Contact, options: DigitalCardOptions): Promise<string> {
  const width = ctx.canvas.width
  const height = ctx.canvas.height
  
  // 그라데이션 배경 (더 부드러운 그라데이션)
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, options.color || '#EC4899')
  gradient.addColorStop(0.5, adjustBrightness(options.color || '#EC4899', 20))
  gradient.addColorStop(1, '#F9A8D4')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  // 장식 원들
  ctx.beginPath()
  ctx.arc(width * 0.8, height * 0.2, 100, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
  ctx.fill()
  
  ctx.beginPath()
  ctx.arc(width * 0.1, height * 0.8, 80, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.fill()
  
  // 이름 (큰 폰트, 그림자)
  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'
  ctx.shadowBlur = 10
  ctx.shadowOffsetX = 2
  ctx.shadowOffsetY = 2
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 56px "Noto Sans KR", "Malgun Gothic", sans-serif'
  ctx.fillText(contact.name, 50, 160)
  ctx.shadowBlur = 0
  
  // 정보 카드 (반투명 배경)
  const infoCardY = 240
  const infoCardHeight = height - infoCardY - 50
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
  ctx.beginPath()
  ctx.roundRect(40, infoCardY, width - 80, infoCardHeight, 20)
  ctx.fill()
  
  // 이모지와 정보 (흰색, 큰 폰트)
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '32px "Noto Sans KR", "Malgun Gothic", sans-serif'
  
  let yPos = infoCardY + 50
  ctx.fillText('📱', 70, yPos)
  ctx.fillText(contact.phone, 120, yPos)
  yPos += 55
  
  if (contact.email) {
    ctx.fillText('✉️', 70, yPos)
    ctx.fillText(contact.email, 120, yPos)
    yPos += 55
  }
  
  if (contact.company) {
    ctx.fillText('🏢', 70, yPos)
    ctx.fillText(contact.company, 120, yPos)
    yPos += 55
  }
  
  if (contact.title) {
    ctx.fillText('💼', 70, yPos)
    ctx.fillText(contact.title, 120, yPos)
  }
  
  return ctx.canvas.toDataURL('image/png')
}

// 유틸리티 함수들
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

function adjustBrightness(color: string, amount: number): string {
  const hex = color.replace('#', '')
  const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount))
  const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount))
  const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// AI 기반 명함 생성
async function generateAICard(
  ctx: CanvasRenderingContext2D,
  contact: Contact,
  aiDesign: AICardDesign,
  options: DigitalCardOptions
): Promise<string> {
  const width = ctx.canvas.width
  const height = ctx.canvas.height
  
  // 텍스트 색상 결정 (배경에 따라 대비가 높은 색상 사용)
  const getTextColor = (bgColor: string): string => {
    // 간단한 밝기 계산
    const hex = bgColor.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 128 ? '#1F2937' : '#FFFFFF'
  }
  
  const textColor = getTextColor(aiDesign.colorScheme.primary)
  
  // 레이아웃에 따른 디자인
  if (aiDesign.layout === 'split') {
    // 분할 레이아웃 - 왼쪽에 이름, 오른쪽에 정보
    const leftWidth = width * 0.4
    
    // 왼쪽 반투명 오버레이 (텍스트 가독성 향상)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
    ctx.fillRect(0, 0, leftWidth, height)
    
    // 이름 (왼쪽, 큰 폰트)
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 64px "Noto Sans KR", "Malgun Gothic", sans-serif'
    ctx.textBaseline = 'top'
    ctx.textAlign = 'left'
    ctx.fillText(contact.name, 40, 80)
    
    // 직책/회사 (왼쪽)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
    ctx.font = '28px "Noto Sans KR", "Malgun Gothic", sans-serif'
    let leftY = 180
    if (contact.title) {
      ctx.fillText(contact.title, 40, leftY)
      leftY += 45
    }
    if (contact.company) {
      ctx.fillText(contact.company, 40, leftY)
    }
    
    // 오른쪽 정보 영역 (반투명 배경)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.beginPath()
    ctx.roundRect(leftWidth + 20, 30, width - leftWidth - 40, height - 60, 20)
    ctx.fill()
    
    // 그림자 효과
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)'
    ctx.shadowBlur = 20
    ctx.shadowOffsetY = 5
    
    // 연락처 정보
    ctx.fillStyle = aiDesign.colorScheme.text || '#1F2937'
    ctx.font = 'bold 36px "Noto Sans KR", "Malgun Gothic", sans-serif'
    ctx.shadowBlur = 0
    
    let rightY = 120
    ctx.fillText('📱', leftWidth + 50, rightY)
    ctx.fillText(contact.phone, leftWidth + 100, rightY)
    rightY += 65
    
    if (contact.email) {
      ctx.font = '26px "Noto Sans KR", "Malgun Gothic", sans-serif'
      ctx.fillStyle = aiDesign.colorScheme.text || '#4B5563'
      ctx.fillText('✉️', leftWidth + 50, rightY)
      ctx.fillText(contact.email, leftWidth + 100, rightY)
    }
    
    // QR 코드
    if (options.includeQR) {
      const qrSize = 140
      const qrX = width - qrSize - 40
      const qrY = height - qrSize - 40
      const qrUrl = await generateQRCodeForCard(generateVCard(contact), qrSize)
      const qrImg = await loadImage(qrUrl)
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)
    }
    
  } else if (aiDesign.layout === 'centered') {
    // 중앙 정렬 레이아웃
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    // 중앙 반투명 배경 (텍스트 가독성)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
    ctx.beginPath()
    ctx.roundRect(width * 0.1, height * 0.15, width * 0.8, height * 0.7, 25)
    ctx.fill()
    
    // 이름
    ctx.fillStyle = aiDesign.colorScheme.primary
    ctx.font = 'bold 68px "Noto Sans KR", "Malgun Gothic", sans-serif'
    ctx.fillText(contact.name, width / 2, height * 0.35)
    
    // 전화번호
    ctx.font = '36px "Noto Sans KR", "Malgun Gothic", sans-serif'
    ctx.fillStyle = aiDesign.colorScheme.text || '#1F2937'
    ctx.fillText(contact.phone, width / 2, height * 0.5)
    
    // 이메일
    if (contact.email) {
      ctx.font = '24px "Noto Sans KR", "Malgun Gothic", sans-serif'
      ctx.fillStyle = aiDesign.colorScheme.text || '#6B7280'
      ctx.fillText(contact.email, width / 2, height * 0.62)
    }
    
    // QR 코드 (하단 중앙)
    if (options.includeQR) {
      const qrSize = 120
      const qrX = width / 2 - qrSize / 2
      const qrY = height - qrSize - 30
      const qrUrl = await generateQRCodeForCard(generateVCard(contact), qrSize)
      const qrImg = await loadImage(qrUrl)
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)
    }
    
    ctx.textAlign = 'left'
    
  } else if (aiDesign.layout === 'asymmetric') {
    // 비대칭 레이아웃
    // 왼쪽 상단에 이름
    ctx.fillStyle = textColor
    ctx.font = 'bold 72px "Noto Sans KR", "Malgun Gothic", sans-serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText(contact.name, 50, 50)
    
    // 오른쪽 하단에 정보
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.beginPath()
    ctx.roundRect(width * 0.5, height * 0.4, width * 0.45, height * 0.5, 20)
    ctx.fill()
    
    ctx.fillStyle = aiDesign.colorScheme.text || '#1F2937'
    ctx.font = 'bold 32px "Noto Sans KR", "Malgun Gothic", sans-serif'
    let infoY = height * 0.45
    ctx.fillText('📱', width * 0.55, infoY)
    ctx.fillText(contact.phone, width * 0.6, infoY)
    infoY += 50
    
    if (contact.email) {
      ctx.font = '24px "Noto Sans KR", "Malgun Gothic", sans-serif'
      ctx.fillText('✉️', width * 0.55, infoY)
      ctx.fillText(contact.email, width * 0.6, infoY)
    }
    
    // QR 코드 (왼쪽 하단)
    if (options.includeQR) {
      const qrSize = 120
      const qrX = 50
      const qrY = height - qrSize - 50
      const qrUrl = await generateQRCodeForCard(generateVCard(contact), qrSize)
      const qrImg = await loadImage(qrUrl)
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)
    }
    
  } else {
    // minimal 레이아웃
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    // 이름 (큰 폰트, 중앙)
    ctx.fillStyle = textColor
    ctx.font = 'bold 80px "Noto Sans KR", "Malgun Gothic", sans-serif'
    ctx.fillText(contact.name, width / 2, height * 0.35)
    
    // 전화번호 (작은 폰트)
    ctx.font = '32px "Noto Sans KR", "Malgun Gothic", sans-serif'
    ctx.fillStyle = aiDesign.colorScheme.primary
    ctx.fillText(contact.phone, width / 2, height * 0.55)
    
    // QR 코드 (하단 중앙, 작게)
    if (options.includeQR) {
      const qrSize = 100
      const qrX = width / 2 - qrSize / 2
      const qrY = height - qrSize - 40
      const qrUrl = await generateQRCodeForCard(generateVCard(contact), qrSize)
      const qrImg = await loadImage(qrUrl)
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)
    }
    
    ctx.textAlign = 'left'
  }
  
  return ctx.canvas.toDataURL('image/png')
}

// CanvasRenderingContext2D에 roundRect 확장
declare global {
  interface CanvasRenderingContext2D {
    roundRect(x: number, y: number, width: number, height: number, radius: number): void
  }
}

// 브라우저 환경에서만 실행 (SSR 방지)
if (typeof window !== 'undefined' && typeof CanvasRenderingContext2D !== 'undefined') {
  if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x: number, y: number, width: number, height: number, radius: number) {
      this.beginPath()
      this.moveTo(x + radius, y)
      this.lineTo(x + width - radius, y)
      this.quadraticCurveTo(x + width, y, x + width, y + radius)
      this.lineTo(x + width, y + height - radius)
      this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
      this.lineTo(x + radius, y + height)
      this.quadraticCurveTo(x, y + height, x, y + height - radius)
      this.lineTo(x, y + radius)
      this.quadraticCurveTo(x, y, x + radius, y)
      this.closePath()
    }
  }
}

export function downloadDigitalCardPackage(pkg: DigitalCardPackage): void {
  // 명함 이미지 다운로드
  const imgLink = document.createElement('a')
  imgLink.href = pkg.imageUrl
  imgLink.download = `${pkg.contact.name}_명함.png`
  imgLink.click()
  
  // QR 코드 다운로드
  const qrLink = document.createElement('a')
  qrLink.href = pkg.qrUrl
  qrLink.download = `${pkg.contact.name}_QR.png`
  qrLink.click()
  
  // vCard 다운로드
  const vcardLink = document.createElement('a')
  vcardLink.href = pkg.vcardUrl
  vcardLink.download = `${pkg.contact.name}.vcf`
  vcardLink.click()
}

export function generateCardPreview(contact: Contact, template: string): string {
  const options: DigitalCardOptions = {
    template: template as any,
    color: '#3B82F6',
    includeQR: true,
    qrSize: 128
  }
  
  // 실제 생성은 비동기이지만, 미리보기용으로는 기본 템플릿 반환
  return `/api/preview/${template}`
}
