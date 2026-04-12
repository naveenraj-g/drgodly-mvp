import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface THeartRateChartProps {
  heartRate: {
    date: string;
    value: number;
  }[];
}

export function HeartRateChart({ heartRate }: THeartRateChartProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Average heart rate over the past week
      </p>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={heartRate}>
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
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--chart-1)"
            strokeWidth={2}
            dot={{ fill: "var(--chart-1)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
