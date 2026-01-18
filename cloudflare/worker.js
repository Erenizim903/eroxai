const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

const jsonResponse = (data, init = {}) =>
  new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
      ...(init.headers || {}),
    },
  })

const errorResponse = (message, status = 400) =>
  jsonResponse({ error: message }, { status })

const extractBase64 = (image) => {
  if (!image) return null
  const match = image.match(/^data:image\/[^;]+;base64,(.*)$/)
  return match ? match[1] : image
}

const handleVisionOcr = async (request, env) => {
  const body = await request.json()
  const base64 = extractBase64(body.image)
  if (!base64) {
    return errorResponse('Image payload missing')
  }

  const payload = {
    requests: [
      {
        image: { content: base64 },
        features: [{ type: 'TEXT_DETECTION' }],
      },
    ],
  }

  if (body.languageHint) {
    payload.requests[0].imageContext = {
      languageHints: [body.languageHint],
    }
  }

  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${env.GOOGLE_VISION_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
  )

  if (!response.ok) {
    const errorText = await response.text()
    return errorResponse(errorText || 'Vision API error', response.status)
  }

  const data = await response.json()
  const text = data?.responses?.[0]?.fullTextAnnotation?.text || ''
  return jsonResponse({ text })
}

const handleOpenAiTranslate = async (request, env) => {
  const body = await request.json()
  const text = body.text || ''
  const source = body.source || 'auto'
  const target = body.target || 'en'
  const model = body.model || 'gpt-4o-mini'

  if (!text.trim()) {
    return errorResponse('Text is required')
  }

  const systemPrompt =
    'You are a professional translator. Translate the input text exactly and only output the translated text.'

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      input: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Source language: ${source}\nTarget language: ${target}\n\nText:\n${text}`,
        },
      ],
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    return errorResponse(errorText || 'OpenAI API error', response.status)
  }

  const data = await response.json()
  const translation =
    data?.output?.[0]?.content?.[0]?.text ||
    data?.output_text ||
    ''

  return jsonResponse({ translation })
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders })
    }

    const url = new URL(request.url)
    if (request.method === 'POST' && url.pathname === '/v1/vision/ocr') {
      return handleVisionOcr(request, env)
    }
    if (request.method === 'POST' && url.pathname === '/v1/openai/translate') {
      return handleOpenAiTranslate(request, env)
    }

    return errorResponse('Not Found', 404)
  },
}
