
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

    // If no valid metrics, return a message indicating data collection is needed
    if (validMetrics.length === 0) {
      const noDataResponse = `Disclosure ${disclosureId}: ${disclosureTitle}

This disclosure requires specific data collection and metrics to provide a comprehensive response. Currently, no relevant data has been provided for this disclosure section.

To complete this disclosure, please ensure the following steps are taken:
1. Collect the required metrics and data points specific to ${disclosureTitle.toLowerCase()}
2. Upload or input the relevant sustainability data
3. Verify that data aligns with the disclosure requirements

Once the necessary data is available, this disclosure response can be generated with specific, factual information based on your organization's actual performance and practices.`;

      return new Response(
        JSON.stringify({ generatedResponse: noDataResponse }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    // Prepare metrics data for the prompt
    const metricsData = validMetrics.map((metric: any) => ({
      metric: metric.metric,
      response: metric.response,
      responseData: metric.responseData,
      definition: metric.definition,
      topic: metric.topic,
      disclosure: metric.disclosure
    }));

    const prompt = `You are a sustainability reporting expert tasked with creating a disclosure response for ${disclosureTitle}.

Disclosure Context:
- ID: ${disclosureId}
- Title: ${disclosureTitle}
- Description: ${disclosureDescription}

CRITICAL INSTRUCTIONS:
1. ONLY use the specific data provided below from disclosure ${disclosureId}
2. DO NOT create, assume, or fabricate any data points, metrics, or information
3. DO NOT reference industry standards, best practices, or generic sustainability concepts unless directly supported by the provided data
4. If a specific data point is missing, explicitly state "data not available" rather than making assumptions
5. Be factual and conservative - only state what can be directly derived from the provided metrics

Available Metrics Data for ${disclosureId}:
${metricsData.map((m: any) => `
Metric: ${m.metric}
Response/Value: ${m.response || 'Not provided'}
Additional Data: ${m.responseData || 'Not provided'}
Definition: ${m.definition || 'Not provided'}
`).join('\n')}

Instructions for Response:
1. Structure the response to address the ${disclosureTitle} requirements using ONLY the provided data
2. For each metric listed above, incorporate the actual response/value if meaningful
3. If any required information is missing, clearly state "This information is not currently available in our data collection"
4. Do not add hypothetical examples, industry benchmarks, or generic sustainability statements
5. Keep the response factual, concise, and directly tied to the provided metrics
6. If the data is insufficient for a complete disclosure, acknowledge this limitation

Generate a disclosure response based STRICTLY on the provided data:`

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
          temperature: 0.3, // Lower temperature for more factual, less creative responses
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 1500, // Reduced to encourage more concise responses
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
