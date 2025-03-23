
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ExternalLink, FileText, ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="general">
                  <AccordionTrigger className="px-4 py-3 bg-white dark:bg-primary/50 rounded-lg shadow-sm hover:no-underline">
                    <span className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-accent" />
                      <span className="font-medium">General Disclosures</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 mt-2 bg-white/70 dark:bg-primary/30 rounded-lg">
                    <div className="space-y-4">
                      <p className="text-sm">
                        General disclosures provide context for understanding an organization, its sustainability governance,
                        and engagement with stakeholders. These disclosures include:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex justify-between items-center p-2 hover:bg-white/80 dark:hover:bg-primary/40 rounded-md">
                          <div>
                            <span className="font-medium">Organization Details</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Basic information about your organization</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => handleInfoClick("Organization Details")}
                          >
                            <span>View</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </li>
                        <li className="flex justify-between items-center p-2 hover:bg-white/80 dark:hover:bg-primary/40 rounded-md">
                          <div>
                            <span className="font-medium">Materiality Assessment</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Key sustainability topics for your organization</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => handleInfoClick("Materiality Assessment")}
                          >
                            <span>View</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </li>
                        <li className="flex justify-between items-center p-2 hover:bg-white/80 dark:hover:bg-primary/40 rounded-md">
                          <div>
                            <span className="font-medium">Sustainability Governance</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">How sustainability is managed within your organization</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => handleInfoClick("Sustainability Governance")}
                          >
                            <span>View</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </li>
                        <li className="flex justify-between items-center p-2 hover:bg-white/80 dark:hover:bg-primary/40 rounded-md">
                          <div>
                            <span className="font-medium">Stakeholder Engagement</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">How you engage with stakeholders on sustainability matters</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => handleInfoClick("Stakeholder Engagement")}
                          >
                            <span>View</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="environmental" className="mt-4">
                  <AccordionTrigger className="px-4 py-3 bg-white dark:bg-primary/50 rounded-lg shadow-sm hover:no-underline">
                    <span className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Environmental Standards</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 mt-2 bg-white/70 dark:bg-primary/30 rounded-lg">
                    <div className="space-y-4">
                      <p className="text-sm">
                        Environmental standards address an organization's impact on living and non-living natural systems,
                        including land, air, water, and ecosystems. These standards include:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex justify-between items-center p-2 hover:bg-white/80 dark:hover:bg-primary/40 rounded-md">
                          <div>
                            <span className="font-medium">Energy Consumption</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total energy used within your organization</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => handleInfoClick("Energy Consumption")}
                          >
                            <span>View</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </li>
                        <li className="flex justify-between items-center p-2 hover:bg-white/80 dark:hover:bg-primary/40 rounded-md">
                          <div>
                            <span className="font-medium">GHG Emissions</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Direct and indirect greenhouse gas emissions</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => handleInfoClick("GHG Emissions")}
                          >
                            <span>View</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </li>
                        <li className="flex justify-between items-center p-2 hover:bg-white/80 dark:hover:bg-primary/40 rounded-md">
                          <div>
                            <span className="font-medium">Water Usage</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total water withdrawal and discharge</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => handleInfoClick("Water Usage")}
                          >
                            <span>View</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </li>
                        <li className="flex justify-between items-center p-2 hover:bg-white/80 dark:hover:bg-primary/40 rounded-md">
                          <div>
                            <span className="font-medium">Waste Management</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total waste generated and disposal methods</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => handleInfoClick("Waste Management")}
                          >
                            <span>View</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="social" className="mt-4">
                  <AccordionTrigger className="px-4 py-3 bg-white dark:bg-primary/50 rounded-lg shadow-sm hover:no-underline">
                    <span className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">Social Standards</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 mt-2 bg-white/70 dark:bg-primary/30 rounded-lg">
                    <div className="space-y-4">
                      <p className="text-sm">
                        Social standards address an organization's impact on the social systems within which it operates,
                        including employee and community relations. These standards include:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex justify-between items-center p-2 hover:bg-white/80 dark:hover:bg-primary/40 rounded-md">
                          <div>
                            <span className="font-medium">Employee Wellbeing</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Measures to ensure employee health and safety</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => handleInfoClick("Employee Wellbeing")}
                          >
                            <span>View</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </li>
                        <li className="flex justify-between items-center p-2 hover:bg-white/80 dark:hover:bg-primary/40 rounded-md">
                          <div>
                            <span className="font-medium">Diversity and Inclusion</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Workforce diversity metrics and initiatives</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => handleInfoClick("Diversity and Inclusion")}
                          >
                            <span>View</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </li>
                        <li className="flex justify-between items-center p-2 hover:bg-white/80 dark:hover:bg-primary/40 rounded-md">
                          <div>
                            <span className="font-medium">Training and Development</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Investment in employee skills and knowledge</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => handleInfoClick("Training and Development")}
                          >
                            <span>View</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </li>
                        <li className="flex justify-between items-center p-2 hover:bg-white/80 dark:hover:bg-primary/40 rounded-md">
                          <div>
                            <span className="font-medium">Community Engagement</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Activities that benefit local communities</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => handleInfoClick("Community Engagement")}
                          >
                            <span>View</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="governance" className="mt-4">
                  <AccordionTrigger className="px-4 py-3 bg-white dark:bg-primary/50 rounded-lg shadow-sm hover:no-underline">
                    <span className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-purple-500" />
                      <span className="font-medium">Governance Standards</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-3 mt-2 bg-white/70 dark:bg-primary/30 rounded-lg">
                    <div className="space-y-4">
                      <p className="text-sm">
                        Governance standards address an organization's leadership, ethics, and control systems.
                        These standards include:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex justify-between items-center p-2 hover:bg-white/80 dark:hover:bg-primary/40 rounded-md">
                          <div>
                            <span className="font-medium">Business Ethics</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Anti-corruption and ethical business practices</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => handleInfoClick("Business Ethics")}
                          >
                            <span>View</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </li>
                        <li className="flex justify-between items-center p-2 hover:bg-white/80 dark:hover:bg-primary/40 rounded-md">
                          <div>
                            <span className="font-medium">Supply Chain Management</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Sustainability criteria in supply chain management</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => handleInfoClick("Supply Chain Management")}
                          >
                            <span>View</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </li>
                        <li className="flex justify-between items-center p-2 hover:bg-white/80 dark:hover:bg-primary/40 rounded-md">
                          <div>
                            <span className="font-medium">Risk Management</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Identification and management of sustainability risks</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => handleInfoClick("Risk Management")}
                          >
                            <span>View</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </li>
                        <li className="flex justify-between items-center p-2 hover:bg-white/80 dark:hover:bg-primary/40 rounded-md">
                          <div>
                            <span className="font-medium">Policy Compliance</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Compliance with environmental and social regulations</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={() => handleInfoClick("Policy Compliance")}
                          >
                            <span>View</span>
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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

// CheckIcon component
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
