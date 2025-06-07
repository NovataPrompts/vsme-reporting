
import { Header } from "@/components/layout/Header";
import { QuickNav } from "@/components/navigation/QuickNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Disclosure = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Disclosure Information</h1>
            <p className="text-muted-foreground">
              Access detailed disclosure requirements and documentation for VSME standards.
            </p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>VSME Disclosure Framework</CardTitle>
                <CardDescription>
                  Comprehensive disclosure requirements for sustainable business practices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The VSME (Value Balancing Alliance's Framework for Very Small, Medium and Large Enterprises) 
                  disclosure framework provides standardized metrics and reporting requirements for companies 
                  to measure and disclose their environmental, social, and governance performance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Disclosure Categories</CardTitle>
                <CardDescription>
                  Key areas covered by the VSME disclosure requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-primary mb-2">Environmental Metrics</h3>
                    <p className="text-sm text-muted-foreground">
                      Energy consumption, greenhouse gas emissions, water usage, and waste management
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-primary mb-2">Social Metrics</h3>
                    <p className="text-sm text-muted-foreground">
                      Employee wellbeing, diversity, community impact, and human rights
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-primary mb-2">Governance Metrics</h3>
                    <p className="text-sm text-muted-foreground">
                      Board composition, executive compensation, and ethical business practices
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-primary mb-2">General Information</h3>
                    <p className="text-sm text-muted-foreground">
                      Company overview, business model, and strategic objectives
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>
                  Steps to begin your disclosure journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Review VSME Standards</h4>
                      <p className="text-sm text-muted-foreground">
                        Familiarize yourself with the disclosure requirements and metrics
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Collect Your Data</h4>
                      <p className="text-sm text-muted-foreground">
                        Gather the necessary information and metrics for each disclosure area
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Input Your Metrics</h4>
                      <p className="text-sm text-muted-foreground">
                        Use our platform to input and validate your disclosure data
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium">Generate Reports</h4>
                      <p className="text-sm text-muted-foreground">
                        Create comprehensive disclosure reports for stakeholders
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <QuickNav />
    </div>
  );
};

export default Disclosure;
