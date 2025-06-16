import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { useDisclosureResponses } from "@/hooks/useDisclosureResponses";
import { ChartRenderer } from "@/components/disclosure/ChartRenderer";
import { supabase } from "@/integrations/supabase/client";

export const DraftViewer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;
  const { getCompanyProfile } = useCompanyProfile();
  
  const [companyProfile, setCompanyProfile] = useState<any>(null);
  const [disclosureResponses, setDisclosureResponses] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        console.log('Loading draft data...');
        
        // Load company profile
        const profile = await getCompanyProfile();
        console.log('Company profile loaded:', profile);
        setCompanyProfile(profile);
        
        // Load disclosure responses directly from Supabase
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('User not authenticated:', userError);
          return;
        }

        console.log('Loading disclosure responses for user:', user.id);

        // Get user's organization
        const { data: userOrg } = await supabase
          .from('user_organizations')
          .select('organization_id')
          .eq('user_id', user.id)
          .maybeSingle();

        console.log('User organization:', userOrg);

        // Load disclosure responses for this user/organization
        const { data: responses, error: responsesError } = await supabase
          .from('disclosure_responses')
          .select('*')
          .eq('user_id', user.id)
          .in('disclosure_id', ['B1', 'B2']);

        if (responsesError) {
          console.error('Error loading disclosure responses:', responsesError);
        } else {
          console.log('Disclosure responses loaded:', responses);
          
          // Organize responses by disclosure_id
          const organizedResponses: any = {};
          responses?.forEach(response => {
            organizedResponses[response.disclosure_id] = response;
          });
          
          // Check if B2 response exists but doesn't have graphics recommendations
          const b2Response = organizedResponses.B2;
          if (b2Response && (!b2Response.graphics_recommendations || !b2Response.graphics_recommendations.hasCharts)) {
            console.log('B2 response found without graphics, generating recommendations...');
            await generateB2Graphics(b2Response, organizedResponses);
          }
          
          setDisclosureResponses(organizedResponses);
        }
        
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [getCompanyProfile]);

  const generateB2Graphics = async (b2Response: any, organizedResponses: any) => {
    try {
      console.log('Generating graphics for B2 disclosure...');
      
      // Get user metrics for B2
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's metrics that might be relevant for B2
      const { data: userResponses } = await supabase
        .from('vsme_user_responses')
        .select(`
          *,
          consol!inner(*)
        `)
        .eq('user_id', user.id);

      console.log('User responses for graphics:', userResponses);

      // Find VSME.B2.26 metric specifically
      const b226Metric = userResponses?.find(response => 
        response.consol?.novata_reference === 'VSME.B2.26'
      );

      let metricsForB2 = [];
      if (b226Metric) {
        metricsForB2.push({
          metric: b226Metric.consol?.metric || 'Practices, policies and future initiatives for transitioning towards a more sustainable economy',
          novataReference: 'VSME.B2.26',
          responseData: b226Metric.response_data
        });
      }

      console.log('Calling recommend-graphics function for B2...');
      
      // Call the recommend-graphics function
      const { data: graphicsData, error: graphicsError } = await supabase.functions.invoke('recommend-graphics', {
        body: {
          disclosureId: 'B2',
          disclosureTitle: 'Practices, policies and future initiatives for transitioning towards a more sustainable economy',
          disclosureDescription: 'Practices, policies and future initiatives for transitioning towards a more sustainable economy',
          metrics: metricsForB2,
          allMetrics: userResponses || []
        }
      });

      if (graphicsError) {
        console.error('Error generating graphics recommendations:', graphicsError);
        return;
      }

      console.log('Graphics recommendations generated:', graphicsData);

      if (graphicsData && graphicsData.hasCharts) {
        // Update the disclosure response with graphics recommendations
        const { error: updateError } = await supabase
          .from('disclosure_responses')
          .update({
            graphics_recommendations: graphicsData
          })
          .eq('user_id', user.id)
          .eq('disclosure_id', 'B2');

        if (updateError) {
          console.error('Error updating disclosure response with graphics:', updateError);
        } else {
          console.log('Successfully updated B2 response with graphics recommendations');
          // Update local state
          organizedResponses.B2 = {
            ...b2Response,
            graphics_recommendations: graphicsData
          };
        }
      }
    } catch (error) {
      console.error('Error in generateB2Graphics:', error);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // Get disclosure responses
  const b1Response = disclosureResponses.B1;
  const b2Response = disclosureResponses.B2;

  const tableOfContents = [
    { page: 3, title: "B1 - General Information - Basis for Preparation" },
    { page: 4, title: "B2 - Practices, Policies and Future Initiatives" }
  ];

  const renderCoverPage = () => (
    <div className="h-full flex flex-col justify-center items-center text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Sustainability Disclosure Report
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700">
          {companyProfile?.name || "Company Name"}
        </h2>
        <p className="text-lg text-gray-600">
          Reporting Period: {companyProfile?.fiscal_year_end ? 
            new Date(companyProfile.fiscal_year_end).getFullYear() : 
            new Date().getFullYear()}
        </p>
      </div>
      
      <div className="mt-16 space-y-2 text-sm text-gray-500">
        <p>Prepared in accordance with</p>
        <p className="font-medium">VSME Standards</p>
      </div>
    </div>
  );

  const renderTableOfContents = () => (
    <div className="h-full space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Table of Contents</h1>
      </div>
      
      <div className="space-y-4">
        {tableOfContents.map((item) => (
          <div 
            key={item.page}
            className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
            onClick={() => goToPage(item.page)}
          >
            <span className="text-gray-700 hover:text-primary">{item.title}</span>
            <span className="text-gray-500 font-mono">{item.page}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderB1Page = () => (
    <div className="h-full space-y-6 overflow-y-auto">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          B1 - General Information - Basis for Preparation
        </h1>
      </div>
      
      <div className="space-y-4">
        {b1Response ? (
          <div className="prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: b1Response.response_content }} />
          </div>
        ) : (
          <div className="text-gray-500 italic">
            No B1 disclosure response available. Please generate the disclosure response first.
          </div>
        )}
      </div>
    </div>
  );

  const renderB2Page = () => (
    <div className="h-full space-y-6 overflow-y-auto">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          B2 - Practices, Policies and Future Initiatives
        </h1>
      </div>
      
      <div className="space-y-6">
        {b2Response ? (
          <>
            <div className="prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ __html: b2Response.response_content }} />
            </div>
            
            {/* Render B2 Graphics if available */}
            {b2Response.graphics_recommendations?.hasCharts && b2Response.graphics_recommendations.charts && (
              <div className="space-y-6">
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Supporting Graphics</h3>
                  {b2Response.graphics_recommendations.charts.map((chart: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-lg mb-6">
                      <ChartRenderer 
                        chartType={chart.chartType}
                        data={chart.data}
                        title={chart.title}
                        description={chart.description}
                        originalColumnOrder={chart.originalColumnOrder}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Show message if no graphics are available but we expected some */}
            {(!b2Response.graphics_recommendations || !b2Response.graphics_recommendations.hasCharts) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> Graphics recommendations for B2 disclosure are not yet available. 
                  Graphics will be automatically generated when you visit the B2 disclosure page and generate the response with graphics.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-gray-500 italic">
            No B2 disclosure response available. Please generate the disclosure response first.
          </div>
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading draft report...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Navigation Controls */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        
        <Button
          variant="outline"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* 8.5 x 11 Viewer */}
      <Card className="shadow-lg">
        <CardContent className="p-0">
          <div 
            className="bg-white border border-gray-300 shadow-xl mx-auto"
            style={{
              width: '8.5in',
              height: '11in',
              minHeight: '11in',
              maxWidth: '100%',
              aspectRatio: '8.5 / 11'
            }}
          >
            <div className="p-8 h-full flex flex-col">
              {/* Page Content */}
              <div className="flex-1 overflow-hidden">
                {currentPage === 1 && renderCoverPage()}
                {currentPage === 2 && renderTableOfContents()}
                {currentPage === 3 && renderB1Page()}
                {currentPage === 4 && renderB2Page()}
              </div>

              {/* Page Footer - Only show on content pages */}
              {currentPage > 1 && (
                <div className="border-t border-gray-200 pt-4 mt-6">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Sustainability Disclosure Report</span>
                    <span>Page {currentPage} of {totalPages}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Page Navigation (Bottom) */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPage(page)}
            className="w-8 h-8"
          >
            {page}
          </Button>
        ))}
      </div>
    </div>
  );
};
