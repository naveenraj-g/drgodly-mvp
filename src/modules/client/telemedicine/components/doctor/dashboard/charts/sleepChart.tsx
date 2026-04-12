import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ISleepChartProps {
  sleep: {
    date: string;
    value: number;
  }[];
}

export function SleepChart({ sleep }: ISleepChartProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Hours of sleep per night (past week)
      </p>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={sleep}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />

          <XAxis
            dataKey="date"
            stroke="var(--muted-foreground)"
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            tickLine={{ stroke: "var(--muted-foreground)" }}
            axisLine={{ stroke: "var(--muted-foreground)" }}
          />

          <YAxis
            stroke="var(--muted-foreground)"
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            tickLine={{ stroke: "var(--muted-foreground)" }}
            axisLine={{ stroke: "var(--muted-foreground)" }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              color: "var(--foreground)",
            }}
          />

          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--chart-1)"
            fill="var(--chart-1)"
            fillOpacity={0.3}
            activeDot={{ r: 4, stroke: "var(--card)", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
