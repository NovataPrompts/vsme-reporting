
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

    // Handle specific disclosure requirements
    if (disclosureId === 'B2') {
      return handleB2Graphics(metrics, disclosureTitle)
    } else if (disclosureId === 'B3') {
      return handleB3Graphics(metrics, disclosureTitle, allMetrics)
    } else {
      // No graphics needed for other disclosures
      return new Response(
        JSON.stringify({
          hasCharts: false,
          message: `No graphics are required for disclosure ${disclosureId}: ${disclosureTitle}`
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }
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

function handleB2Graphics(metrics: any[], disclosureTitle: string) {
  // Find the VSME.B2.26 metric
  const vsmeMetric = metrics.find(m => m.metric === 'Practices, policies and future initiatives for transitioning towards a more sustainable economy')
  
  if (!vsmeMetric || !vsmeMetric.responseData) {
    return new Response(
      JSON.stringify({
        hasCharts: false,
        message: `No data available for VSME.B2.26 table visualization in ${disclosureTitle}`
      }),
      {
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      },
    )
  }

  // Extract original column order if available
  let originalColumnOrder = null
  if (vsmeMetric.responseData.originalColumnOrder) {
    originalColumnOrder = vsmeMetric.responseData.originalColumnOrder
  } else if (vsmeMetric.responseData.tabularData && vsmeMetric.responseData.tabularData.length > 0) {
    // Fallback: get column order from first row
    originalColumnOrder = Object.keys(vsmeMetric.responseData.tabularData[0])
  }

  const tableData = vsmeMetric.responseData.tabularData || vsmeMetric.responseData

  const response = {
    hasCharts: true,
    charts: [{
      title: "VSME B2.26 - Sustainability Practices Implementation Status",
      description: "Table showing implementation status of sustainability practices and policies",
      chartType: "Table",
      data: tableData,
      originalColumnOrder: originalColumnOrder,
      insights: [
        "Visual representation of sustainability practices implementation",
        "Green checkmarks indicate implemented practices",
        "Red X marks show areas requiring attention"
      ]
    }],
    contextualAnalysis: "This table provides a clear visual overview of the organization's sustainability practices and policies implementation status for VSME B2.26 disclosure requirements."
  }

  return new Response(
    JSON.stringify(response),
    {
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    },
  )
}

function handleB3Graphics(metrics: any[], disclosureTitle: string, allMetrics: any[]) {
  // Find energy-related metrics for stacked bar chart
  const energyMetrics = metrics.filter(m => 
    m.metric.toLowerCase().includes('energy') || 
    m.unit?.toLowerCase().includes('mwh') ||
    m.responseData
  )

  if (energyMetrics.length === 0) {
    return new Response(
      JSON.stringify({
        hasCharts: false,
        message: `No energy data available for stacked bar chart visualization in ${disclosureTitle}`
      }),
      {
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      },
    )
  }

  // Process energy data for stacked bar chart
  let chartData = []
  let totalMWh = 0

  energyMetrics.forEach(metric => {
    if (metric.responseData && Array.isArray(metric.responseData)) {
      metric.responseData.forEach(item => {
        const energyValue = parseFloat(item.consumption || item.amount || item.value || '0')
        const energyType = item.type || item.category || item['Energy Type'] || 'Unknown'
        
        if (energyValue > 0) {
          chartData.push({
            category: energyType,
            value: energyValue,
            unit: 'MWh'
          })
          totalMWh += energyValue
        }
      })
    } else if (metric.response && metric.unit?.toLowerCase().includes('mwh')) {
      const value = parseFloat(metric.response)
      if (value > 0) {
        chartData.push({
          category: metric.metric,
          value: value,
          unit: 'MWh'
        })
        totalMWh += value
      }
    }
  })

  const response = {
    hasCharts: true,
    charts: [{
      title: "B3 - Energy Consumption Breakdown",
      description: `Stacked bar chart showing energy consumption by source with total of ${totalMWh.toFixed(2)} MWh`,
      chartType: "StackedBarChart",
      data: chartData,
      insights: [
        `Total energy consumption: ${totalMWh.toFixed(2)} MWh`,
        "Stacked visualization shows contribution of each energy source",
        "Values displayed in MWh for regulatory compliance"
      ]
    }],
    contextualAnalysis: `This stacked bar chart presents the organization's energy consumption data for B3 disclosure requirements, showing a total consumption of ${totalMWh.toFixed(2)} MWh across different energy sources.`
  }

  return new Response(
    JSON.stringify(response),
    {
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    },
  )
}
