
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

    // Function to analyze and extract quantitative data from tabular data
    const extractQuantitativeData = (responseData: any): any[] => {
      if (!responseData || typeof responseData !== 'object') {
        return [];
      }

      const quantitativeData: any[] = [];

      if (Array.isArray(responseData)) {
        responseData.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            Object.entries(item).forEach(([key, value]) => {
              // Check if value is numeric or contains numeric data
              if (typeof value === 'number') {
                quantitativeData.push({
                  category: key,
                  value: value,
                  unit: 'count',
                  source: `Row ${index + 1}`,
                  type: 'numeric'
                });
              } else if (typeof value === 'string') {
                // Try to extract numbers from strings
                const numericMatch = value.match(/(\d+(?:\.\d+)?)/g);
                if (numericMatch) {
                  numericMatch.forEach((num) => {
                    quantitativeData.push({
                      category: `${key} (extracted)`,
                      value: parseFloat(num),
                      unit: 'extracted value',
                      source: `Row ${index + 1}`,
                      type: 'extracted'
                    });
                  });
                }
              }
            });
          }
        });
      } else {
        // Handle object data
        Object.entries(responseData).forEach(([key, value]) => {
          if (typeof value === 'number') {
            quantitativeData.push({
              category: key,
              value: value,
              unit: 'count',
              source: 'Data object',
              type: 'numeric'
            });
          }
        });
      }

      return quantitativeData;
    };

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
        inputType: m.inputType,
        hasTabularData: !!m.responseData
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

    // Prepare quantitative data for analysis with tabular data extraction
    const dataForAnalysis = quantitativeMetrics.map((metric: any) => {
      const extractedTabularData = metric.responseData ? extractQuantitativeData(metric.responseData) : [];
      
      return {
        metric: metric.metric,
        value: metric.response,
        unit: metric.unit,
        inputType: metric.inputType,
        definition: metric.definition,
        responseData: metric.responseData,
        extractedQuantitativeData: extractedTabularData
      };
    });

    const prompt = `You are a data visualization expert analyzing sustainability metrics for ${disclosureTitle}.

**Disclosure Context:**
- ID: ${disclosureId}
- Title: ${disclosureTitle}
- Description: ${disclosureDescription}

**INSTRUCTIONS:**
1. Analyze the quantitative data provided below, including extracted data from tabular sources
2. Recommend specific, appropriate visualizations for this data
3. Focus on charts and graphics that would best communicate the sustainability information
4. Consider the audience (stakeholders, investors, regulators)
5. Suggest chart types, data groupings, and key insights to highlight
6. Be specific about which metrics should be visualized together vs. separately
7. When tabular data is available, suggest how to best visualize the relationships and patterns

**Available Quantitative Data for ${disclosureId}:**
${dataForAnalysis.map((d: any) => `
**Metric:** ${d.metric}
**Value:** ${d.value || 'Not provided'}
**Unit:** ${d.unit || 'Not specified'}
**Input Type:** ${d.inputType || 'Not specified'}
**Definition:** ${d.definition || 'Not provided'}
**Tabular Data:** ${d.responseData ? JSON.stringify(d.responseData, null, 2) : 'None'}
**Extracted Quantitative Elements:** ${d.extractedQuantitativeData.length > 0 ? 
  d.extractedQuantitativeData.map((item: any) => `${item.category}: ${item.value} ${item.unit}`).join(', ') : 'None'}
`).join('\n')}

**Provide specific visualization recommendations including:**
1. Chart type (bar, line, pie, scatter, table, etc.)
2. Which metrics to include in each visualization
3. How to group or categorize the data
4. Key insights each chart should highlight
5. Suggested titles and labels
6. Any time-based analysis if applicable
7. How to best represent tabular data relationships
8. Specific recommendations for extracted quantitative elements

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
