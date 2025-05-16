
import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit, ArrowDownFromLine, File, LetterText, Link, Share2 } from "lucide-react";

type ReportActionButtonsProps = {
  reportId: string;
  status: string; // Added status prop
  onEditClick: (reportId: string) => void;
  onActionClick: (action: string, reportId: string) => void;
};

const ReportActionButtons = ({ 
  reportId, 
  status,
  onEditClick, 
  onActionClick 
}: ReportActionButtonsProps) => {
  // Determine if the report is archived or published
  const isArchived = status === 'Archived';
  const isPublished = status === 'Published';
  
  return (
    <div className="action-buttons flex space-x-1 justify-end">
      {/* Only show Edit button for non-published reports */}
      {!isPublished && !isArchived && (
        <Button 
          onClick={() => onEditClick(reportId)}
          variant="action"
          size="actionIcon"
          className="bg-[#077bc0] text-white hover:bg-[#077bc0]/90"
          title="Edit Report"
        >
          <Edit className="h-full w-full" />
        </Button>
      )}
      
      {/* Only show sharing buttons for published reports */}
      {isPublished && !isArchived && (
        <>
          <Button 
            onClick={() => onActionClick('pdf', reportId)}
            variant="action"
            size="actionIcon"
            title="Download PDF"
          >
            <ArrowDownFromLine className="h-full w-full" />
          </Button>
          <Button 
            onClick={() => onActionClick('google', reportId)}
            variant="action"
            size="actionIcon"
            title="Open in Google Docs"
          >
            <File className="h-full w-full" />
          </Button>
          <Button 
            onClick={() => onActionClick('word', reportId)}
            variant="action"
            size="actionIcon"
            title="Download Word Document"
          >
            <LetterText className="h-full w-full" />
          </Button>
          <Button 
            onClick={() => onActionClick('share', reportId)}
            variant="action" 
            size="actionIcon"
            title="Share Link"
          >
            <Link className="h-full w-full" />
          </Button>
          <Button 
            onClick={() => onActionClick('embed', reportId)}
            variant="action"
            size="actionIcon"
            title="Embed Code"
          >
            <Share2 className="h-full w-full" />
          </Button>
        </>
      )}
      
      {/* No buttons for archived reports */}
    </div>
  );
};

export default ReportActionButtons;
