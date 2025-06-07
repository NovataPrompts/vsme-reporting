
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

    // Function to synthesize tabular data into readable text
    const synthesizeTabularData = (responseData: any): string => {
      if (!responseData || typeof responseData !== 'object') {
        return 'No detailed data available';
      }

      if (Array.isArray(responseData)) {
        if (responseData.length === 0) {
          return 'No entries found in the data';
        }

        // For arrays of objects (typical Excel data), synthesize into readable format
        const synthesizedItems = responseData.map((item, index) => {
          if (typeof item === 'object' && item !== null) {
            const entries = Object.entries(item).filter(([key, value]) => 
              value !== null && value !== undefined && value !== ''
            );
            
            if (entries.length === 0) return null;
            
            // Create readable description from the object
            const description = entries.map(([key, value]) => {
              // Clean up column names for better readability
              const cleanKey = key.replace(/[_-]/g, ' ').toLowerCase();
              return `${cleanKey}: ${value}`;
            }).join(', ');
            
            return description;
          }
          return String(item);
        }).filter(item => item !== null);

        if (synthesizedItems.length === 0) {
          return 'Data entries are present but contain no meaningful information';
        }

        // Determine the type of data and create appropriate summary
        const firstItem = responseData[0];
        if (firstItem && typeof firstItem === 'object') {
          const keys = Object.keys(firstItem).map(k => k.toLowerCase());
          
          // Check for common patterns to create better summaries
          if (keys.some(k => k.includes('subsidiary') || k.includes('entity') || k.includes('company'))) {
            return `The organization has ${synthesizedItems.length} ${synthesizedItems.length === 1 ? 'subsidiary' : 'subsidiaries'}: ${synthesizedItems.slice(0, 3).join('; ')}${synthesizedItems.length > 3 ? ' and others' : ''}`;
          } else if (keys.some(k => k.includes('location') || k.includes('address') || k.includes('site'))) {
            return `The organization operates from ${synthesizedItems.length} ${synthesizedItems.length === 1 ? 'location' : 'locations'}: ${synthesizedItems.slice(0, 3).join('; ')}${synthesizedItems.length > 3 ? ' and others' : ''}`;
          } else if (keys.some(k => k.includes('employee') || k.includes('staff') || k.includes('worker'))) {
            return `Workforce data shows ${synthesizedItems.length} entries: ${synthesizedItems.slice(0, 3).join('; ')}${synthesizedItems.length > 3 ? ' and others' : ''}`;
          } else {
            return `Data contains ${synthesizedItems.length} entries: ${synthesizedItems.slice(0, 3).join('; ')}${synthesizedItems.length > 3 ? ' and others' : ''}`;
          }
        }

        return `Contains ${synthesizedItems.length} data entries: ${synthesizedItems.slice(0, 3).join('; ')}${synthesizedItems.length > 3 ? ' and others' : ''}`;
      }

      // For non-array objects, convert to readable format
      const entries = Object.entries(responseData).filter(([key, value]) => 
        value !== null && value !== undefined && value !== ''
      );
      
      if (entries.length === 0) {
        return 'Data object contains no meaningful information';
      }

      const description = entries.map(([key, value]) => {
        const cleanKey = key.replace(/[_-]/g, ' ').toLowerCase();
        return `${cleanKey}: ${value}`;
      }).join(', ');

      return description;
    };

    // Prepare metrics data for the prompt with synthesized tabular data
    const metricsData = validMetrics.map((metric: any) => {
      let processedResponse = metric.response;
      let synthesizedData = '';

      // If there's tabular data, synthesize it
      if (metric.responseData) {
        synthesizedData = synthesizeTabularData(metric.responseData);
      }

      return {
        metric: metric.metric,
        response: processedResponse,
        synthesizedData: synthesizedData,
        definition: metric.definition,
        topic: metric.topic,
        disclosure: metric.disclosure
      };
    });

    const prompt = `You are a sustainability reporting expert tasked with creating a disclosure response for ${disclosureTitle}.

Disclosure Context:
- ID: ${disclosureId}
- Title: ${disclosureTitle}
- Description: ${disclosureDescription}

CRITICAL INSTRUCTIONS:
1. ONLY use the specific data provided below from disclosure ${disclosureId}
2. DO NOT create, assume, or fabricate any data points, metrics, or information
3. DO NOT reference industry standards, best practices, or generic sustainability concepts unless directly supported by the provided data
4. When tabular data has been synthesized, use the specific details provided rather than generic statements
5. Be factual and conservative - only state what can be directly derived from the provided metrics
6. If a specific data point is missing, explicitly state "data not available" rather than making assumptions

Available Metrics Data for ${disclosureId}:
${metricsData.map((m: any) => `
Metric: ${m.metric}
Response/Value: ${m.response || 'Not provided'}
Synthesized Tabular Data: ${m.synthesizedData || 'Not provided'}
Definition: ${m.definition || 'Not provided'}
`).join('\n')}

Instructions for Response:
1. Structure the response to address the ${disclosureTitle} requirements using ONLY the provided data
2. For each metric listed above, incorporate the actual response/value and synthesized data if meaningful
3. Use the synthesized tabular data to provide specific, concrete details rather than generic statements
4. If any required information is missing, clearly state "This information is not currently available in our data collection"
5. Do not add hypothetical examples, industry benchmarks, or generic sustainability statements
6. Keep the response factual, concise, and directly tied to the provided metrics and synthesized data
7. If the data is insufficient for a complete disclosure, acknowledge this limitation

Generate a disclosure response based STRICTLY on the provided data and synthesized information:`

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
