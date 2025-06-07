
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
    const { disclosureId, disclosureTitle, disclosureDescription, metrics, allMetrics } = await req.json()

    console.log(`Processing graphics recommendations for disclosure ${disclosureId}:`, {
      totalMetrics: metrics.length,
      totalDatasetMetrics: allMetrics?.length || 0,
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
              if (typeof value === 'number') {
                quantitativeData.push({
                  category: key,
                  value: value,
                  unit: 'count',
                  source: `Row ${index + 1}`,
                  type: 'numeric'
                });
              } else if (typeof value === 'string') {
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

    // Filter metrics that have quantitative data for this disclosure
    const quantitativeMetrics = metrics.filter((metric: any) => {
      const hasData = metric.response || metric.responseData;
      const belongsToDisclosure = metric.disclosure === disclosureId;
      
      const isQuantitative = 
        metric.inputType === 'Decimal' || 
        metric.inputType === 'Integer' ||
        metric.unit || 
        (metric.response && /^\d+(\.\d+)?/.test(metric.response)) ||
        (metric.responseData && typeof metric.responseData === 'object');
      
      return hasData && belongsToDisclosure && isQuantitative;
    });

    // Analyze ALL metrics for context (not just this disclosure)
    const contextualMetrics = (allMetrics || []).filter((metric: any) => {
      const hasData = metric.response || metric.responseData;
      const isQuantitative = 
        metric.inputType === 'Decimal' || 
        metric.inputType === 'Integer' ||
        metric.unit || 
        (metric.response && /^\d+(\.\d+)?/.test(metric.response)) ||
        (metric.responseData && typeof metric.responseData === 'object');
      
      return hasData && isQuantitative;
    });

    console.log(`Analyzing quantitative data with full context:`, {
      disclosureMetrics: quantitativeMetrics.length,
      contextualMetrics: contextualMetrics.length,
      totalDataset: allMetrics?.length || 0
    });

    if (quantitativeMetrics.length === 0) {
      const noDataResponse = {
        hasCharts: false,
        message: `**No Quantitative Data Available for Visualization**

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
- Tables for detailed breakdowns`
      };

      return new Response(
        JSON.stringify(noDataResponse),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    // Prepare data for analysis with full context
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

    // Prepare contextual data summary
    const contextualSummary = contextualMetrics.map((metric: any) => ({
      disclosure: metric.disclosure,
      metric: metric.metric,
      value: metric.response,
      unit: metric.unit,
      topic: metric.topic
    }));

    const prompt = `You are a data visualization expert analyzing sustainability metrics for ${disclosureTitle}.

**CRITICAL INSTRUCTION: Generate actual React/Recharts chart components as CODE STRINGS, not just descriptions**

**Disclosure Context:**
- ID: ${disclosureId}
- Title: ${disclosureTitle}
- Description: ${disclosureDescription}

**FULL DATASET CONTEXT (for calculating rates, percentages, and meaningful comparisons):**
${contextualSummary.slice(0, 50).map((ctx: any) => `
- ${ctx.disclosure}: ${ctx.metric} = ${ctx.value} ${ctx.unit || ''}`).join('')}

**TARGET DISCLOSURE DATA for ${disclosureId}:**
${dataForAnalysis.map((d: any) => `
**Metric:** ${d.metric}
**Value:** ${d.value || 'Not provided'}
**Unit:** ${d.unit || 'Not specified'}
**Input Type:** ${d.inputType || 'Not specified'}
**Definition:** ${d.definition || 'Not provided'}
**Tabular Data:** ${d.responseData ? JSON.stringify(d.responseData, null, 2) : 'None'}
**Extracted Elements:** ${d.extractedQuantitativeData.length > 0 ? 
  d.extractedQuantitativeData.map((item: any) => `${item.category}: ${item.value} ${item.unit}`).join(', ') : 'None'}
`).join('\n')}

**YOUR TASK:**
1. **USE THE FULL DATASET** to calculate meaningful rates, percentages, and contextual metrics
2. **GENERATE ACTUAL CHART CODE** using React and Recharts library
3. **CREATE SPECIFIC VISUALIZATIONS** that tell the story of the data

**REQUIRED OUTPUT FORMAT:**
Provide a JSON response with this exact structure:
{
  "hasCharts": true,
  "charts": [
    {
      "title": "Chart Title",
      "description": "Brief description of insights",
      "chartType": "BarChart|LineChart|PieChart|ScatterChart",
      "code": "COMPLETE React component code using Recharts as a STRING",
      "data": [chart data array],
      "insights": ["Key insight 1", "Key insight 2"]
    }
  ],
  "contextualAnalysis": "Analysis using full dataset context for rates and comparisons"
}

**Chart Code Requirements:**
- Use Recharts library (BarChart, LineChart, PieChart, etc.)
- Include proper imports as strings
- Make charts responsive with ResponsiveContainer
- Use meaningful colors and proper formatting
- Include data labels where appropriate
- Calculate rates per 100 employees, per 1000 hours, percentages, etc. using contextual data

**Example of React component code as STRING:**
"import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WorkplaceAccidentsChart = () => {
  const data = [
    { category: 'Fatal Accidents', count: 2, rate: 0.5 },
    { category: 'Non-Fatal Accidents', count: 15, rate: 3.75 }
  ];

  return (
    <ResponsiveContainer width=\"100%\" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray=\"3 3\" />
        <XAxis dataKey=\"category\" />
        <YAxis />
        <Tooltip formatter={(value, name) => [value, name === 'rate' ? 'Per 100 Employees' : 'Total Count']} />
        <Bar dataKey=\"count\" fill=\"#8884d8\" name=\"Total Count\" />
        <Bar dataKey=\"rate\" fill=\"#82ca9d\" name=\"Rate per 100 Employees\" />
      </BarChart>
    </ResponsiveContainer>
  );
};"

Generate 1-3 specific, actionable charts with complete code that can be directly used.`

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
          temperature: 0.3,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 2500,
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

    // Try to parse JSON response, fallback to text if needed
    let parsedRecommendations;
    try {
      // Extract JSON from the response if it's wrapped in markdown
      const jsonMatch = recommendations.match(/```json\n([\s\S]*?)\n```/) || recommendations.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedRecommendations = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        parsedRecommendations = JSON.parse(recommendations);
      }
    } catch (parseError) {
      console.log('Could not parse as JSON, returning as text:', parseError);
      parsedRecommendations = {
        hasCharts: false,
        message: recommendations
      };
    }

    console.log('Graphics recommendations generated successfully');

    return new Response(
      JSON.stringify(parsedRecommendations),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error in recommend-graphics function:', error)
    return new Response(
      JSON.stringify({ 
        hasCharts: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
