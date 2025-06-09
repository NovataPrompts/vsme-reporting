
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const DraftViewer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5; // This can be dynamic based on actual content

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

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Navigation Controls */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={prevPage}
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
          onClick={nextPage}
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
              {/* Page Header */}
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Sustainability Disclosure Report
                </h1>
                <p className="text-sm text-gray-600 mt-2">
                  Draft Report - Page {currentPage}
                </p>
              </div>

              {/* Page Content */}
              <div className="flex-1 overflow-hidden">
                {currentPage === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        B1 - General Information - Basis for preparation
                      </h2>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        This disclosure provides the basis for preparation of sustainability information
                        in accordance with relevant standards and frameworks. Our organization follows
                        established methodologies for data collection and reporting.
                      </p>
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        B2 - Practices, policies and future initiatives
                      </h2>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Our organization has implemented comprehensive practices and policies
                        for transitioning towards a more sustainable economy. This includes
                        strategic initiatives focused on environmental stewardship.
                      </p>
                    </div>
                  </div>
                )}

                {currentPage === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        B3 - Energy and greenhouse gas emissions
                      </h2>
                      <p className="text-sm text-gray-700 leading-relaxed mb-4">
                        This section provides detailed metrics on energy consumption and
                        greenhouse gas emissions across our operations.
                      </p>
                      
                      {/* Placeholder for charts/tables */}
                      <div className="border border-gray-200 h-48 flex items-center justify-center bg-gray-50">
                        <p className="text-gray-500">Energy Consumption Chart</p>
                      </div>
                    </div>
                  </div>
                )}

                {currentPage === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        B4 - Pollution of air, water and soil
                      </h2>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Environmental impact metrics related to pollution prevention
                        and mitigation efforts across air, water, and soil resources.
                      </p>
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        B5 - Biodiversity
                      </h2>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Metrics and initiatives related to biodiversity conservation
                        and ecosystem protection within our operational footprint.
                      </p>
                    </div>
                  </div>
                )}

                {currentPage === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        B6 - Water
                      </h2>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Water usage and management metrics demonstrating our commitment
                        to responsible water stewardship and conservation.
                      </p>
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        B7 - Resource use, circular economy, and waste management
                      </h2>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Comprehensive metrics on resource efficiency, circular economy
                        practices, and waste reduction initiatives.
                      </p>
                    </div>
                  </div>
                )}

                {currentPage === 5 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        B8-B11 - Social and Governance Metrics
                      </h2>
                      <p className="text-sm text-gray-700 leading-relaxed mb-4">
                        Workforce characteristics, health and safety, remuneration,
                        and governance metrics including anti-corruption measures.
                      </p>
                      
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-medium text-gray-900">B8 - Workforce General Characteristics</h3>
                          <p className="text-sm text-gray-600">Employee demographics and diversity metrics</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">B9 - Health and Safety</h3>
                          <p className="text-sm text-gray-600">Workplace safety performance indicators</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">B10 - Remuneration and Training</h3>
                          <p className="text-sm text-gray-600">Compensation equity and professional development</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">B11 - Governance</h3>
                          <p className="text-sm text-gray-600">Anti-corruption and compliance metrics</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Page Footer */}
              <div className="border-t border-gray-200 pt-4 mt-6">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Sustainability Disclosure Report</span>
                  <span>Page {currentPage} of {totalPages}</span>
                </div>
              </div>
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
