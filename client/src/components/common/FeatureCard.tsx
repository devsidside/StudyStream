import { ReactNode } from "react";
import { cn } from "@/utils/utils";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  iconBgColor?: string;
  className?: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  iconBgColor = "bg-primary/10",
  className
}: FeatureCardProps) {
  return (
    <div className={cn("flex items-start space-x-4", className)}>
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1", iconBgColor)}>
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}