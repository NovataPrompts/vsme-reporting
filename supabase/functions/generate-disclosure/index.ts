
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

    // Double-check that all metrics belong to the specified disclosure
    const validMetrics = metrics.filter((metric: any) => 
      metric.disclosure === disclosureId && (metric.response || metric.responseData)
    );

    console.log(`Processing disclosure ${disclosureId}:`, {
      receivedMetrics: metrics.length,
      validMetrics: validMetrics.length,
      disclosureId
    });

    // Prepare metrics data for the prompt
    const metricsData = validMetrics.map((metric: any) => ({
      metric: metric.metric,
      response: metric.response,
      responseData: metric.responseData,
      definition: metric.definition,
      topic: metric.topic,
      disclosure: metric.disclosure
    }));

    const prompt = `You are a sustainability reporting expert tasked with creating a comprehensive disclosure response for ${disclosureTitle}.

Disclosure Context:
- ID: ${disclosureId}
- Title: ${disclosureTitle}
- Description: ${disclosureDescription}

IMPORTANT: Only use metrics data that specifically belongs to disclosure ${disclosureId}. Do not reference or incorporate data from other disclosures.

Available Metrics Data for ${disclosureId}:
${metricsData.length > 0 ? metricsData.map((m: any) => `
- Metric: ${m.metric}
- Disclosure: ${m.disclosure}
- Topic: ${m.topic || 'Not specified'}
- Definition: ${m.definition || 'Not provided'}
- Response: ${m.response || 'Not provided'}
- Additional Data: ${m.responseData || 'Not provided'}
`).join('\n') : 'No metrics data available for this disclosure.'}

Instructions:
1. Write a comprehensive disclosure response that addresses ONLY the ${disclosureTitle} requirements
2. Use ONLY the provided metrics data that belongs to disclosure ${disclosureId}
3. If no relevant metrics are available, focus on the disclosure requirements and indicate areas where data collection is needed
4. Write in a confident, authoritative, and expertise-driven tone
5. Structure the response in well-formed paragraphs with full sentences
6. Ensure the response demonstrates the organization's commitment to sustainability and transparency
7. Include specific data points and metrics where relevant, but only from ${disclosureId}
8. Make the response professional and suitable for stakeholder review
9. Do not reference metrics or data from other disclosure sections

Please generate a detailed disclosure response for ${disclosureId} only:`

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
