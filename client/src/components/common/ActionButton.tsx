import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionButtonProps {
  icon: LucideIcon;
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  testId?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export default function ActionButton({
  icon: Icon,
  children,
  onClick,
  variant = "default",
  size = "default",
  className,
  testId,
  disabled = false,
  type = "button"
}: ActionButtonProps) {
  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={cn("", className)}
      data-testid={testId}
    >
      <Icon className="w-4 h-4 mr-1" />
      {children}
    </Button>
  );
}