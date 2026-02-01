import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { 
      prompt, 
      apiKey, 
      provider, 
      openRouterApiKey, 
      nanobanaApiKey,
      xaiApiKey,
      openaiApiKey,
      geminiApiKey
    } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    console.log('🎨 서버에서 이미지 생성 API 호출:', {
      provider: provider || 'openai', // OpenAI를 기본값으로
      prompt: prompt.substring(0, 50) + '...',
      hasOpenAIApiKey: !!openaiApiKey
    })

    // Provider별로 분기 (OpenAI 우선)
    const providerType = provider || 'openai'
    
    // 1. xAI Grok 이미지 API
    if (providerType === 'xai' && xaiApiKey) {
      return await generateWithXAI(prompt, xaiApiKey)
    }
    
    // 2. OpenAI Image Generation API
    if (providerType === 'openai' && openaiApiKey) {
      return await generateWithOpenAI(prompt, openaiApiKey)
    }
    
    // 3. Google Gemini Imagen API
    if (providerType === 'gemini' && geminiApiKey) {
      return await generateWithGemini(prompt, geminiApiKey)
    }
    
    // 4. OpenRouter (이미지 생성 불가)
    if (providerType === 'openrouter' && openRouterApiKey) {
      return await generateWithOpenRouter(prompt, openRouterApiKey)
    }
    
    // 5. 나노바나 (Gemini Native)
    if (providerType === 'nanobana' && nanobanaApiKey) {
      return await generateWithNanobana(prompt, nanobanaApiKey)
    }
    
    // 기본값: OpenAI
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is required', fallback: true },
        { status: 400 }
      )
    }
    
    // OpenAI API 호출
    return await generateWithOpenAI(prompt, openaiApiKey)
  } catch (error) {
    console.error('❌ 서버 에러:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

// xAI Grok 이미지 생성 API
async function generateWithXAI(prompt: string, apiKey: string) {
  try {
    console.log('🤖 xAI Grok 이미지 API 호출 시작')
    
    const response = await fetch('https://api.x.ai/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-imagine-image',
        prompt: prompt,
        n: 1,
        size: '1024x1024', // xAI는 정사각형만 지원할 수 있음, 나중에 리사이즈
        response_format: 'b64_json'
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      console.warn(`❌ xAI API Error: ${response.status}`, errorData)
      return NextResponse.json({
        success: false,
        error: `xAI API Error: ${response.status}`,
        fallback: true,
        details: errorData.error?.message || 'xAI API 호출 실패'
      })
    }

    const data = await response.json()
    
    // xAI 응답 형식: data[0].b64_json 또는 data[0].url
    let imageBase64 = data.data?.[0]?.b64_json || data.b64_json
    
    if (!imageBase64) {
      // URL이 있는 경우 다운로드
      const imageUrl = data.data?.[0]?.url || data.url
      if (imageUrl) {
        const imageResponse = await fetch(imageUrl)
        if (imageResponse.ok) {
          const arrayBuffer = await imageResponse.arrayBuffer()
          imageBase64 = Buffer.from(arrayBuffer).toString('base64')
        }
      }
    }
    
    if (!imageBase64) {
      console.warn('❌ xAI 응답에 이미지가 없습니다:', data)
      return NextResponse.json({
        success: false,
        error: 'xAI 응답에 이미지가 없습니다.',
        fallback: true
      })
    }

    console.log('✅ xAI 이미지 수신 완료')
    return NextResponse.json({
      success: true,
      image: `data:image/png;base64,${imageBase64}`,
      size: imageBase64.length,
      provider: 'xai'
    })
  } catch (error) {
    console.error('❌ xAI API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'xAI API 호출 실패',
      fallback: true,
      details: error instanceof Error ? error.message : String(error)
    })
  }
}

// OpenAI Image Generation API
async function generateWithOpenAI(prompt: string, apiKey: string) {
  try {
    console.log('🎨 OpenAI 이미지 생성 API 호출 시작')
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3', // 또는 dall-e-2
        prompt: prompt,
        n: 1,
        size: '1024x1024', // OpenAI는 정사각형만 지원, 나중에 리사이즈
        response_format: 'b64_json'
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      console.warn(`❌ OpenAI API Error: ${response.status}`, errorData)
      return NextResponse.json({
        success: false,
        error: `OpenAI API Error: ${response.status}`,
        fallback: true,
        details: errorData.error?.message || 'OpenAI API 호출 실패'
      })
    }

    const data = await response.json()
    
    // OpenAI 응답 형식: data[0].b64_json
    const imageBase64 = data.data?.[0]?.b64_json
    
    if (!imageBase64) {
      console.warn('❌ OpenAI 응답에 이미지가 없습니다:', data)
      return NextResponse.json({
        success: false,
        error: 'OpenAI 응답에 이미지가 없습니다.',
        fallback: true
      })
    }

    console.log('✅ OpenAI 이미지 수신 완료')
    return NextResponse.json({
      success: true,
      image: `data:image/png;base64,${imageBase64}`,
      size: imageBase64.length,
      provider: 'openai'
    })
  } catch (error) {
    console.error('❌ OpenAI API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'OpenAI API 호출 실패',
      fallback: true,
      details: error instanceof Error ? error.message : String(error)
    })
  }
}

// Google Gemini Imagen API
async function generateWithGemini(prompt: string, apiKey: string) {
  try {
    console.log('🌐 Google Gemini Imagen API 호출 시작')
    
    // Gemini API는 Vertex AI 또는 Gemini API 사용
    // 여기서는 Gemini API (ai.google.dev) 사용
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [{
          prompt: prompt
        }],
        parameters: {
          sampleCount: 1,
          aspectRatio: '16:9', // 명함 비율에 가까움
          safetyFilterLevel: 'block_some',
          personGeneration: 'allow_all'
        }
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      console.warn(`❌ Gemini API Error: ${response.status}`, errorData)
      return NextResponse.json({
        success: false,
        error: `Gemini API Error: ${response.status}`,
        fallback: true,
        details: errorData.error?.message || 'Gemini API 호출 실패'
      })
    }

    const data = await response.json()
    
    // Gemini 응답 형식 확인 필요 (문서에 따라 다를 수 있음)
    const imageBase64 = data.predictions?.[0]?.bytesBase64Encoded || data.bytesBase64Encoded
    
    if (!imageBase64) {
      // URL이 있는 경우
      const imageUrl = data.predictions?.[0]?.imageUri || data.imageUri
      if (imageUrl) {
        const imageResponse = await fetch(imageUrl)
        if (imageResponse.ok) {
          const arrayBuffer = await imageResponse.arrayBuffer()
          const base64 = Buffer.from(arrayBuffer).toString('base64')
          console.log('✅ Gemini 이미지 수신 완료 (URL)')
          return NextResponse.json({
            success: true,
            image: `data:image/png;base64,${base64}`,
            size: arrayBuffer.byteLength,
            provider: 'gemini'
          })
        }
      }
      
      console.warn('❌ Gemini 응답에 이미지가 없습니다:', data)
      return NextResponse.json({
        success: false,
        error: 'Gemini 응답에 이미지가 없습니다.',
        fallback: true
      })
    }

    console.log('✅ Gemini 이미지 수신 완료')
    return NextResponse.json({
      success: true,
      image: `data:image/png;base64,${imageBase64}`,
      size: imageBase64.length,
      provider: 'gemini'
    })
  } catch (error) {
    console.error('❌ Gemini API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Gemini API 호출 실패',
      fallback: true,
      details: error instanceof Error ? error.message : String(error)
    })
  }
}

// OpenRouter API를 통한 이미지 생성
// ⚠️ 주의: OpenRouter는 주로 텍스트 생성 모델을 제공합니다
// 이미지 생성 모델 지원 여부는 확인이 필요합니다
async function generateWithOpenRouter(prompt: string, apiKey: string) {
  try {
    console.log('🌐 OpenRouter API 호출 시작')
    console.warn('⚠️ OpenRouter는 주로 텍스트 모델을 제공합니다. 이미지 생성은 지원하지 않을 수 있습니다.')
    
    // OpenRouter는 텍스트 생성 API만 제공하므로 이미지 생성 불가
    // 대신 에러 반환하고 그라데이션 폴백 사용
    return NextResponse.json({
      success: false,
      error: 'OpenRouter는 이미지 생성 API를 지원하지 않습니다. 텍스트 생성 모델만 제공합니다.',
      fallback: true,
      details: 'Replicate API나 다른 이미지 생성 서비스를 사용해주세요.'
    })
  } catch (error) {
    console.error('❌ OpenRouter API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'OpenRouter API 호출 실패',
      fallback: true
    })
  }
}

// 나노바나 API를 통한 이미지 생성
// ⚠️ 주의: 나노바나의 공식 API 문서 확인이 필요합니다
// 현재는 추정된 엔드포인트를 사용하며, 실제 API와 다를 수 있습니다
async function generateWithNanobana(prompt: string, apiKey: string) {
  try {
    console.log('🍌 나노바나 API 호출 시작')
    console.warn('⚠️ 나노바나 API 엔드포인트는 추정값입니다. 공식 문서 확인이 필요합니다.')
    
    // 나노바나의 실제 API 엔드포인트 확인 필요
    // 현재는 일반적인 형식으로 시도
    const possibleEndpoints = [
      'https://api.nanobana.com/v1/images/generate',
      'https://api.nanobana.com/v1/generate',
      'https://nanobana.com/api/v1/images/generate'
    ]
    
    let lastError: any = null
    
    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`🔄 나노바나 엔드포인트 시도: ${endpoint}`)
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            prompt: prompt,
            width: 1063,
            height: 591,
            num_images: 1
          })
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          lastError = errorData
          console.warn(`❌ 나노바나 API Error (${endpoint}): ${response.status}`, errorData)
          continue // 다음 엔드포인트 시도
        }

        const data = await response.json()
        
        // 나노바나 응답 형식에 맞게 처리
        let imageUrl = data.image_url || data.data?.image_url || data.url || data.imageUrl
        
        if (!imageUrl) {
          console.warn('❌ 나노바나 응답에 이미지 URL이 없습니다:', data)
          continue
        }

        // 이미지 다운로드 및 Base64 변환
        console.log('📥 나노바나 이미지 다운로드 중...')
        const imageResponse = await fetch(imageUrl)
        
        if (!imageResponse.ok) {
          throw new Error(`이미지 다운로드 실패: ${imageResponse.status}`)
        }

        const arrayBuffer = await imageResponse.arrayBuffer()
        const base64 = Buffer.from(arrayBuffer).toString('base64')
        const mimeType = imageResponse.headers.get('content-type') || 'image/png'
        
        console.log('✅ 나노바나 이미지 수신 완료:', arrayBuffer.byteLength, 'bytes')

        return NextResponse.json({
          success: true,
          image: `data:${mimeType};base64,${base64}`,
          size: arrayBuffer.byteLength,
          provider: 'nanobana'
        })
      } catch (error) {
        console.log(`❌ ${endpoint} 호출 실패:`, error)
        lastError = error
        continue
      }
    }
    
    // 모든 엔드포인트 실패
    return NextResponse.json({
      success: false,
      error: '나노바나 API 호출 실패',
      fallback: true,
      details: '나노바나의 공식 API 문서를 확인하고 올바른 엔드포인트를 설정해주세요.'
    })
  } catch (error) {
    console.error('❌ 나노바나 API Error:', error)
    return NextResponse.json({
      success: false,
      error: '나노바나 API 호출 실패',
      fallback: true,
      details: error instanceof Error ? error.message : String(error)
    })
  }
}

// Replicate API를 통한 이미지 생성
async function generateWithReplicate(prompt: string, apiKey: string) {
  try {
    console.log('🔄 Replicate API로 이미지 생성 시작')

    // Replicate API 사용
    // Replicate는 prediction을 생성하고, 완료될 때까지 polling하는 방식
    console.log('🔄 Replicate API로 이미지 생성 시작')
    
    // 1단계: Prediction 생성
    // Replicate 추천 모델들 (비용 대비 품질 우수)
    // 참고: https://replicate.com/collections/text-to-image
    const models = [
      {
        // 추천 1: seedream-4.5 - 비용 대비 품질 우수, 빠른 속도
        model: 'bytedance/seedream-4.5',
        name: 'seedream-4.5',
        description: '비용 대비 품질 우수, 빠른 속도'
      },
      {
        // 추천 2: ideogram-v3-turbo - 텍스트 렌더링 우수, 현실적인 이미지
        model: 'ideogram-ai/ideogram-v3-turbo',
        name: 'ideogram-v3-turbo',
        description: '텍스트 렌더링 우수, 현실적인 이미지'
      },
      {
        // 추천 3: flux-schnell - 빠른 속도, 다양한 스타일
        model: 'black-forest-labs/flux-schnell',
        name: 'flux-schnell',
        description: '빠른 속도, 다양한 스타일'
      },
      {
        // 폴백: SD 1.5 - 가장 저렴하지만 품질 낮음
        model: 'stability-ai/stable-diffusion',
        version: 'a9758cbfbd5f3c2094457d996681af52552901775aa2d6dd0b5fd46af3f4dd5b',
        name: 'stable-diffusion-1.5',
        description: '가장 저렴하지만 품질 낮음'
      }
    ]
    
    // 여러 모델 시도 (비용 대비 품질 우수한 것부터)
    let createResponse: Response | null = null
    let lastError: any = null
    let selectedModel = models[0]
    
    for (const modelOption of models) {
      try {
        console.log(`🔄 모델 시도: ${modelOption.name} (${modelOption.description})`)
        
        // Replicate API 요청 본문 구성
        const requestBody: any = {
          input: {
            prompt: prompt,
            width: 1063,
            height: 591
          }
        }
        
        // version이 있으면 version 사용, 없으면 model 사용
        if (modelOption.version) {
          requestBody.version = modelOption.version
        } else {
          requestBody.model = modelOption.model
        }
        
        // 모델별 특정 파라미터 추가
        if (modelOption.name === 'seedream-4.5' || modelOption.name === 'ideogram-v3-turbo') {
          // 이 모델들은 기본 파라미터만 사용
        } else if (modelOption.name === 'flux-schnell') {
          requestBody.input.num_inference_steps = 4 // Flux Schnell은 빠른 추론
        } else {
          // SD 모델들은 기본 파라미터
          requestBody.input.num_inference_steps = 20
          requestBody.input.guidance_scale = 7.5
        }
        
        createResponse = await fetch('https://api.replicate.com/v1/predictions', {
          method: 'POST',
          headers: {
            'Authorization': `Token ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        })

        if (!createResponse.ok) {
          const errorData = await createResponse.json().catch(() => ({ detail: 'Unknown error' }))
          lastError = errorData
          
          // 402 에러는 크레딧 부족
          if (createResponse.status === 402) {
            console.log(`💳 ${modelOption.name} 모델 크레딧 부족, 다음 모델 시도...`)
            createResponse = null
            continue
          }
          
          // 다른 에러면 다음 모델 시도
          console.log(`⚠️ ${modelOption.name} 모델 에러 (${createResponse.status}), 다음 모델 시도...`)
          createResponse = null
          continue
        }
        
        // 성공하면 이 모델 사용
        console.log(`✅ ${modelOption.name} 모델 성공!`)
        selectedModel = modelOption
        break
      } catch (error) {
        console.log(`❌ ${modelOption.name} 모델 호출 실패:`, error)
        createResponse = null
        continue
      }
    }
    
    // 모든 모델 실패 시
    if (!createResponse) {
      console.log('💳 모든 모델 크레딧 부족, 그라데이션 배경 사용')
      return NextResponse.json({
        success: false,
        error: 'Replicate API 크레딧이 부족합니다. 그라데이션 배경을 사용합니다.',
        fallback: true,
        details: lastError?.detail || '무료 크레딧을 확인하세요: https://replicate.com/account/billing'
      })
    }

    const prediction = await createResponse.json()
    console.log('📡 Prediction 생성됨:', prediction.id)

    // 2단계: Prediction 완료 대기 (최대 60초)
    let imageUrl: string | null = null
    const maxAttempts = 60
    let attempts = 0

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)) // 1초 대기
      
      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: {
          'Authorization': `Token ${apiKey}`,
        },
      })

      if (!statusResponse.ok) {
        throw new Error(`Status check failed: ${statusResponse.status}`)
      }

      const status = await statusResponse.json()
      console.log(`⏳ Prediction 상태: ${status.status} (${attempts + 1}/${maxAttempts})`)

      if (status.status === 'succeeded') {
        imageUrl = status.output?.[0] || status.output
        console.log('✅ 이미지 생성 완료!')
        break
      }

      if (status.status === 'failed' || status.status === 'canceled') {
        throw new Error(`Prediction failed: ${status.error || 'Unknown error'}`)
      }

      attempts++
    }

    if (!imageUrl) {
      throw new Error('이미지 생성 시간 초과')
    }

    // 3단계: 이미지 다운로드 및 Base64 변환
    console.log('📥 이미지 다운로드 중...')
    const imageResponse = await fetch(imageUrl)
    
    if (!imageResponse.ok) {
      throw new Error(`이미지 다운로드 실패: ${imageResponse.status}`)
    }

    const arrayBuffer = await imageResponse.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const mimeType = imageResponse.headers.get('content-type') || 'image/png'
    
    console.log('✅ 이미지 수신 완료:', arrayBuffer.byteLength, 'bytes')

    return NextResponse.json({
      success: true,
      image: `data:${mimeType};base64,${base64}`,
      size: arrayBuffer.byteLength
    })
  } catch (error) {
    console.error('❌ 서버 에러:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
