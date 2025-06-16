"use client"

import { RadialBar, RadialBarChart, LabelList, PolarAngleAxis } from "recharts"
import React from "react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"
import { useTheme } from "next-themes"

interface RadialChartProps {
  incomes: number;
  expenses: number;
  savings: number;
  goals: number;
}

const chartConfig = {
  savings: {
    label: "savings",
  },
  projected: {
    label: "expenses",
  },
} satisfies ChartConfig;

export function GoalsRadialChart({
  incomes,
  expenses,
  savings,
  goals,
}: Readonly<RadialChartProps>) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const projectedSavings = savings + (incomes - expenses)

  const chartData = [
    {
      name: "savings",
      value: Math.min(savings, goals),
      fill: isDark ? "#60a5fa" : "#2563eb",
    },
    {
      name: "projected",
      value: Math.min(projectedSavings, goals),
      fill: isDark ? "#4ade80" : "#22c55e",
    },
  ];

  return (
    <Card className="flex flex-col h-full w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Progress to Goals</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0 flex justify-center items-center">
        <ChartContainer config={chartConfig} className="aspect-square w-[80%] max-w-[300px]">
          <RadialBarChart
            innerRadius="60%"
            outerRadius="100%"
            barSize={30}
            data={chartData}
            startAngle={270}
            endAngle={630}
          >
             <PolarAngleAxis
              type="number"
              domain={[0, goals]}
              angleAxisId={0}
              tick={false}
            />
            <ChartTooltip content={<ChartTooltipContent/>} />
            <RadialBar
              background
              dataKey="value"
              cornerRadius={10}
            >
              <LabelList
                position="insideStart"
                dataKey="name"
                className="fill-white capitalize mix-blend-luminosity"
                fontSize={11}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {projectedSavings >= goals
            ? "🎉 Goal achieved! You have made it to 100% or more."
            : `$${(goals - projectedSavings).toFixed(2)} more to achieve your goal.`}
        </div>
      </CardFooter>
    </Card>
  );
}
