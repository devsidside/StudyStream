import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
  onClick?: () => void;
  className?: string;
  testId?: string;
}

export default function QuickActionCard({
  icon: Icon,
  title,
  description,
  color = "bg-primary",
  onClick,
  className,
  testId
}: QuickActionCardProps) {
  return (
    <Button
      variant="outline"
      className={cn(
        "h-auto p-4 flex-col space-y-2 hover-lift transition-all duration-300 hover:shadow-lg", 
        className
      )}
      onClick={onClick}
      data-testid={testId}
    >
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white", color)}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-center">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </Button>
  );
}