import { Card, CardContent } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatItem {
  title: string;
  value: string;
  icon: LucideIcon;
  change?: string;
  bgColor?: string;
}

interface StatsCardsProps {
  stats: StatItem[];
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-blush/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-espresso/60">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-espresso">{stat.value}</p>
                {stat.change && (
                  <p className="text-xs text-deep-olive">{stat.change}</p>
                )}
              </div>
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full",
                  stat.bgColor ?? "bg-champagne-gold/10"
                )}
              >
                <stat.icon className="h-6 w-6 text-champagne-gold" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
