import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn("bg-card border border-border rounded-lg p-6 flex flex-col", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="text-3xl font-semibold">{value}</div>
      {trend && (
        <div className="mt-2 text-sm flex items-center">
          <span className={cn(
            trend.isPositive ? "text-emerald-500" : "text-destructive",
            "font-medium"
          )}>
            {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
          </span>
          <span className="text-muted-foreground ml-2">from last month</span>
        </div>
      )}
    </div>
  );
}
