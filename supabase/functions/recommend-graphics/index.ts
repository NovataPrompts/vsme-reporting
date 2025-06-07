
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

    console.log(`Processing graphics recommendations for disclosure ${disclosureId}:`, {
      totalMetrics: metrics.length,
      disclosureTitle
    })

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured')
    }

    // Filter metrics that have quantitative data
    const quantitativeMetrics = metrics.filter((metric: any) => {
      const hasData = metric.response || metric.responseData;
      const belongsToDisclosure = metric.disclosure === disclosureId;
      
      // Check if the data appears to be quantitative
      const isQuantitative = 
        metric.inputType === 'Decimal' || 
        metric.inputType === 'Integer' ||
        metric.unit || 
        (metric.response && /^\d+(\.\d+)?/.test(metric.response)) ||
        (metric.responseData && typeof metric.responseData === 'object');
      
      return hasData && belongsToDisclosure && isQuantitative;
    });

    console.log(`Analyzing quantitative data for disclosure ${disclosureId}:`, {
      totalMetrics: metrics.length,
      quantitativeMetrics: quantitativeMetrics.length,
      quantitativeData: quantitativeMetrics.map(m => ({ 
        metric: m.metric, 
        value: m.response,
        unit: m.unit,
        inputType: m.inputType
      }))
    });

    // If no quantitative metrics, return a message indicating no visualizable data
    if (quantitativeMetrics.length === 0) {
      const noDataResponse = `**No Quantitative Data Available for Visualization**

**Disclosure ${disclosureId}: ${disclosureTitle}**

Currently, there are no quantitative metrics available for this disclosure that would benefit from data visualization. 

**To generate meaningful graphics recommendations:**
1. Ensure numerical data is collected for relevant metrics
2. Include data with units of measurement (percentages, amounts, counts, etc.)
3. Provide time-series data for trend analysis
4. Include categorical data that can be compared

**Once quantitative data is available, we can recommend appropriate visualizations such as:**
- Bar charts for comparisons
- Line charts for trends over time
- Pie charts for proportional data
- Tables for detailed breakdowns`;

      return new Response(
        JSON.stringify({ recommendations: noDataResponse }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    // Prepare quantitative data for analysis
    const dataForAnalysis = quantitativeMetrics.map((metric: any) => ({
      metric: metric.metric,
      value: metric.response,
      unit: metric.unit,
      inputType: metric.inputType,
      definition: metric.definition,
      responseData: metric.responseData
    }));

    const prompt = `You are a data visualization expert analyzing sustainability metrics for ${disclosureTitle}.

**Disclosure Context:**
- ID: ${disclosureId}
- Title: ${disclosureTitle}
- Description: ${disclosureDescription}

**INSTRUCTIONS:**
1. Analyze the quantitative data provided below
2. Recommend specific, appropriate visualizations for this data
3. Focus on charts and graphics that would best communicate the sustainability information
4. Consider the audience (stakeholders, investors, regulators)
5. Suggest chart types, data groupings, and key insights to highlight
6. Be specific about which metrics should be visualized together vs. separately

**Available Quantitative Data for ${disclosureId}:**
${dataForAnalysis.map((d: any) => `
**Metric:** ${d.metric}
**Value:** ${d.value || 'Not provided'}
**Unit:** ${d.unit || 'Not specified'}
**Input Type:** ${d.inputType || 'Not specified'}
**Definition:** ${d.definition || 'Not provided'}
**Additional Data:** ${d.responseData ? JSON.stringify(d.responseData) : 'None'}
`).join('\n')}

**Provide specific visualization recommendations including:**
1. Chart type (bar, line, pie, scatter, etc.)
2. Which metrics to include in each visualization
3. How to group or categorize the data
4. Key insights each chart should highlight
5. Suggested titles and labels
6. Any time-based analysis if applicable

Format your response as clear, actionable recommendations for creating meaningful visualizations. Use markdown formatting for better readability.`

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
          temperature: 0.4,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 1500,
        }
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Gemini API error:', error)
      throw new Error(error.error?.message || 'Failed to generate graphics recommendations')
    }

    const data = await response.json()
    const recommendations = data.candidates[0].content.parts[0].text

    console.log('Graphics recommendations generated successfully')

    return new Response(
      JSON.stringify({ recommendations }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error in recommend-graphics function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
