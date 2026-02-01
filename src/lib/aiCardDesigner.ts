import { type Contact } from './vcard'

export interface AICardDesign {
  backgroundUrl?: string
  colorScheme: {
    primary: string
    secondary: string
    text: string
    accent: string
  }
  layout: 'split' | 'centered' | 'asymmetric' | 'minimal'
  style: 'professional' | 'creative' | 'elegant' | 'modern'
}

/**
 * AI 기반 명함 디자인 추천
 * 연락처 정보를 분석하여 최적의 디자인을 추천합니다.
 */
export function recommendCardDesign(contact: Contact): AICardDesign {
  const hasCompany = !!contact.company
  const hasTitle = !!contact.title
  const hasEmail = !!contact.email
  
  // 비즈니스 연락처인지 판단
  const isBusiness = hasCompany || hasTitle
  
  // 색상 스키마 추천
  let colorScheme = {
    primary: '#3B82F6',
    secondary: '#EFF6FF',
    text: '#1F2937',
    accent: '#10B981'
  }
  
  let layout: 'split' | 'centered' | 'asymmetric' | 'minimal' = 'split'
  let style: 'professional' | 'creative' | 'elegant' | 'modern' = 'modern'
  
  if (isBusiness) {
    // 비즈니스: 전문적이고 신뢰감 있는 디자인
    colorScheme = {
      primary: '#1E40AF',
      secondary: '#DBEAFE',
      text: '#111827',
      accent: '#3B82F6'
    }
    layout = 'split'
    style = 'professional'
  } else {
    // 개인: 친근하고 창의적인 디자인
    colorScheme = {
      primary: '#EC4899',
      secondary: '#FCE7F3',
      text: '#1F2937',
      accent: '#F59E0B'
    }
    layout = 'centered'
    style = 'creative'
  }
  
  // 회사명에 따라 색상 조정
  if (contact.company) {
    const companyName = contact.company.toLowerCase()
    if (companyName.includes('tech') || companyName.includes('tech')) {
      colorScheme.primary = '#6366F1'
    } else if (companyName.includes('finance') || companyName.includes('금융')) {
      colorScheme.primary = '#059669'
    } else if (companyName.includes('design') || companyName.includes('디자인')) {
      colorScheme.primary = '#F59E0B'
    }
  }
  
  return {
    colorScheme,
    layout,
    style
  }
}

/**
 * Replicate API를 사용한 배경 이미지 생성
 */
export async function generateAIBackgroundWithReplicate(
  prompt: string,
  apiKey: string
): Promise<string | null> {
  try {
    console.log('🎨 Replicate API 호출 시작 (서버 경유):', {
      model: 'stabilityai/stable-diffusion',
      prompt: prompt.substring(0, 50) + '...',
      hasApiKey: !!apiKey
    })
    
    // Next.js API Route를 통해 서버 사이드에서 호출 (CORS 문제 해결)
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        apiKey
      }),
    })

    console.log('📡 API 응답 상태:', response.status, response.statusText)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      console.warn(`❌ Replicate API Error: ${response.status}`, errorData)
      
      // 402 에러는 크레딧 부족 - 그라데이션 폴백 사용
      if (response.status === 402) {
        console.log('💳 Replicate API 크레딧 부족, 그라데이션 배경으로 폴백')
      }
      
      return null
    }

    const data = await response.json()
    
    if (!data.success || !data.image) {
      console.warn('❌ API 응답에 이미지가 없습니다:', data)
      return null
    }

    console.log('✅ 이미지 수신 완료:', data.size, 'bytes')
    
    // Base64 이미지를 Blob URL로 변환
    // data.image는 이미 "data:image/png;base64,..." 형식
    return data.image
  } catch (error) {
    console.error('❌ Replicate API Error:', error)
    return null
  }
}

/**
 * 이미지 생성 프롬프트 생성
 * @param contact 연락처 정보
 * @param style 스타일
 * @param fullCard true면 명함 전체 생성, false면 배경만 생성
 */
export function generateImagePrompt(contact: Contact, style: string, fullCard: boolean = false): string {
  if (fullCard) {
    // 명함 전체 생성 프롬프트 - 매우 구체적이고 명확하게 작성
    const contactInfo: string[] = []
    
    // 연락처 정보 구성
    contactInfo.push(`Name: "${contact.name}"`)
    
    if (contact.title) {
      contactInfo.push(`Job Title: "${contact.title}"`)
    }
    
    if (contact.company) {
      contactInfo.push(`Company: "${contact.company}"`)
    }
    
    contactInfo.push(`Phone Number: "${contact.phone}"`)
    
    if (contact.email) {
      contactInfo.push(`Email: "${contact.email}"`)
    }
    
    // 스타일별 상세 키워드
    let styleDescription = ''
    let layoutDescription = ''
    
    if (style === 'professional') {
      styleDescription = 'professional corporate business card, clean white background with subtle gradient, modern office aesthetic, trustworthy and reliable design, minimal decorative elements'
      layoutDescription = 'left-aligned text layout, name prominently displayed at top, company logo area on right side, contact information clearly organized in vertical list'
    } else if (style === 'creative') {
      styleDescription = 'creative artistic business card, vibrant colorful abstract background, modern design, eye-catching but professional, dynamic visual elements'
      layoutDescription = 'asymmetric layout, bold typography, name in large font, creative use of negative space, contact info integrated into design flow'
    } else if (style === 'elegant') {
      styleDescription = 'elegant luxury business card, sophisticated premium design, refined color palette, high-end aesthetic, subtle textures, minimalist elegance'
      layoutDescription = 'centered elegant typography, balanced composition, premium materials look, sophisticated spacing, classic yet modern'
    } else {
      styleDescription = 'modern minimalist business card, clean contemporary design, simple geometric shapes, fresh and approachable, professional yet friendly'
      layoutDescription = 'clean grid-based layout, ample white space, clear hierarchy, modern sans-serif typography, well-organized information'
    }
    
    // 회사 정보 기반 스타일 미세 조정
    if (contact.company) {
      const companyName = contact.company.toLowerCase()
      if (companyName.includes('tech') || companyName.includes('테크')) {
        styleDescription += ', tech industry aesthetic, digital innovation, futuristic elements, sleek modern design'
      } else if (companyName.includes('finance') || companyName.includes('금융')) {
        styleDescription += ', financial services, conservative professional, trustworthy appearance, traditional yet modern'
      } else if (companyName.includes('design') || companyName.includes('디자인')) {
        styleDescription += ', creative industry, artistic flair, design-forward, visually striking'
      }
    }
    
    // 전체 프롬프트 구성 - 실제 명함처럼 보이도록 매우 강력하게 작성
    const prompt = `A professional business card design. 

CRITICAL REQUIREMENTS - MUST FOLLOW:
- This is a REAL business card, NOT abstract art, NOT digital graphics, NOT artistic illustration
- Clean, simple, professional design like a real printed business card
- White or light colored background (NO vibrant gradients, NO abstract patterns, NO artistic backgrounds)
- All text must be clearly readable, sharp, and professional
- Text appears as if printed on paper, not floating or decorative
- Standard business card layout with organized information

CARD INFORMATION TO DISPLAY EXACTLY:
${contactInfo.map(info => `- ${info}`).join('\n')}

DESIGN STYLE (${style}):
${style === 'professional' ? 'Clean white background, minimal design, professional typography, corporate style, simple and elegant' : 
  style === 'creative' ? 'Modern design with subtle color accent, clean background, creative but professional layout' :
  style === 'elegant' ? 'Sophisticated design, premium look, elegant typography, refined color palette' :
  'Modern minimalist design, clean layout, simple and fresh'}

LAYOUT STRUCTURE:
- Name "${contact.name}" displayed prominently at the top in large, bold font
${contact.title ? `- Job title "${contact.title}" below the name in medium font` : ''}
${contact.company ? `- Company "${contact.company}" below title in medium font` : ''}
- Phone number "${contact.phone}" clearly displayed in readable font
${contact.email ? `- Email "${contact.email}" clearly displayed in readable font` : ''}
- All contact information organized in a clean, vertical or horizontal layout
- Professional spacing between elements
- High contrast between text and background for perfect readability

VISUAL STYLE:
- Simple, clean background (white, light gray, or subtle single color)
- NO abstract art, NO complex gradients, NO decorative patterns
- Professional sans-serif or serif typography
- Text is black or dark color on light background
- Clean, sharp edges
- Looks like a real printed business card on paper
- Professional and business-appropriate

FORBIDDEN ELEMENTS:
- NO abstract art or artistic illustrations
- NO complex gradients or colorful backgrounds
- NO decorative patterns or textures
- NO floating or abstract text
- NO artistic or creative text styling
- NO circuit board patterns or digital graphics
- NO vibrant colors or rainbow effects

OUTPUT REQUIREMENTS:
- Must look like a standard business card you would receive at a networking event
- Professional, clean, and suitable for actual business use
- All text must be clearly readable and properly formatted
- Simple design that focuses on information, not decoration
- High quality, detailed, professional appearance`
    
    return prompt
  } else {
    // 배경만 생성 (기존 방식)
    const keywords: string[] = []
    
    // 스타일 키워드
    if (style === 'professional') {
      keywords.push('professional business card background', 'corporate', 'modern office', 'clean')
    } else if (style === 'creative') {
      keywords.push('creative abstract background', 'artistic', 'colorful gradient', 'vibrant')
    } else if (style === 'elegant') {
      keywords.push('elegant luxury background', 'sophisticated', 'minimalist', 'refined')
    } else {
      keywords.push('modern minimalist background', 'clean', 'contemporary', 'simple')
    }
    
    // 회사 정보 추가
    if (contact.company) {
      const companyName = contact.company.toLowerCase()
      if (companyName.includes('tech') || companyName.includes('테크')) {
        keywords.push('technology', 'digital', 'futuristic')
      } else if (companyName.includes('finance') || companyName.includes('금융')) {
        keywords.push('financial', 'professional', 'trustworthy')
      } else if (companyName.includes('design') || companyName.includes('디자인')) {
        keywords.push('art', 'creative', 'minimalist')
      }
    }
    
    // 품질 키워드 추가
    keywords.push('high quality', '4k', 'detailed', 'beautiful')
    
    return keywords.join(', ')
  }
}

/**
 * 그라데이션 배경을 Canvas로 생성하여 Data URL 반환
 */
function generateGradientBackground(
  style: string,
  color: string,
  width: number = 1063,
  height: number = 591
): string {
  // 브라우저 환경에서만 실행
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return ''
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  
  // 스타일별 그라데이션 생성
  let gradient: CanvasGradient
  
  switch (style) {
    case 'professional':
      gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, color)
      gradient.addColorStop(1, adjustColorBrightness(color, -30))
      break
    case 'creative':
      gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height))
      gradient.addColorStop(0, color)
      gradient.addColorStop(0.5, adjustColorBrightness(color, 20))
      gradient.addColorStop(1, adjustColorBrightness(color, 40))
      break
    case 'elegant':
      gradient = ctx.createLinearGradient(0, 0, width, 0)
      gradient.addColorStop(0, adjustColorBrightness(color, -20))
      gradient.addColorStop(0.5, color)
      gradient.addColorStop(1, adjustColorBrightness(color, -20))
      break
    default: // modern
      gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, color)
      gradient.addColorStop(1, adjustColorBrightness(color, 15))
      break
  }
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  // 텍스처 효과 추가 (선택적)
  if (style === 'professional' || style === 'elegant') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const size = Math.random() * 3
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  
  return canvas.toDataURL('image/png')
}

/**
 * 색상 밝기 조정 유틸리티
 */
function adjustColorBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.max(0, Math.min(255, (num >> 16) + percent))
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + percent))
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + percent))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

/**
 * 배경 이미지 생성 (여러 API 시도, 실패 시 그라데이션 폴백)
 */
export async function generateAIBackground(
  style: string,
  color: string,
  contact?: Contact,
  apiKey?: string,
  provider?: 'replicate' | 'openrouter' | 'nanobana' | 'xai' | 'openai' | 'gemini',
  openRouterApiKey?: string,
  nanobanaApiKey?: string,
  xaiApiKey?: string,
  openaiApiKey?: string,
  geminiApiKey?: string,
  fullCard: boolean = false // 명함 전체 생성 여부
): Promise<string | null> {
  // API 키가 있고 연락처 정보가 있으면 AI API 사용
  if (contact) {
    console.log('🤖 AI 배경 생성 시도:', { 
      style, 
      provider: 'openai', // OpenAI만 사용
      hasOpenAIApiKey: !!openaiApiKey,
      contactName: contact.name 
    })
    const prompt = generateImagePrompt(contact, style, fullCard)
    console.log('📝 생성된 프롬프트:', prompt.substring(0, 200) + (prompt.length > 200 ? '...' : ''))
    console.log('🎨 생성 모드:', fullCard ? '명함 전체 생성' : '배경만 생성')
    
    // OpenAI API만 사용
    let result: string | null = null
    
    if (openaiApiKey) {
      console.log('🎨 OpenAI API 시도...')
      try {
        result = await generateAIBackgroundWithProvider(prompt, 'openai', openaiApiKey)
        if (result) {
          console.log('✅ OpenAI API로 배경 이미지 생성 성공')
          return result
        }
        console.log('❌ OpenAI API 실패, 그라데이션 배경으로 폴백')
      } catch (error) {
        console.error('❌ OpenAI API 에러:', error)
        console.log('❌ OpenAI API 실패, 그라데이션 배경으로 폴백')
      }
    } else {
      console.log('⚠️ OpenAI API 키가 없어 그라데이션 배경 사용')
    }
    
    console.log('⚠️ 모든 AI API 실패, 그라데이션 폴백 사용')
  } else {
    if (!apiKey && !openRouterApiKey && !nanobanaApiKey && !xaiApiKey && !openaiApiKey && !geminiApiKey) {
      console.log('⚠️ API 키가 없어 그라데이션 배경 사용')
    }
    if (!contact) {
      console.log('⚠️ 연락처 정보가 없어 그라데이션 배경 사용')
    }
  }
  
  // 그라데이션 배경 생성 (CORS 문제 없음)
  try {
    console.log('🎨 그라데이션 배경 생성:', style)
    return generateGradientBackground(style, color)
  } catch (error) {
    console.error('그라데이션 배경 생성 실패:', error)
    return null
  }
}

/**
 * Provider별 AI 배경 생성 (통합 함수)
 */
async function generateAIBackgroundWithProvider(
  prompt: string,
  provider: 'replicate' | 'openrouter' | 'nanobana' | 'xai' | 'openai' | 'gemini',
  apiKey: string
): Promise<string | null> {
  try {
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        provider: 'openai', // OpenAI만 사용하도록 강제
        openaiApiKey: apiKey, // OpenAI API 키 전달
      }),
    })

    console.log('📡 API 응답 상태:', response.status, response.statusText)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      console.warn(`❌ ${provider} API Error: ${response.status}`, errorData)
      return null
    }

    const data = await response.json()
    
    if (!data.success || !data.image) {
      console.warn(`❌ ${provider} API 응답에 이미지가 없습니다:`, data)
      return null
    }

    console.log(`✅ ${provider} 이미지 수신 완료:`, data.size, 'bytes')
    return data.image
  } catch (error) {
    console.error(`❌ ${provider} API Error:`, error)
    return null
  }
}

function getBackgroundKeywords(style: string, color: string): string[] {
  const keywords: string[] = []
  
  switch (style) {
    case 'professional':
      keywords.push('business', 'office', 'corporate', 'professional')
      break
    case 'creative':
      keywords.push('abstract', 'artistic', 'colorful', 'creative')
      break
    case 'elegant':
      keywords.push('elegant', 'luxury', 'sophisticated', 'minimal')
      break
    case 'modern':
      keywords.push('modern', 'geometric', 'minimalist', 'contemporary')
      break
  }
  
  // 색상 기반 키워드 추가
  if (color.includes('blue')) keywords.push('blue')
  if (color.includes('pink')) keywords.push('pink')
  if (color.includes('green')) keywords.push('green')
  
  return keywords
}

/**
 * AI 기반 디자인 설명 생성
 */
export function generateDesignDescription(design: AICardDesign, contact: Contact): string {
  const styleNames: Record<string, string> = {
    professional: '전문적인',
    creative: '창의적인',
    elegant: '우아한',
    modern: '현대적인'
  }
  
  const layoutNames: Record<string, string> = {
    split: '분할 레이아웃',
    centered: '중앙 정렬',
    asymmetric: '비대칭 레이아웃',
    minimal: '미니멀 레이아웃'
  }
  
  return `${styleNames[design.style] || '세련된'} ${layoutNames[design.layout] || '레이아웃'}으로 ${contact.company ? '비즈니스' : '개인'} 명함에 최적화된 디자인입니다.`
}
