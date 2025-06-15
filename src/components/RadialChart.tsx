"use client"

import { RadialBar, RadialBarChart, LabelList } from "recharts"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
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
      fill: isDark ? "#60a5fa" : "#2563eb", // azul
    },
    {
      name: "projected",
      value: Math.min(projectedSavings, goals),
      fill: isDark ? "#4ade80" : "#22c55e", // verde
    },
  ];

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Progress to Goals</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadialBarChart
            innerRadius={70}
            outerRadius={110}
            barSize={30}
            data={chartData}
            startAngle={270}
            endAngle={630}
          >
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
            ? "🎉 ¡Meta alcanzada! Has llegado al 100% o más."
            : `Faltan $${(goals - projectedSavings).toFixed(2)} para alcanzar la meta`}
        </div>
      </CardFooter>
    </Card>
  );
}
