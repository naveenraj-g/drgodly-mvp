import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface IStepsChartProps {
  steps: {
    date: string;
    value: number;
  }[];
}

export function StepsChart({ steps }: IStepsChartProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Daily step count for the past week
      </p>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={steps}>
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
          <Bar dataKey="value" fill="var(--chart-2)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
