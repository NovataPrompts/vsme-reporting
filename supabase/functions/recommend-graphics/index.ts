
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
  console.log('B3 handleB3Graphics called with metrics:', metrics.length)
  console.log('All available metrics for B3:', metrics.map(m => ({ 
    novataReference: m.novataReference, 
    metric: m.metric,
    hasResponse: !!m.response,
    hasResponseData: !!m.responseData,
    response: m.response,
    responseData: m.responseData
  })))

  const charts = []

  // 1. Table based on VSME.B3.29 with percentage breakdown
  const vsmeB329Metric = metrics.find(m => m.novataReference === 'VSME.B3.29')
  if (vsmeB329Metric && vsmeB329Metric.responseData) {
    console.log('Found VSME.B3.29 metric:', vsmeB329Metric)
    
    // Get the original column order and tabular data
    let originalColumnOrder = null
    let tableData = null
    
    if (vsmeB329Metric.responseData.originalColumnOrder) {
      originalColumnOrder = vsmeB329Metric.responseData.originalColumnOrder
      console.log('Using preserved original column order:', originalColumnOrder)
    }
    
    if (vsmeB329Metric.responseData.tabularData) {
      tableData = vsmeB329Metric.responseData.tabularData
      console.log('Using tabular data:', tableData)
    } else {
      tableData = vsmeB329Metric.responseData
      console.log('Using response data directly:', tableData)
    }

    // If we still don't have column order, get it from the first row
    if (!originalColumnOrder && tableData && tableData.length > 0) {
      originalColumnOrder = Object.keys(tableData[0])
      console.log('Fallback to first row keys:', originalColumnOrder)
    }

    if (tableData && tableData.length > 0) {
      // Calculate total energy consumption for percentage calculation
      // EXCLUDE the "Total" row from percentage calculations
      const dataRowsOnly = tableData.filter(item => {
        const energyType = (item['Energy Consumption Type'] || item['Type'] || item.type || item.category || item.source || '').toString().toLowerCase()
        return energyType !== 'total' && energyType.trim() !== ''
      })
      
      console.log('Data rows excluding total:', dataRowsOnly)
      
      let totalConsumption = 0
      
      // Try different possible column names for consumption values
      const consumptionColumns = ['Total (MWh)', 'Consumption', 'consumption', 'amount', 'value', 'Total']
      let consumptionColumnName = null
      
      // Find which column contains the consumption data
      for (const colName of consumptionColumns) {
        if (tableData[0][colName] !== undefined) {
          consumptionColumnName = colName
          break
        }
      }
      
      console.log('Found consumption column:', consumptionColumnName)
      
      if (consumptionColumnName) {
        // Calculate total from data rows only (excluding "Total" row)
        dataRowsOnly.forEach(item => {
          const consumption = parseFloat(item[consumptionColumnName] || '0')
          if (consumption > 0) {
            totalConsumption += consumption
          }
        })
        
        console.log('Total consumption calculated (excluding Total row):', totalConsumption)

        // Add percentage column to the data
        const enhancedTableData = tableData.map(item => {
          const energyType = (item['Energy Consumption Type'] || item['Type'] || item.type || item.category || item.source || '').toString().toLowerCase()
          const consumption = parseFloat(item[consumptionColumnName] || '0')
          
          // Don't calculate percentage for the "Total" row
          let percentage = ''
          if (energyType === 'total') {
            percentage = '-'
          } else if (totalConsumption > 0) {
            percentage = `${((consumption / totalConsumption) * 100).toFixed(1)}%`
          } else {
            percentage = '0%'
          }
          
          return {
            ...item,
            'Percentage (%)': percentage
          }
        })

        // Set the specific column order requested: Energy consumption type, renewable, non-renewable, total, percentage
        const enhancedColumnOrder = [
          'Energy Consumption Type',
          'Renewable (MWh)',
          'Non-renewable (MWh)', 
          'Total (MWh)',
          'Percentage (%)'
        ]
        
        console.log('Enhanced column order:', enhancedColumnOrder)
        console.log('Enhanced table data sample:', enhancedTableData[0])

        charts.push({
          title: "Energy Consumption Breakdown",
          description: "Table showing detailed energy consumption metrics with percentage breakdown by source (VSME B3.29)",
          chartType: "Table",
          data: enhancedTableData,
          originalColumnOrder: enhancedColumnOrder,
          insights: [
            "Detailed breakdown of energy consumption by source",
            "Percentage distribution shows relative consumption by energy type (excluding total row)",
            "Values presented in standardized units for comparison"
          ]
        })

        // 2. Pie Chart - Electricity vs Fuel breakdown with percentages
        const pieChartData = dataRowsOnly.map(item => {
          const consumption = parseFloat(item[consumptionColumnName] || '0')
          const percentage = totalConsumption > 0 ? ((consumption / totalConsumption) * 100).toFixed(1) : '0'
          
          return {
            category: item['Energy Consumption Type'] || item['Type'] || item.type || item.category || item.source,
            value: consumption,
            unit: 'MWh',
            percentage: `${percentage}%`,
            label: `${item['Energy Consumption Type'] || item['Type'] || item.type || item.category || item.source}: ${consumption} MWh (${percentage}%)`
          }
        })

        if (pieChartData.length > 0) {
          charts.push({
            title: "Energy Consumption by Source Type",
            description: "Pie chart showing the breakdown between electricity and fuel consumption with percentages (VSME B3.29)",
            chartType: "PieChart",
            data: pieChartData,
            insights: [
              "Visual comparison of electricity vs fuel consumption with percentages",
              "Shows relative proportion of each energy source",
              "Helps identify primary energy consumption patterns"
            ]
          })
        }

        // 3. Stacked Bar Chart - Renewable vs Non-renewable by type with MWh labels
        const stackedBarData = dataRowsOnly.map(item => {
          const renewable = parseFloat(item['Renewable (MWh)'] || item['renewable'] || '0')
          const nonRenewable = parseFloat(item['Non-renewable (MWh)'] || item['nonrenewable'] || item['non_renewable'] || '0')
          
          return {
            category: item['Energy Consumption Type'] || item['Type'] || item.type || item.category || item.source,
            renewable: renewable,
            nonRenewable: nonRenewable,
            unit: 'MWh',
            renewableLabel: `${renewable} MWh`,
            nonRenewableLabel: `${nonRenewable} MWh`
          }
        })

        if (stackedBarData.length > 0) {
          charts.push({
            title: "Renewable vs Non-Renewable Energy by Source",
            description: "Stacked bar chart showing renewable and non-renewable energy breakdown by electricity and fuel with MWh values (VSME B3.29)",
            chartType: "StackedBarChart",
            data: stackedBarData,
            insights: [
              "Compares renewable vs non-renewable energy across source types with MWh values",
              "Shows sustainability performance by energy category",
              "Identifies opportunities for increasing renewable energy use"
            ]
          })
        }

        // 4. Pie Chart - Overall Renewable vs Non-renewable with percentages
        let totalRenewable = 0
        let totalNonRenewable = 0
        
        dataRowsOnly.forEach(item => {
          totalRenewable += parseFloat(item['Renewable (MWh)'] || item['renewable'] || '0')
          totalNonRenewable += parseFloat(item['Non-renewable (MWh)'] || item['nonrenewable'] || item['non_renewable'] || '0')
        })

        if (totalRenewable > 0 || totalNonRenewable > 0) {
          const totalEnergy = totalRenewable + totalNonRenewable
          const renewablePercentage = totalEnergy > 0 ? ((totalRenewable / totalEnergy) * 100).toFixed(1) : '0'
          const nonRenewablePercentage = totalEnergy > 0 ? ((totalNonRenewable / totalEnergy) * 100).toFixed(1) : '0'

          const renewablePieData = [
            {
              category: 'Renewable',
              value: totalRenewable,
              unit: 'MWh',
              percentage: `${renewablePercentage}%`,
              label: `Renewable: ${totalRenewable.toFixed(1)} MWh (${renewablePercentage}%)`
            },
            {
              category: 'Non-renewable',
              value: totalNonRenewable,
              unit: 'MWh',
              percentage: `${nonRenewablePercentage}%`,
              label: `Non-renewable: ${totalNonRenewable.toFixed(1)} MWh (${nonRenewablePercentage}%)`
            }
          ]

          charts.push({
            title: "Overall Renewable vs Non-Renewable Energy",
            description: `Pie chart showing the overall breakdown of renewable (${totalRenewable.toFixed(1)} MWh, ${renewablePercentage}%) vs non-renewable (${totalNonRenewable.toFixed(1)} MWh, ${nonRenewablePercentage}%) energy`,
            chartType: "PieChart",
            data: renewablePieData,
            insights: [
              `${renewablePercentage}% of total energy consumption is renewable`,
              "Overall sustainability performance indicator",
              "Key metric for environmental impact assessment"
            ]
          })
        }
      } else {
        // Fallback: just show the table without percentage calculation
        const fallbackColumnOrder = [
          'Energy Consumption Type',
          'Renewable (MWh)',
          'Non-renewable (MWh)', 
          'Total (MWh)'
        ]
        
        charts.push({
          title: "Energy Consumption Breakdown",
          description: "Table showing detailed energy consumption metrics (VSME B3.29)",
          chartType: "Table",
          data: tableData,
          originalColumnOrder: fallbackColumnOrder,
          insights: [
            "Detailed breakdown of energy consumption by source",
            "Values presented in standardized units for comparison"
          ]
        })
      }
    }
  }

  // 2. FIXED: GHG Emissions Charts using the correct Novata references
  console.log('Looking for GHG metrics with correct Novata references...')
  console.log('Available metrics in B3:', metrics.map(m => `${m.novataReference}: ${m.metric}`))
  
  // Find GHG metrics using the exact Novata references
  const scope1Metric = metrics.find(m => m.novataReference === 'VSME.B3.30.a')
  const scope2Metric = metrics.find(m => m.novataReference === 'VSME.B3.30.b') 
  const scope3Metric = metrics.find(m => m.novataReference === 'VSME.C2.50')
  
  console.log('GHG metrics search results:', {
    'VSME.B3.30.a': scope1Metric ? { 
      found: true, 
      response: scope1Metric.response, 
      responseData: scope1Metric.responseData,
      metric: scope1Metric.metric 
    } : { found: false },
    'VSME.B3.30.b': scope2Metric ? { 
      found: true, 
      response: scope2Metric.response, 
      responseData: scope2Metric.responseData,
      metric: scope2Metric.metric 
    } : { found: false },
    'VSME.C2.50': scope3Metric ? { 
      found: true, 
      response: scope3Metric.response, 
      responseData: scope3Metric.responseData,
      metric: scope3Metric.metric 
    } : { found: false }
  })

  const ghgMetrics = []
  if (scope1Metric) ghgMetrics.push(scope1Metric)
  if (scope2Metric) ghgMetrics.push(scope2Metric)
  if (scope3Metric) ghgMetrics.push(scope3Metric)

  console.log('Total GHG metrics found:', ghgMetrics.length)

  if (ghgMetrics.length > 0) {
    let chartData = []
    let tableData = []
    let totalEmissions = 0

    ghgMetrics.forEach(metric => {
      console.log(`Processing GHG metric ${metric.novataReference}:`, {
        response: metric.response,
        responseData: metric.responseData,
        metric: metric.metric
      })

      // Try to get the value from response or responseData
      let value = 0
      if (metric.response && !isNaN(parseFloat(metric.response))) {
        value = parseFloat(metric.response)
        console.log(`Got value from response: ${value}`)
      } else if (metric.responseData && typeof metric.responseData === 'object' && metric.responseData.value) {
        value = parseFloat(metric.responseData.value)
        console.log(`Got value from responseData.value: ${value}`)
      } else if (metric.responseData && !isNaN(parseFloat(metric.responseData))) {
        value = parseFloat(metric.responseData)
        console.log(`Got value from responseData directly: ${value}`)
      }

      console.log(`Final extracted value for ${metric.novataReference}: ${value}`)

      let scope = 'Unknown'
      if (metric.novataReference === 'VSME.B3.30.a') scope = 'Scope 1'
      else if (metric.novataReference === 'VSME.B3.30.b') scope = 'Scope 2'
      else if (metric.novataReference === 'VSME.C2.50') scope = 'Scope 3'

      // Always add to chart data, even if value is 0
      chartData.push({
        category: scope,
        value: value,
        unit: 'tCO2e'
      })

      // Add to table data
      tableData.push({
        'Emission Scope': scope,
        'Value': value.toString(),
        'Unit': 'tCO2e',
        'Metric Reference': metric.novataReference,
        'Description': metric.metric || ''
      })

      totalEmissions += value
    })

    console.log('Final GHG chart data:', chartData)
    console.log('Final GHG table data:', tableData)
    console.log('Total emissions calculated:', totalEmissions)

    // Always create the bar chart, even with zero values
    charts.push({
      title: "GHG Emissions by Scope",
      description: `Bar chart showing GHG emissions by scope with total of ${totalEmissions.toFixed(2)} tCO2e (VSME.B3.30.a, VSME.B3.30.b, VSME.C2.50)`,
      chartType: "BarChart",
      data: chartData,
      insights: [
        `Total GHG emissions: ${totalEmissions.toFixed(2)} tCO2e`,
        "Comparison across different emission scopes",
        "Values displayed in tonnes of CO2 equivalent"
      ]
    })

    // Always create the summary table
    charts.push({
      title: "GHG Emissions Summary Table",
      description: "Summary table of Scope 1, 2, and 3 emissions with units (VSME.B3.30.a, VSME.B3.30.b, VSME.C2.50)",
      chartType: "Table",
      data: tableData,
      originalColumnOrder: ['Emission Scope', 'Value', 'Unit', 'Metric Reference', 'Description'],
      insights: [
        "Structured overview of all emission scopes",
        "Standardized units for regulatory compliance",
        "Clear categorization of emission sources with metric references"
      ]
    })
  } else {
    console.log('No GHG metrics found, creating placeholder charts with correct references')
    // Create placeholder charts even if no data is available
    const placeholderChartData = [
      { category: 'Scope 1', value: 0, unit: 'tCO2e' },
      { category: 'Scope 2', value: 0, unit: 'tCO2e' },
      { category: 'Scope 3', value: 0, unit: 'tCO2e' }
    ]

    const placeholderTableData = [
      { 'Emission Scope': 'Scope 1', 'Value': '0', 'Unit': 'tCO2e', 'Metric Reference': 'VSME.B3.30.a', 'Description': 'Direct emissions' },
      { 'Emission Scope': 'Scope 2', 'Value': '0', 'Unit': 'tCO2e', 'Metric Reference': 'VSME.B3.30.b', 'Description': 'Indirect emissions from energy' },
      { 'Emission Scope': 'Scope 3', 'Value': '0', 'Unit': 'tCO2e', 'Metric Reference': 'VSME.C2.50', 'Description': 'Other indirect emissions' }
    ]

    charts.push({
      title: "GHG Emissions by Scope",
      description: "Bar chart showing GHG emissions by scope (no data available - showing placeholder)",
      chartType: "BarChart",
      data: placeholderChartData,
      insights: [
        "No emission data available",
        "Placeholder chart showing emission scope structure",
        "Values displayed in tonnes of CO2 equivalent"
      ]
    })

    charts.push({
      title: "GHG Emissions Summary Table",
      description: "Summary table of Scope 1, 2, and 3 emissions (no data available - showing structure)",
      chartType: "Table",
      data: placeholderTableData,
      originalColumnOrder: ['Emission Scope', 'Value', 'Unit', 'Metric Reference', 'Description'],
      insights: [
        "Structured overview of all emission scopes",
        "Standardized units for regulatory compliance",
        "Ready for data input when metrics are available"
      ]
    })
  }

  console.log('B3 Total charts created:', charts.length)
  console.log('B3 Chart titles:', charts.map(c => c.title))

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

  console.log('B3 Final response:', response)

  return new Response(
    JSON.stringify(response),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    },
  )
}
