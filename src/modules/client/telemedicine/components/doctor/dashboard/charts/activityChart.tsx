import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface IActivityChartProps {
  activity: {
    date: string;
    value: number;
    activityName?: string;
  }[];
}

export function ActivityChart({ activity }: IActivityChartProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Active minutes per day (past week)
      </p>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={activity}>
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
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const entry = payload[0];
              const activityName = (entry.payload as { activityName?: string })?.activityName;
              return (
                <div
                  style={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    color: "var(--foreground)",
                    padding: "8px 12px",
                    fontSize: 12,
                  }}
                >
                  <p style={{ marginBottom: 4, fontWeight: 600 }}>Day: {label}</p>
                  <p>{entry.value} min active</p>
                  {activityName && (
                    <p style={{ color: "var(--muted-foreground)", marginTop: 2, textTransform: "capitalize" }}>
                      {activityName.charAt(0) + activityName.slice(1).toLowerCase()}
                    </p>
                  )}
                </div>
              );
            }}
          />
          <Bar dataKey="value" fill="var(--chart-3)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
