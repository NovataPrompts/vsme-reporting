
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";

type ReportStatusDropdownProps = {
  status: string;
  reportId: string;
  onStatusChange: (reportId: string, newStatus: string) => void;
};

const ReportStatusDropdown = ({ 
  status, 
  reportId, 
  onStatusChange 
}: ReportStatusDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="rounded-full bg-[#f9fafb] hover:bg-[#f9fafb] flex gap-1 items-center px-3 py-1 h-auto text-xs border border-gray-200"
        >
          {status}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => onStatusChange(reportId, 'Draft')}>
          Draft
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange(reportId, 'Published')}>
          Published
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange(reportId, 'Archived')}>
          Archived
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ReportStatusDropdown;
