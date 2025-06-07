
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { disclosureId, disclosureTitle, disclosureDescription, metrics } = await req.json()

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured')
    }

    // Prepare metrics data for the prompt
    const metricsData = metrics.map((metric: any) => ({
      metric: metric.metric,
      response: metric.response,
      responseData: metric.responseData,
      definition: metric.definition,
      topic: metric.topic
    })).filter((m: any) => m.response || m.responseData)

    const prompt = `You are a sustainability reporting expert tasked with creating a comprehensive disclosure response for ${disclosureTitle}.

Disclosure Context:
- ID: ${disclosureId}
- Title: ${disclosureTitle}
- Description: ${disclosureDescription}

Available Metrics Data:
${metricsData.map((m: any) => `
- Metric: ${m.metric}
- Topic: ${m.topic || 'Not specified'}
- Definition: ${m.definition || 'Not provided'}
- Response: ${m.response || 'Not provided'}
- Additional Data: ${m.responseData || 'Not provided'}
`).join('\n')}

Instructions:
1. Write a comprehensive disclosure response that addresses the ${disclosureTitle} requirements
2. Use the provided metrics data to support your statements
3. Write in a confident, authoritative, and expertise-driven tone
4. Structure the response in well-formed paragraphs with full sentences
5. Ensure the response demonstrates the organization's commitment to sustainability and transparency
6. Include specific data points and metrics where relevant
7. Make the response professional and suitable for stakeholder review

Please generate a detailed disclosure response:`

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to generate disclosure response')
    }

    const data = await response.json()
    const generatedResponse = data.candidates[0].content.parts[0].text

    return new Response(
      JSON.stringify({ generatedResponse }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
