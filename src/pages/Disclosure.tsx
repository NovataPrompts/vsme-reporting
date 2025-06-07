
import { Header } from "@/components/layout/Header";
import { QuickNav } from "@/components/navigation/QuickNav";
import { DisclosureBox } from "@/components/disclosure/DisclosureBox";

const Disclosure = () => {
  const disclosures = [
    {
      id: "B1",
      title: "General Information - Basis for preparation",
      description: "Basis for preparation of sustainability information"
    },
    {
      id: "B2", 
      title: "General Information - Practices, policies and future initiatives for transitioning towards a more sustainable economy",
      description: "Practices, policies and future initiatives for transitioning towards a more sustainable economy"
    },
    {
      id: "B3",
      title: "Environment metrics - Energy and greenhouse gas emissions", 
      description: "Energy and greenhouse gas emissions metrics and disclosures"
    },
    {
      id: "B4",
      title: "Environment metrics - Pollution of air, water and soil",
      description: "Pollution of air, water and soil metrics and disclosures"
    },
    {
      id: "B5",
      title: "Environment metrics - Biodiversity",
      description: "Biodiversity metrics and disclosures"
    },
    {
      id: "B6",
      title: "Environment metrics - Water",
      description: "Water usage and management metrics and disclosures"
    },
    {
      id: "B7",
      title: "Environment metrics - Resource use, circular economy, and waste management",
      description: "Resource use, circular economy, and waste management metrics and disclosures"
    },
    {
      id: "B8",
      title: "Social metrics - Workforce - General Characteristics",
      description: "Workforce general characteristics metrics and disclosures"
    },
    {
      id: "B9",
      title: "Social metrics - Workforce - Health and Safety",
      description: "Workforce health and safety metrics and disclosures"
    },
    {
      id: "B10",
      title: "Social metrics - Workforce - Remuneration, collective bargaining and training",
      description: "Workforce remuneration, collective bargaining and training metrics and disclosures"
    },
    {
      id: "B11",
      title: "Governance metrics - Convictions and fines for corruption and bribery",
      description: "Governance metrics related to convictions and fines for corruption and bribery"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Disclosure Responses</h1>
            <p className="text-muted-foreground">
              Generate comprehensive disclosure responses based on your metrics data.
            </p>
          </div>

          <div className="grid gap-6">
            {disclosures.map((disclosure) => (
              <DisclosureBox
                key={disclosure.id}
                disclosure={disclosure}
              />
            ))}
          </div>
        </div>
      </main>
      <QuickNav />
    </div>
  );
};

export default Disclosure;
