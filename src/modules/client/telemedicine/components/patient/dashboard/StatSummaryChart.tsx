"use client";

import { Button } from "@/components/ui/button";
import { formatNumber } from "@/modules/shared/helper";
import { Users } from "lucide-react";
import Link from "next/link";
import { ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";

export const StatSummaryChart = ({
  data,
  total,
}: {
  data: any;
  total: number;
}) => {
  const dataInfo = [
    {
      name: "Total",
      count: total || 0,
      fill: "var(--card)",
    },
    {
      name: "Pending",
      count: data?.PENDING + data?.SCHEDULED + data?.RESCHEDULED || 0,
      fill: "var(--foreground)",
    },
    {
      name: "Completed",
      count: data?.COMPLETED || 0,
      fill: "var(--primary)",
    },
  ];

  const appointment = dataInfo[1].count;
  const consultation = dataInfo[2].count;

  return (
    <div className="rounded-xl w-full h-full">
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <h1 className="text-lg font-semibold">Appointments Summary</h1>

        <Button
          asChild
          size="sm"
          variant="outline"
          className="font-normal text-xs bg-transparent p-2 h-0 hover:underline border-0 shadow-none hover:bg-transparent"
        >
          <Link href="/bezs/telemedicine/patient/appointments">
            See details
          </Link>
        </Button>
      </div>

      <div className="relative w-full h-[75%]">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={dataInfo}
          >
            <RadialBar
              background={{ fill: "var(--border)" }}
              dataKey="count"
              cornerRadius={999}
              isAnimationActive
            />
          </RadialBarChart>
        </ResponsiveContainer>

        <Users
          size={40}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ color: "var(--muted-foreground)" }}
        />
      </div>

      <div className="flex justify-center flex-wrap md:flex-nowrap gap-4 xs:gap-16">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: "var(--foreground)" }}
            />
            <h1 className="font-bold">{formatNumber(appointment)}</h1>
          </div>
          <h2 className="text-xs text-muted-foreground">
            {dataInfo[1].name} (
            {((appointment / (appointment + consultation)) * 100).toFixed(0)}%)
          </h2>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: "var(--primary)" }}
            />
            <h1 className="font-bold">{formatNumber(consultation)}</h1>
          </div>
          <h2 className="text-xs text-muted-foreground">
            {dataInfo[2].name} (
            {((consultation / (appointment + consultation)) * 100).toFixed(0)}%)
          </h2>
        </div>
      </div>
    </div>
  );
};
