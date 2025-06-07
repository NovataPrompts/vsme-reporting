
import { Header } from "@/components/layout/Header";
import { QuickNav } from "@/components/navigation/QuickNav";
import { DisclosureBox } from "@/components/disclosure/DisclosureBox";

const Disclosure = () => {
  const disclosures = [
    {
      id: "B1",
      title: "B1 - Basis for Preparation",
      description: "Basis for preparation of sustainability information"
    },
    {
      id: "B2", 
      title: "B2 - Governance",
      description: "Governance processes, controls and procedures"
    },
    {
      id: "B3",
      title: "B3 - Strategy", 
      description: "Strategy and business model"
    },
    {
      id: "B4",
      title: "B4 - Impact, Risk and Opportunity Management",
      description: "Impact, risk and opportunity management processes"
    },
    {
      id: "B5",
      title: "B5 - Metrics and Targets",
      description: "Metrics and targets used to measure and manage impacts, risks and opportunities"
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
