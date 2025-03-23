
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface MobileMenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const MobileMenuToggle = ({ isOpen, onToggle }: MobileMenuToggleProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden rounded-full"
      onClick={onToggle}
    >
      {isOpen ? (
        <X className="h-6 w-6 text-primary dark:text-white" />
      ) : (
        <Menu className="h-6 w-6 text-primary dark:text-white" />
      )}
    </Button>
  );
};
