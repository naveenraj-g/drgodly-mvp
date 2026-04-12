"use client";

import { Card } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  Legend,
  Bar,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type AppointmentChartProps = {
  name: string;
  appointment: number;
  completed: number;
}[];

interface DataProps {
  data: AppointmentChartProps;
}

export const AppoinmentChart = ({ data }: DataProps) => {
  return (
    <Card className="rounded-xl p-4 h-full">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-lg font-semibold">Appointments</h1>
      </div>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} barSize={24}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--border)"
          />

          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted-foreground)" }}
          />

          <YAxis
            allowDecimals={false}
            // tickCount={5}
            tickFormatter={(value) => value.toString()}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted-foreground)" }}
          />

          <Tooltip
            contentStyle={{
              borderRadius: "0.5rem",
              backgroundColor: "var(--popover)",
              border: "1px solid var(--border)",
              color: "var(--popover-foreground)",
            }}
          />

          <Legend
            align="left"
            verticalAlign="top"
            wrapperStyle={{
              paddingTop: "16px",
              paddingBottom: "32px",
              textTransform: "capitalize",
              color: "var(--foreground)",
            }}
          />

          <Bar
            dataKey="appointment"
            fill="var(--muted-foreground)"
            legendType="circle"
            radius={[8, 8, 0, 0]}
          />

          <Bar
            dataKey="completed"
            fill="var(--primary)"
            legendType="circle"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
