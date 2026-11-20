"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatCents } from "@/lib/format";

type Point = { month: string; bookings: number; revenueCents?: number; earningsCents?: number };

function monthLabel(month: string) {
  const [year, value] = month.split("-");
  const date = new Date(Number(year), Number(value) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "short" });
}

export function MonthlyChart({
  data,
  metric,
}: {
  data: Point[];
  metric: "bookings" | "revenue";
}) {
  const isRevenue = metric === "revenue";
  const config = {
    value: {
      label: isRevenue ? "Revenue" : "Bookings",
      color: isRevenue ? "#e4572e" : "#17493a",
    },
  } satisfies ChartConfig;

  const points = data.map((entry) => ({
    month: monthLabel(entry.month),
    value: isRevenue
      ? (entry.revenueCents ?? entry.earningsCents ?? 0) / 100
      : entry.bookings,
  }));

  return (
    <ChartContainer config={config} className="h-64 w-full">
      <BarChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={48}
          fontSize={12}
          tickFormatter={(value: number) =>
            isRevenue ? `$${value >= 1000 ? `${Math.round(value / 1000)}k` : value}` : String(value)
          }
        />
        <ChartTooltip
          cursor={{ fill: "var(--muted)" }}
          content={
            <ChartTooltipContent
              formatter={(value) =>
                isRevenue
                  ? formatCents(Number(value) * 100)
                  : `${Number(value)} booking${Number(value) === 1 ? "" : "s"}`
              }
            />
          }
        />
        <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
