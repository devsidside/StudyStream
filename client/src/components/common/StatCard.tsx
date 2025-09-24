import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  description: string;
  valueColor?: string;
  iconBgColor?: string;
  className?: string;
  testId?: string;
}

export default function StatCard({
  icon,
  value,
  label,
  description,
  valueColor = "text-primary",
  iconBgColor = "bg-primary/10",
  className,
  testId
}: StatCardProps) {
  return (
    <div className={cn("bg-card rounded-2xl p-8 hover-lift border border-border", className)}>
      <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mb-6", iconBgColor)}>
        {icon}
      </div>
      <h3 className={cn("text-4xl font-bold mb-2", valueColor)} data-testid={testId}>
        {value}
      </h3>
      <p className="text-lg font-semibold mb-2">{label}</p>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}