
import React, { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Link, Share2 } from "lucide-react";

export const shareReportSchema = z.object({
  reportId: z.string().min(1, "Please select a report")
});

export type ShareReportFormValues = z.infer<typeof shareReportSchema>;

export type AvailableReport = {
  id: string;
  title: string;
};

type ShareReportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ShareReportFormValues, shareType: "html" | "iframe") => void;
  availableReports: AvailableReport[];
  defaultReportId?: string;
};

const ShareReportDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  availableReports,
  defaultReportId 
}: ShareReportDialogProps) => {
  const [shareType, setShareType] = useState<"html" | "iframe">("html");
  
  const form = useForm<ShareReportFormValues>({
    resolver: zodResolver(shareReportSchema),
    defaultValues: {
      reportId: defaultReportId || ""
    }
  });

  const handleSubmit = (data: ShareReportFormValues) => {
    onSubmit(data, shareType);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share Report</DialogTitle>
          <DialogDescription>
            Create a shareable link for your sustainability report.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="reportId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Report</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a report to share" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableReports.map((report) => (
                        <SelectItem key={report.id} value={report.id}>
                          {report.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex flex-col space-y-1.5">
              <FormLabel>Sharing Format</FormLabel>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={shareType === "html" ? "default" : "outline"}
                  onClick={() => setShareType("html")}
                  className={`flex-1 ${shareType === "html" ? "bg-[#057cc1] hover:bg-[#057cc1]/90" : ""}`}
                >
                  <Link className="mr-2 h-4 w-4" />
                  HTML Link
                </Button>
                <Button
                  type="button"
                  variant={shareType === "iframe" ? "default" : "outline"}
                  onClick={() => setShareType("iframe")}
                  className={`flex-1 ${shareType === "iframe" ? "bg-[#057cc1] hover:bg-[#057cc1]/90" : "hover:bg-[#f9fafb]"}`}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Embed Code
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {shareType === "html" 
                  ? "Creates an HTML version that can be shared via URL" 
                  : "Creates code for embedding the report in other websites"}
              </p>
            </div>
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="hover:bg-[#f9fafb]"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-[#057cc1] hover:bg-[#057cc1]/90"
              >
                Create Link
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ShareReportDialog;
