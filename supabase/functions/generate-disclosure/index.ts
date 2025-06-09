
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

    // Get authorization header for Supabase operations
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    })

    // Fetch company profile for B1 disclosures
    let companyProfile = null
    if (disclosureId === 'B1') {
      const { data: profile, error: profileError } = await supabase
        .from('company_profiles')
        .select('*')
        .maybeSingle()

      if (profileError) {
        console.error('Error fetching company profile:', profileError)
      } else {
        companyProfile = profile
      }
    }

    // Double-check that all metrics belong to the specified disclosure
    const validMetrics = metrics.filter((metric: any) => 
      metric.disclosure === disclosureId && (metric.response || metric.responseData)
    );

    console.log(`Processing disclosure ${disclosureId}:`, {
      receivedMetrics: metrics.length,
      validMetrics: validMetrics.length,
      disclosureId,
      hasCompanyProfile: !!companyProfile
    });

    // If no valid metrics, return a message indicating data collection is needed
    if (validMetrics.length === 0 && !companyProfile) {
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

      // Handle nested tabular data structure
      let dataToProcess = responseData;
      if (responseData.tabularData && Array.isArray(responseData.tabularData)) {
        dataToProcess = responseData.tabularData;
      }

      if (Array.isArray(dataToProcess)) {
        if (dataToProcess.length === 0) {
          return 'No entries found in the data';
        }

        // Enhanced synthesis for different data types
        const synthesizedItems = dataToProcess.map((item, index) => {
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
        const firstItem = dataToProcess[0];
        if (firstItem && typeof firstItem === 'object') {
          const keys = Object.keys(firstItem).map(k => k.toLowerCase());
          
          // Enhanced energy consumption detection and processing for B3
          if (keys.some(k => k.includes('energy') || k.includes('fuel') || k.includes('electricity') || k.includes('consumption') || k.includes('kwh') || k.includes('mwh'))) {
            console.log('Processing energy data for B3:', dataToProcess);
            
            let totalConsumption = 0;
            const energyBreakdown = dataToProcess.map(item => {
              const energyType = item['Energy Type'] || item['Type'] || item.type || item.category || item.source || 'energy source';
              const consumption = parseFloat(item['Consumption'] || item.consumption || item.amount || item.value || '0');
              const unit = item['Unit'] || item.unit || 'MWh';
              
              if (consumption > 0) {
                totalConsumption += consumption;
                return `${consumption.toFixed(2)} ${unit} from ${String(energyType).toLowerCase()}`;
              }
              return null;
            }).filter(item => item !== null);
            
            if (energyBreakdown.length > 0) {
              return `The organization's total energy consumption is ${totalConsumption.toFixed(2)} MWh, with the following breakdown: ${energyBreakdown.join(', ')}.`;
            }
          }
          
          // Enhanced gender/workforce composition detection and processing
          if (keys.some(k => k.includes('gender') || k.includes('sex')) || 
              keys.some(k => k.includes('male') || k.includes('female'))) {
            
            // Handle different data structures for gender data
            let genderData = dataToProcess;
            
            // Filter out rows with no meaningful data (empty employee counts)
            genderData = genderData.filter(item => {
              const employeeCount = item['Number of employees'] || item['Number of Employees'] || 
                                  item.count || item.employees || item.headcount || 
                                  item['Employee Count'] || item.total || '0';
              
              // Convert to number and check if it's valid and greater than 0
              const numericCount = parseInt(String(employeeCount).replace(/[^\d]/g, '')) || 0;
              return numericCount > 0;
            });
            
            if (genderData.length > 0) {
              const totalEmployees = genderData.reduce((sum, item) => {
                const count = parseInt(String(item['Number of employees'] || item['Number of Employees'] || 
                                     item.count || item.employees || item.headcount || 
                                     item['Employee Count'] || item.total || '0').replace(/[^\d]/g, '')) || 0;
                return sum + count;
              }, 0);
              
              if (totalEmployees > 0) {
                const genderBreakdown = genderData.map(item => {
                  const gender = item.gender || item.Gender || item.category || item.type;
                  const count = parseInt(String(item['Number of employees'] || item['Number of Employees'] || 
                                        item.count || item.employees || item.headcount || 
                                        item['Employee Count'] || item.total || '0').replace(/[^\d]/g, '')) || 0;
                  const percentage = totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0;
                  
                  if (count > 0) {
                    return `${count} ${String(gender).toLowerCase()} employees (${percentage}%)`;
                  }
                  return null;
                }).filter(item => item !== null);
                
                if (genderBreakdown.length > 0) {
                  return `The organization's workforce comprises ${totalEmployees} employees distributed as follows: ${genderBreakdown.join(', ')}.`;
                }
              }
            }
            
            // Fallback if no valid gender data found
            return 'Gender composition data is available but requires further specification of employee counts.';
          }
          
          // Location/subsidiary data
          if (keys.some(k => k.includes('subsidiary') || k.includes('entity') || k.includes('company') || k.includes('location'))) {
            const locationItems = dataToProcess.map(item => {
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
              const entityWord = dataToProcess.length === 1 ? 'subsidiary' : 'subsidiaries';
              return `The organization operates through ${dataToProcess.length} ${entityWord}: ${locationItems.join(', ')}.`;
            }
          }
          
          // Emissions data
          if (keys.some(k => k.includes('emission') || k.includes('co2') || k.includes('carbon'))) {
            const emissionItems = dataToProcess.map(item => {
              const scope = item.scope || item.category || item.type;
              const amount = item.emissions || item.amount || item.value;
              const unit = item.unit || 'tCO2e';
              return `${scope}: ${amount} ${unit}`;
            });
            return `Greenhouse gas emissions data shows ${emissionItems.join(', ')}.`;
          }
          
          // Health and safety data
          if (keys.some(k => k.includes('accident') || k.includes('injury') || k.includes('incident') || k.includes('safety'))) {
            const safetyItems = dataToProcess.map(item => {
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
      const entries = Object.entries(dataToProcess).filter(([key, value]) => 
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
        console.log(`Processing responseData for metric ${metric.metric}:`, metric.responseData);
        synthesizedData = synthesizeTabularData(metric.responseData);
        console.log(`Synthesized data: ${synthesizedData}`);
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

    // Create company profile context for B1 disclosures
    let companyProfileContext = '';
    if (disclosureId === 'B1' && companyProfile) {
      companyProfileContext = `
Company Profile Information:
- Company Name: ${companyProfile.name}
- Company Structure: ${companyProfile.company_structure || 'Not specified'}
- Country of Domicile: ${companyProfile.country_of_domicile}
- Year of Incorporation: ${companyProfile.year_of_incorporation || 'Not specified'}
- Primary Currency: ${companyProfile.primary_currency}
- Website: ${companyProfile.website || 'Not specified'}
- DBA Name: ${companyProfile.dba_name || 'Not specified'}
- Company Description: ${companyProfile.company_description || 'Not specified'}
- Fiscal Year End: ${companyProfile.fiscal_year_end || 'Not specified'}
`;
    }

    let prompt = `You are a sustainability reporting expert tasked with creating a professional disclosure response for ${disclosureTitle}.

Disclosure Context:
- ID: ${disclosureId}
- Title: ${disclosureTitle}
- Description: ${disclosureDescription}

${companyProfileContext}

CRITICAL INSTRUCTIONS:
1. ONLY use the specific data provided below from disclosure ${disclosureId}
2. DO NOT create, assume, or fabricate any data points, metrics, or information
3. DO NOT reference industry standards, best practices, or generic sustainability concepts unless directly supported by the provided data
4. When tabular data has been synthesized, use the specific details provided and convert them into professional prose
5. NEVER display raw tables, data grids, or formatted lists - always write in complete, professional sentences
6. Be factual and conservative - only state what can be directly derived from the provided metrics
7. ONLY mention missing data if it's truly critical to the disclosure and would be expected by regulators
8. Write in a professional, formal disclosure style appropriate for sustainability reporting
9. Focus on presenting the available data comprehensively rather than highlighting gaps`;

    // Special instructions for B1 disclosure
    if (disclosureId === 'B1') {
      prompt += `
10. For B1 disclosures, incorporate the company profile information to provide context about the organization's basis for preparation
11. Use the company structure, domicile, and other profile details to frame the sustainability reporting approach
12. Reference the company name, structure, and geographical scope when describing the reporting basis`;
    }

    // Special instructions for B3 disclosure
    if (disclosureId === 'B3') {
      prompt += `
10. For B3 disclosures, pay special attention to energy consumption data and ensure all tabular energy metrics are fully incorporated
11. Present energy consumption figures with specific values, units, and breakdowns by energy type
12. Calculate and present total energy consumption figures where applicable
13. Include all energy-related data points from the synthesized tabular data`;
    }

    prompt += `

Available Metrics Data for ${disclosureId}:
${metricsData.map((m: any) => `
Metric: ${m.metric}
Response/Value: ${m.response || 'Not provided'}
Synthesized Data: ${m.synthesizedData || 'Not provided'}
Definition: ${m.definition || 'Not provided'}
`).join('\n')}

Instructions for Response:
1. Structure the response to address the ${disclosureTitle} requirements using ALL the provided data comprehensively
2. For each metric listed above, incorporate the actual response/value and synthesized data into flowing, professional sentences
3. Convert all tabular information into well-written prose that naturally integrates into the disclosure narrative
4. Present the information as a complete, professional disclosure response that demonstrates transparency and compliance
5. Do not add hypothetical examples, industry benchmarks, or generic sustainability statements
6. Keep the response factual, comprehensive, and directly tied to the provided metrics and synthesized data
7. Write in complete paragraphs with proper sentence structure - avoid bullet points, lists, or table formats
8. Create a cohesive narrative that flows naturally from one data point to the next

Generate a comprehensive, professional disclosure response written entirely in prose format that maximizes the value of all provided data:`

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
