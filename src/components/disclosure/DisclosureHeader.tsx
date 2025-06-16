
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, Save, Edit, Trash2 } from "lucide-react";

interface Disclosure {
  id: string;
  title: string;
  description: string;
}

interface DisclosureHeaderProps {
  disclosure: Disclosure;
  response: string;
  isGenerating: boolean;
  isRecommendingGraphics: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  isEditing: boolean;
  showGraphicsButton: boolean;
  onGenerateResponse: () => void;
  onRecommendGraphics: () => void;
  onSave: () => void;
  onEdit: () => void;
  onSaveEdit: () => void;
  onClear: () => void;
}

export const DisclosureHeader = ({
  disclosure,
  response,
  isGenerating,
  isRecommendingGraphics,
  isSaving,
  hasUnsavedChanges,
  isEditing,
  showGraphicsButton,
  onGenerateResponse,
  onRecommendGraphics,
  onSave,
  onEdit,
  onSaveEdit,
  onClear
}: DisclosureHeaderProps) => {
  // Split title at hyphen for multi-line display
  const titleParts = disclosure.title.split(' - ');
  const mainTitle = titleParts[0];
  const subTitle = titleParts[1];

  return (
    <CardTitle className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm flex-shrink-0 mt-1">
          {disclosure.id}
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-lg text-primary leading-tight">
            {mainTitle}
          </span>
          {subTitle && (
            <span className="font-medium text-base text-muted-foreground leading-tight mt-1">
              {subTitle}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button 
          onClick={onGenerateResponse} 
          disabled={isGenerating} 
          className="flex items-center gap-2"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {isGenerating ? "Generating..." : "Generate Response"}
        </Button>
        {response && (
          <>
            <Button 
              onClick={onSave}
              disabled={isSaving || !hasUnsavedChanges}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? "Saving..." : hasUnsavedChanges ? "Save" : "Saved"}
            </Button>
            <Button 
              variant="outline"
              onClick={isEditing ? onSaveEdit : onEdit}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              {isEditing ? "Done Editing" : "Edit"}
            </Button>
            <Button 
              variant="outline"
              onClick={onClear}
              className="flex items-center gap-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          </>
        )}
      </div>
    </CardTitle>
  );
};
