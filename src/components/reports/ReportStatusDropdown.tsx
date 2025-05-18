
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
  // Define status-based styling
  const getStatusStyle = (currentStatus: string) => {
    switch (currentStatus) {
      case 'Published':
        return "bg-[#ebf7ed] text-[#147c30] border-[#a0e0b2]";
      case 'Draft':
        return "bg-[#f9fafb] text-gray-700 border-gray-200";
      case 'Archived':
        return "bg-[#f3f4f6] text-gray-500 border-gray-300";
      default:
        return "bg-[#f9fafb] border-gray-200";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`rounded-full flex gap-1 items-center px-3 py-1 h-auto text-xs ${getStatusStyle(status)}`}
        >
          {status}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="bg-white">
        <DropdownMenuItem 
          onClick={() => onStatusChange(reportId, 'Draft')}
          className="hover:bg-[#057cc1] hover:text-white"
        >
          Draft
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onStatusChange(reportId, 'Published')}
          className="hover:bg-[#057cc1] hover:text-white"
        >
          Published
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onStatusChange(reportId, 'Archived')}
          className="hover:bg-[#057cc1] hover:text-white"
        >
          Archived
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ReportStatusDropdown;
