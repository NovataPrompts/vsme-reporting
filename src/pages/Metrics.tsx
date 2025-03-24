import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Briefcase, 
  Users, 
  Activity, 
  FileText, 
  Info, 
  Save
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Metrics = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const metricCategories = [
    {
      id: "general",
      name: "General Information",
      description: "General information about your organization's sustainability approach",
      icon: FileText,
      metrics: [
        { id: "g1", name: "Organization Details", description: "Basic information about your organization" },
        { id: "g2", name: "Materiality Assessment", description: "Key sustainability topics for your organization" },
        { id: "g3", name: "Sustainability Governance", description: "How sustainability is managed within your organization" },
        { id: "g4", name: "Stakeholder Engagement", description: "How you engage with stakeholders on sustainability matters" }
      ]
    },
    {
      id: "environmental",
      name: "Environmental Standards",
      description: "Metrics related to your environmental impact and initiatives",
      icon: Briefcase,
      metrics: [
        { id: "e1", name: "Energy Consumption", description: "Total energy used within your organization" },
        { id: "e2", name: "GHG Emissions", description: "Direct and indirect greenhouse gas emissions" },
        { id: "e3", name: "Water Usage", description: "Total water withdrawal and discharge" },
        { id: "e4", name: "Waste Management", description: "Total waste generated and disposal methods" },
        { id: "e5", name: "Resource Efficiency", description: "Measures to improve resource efficiency" },
        { id: "e6", name: "Biodiversity", description: "Impact on biodiversity and conservation efforts" }
      ]
    },
    {
      id: "social",
      name: "Social Standards",
      description: "Metrics related to your social impact and initiatives",
      icon: Users,
      metrics: [
        { id: "s1", name: "Employee Wellbeing", description: "Measures to ensure employee health and safety" },
        { id: "s2", name: "Diversity and Inclusion", description: "Workforce diversity metrics and initiatives" },
        { id: "s3", name: "Training and Development", description: "Investment in employee skills and knowledge" },
        { id: "s4", name: "Community Engagement", description: "Activities that benefit local communities" },
        { id: "s5", name: "Human Rights", description: "Measures to respect and protect human rights" }
      ]
    },
    {
      id: "governance",
      name: "Governance Standards",
      description: "Metrics related to your governance structures and practices",
      icon: Activity,
      metrics: [
        { id: "g1", name: "Business Ethics", description: "Anti-corruption and ethical business practices" },
        { id: "g2", name: "Supply Chain Management", description: "Sustainability criteria in supply chain management" },
        { id: "g3", name: "Risk Management", description: "Identification and management of sustainability risks" },
        { id: "g4", name: "Policy Compliance", description: "Compliance with environmental and social regulations" }
      ]
    }
  ];

  const allMetrics = metricCategories.flatMap(category => 
    category.metrics.map(metric => ({
      ...metric,
      category: category.name,
      categoryId: category.id
    }))
  );

  const filteredMetrics = searchQuery
    ? allMetrics.filter(metric => 
        metric.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        metric.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        metric.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSaveMetric = (metricName: string) => {
    toast({
      title: "Metric Saved",
      description: `${metricName} data has been saved successfully.`,
      duration: 3000,
    });
  };

  const handleLearnMore = (metricName: string) => {
    toast({
      title: "Learn More",
      description: `Additional information about ${metricName} will be available soon.`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Metrics</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Collect, manage, and report on your VSME sustainability metrics
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-3">
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search metrics..." 
                    className="pl-10 rounded-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {searchQuery && (
                  <div className="mt-4">
                    <h2 className="text-lg font-medium mb-3">Search Results</h2>
                    <Card className="shadow-sm">
                      <CardContent className="p-0">
                        <div className="grid grid-cols-1 divide-y divide-gray-200 dark:divide-gray-700">
                          {filteredMetrics.length > 0 ? (
                            filteredMetrics.map((metric) => (
                              <div key={metric.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all-ease">
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                                        {metric.category}
                                      </span>
                                    </div>
                                    <h3 className="font-medium mt-1">{metric.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{metric.description}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="flex gap-1 items-center text-xs"
                                      onClick={() => handleLearnMore(metric.name)}
                                    >
                                      <Info className="h-3 w-3" />
                                      <span>Learn More</span>
                                    </Button>
                                    <Button 
                                      size="sm"
                                      className="flex gap-1 items-center text-xs bg-accent hover:bg-accent/90 text-primary"
                                      onClick={() => handleSaveMetric(metric.name)}
                                    >
                                      <Save className="h-3 w-3" />
                                      <span>Enter Data</span>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-8 text-center">
                              <p className="text-gray-500 dark:text-gray-400">No metrics found matching your search criteria.</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              <Tabs defaultValue="general" className="space-y-4">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="general">General Information</TabsTrigger>
                  <TabsTrigger value="environmental">Environmental</TabsTrigger>
                  <TabsTrigger value="social">Social</TabsTrigger>
                  <TabsTrigger value="governance">Governance</TabsTrigger>
                </TabsList>

                {metricCategories.map((category) => (
                  <TabsContent key={category.id} value={category.id} className="mt-0 space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <category.icon className="h-5 w-5" />
                          <span>{category.name}</span>
                        </CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="grid grid-cols-1 divide-y divide-gray-200 dark:divide-gray-700">
                          {category.metrics.map((metric) => (
                            <div key={metric.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all-ease">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                  <h3 className="font-medium">{metric.name}</h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">{metric.description}</p>
                                </div>
                                <div className="flex items-center gap-2 self-end sm:self-auto">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="flex gap-1 items-center"
                                    onClick={() => handleLearnMore(metric.name)}
                                  >
                                    <Info className="h-4 w-4" />
                                    <span>Learn More</span>
                                  </Button>
                                  <Button 
                                    size="sm"
                                    className="flex gap-1 items-center bg-accent hover:bg-accent/90 text-primary"
                                    onClick={() => handleSaveMetric(metric.name)}
                                  >
                                    <Save className="h-4 w-4" />
                                    <span>Enter Data</span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Metrics;
