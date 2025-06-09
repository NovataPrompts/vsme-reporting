
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
    if (disclosureId === 'B1') {
      return handleB1Graphics(disclosureTitle)
    } else if (disclosureId === 'B2') {
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

function handleB1Graphics(disclosureTitle: string) {
  return new Response(
    JSON.stringify({
      hasCharts: false,
      message: `No graphics are required for B1 - ${disclosureTitle}`
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    },
  )
}

function handleB2Graphics(metrics: any[], disclosureTitle: string) {
  // Find the VSME.B2.26 metric
  const vsmeB226Metric = metrics.find(m => 
    m.metric === 'Practices, policies and future initiatives for transitioning towards a more sustainable economy' ||
    m.novataReference === 'VSME.B2.26'
  )
  
  if (!vsmeB226Metric || !vsmeB226Metric.responseData) {
    return new Response(
      JSON.stringify({
        hasCharts: false,
        message: `No data available for VSME.B2.26 table visualization in ${disclosureTitle}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }

  // Extract original column order if available
  let originalColumnOrder = null
  if (vsmeB226Metric.responseData.originalColumnOrder) {
    originalColumnOrder = vsmeB226Metric.responseData.originalColumnOrder
  } else if (vsmeB226Metric.responseData.tabularData && vsmeB226Metric.responseData.tabularData.length > 0) {
    // Fallback: get column order from first row
    originalColumnOrder = Object.keys(vsmeB226Metric.responseData.tabularData[0])
  }

  const tableData = vsmeB226Metric.responseData.tabularData || vsmeB226Metric.responseData

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
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    },
  )
}

function handleB3Graphics(metrics: any[], disclosureTitle: string, allMetrics: any[]) {
  const charts = []

  // 1. Table based on VSME.B3.29
  const vsmeB329Metric = metrics.find(m => m.novataReference === 'VSME.B3.29')
  if (vsmeB329Metric && vsmeB329Metric.responseData) {
    let originalColumnOrder = null
    if (vsmeB329Metric.responseData.originalColumnOrder) {
      originalColumnOrder = vsmeB329Metric.responseData.originalColumnOrder
    } else if (vsmeB329Metric.responseData.tabularData && vsmeB329Metric.responseData.tabularData.length > 0) {
      originalColumnOrder = Object.keys(vsmeB329Metric.responseData.tabularData[0])
    }

    const tableData = vsmeB329Metric.responseData.tabularData || vsmeB329Metric.responseData

    charts.push({
      title: "VSME B3.29 - Energy Consumption Data",
      description: "Table showing detailed energy consumption metrics",
      chartType: "Table",
      data: tableData,
      originalColumnOrder: originalColumnOrder,
      insights: [
        "Detailed breakdown of energy consumption by source",
        "Values presented in standardized units for comparison"
      ]
    })
  }

  // 2. Bar chart for GHG Emissions (Scope 1, 2, 3)
  const ghgMetrics = [
    metrics.find(m => m.novataReference === 'VSME.B3.30.a'),
    metrics.find(m => m.novataReference === 'VSME.B3.30.b'),
    metrics.find(m => m.novataReference === 'VSME.C2.50')
  ].filter(Boolean)

  if (ghgMetrics.length > 0) {
    let chartData = []
    let totalEmissions = 0

    ghgMetrics.forEach(metric => {
      if (metric.response) {
        const value = parseFloat(metric.response)
        if (value > 0) {
          let scope = 'Unknown'
          if (metric.novataReference === 'VSME.B3.30.a') scope = 'Scope 1'
          else if (metric.novataReference === 'VSME.B3.30.b') scope = 'Scope 2'
          else if (metric.novataReference === 'VSME.C2.50') scope = 'Scope 3'

          chartData.push({
            category: scope,
            value: value,
            unit: 'tCO2e'
          })
          totalEmissions += value
        }
      }
    })

    if (chartData.length > 0) {
      charts.push({
        title: "Green House Gas Emissions (Scope 1, 2, 3)",
        description: `Bar chart showing GHG emissions by scope with total of ${totalEmissions.toFixed(2)} tCO2e`,
        chartType: "BarChart",
        data: chartData,
        insights: [
          `Total GHG emissions: ${totalEmissions.toFixed(2)} tCO2e`,
          "Comparison across different emission scopes",
          "Values displayed in tonnes of CO2 equivalent"
        ]
      })
    }
  }

  // 3. Table showing Scope 1, 2, and 3 with units
  if (ghgMetrics.length > 0) {
    const scopeTableData = ghgMetrics.map(metric => {
      let scope = 'Unknown'
      if (metric.novataReference === 'VSME.B3.30.a') scope = 'Scope 1'
      else if (metric.novataReference === 'VSME.B3.30.b') scope = 'Scope 2'
      else if (metric.novataReference === 'VSME.C2.50') scope = 'Scope 3'

      return {
        'Emission Scope': scope,
        'Value': metric.response || '0',
        'Unit': 'tCO2e',
        'Description': metric.metric || ''
      }
    })

    charts.push({
      title: "GHG Emissions Summary Table",
      description: "Summary table of Scope 1, 2, and 3 emissions with units",
      chartType: "Table",
      data: scopeTableData,
      originalColumnOrder: ['Emission Scope', 'Value', 'Unit', 'Description'],
      insights: [
        "Structured overview of all emission scopes",
        "Standardized units for regulatory compliance",
        "Clear categorization of emission sources"
      ]
    })
  }

  if (charts.length === 0) {
    return new Response(
      JSON.stringify({
        hasCharts: false,
        message: `No data available for B3 graphics visualization in ${disclosureTitle}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }

  const response = {
    hasCharts: true,
    charts: charts,
    contextualAnalysis: `This visualization package for B3 includes ${charts.length} graphics covering energy consumption and greenhouse gas emissions data across different scopes and categories.`
  }

  return new Response(
    JSON.stringify(response),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    },
  )
}
