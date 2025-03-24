
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
          The voluntary sustainability reporting standard for non-listed SMEs (VSME) is a reporting framework
          designed to make sustainability reporting accessible and efficient for small and medium-sized enterprises.
        </p>
        <p>
          The VSME standard provides a clear structure for SMEs to communicate their sustainability performance
          across environmental, social, and governance dimensions, enabling them to respond to market demands,
          enhance transparency, and drive sustainable practices.
        </p>
      </CardContent>
    </Card>
  );
};
