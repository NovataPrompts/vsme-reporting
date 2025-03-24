
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const AboutVSME = () => {
  return (
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
  );
};
