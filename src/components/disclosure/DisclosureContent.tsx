
import { Textarea } from "@/components/ui/textarea";
import { DisclosureTimestamps } from "./DisclosureTimestamps";

interface DisclosureContentProps {
  disclosure: { id: string; title: string; description: string };
  response: string;
  isEditing: boolean;
  hasUnsavedChanges: boolean;
  lastGeneratedAt: Date | null;
  lastSavedAt: Date | null;
  onResponseChange: (value: string) => void;
}

export const DisclosureContent = ({
  disclosure,
  response,
  isEditing,
  hasUnsavedChanges,
  lastGeneratedAt,
  lastSavedAt,
  onResponseChange
}: DisclosureContentProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Textarea 
          placeholder={`Enter or generate disclosure response for ${disclosure.title}...`}
          value={response}
          onChange={(e) => onResponseChange(e.target.value)}
          className="min-h-[200px] resize-y"
          readOnly={!isEditing && response !== ""}
        />
        {hasUnsavedChanges && response && (
          <p className="text-sm text-red-600 mt-2">
            You have unsaved changes. Click "Save" to preserve your work.
          </p>
        )}
        <DisclosureTimestamps
          lastGeneratedAt={lastGeneratedAt}
          lastSavedAt={lastSavedAt}
          hasUnsavedChanges={hasUnsavedChanges}
        />
      </div>
    </div>
  );
};
