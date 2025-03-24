
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Briefcase, 
  Users, 
  Activity
} from "lucide-react";
import { Metric, MetricCategory } from "@/types/metrics";

export const useMetrics = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  const metricCategories: MetricCategory[] = [
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

  const allMetrics: Metric[] = metricCategories.flatMap(category => 
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
        metric.category?.toLowerCase().includes(searchQuery.toLowerCase())
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

  return {
    searchQuery,
    setSearchQuery,
    metricCategories,
    filteredMetrics,
    handleSaveMetric,
    handleLearnMore
  };
};
