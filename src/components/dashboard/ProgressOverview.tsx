
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, FileText, Users, Briefcase, Activity } from "lucide-react";

export const ProgressOverview = () => {
  const progressData = [
    { id: 1, category: "General Disclosures", progress: 80, icon: FileText },
    { id: 2, category: "Social Standards", progress: 65, icon: Users },
    { id: 3, category: "Environmental Standards", progress: 45, icon: Briefcase },
    { id: 4, category: "Governance Standards", progress: 90, icon: Activity }
  ];

  return (
    <Card className="shadow-sm glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center justify-between">
          <span>Report Completion</span>
          <span className="text-sm text-accent font-normal flex items-center gap-1 cursor-pointer hover:underline">
            View All
            <ArrowUpRight className="h-3 w-3" />
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {progressData.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center">
                    <item.icon className="h-4 w-4 text-primary dark:text-white" />
                  </div>
                  <span className="text-sm font-medium">{item.category}</span>
                </div>
                <span className="text-sm font-medium">{item.progress}%</span>
              </div>
              <Progress value={item.progress} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
