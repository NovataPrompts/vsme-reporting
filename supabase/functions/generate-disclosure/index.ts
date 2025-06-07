
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

    // Enhanced function to synthesize tabular data into professional prose
    const synthesizeTabularData = (responseData: any): string => {
      if (!responseData || typeof responseData !== 'object') {
        return 'No detailed data available';
      }

      if (Array.isArray(responseData)) {
        if (responseData.length === 0) {
          return 'No entries found in the data';
        }

        // Enhanced synthesis for different data types
        const synthesizedItems = responseData.map((item, index) => {
          if (typeof item === 'object' && item !== null) {
            const entries = Object.entries(item).filter(([key, value]) => 
              value !== null && value !== undefined && value !== ''
            );
            
            if (entries.length === 0) return null;
            
            return entries.reduce((acc, [key, value], i) => {
              const cleanKey = key.replace(/[_-]/g, ' ').toLowerCase();
              if (i === 0) return `${value}`;
              if (i === entries.length - 1 && entries.length > 1) return `${acc} ${cleanKey} ${value}`;
              return `${acc}, ${cleanKey} ${value}`;
            }, '');
          }
          return String(item);
        }).filter(item => item !== null);

        if (synthesizedItems.length === 0) {
          return 'Data entries are present but contain no meaningful information';
        }

        // Determine the type of data and create appropriate professional sentences
        const firstItem = responseData[0];
        if (firstItem && typeof firstItem === 'object') {
          const keys = Object.keys(firstItem).map(k => k.toLowerCase());
          
          // Gender/workforce composition
          if (keys.some(k => k.includes('gender') || k.includes('sex'))) {
            const genderData = responseData.filter(item => item.gender || item.Gender);
            if (genderData.length > 0) {
              const totalEmployees = genderData.reduce((sum, item) => {
                const count = parseInt(item['Number of Employees'] || item.count || item.employees || '0');
                return sum + count;
              }, 0);
              
              const genderBreakdown = genderData.map(item => {
                const gender = item.gender || item.Gender;
                const count = parseInt(item['Number of Employees'] || item.count || item.employees || '0');
                const percentage = totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0;
                return `${count} ${gender.toLowerCase()} employees (${percentage}%)`;
              }).join(', ');
              
              return `The organization's workforce comprises ${totalEmployees} employees distributed as follows: ${genderBreakdown}.`;
            }
          }
          
          // Energy consumption data
          if (keys.some(k => k.includes('energy') || k.includes('fuel') || k.includes('electricity'))) {
            const energyItems = responseData.map(item => {
              const type = item['Energy Type'] || item.type || item.category || 'energy source';
              const consumption = item['Consumption'] || item.consumption || item.amount || item.value;
              const unit = item['Unit'] || item.unit || 'units';
              return `${consumption} ${unit} from ${type.toLowerCase()}`;
            });
            return `Energy consumption breakdown includes ${energyItems.join(', ')}.`;
          }
          
          // Location/subsidiary data
          if (keys.some(k => k.includes('subsidiary') || k.includes('entity') || k.includes('company') || k.includes('location'))) {
            const locationItems = responseData.map(item => {
              const name = item.subsidiary || item.entity || item.company || item.name;
              const location = item.location || item.address || item.city || item.country;
              if (name && location) {
                return `${name} located at ${location}`;
              } else if (name) {
                return name;
              } else if (location) {
                return `operations at ${location}`;
              }
              return 'unnamed entity';
            }).filter(item => item !== 'unnamed entity');
            
            if (locationItems.length > 0) {
              const entityWord = responseData.length === 1 ? 'subsidiary' : 'subsidiaries';
              return `The organization operates through ${responseData.length} ${entityWord}: ${locationItems.join(', ')}.`;
            }
          }
          
          // Emissions data
          if (keys.some(k => k.includes('emission') || k.includes('co2') || k.includes('carbon'))) {
            const emissionItems = responseData.map(item => {
              const scope = item.scope || item.category || item.type;
              const amount = item.emissions || item.amount || item.value;
              const unit = item.unit || 'tCO2e';
              return `${scope}: ${amount} ${unit}`;
            });
            return `Greenhouse gas emissions data shows ${emissionItems.join(', ')}.`;
          }
          
          // Health and safety data
          if (keys.some(k => k.includes('accident') || k.includes('injury') || k.includes('incident') || k.includes('safety'))) {
            const safetyItems = responseData.map(item => {
              const type = item.type || item.category || item.incident_type || 'safety incident';
              const count = item.count || item.number || item.incidents || item.accidents || '0';
              return `${count} ${type.toLowerCase()}${parseInt(count) !== 1 ? 's' : ''}`;
            });
            return `Health and safety performance includes ${safetyItems.join(', ')} recorded during the reporting period.`;
          }
          
          // Generic structured data
          const structuredSummary = synthesizedItems.slice(0, 3).join('; ');
          const moreIndicator = synthesizedItems.length > 3 ? ` and ${synthesizedItems.length - 3} additional entries` : '';
          return `The data includes ${structuredSummary}${moreIndicator}.`;
        }

        // Fallback for simple arrays
        const summary = synthesizedItems.slice(0, 3).join(', ');
        const moreIndicator = synthesizedItems.length > 3 ? ` and ${synthesizedItems.length - 3} other entries` : '';
        return `The dataset contains ${synthesizedItems.length} entries including ${summary}${moreIndicator}.`;
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

      return `Data shows ${description}.`;
    };

    // Prepare metrics data for the prompt with enhanced tabular data synthesis
    const metricsData = validMetrics.map((metric: any) => {
      let processedResponse = metric.response;
      let synthesizedData = '';

      // If there's tabular data, synthesize it into professional prose
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

    const prompt = `You are a sustainability reporting expert tasked with creating a professional disclosure response for ${disclosureTitle}.

Disclosure Context:
- ID: ${disclosureId}
- Title: ${disclosureTitle}
- Description: ${disclosureDescription}

CRITICAL INSTRUCTIONS:
1. ONLY use the specific data provided below from disclosure ${disclosureId}
2. DO NOT create, assume, or fabricate any data points, metrics, or information
3. DO NOT reference industry standards, best practices, or generic sustainability concepts unless directly supported by the provided data
4. When tabular data has been synthesized, use the specific details provided and convert them into professional prose
5. NEVER display raw tables, data grids, or formatted lists - always write in complete, professional sentences
6. Be factual and conservative - only state what can be directly derived from the provided metrics
7. If a specific data point is missing, explicitly state "data not available" rather than making assumptions
8. Write in a professional, formal disclosure style appropriate for sustainability reporting

Available Metrics Data for ${disclosureId}:
${metricsData.map((m: any) => `
Metric: ${m.metric}
Response/Value: ${m.response || 'Not provided'}
Synthesized Data: ${m.synthesizedData || 'Not provided'}
Definition: ${m.definition || 'Not provided'}
`).join('\n')}

Instructions for Response:
1. Structure the response to address the ${disclosureTitle} requirements using ONLY the provided data
2. For each metric listed above, incorporate the actual response/value and synthesized data into flowing, professional sentences
3. Convert all tabular information into well-written prose that naturally integrates into the disclosure narrative
4. If any required information is missing, clearly state "This information is not currently available in our data collection"
5. Do not add hypothetical examples, industry benchmarks, or generic sustainability statements
6. Keep the response factual, concise, and directly tied to the provided metrics and synthesized data
7. Write in complete paragraphs with proper sentence structure - avoid bullet points, lists, or table formats
8. If the data is insufficient for a complete disclosure, acknowledge this limitation in professional language

Generate a professional disclosure response written entirely in prose format based STRICTLY on the provided data:`

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
          temperature: 0.2, // Even lower temperature for more formal, factual responses
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 2000, // Increased for more comprehensive prose
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
