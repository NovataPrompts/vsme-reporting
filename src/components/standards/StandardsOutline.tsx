
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const StandardsOutline = () => {
  return (
    <Card className="shadow-sm glass-card">
      <CardHeader>
        <div className="mb-2">
          <span className="text-[#00f5f3] font-medium">BASIC</span>
        </div>
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
  );
};
