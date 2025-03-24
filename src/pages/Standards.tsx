import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ExternalLink, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Standards = () => {
  const { toast } = useToast();

  const handleDownload = () => {
    window.open("https://www.efrag.org/sites/default/files/sites/webpublishing/SiteAssets/VSME%20Standard.pdf", "_blank");
  };

  const handleInfoClick = (section: string) => {
    toast({
      title: `${section} Information`,
      description: `Additional information about ${section} will be available soon.`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">VSME Sustainability Standard</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              A comprehensive guide to the European voluntary sustainability reporting standard for non-listed SMEs
            </p>
            <Button 
              onClick={handleDownload}
              className="bg-primary hover:bg-primary/90 text-white rounded-full flex items-center gap-2 mx-auto"
            >
              <Download className="h-4 w-4" />
              <span>Download Full Standard</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="shadow-sm glass-card mb-6">
                <CardHeader>
                  <CardTitle>About VSME Standard</CardTitle>
                  <CardDescription>
                    The voluntary sustainability reporting standard for non-listed SMEs (VSME)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    The voluntary sustainability reporting standard for non-listed SMEs (VSME) is a European reporting framework
                    designed to make sustainability reporting accessible and efficient for small and medium-sized enterprises.
                  </p>
                  <p>
                    The VSME standard provides a clear structure for SMEs to communicate their sustainability performance
                    across environmental, social, and governance dimensions, enabling them to respond to market demands,
                    enhance transparency, and drive sustainable practices.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge className="bg-secondary text-primary">Voluntary Standard</Badge>
                    <Badge variant="outline">European Framework</Badge>
                    <Badge variant="outline">SME-Focused</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm glass-card">
                <CardHeader>
                  <CardTitle>VSME Standard Outline</CardTitle>
                  <CardDescription>
                    Comprehensive overview of sustainability reporting requirements for SMEs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-24">Disclosure</TableHead>
                          <TableHead className="w-48">Topic</TableHead>
                          <TableHead className="w-64">Section</TableHead>
                          <TableHead>Sub-Section</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">B1</TableCell>
                          <TableCell>General Information</TableCell>
                          <TableCell>Basis for preparation</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">B2</TableCell>
                          <TableCell>General Information</TableCell>
                          <TableCell>Practices, policies and future initiatives</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">B3</TableCell>
                          <TableCell>Environment metrics</TableCell>
                          <TableCell>Energy and greenhouse gas emissions</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">B4</TableCell>
                          <TableCell>Environment metrics</TableCell>
                          <TableCell>Pollution of air, water and soil</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">B5</TableCell>
                          <TableCell>Environment metrics</TableCell>
                          <TableCell>Biodiversity</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">B6</TableCell>
                          <TableCell>Environment metrics</TableCell>
                          <TableCell>Water</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">B7</TableCell>
                          <TableCell>Environment metrics</TableCell>
                          <TableCell>Resource use, circular economy, and waste management</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">B8</TableCell>
                          <TableCell>Social metrics</TableCell>
                          <TableCell>Workforce</TableCell>
                          <TableCell>General Characteristics</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">B9</TableCell>
                          <TableCell>Social metrics</TableCell>
                          <TableCell>Workforce</TableCell>
                          <TableCell>Health and Safety</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">B10</TableCell>
                          <TableCell>Social metrics</TableCell>
                          <TableCell>Workforce</TableCell>
                          <TableCell>Remuneration, collective bargaining and training</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">B11</TableCell>
                          <TableCell>Governance metrics</TableCell>
                          <TableCell>Convictions and fines for corruption and bribery</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="shadow-sm glass-card">
                <CardHeader>
                  <CardTitle>Resources</CardTitle>
                  <CardDescription>
                    Additional resources to help you understand and implement the VSME standard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <a 
                      href="https://www.efrag.org/sites/default/files/sites/webpublishing/SiteAssets/VSME%20Standard.pdf" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-white/50 dark:bg-white/5 hover:bg-accent/10 rounded-lg border border-gray-200 dark:border-gray-700 transition-all-ease"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary dark:text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium">Official VSME Standard</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">PDF Document • 2.4 MB</p>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-between"
                      onClick={() => handleInfoClick("Implementation Guides")}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary dark:text-white" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium">Implementation Guides</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Step-by-step implementation instructions</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-between"
                      onClick={() => handleInfoClick("Webinars & Training")}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary dark:text-white" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium">Webinars & Training</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Educational videos and training materials</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-between"
                      onClick={() => handleInfoClick("Case Studies")}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary dark:text-white" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium">Case Studies</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Examples of successful VSME implementation</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm glass-card mt-6">
                <CardHeader>
                  <CardTitle>How We Can Help</CardTitle>
                  <CardDescription>
                    Let us assist you in creating compliant VSME sustainability reports
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">
                    Our platform simplifies the VSME reporting process by providing tools to collect,
                    manage, and present your sustainability data in a professional format that meets all standard requirements.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center">
                        <CheckIcon className="h-3 w-3 text-primary" />
                      </div>
                      <span>Automated data collection and validation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center">
                        <CheckIcon className="h-3 w-3 text-primary" />
                      </div>
                      <span>Compliant report templates and visualizations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center">
                        <CheckIcon className="h-3 w-3 text-primary" />
                      </div>
                      <span>Secure data sharing with stakeholders</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center">
                        <CheckIcon className="h-3 w-3 text-primary" />
                      </div>
                      <span>Year-over-year performance tracking</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const CheckIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default Standards;
