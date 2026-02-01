import { generateVCard, generateMultipleVCards, type Contact } from './vcard'
import QRCode from 'qrcode'

export interface ProfilePageOptions {
  theme: 'professional' | 'casual' | 'minimal' | 'creative'
  color: string
  background?: string
  logo?: string
  includeSocial: boolean
  customMessage?: string
}

export interface ProfilePage {
  id: string
  contact: Contact
  url: string
  qrUrl: string
  vcardUrl: string
  createdAt: Date
  options: ProfilePageOptions
  stats: {
    views: number
    downloads: number
    shares: number
  }
}

export class ProfilePageService {
  private static instance: ProfilePageService
  private profiles: Map<string, ProfilePage> = new Map()

  static getInstance(): ProfilePageService {
    if (!ProfilePageService.instance) {
      ProfilePageService.instance = new ProfilePageService()
    }
    return ProfilePageService.instance
  }

  async createProfilePage(
    contact: Contact,
    options: ProfilePageOptions = {
      theme: 'professional',
      color: '#3B82F6',
      includeSocial: false
    }
  ): Promise<ProfilePage> {
    const id = this.generateId()
    const url = `${window.location.origin}/profile/${id}`
    
    // vCard 생성
    const vcardContent = generateVCard(contact)
    const vcardBlob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8' })
    const vcardUrl = URL.createObjectURL(vcardBlob)
    
    // QR 코드 생성
    const qrUrl = await this.generateQRCodeForProfile(url)
    
    const profilePage: ProfilePage = {
      id,
      contact,
      url,
      qrUrl,
      vcardUrl,
      createdAt: new Date(),
      options,
      stats: {
        views: 0,
        downloads: 0,
        shares: 0
      }
    }

    this.profiles.set(id, profilePage)
    return profilePage
  }

  getProfile(id: string): ProfilePage | null {
    const profile = this.profiles.get(id)
    if (profile) {
      profile.stats.views++
    }
    return profile || null
  }

  recordDownload(id: string): void {
    const profile = this.profiles.get(id)
    if (profile) {
      profile.stats.downloads++
    }
  }

  recordShare(id: string): void {
    const profile = this.profiles.get(id)
    if (profile) {
      profile.stats.shares++
    }
  }

  getProfileStats(id: string): ProfilePage['stats'] | null {
    const profile = this.profiles.get(id)
    return profile?.stats || null
  }

  private async generateQRCodeForProfile(url: string): Promise<string> {
    try {
      const qrDataUrl = await QRCode.toDataURL(url, {
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

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15)
  }

  // 테스트용 메소드
  getAllProfiles(): ProfilePage[] {
    return Array.from(this.profiles.values())
  }

  clearProfiles(): void {
    this.profiles.clear()
  }
}

export function generateProfileHTML(profile: ProfilePage): string {
  const { contact, options } = profile
  
  // vCard 생성
  const vcardContent = generateVCard(contact)
  
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${contact.name} - 연락처</title>
    <meta property="og:title" content="${contact.name}">
    <meta property="og:description" content="${contact.phone}">
    <meta property="og:image" content="${profile.qrUrl}">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        ${getThemeStyles(options.theme, options.color)}
    </style>
</head>
<body class="min-h-screen ${getThemeClasses(options.theme)}">
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-2xl mx-auto">
            <!-- 미리보기 배지 -->
            <div class="text-center mb-4">
                <span class="preview-badge">
                    📱 미리보기 모드
                </span>
            </div>
            
            <!-- 프로필 헤더 -->
            <div class="text-center mb-8">
                ${options.logo ? `
                <div class="mb-4">
                    <img src="${options.logo}" alt="Logo" class="w-20 h-20 mx-auto rounded-full object-cover shadow-lg">
                </div>
                ` : ''}
                <h1 class="text-4xl font-bold mb-2 text-white drop-shadow-lg">${contact.name}</h1>
                ${contact.title ? `<p class="text-xl opacity-90">${contact.title}</p>` : ''}
                ${contact.company ? `<p class="text-lg opacity-80">${contact.company}</p>` : ''}
            </div>

            <!-- 연락처 정보 -->
            <div class="bg-white/20 backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-xl border border-white/20">
                <div class="space-y-4">
                    <div class="flex items-center gap-3">
                        <i class="fas fa-phone text-xl text-white"></i>
                        <span class="text-lg text-white font-medium">${contact.phone}</span>
                    </div>
                    ${contact.email ? `
                    <div class="flex items-center gap-3">
                        <i class="fas fa-envelope text-xl text-white"></i>
                        <span class="text-lg text-white font-medium">${contact.email}</span>
                    </div>
                    ` : ''}
                    ${contact.company ? `
                    <div class="flex items-center gap-3">
                        <i class="fas fa-building text-xl text-white"></i>
                        <span class="text-lg text-white font-medium">${contact.company}</span>
                    </div>
                    ` : ''}
                </div>
            </div>

            <!-- QR 코드 -->
            <div class="bg-white/20 backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-xl border border-white/20">
                <div class="text-center">
                    <h3 class="text-lg font-semibold mb-4 text-white">연락처 저장</h3>
                    <img src="${profile.qrUrl}" alt="QR Code" class="w-48 h-48 mx-auto mb-4 rounded-lg shadow-lg border-2 border-white/30">
                    <p class="text-sm opacity-90 text-white">QR 코드를 스캔하여 연락처를 저장하세요</p>
                </div>
            </div>

            <!-- 액션 버튼 -->
            <div class="flex flex-col sm:flex-row gap-4 mb-6">
                <button onclick="downloadVCard()" class="flex-1 bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-all border border-white/30 shadow-lg backdrop-blur-sm">
                    <i class="fas fa-download mr-2"></i>
                    vCard 다운로드
                </button>
                <button onclick="shareProfile()" class="flex-1 bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-all border border-white/30 shadow-lg backdrop-blur-sm">
                    <i class="fas fa-share-alt mr-2"></i>
                    공유하기
                </button>
            </div>

            <!-- 커스텀 메시지 -->
            ${options.customMessage ? `
            <div class="bg-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
                <p class="text-center text-white">${options.customMessage}</p>
            </div>
            ` : ''}

            <!-- 통계 정보 -->
            <div class="text-center text-sm opacity-80 text-white">
                <p>조회 ${profile.stats.views}회 • 다운로드 ${profile.stats.downloads}회 • 공유 ${profile.stats.shares}회</p>
            </div>
        </div>
    </div>

    <script>
        function downloadVCard() {
            const vcardData = '${vcardContent.replace(/'/g, "\\'").replace(/\n/g, '\\n')}';
            const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = '${contact.name}.vcf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            // 다운로드 통계 기록 (실제 환경에서만 작동)
            if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
              fetch('/api/profile/${profile.id}/download', { method: 'POST' });
            }
        }

        function shareProfile() {
            if (navigator.share) {
                navigator.share({
                    title: '${contact.name} - 연락처',
                    text: '${contact.phone}',
                    url: window.location.href
                });
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert('프로필 링크가 클립보드에 복사되었습니다.');
            }
            
            // 공유 통계 기록 (실제 환경에서만 작동)
            if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
              fetch('/api/profile/${profile.id}/share', { method: 'POST' });
            }
        }
    </script>
</body>
</html>
  `
}

function getThemeStyles(theme: string, color: string): string {
  const baseStyles = `
    body {
      font-family: 'Inter', sans-serif;
    }
    
    .container {
      max-width: 640px;
    }
    
    .bg-white\\/10 {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .backdrop-blur-md {
      backdrop-filter: blur(12px);
    }
    
    .preview-badge {
      background-color: #fef3c7;
      color: #92400e;
      border: 1px solid #fbbf24;
      font-weight: 600;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
      display: inline-block;
    }
  `
  
  switch (theme) {
    case 'professional':
      return baseStyles + `
        body {
          background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
        }
      `
    case 'casual':
      return baseStyles + `
        body {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
      `
    case 'minimal':
      return baseStyles + `
        body {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
      `
    case 'creative':
      return baseStyles + `
        body {
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        }
      `
    default:
      return baseStyles
  }
}

function getThemeClasses(theme: string): string {
  switch (theme) {
    case 'professional':
      return 'text-white'
    case 'casual':
      return 'text-white'
    case 'minimal':
      return 'text-gray-800'
    case 'creative':
      return 'text-white'
    default:
      return 'text-white'
  }
}

export function downloadProfileQR(profile: ProfilePage): void {
  const link = document.createElement('a')
  link.href = profile.qrUrl
  link.download = `${profile.contact.name}_프로필_QR.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function shareProfileLink(profile: ProfilePage): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${profile.contact.name} - 연락처`,
          text: `${profile.contact.phone}`,
          url: profile.url
        })
      } else {
        await navigator.clipboard.writeText(profile.url)
        alert('프로필 링크가 클립보드에 복사되었습니다.')
      }
      
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}
