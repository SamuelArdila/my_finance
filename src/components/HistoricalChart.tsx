"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useTheme } from "next-themes";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type SavingsData = {
  year: number
  month: number
  savings: number
}

const timeRanges = [
  { label: "Last 10 Years", value: "10y" },
  { label: "Last 5 Years", value: "5y" },
  { label: "Last Year", value: "1y" },
]

const formatDate = (year: number, month: number) => {
  const date = new Date(year, month - 1)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  })
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--color-desktop)",
  },
} satisfies ChartConfig

interface HistoricalChartProps {
  readonly data: readonly SavingsData[];
}

export function HistoricalChart({ data }: HistoricalChartProps) {
  const [timeRange, setTimeRange] = React.useState("1y")
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const strokeColor = isDark ? "#60a5fa" : "#2563eb";
  const fillGradient = isDark
    ? ["#60a5fa", "rgba(96, 165, 250, 0.1)"]
    : ["#2563eb", "rgba(37, 99, 235, 0.1)"];

  const filteredData = React.useMemo(() => {
    const today = new Date()
    const cutoffDate = new Date()
    const yearsToSubtract = parseInt(timeRange)
    cutoffDate.setFullYear(today.getFullYear() - yearsToSubtract)

    const filtered = data.filter(({ year, month }) => {
      const entryDate = new Date(year, month - 1)
      return entryDate >= cutoffDate
    })

    if (yearsToSubtract > 1) {
      const grouped = new Map<number, number>()
      filtered.forEach(({ year, savings }) => {
        grouped.set(year, (grouped.get(year) ?? 0) + savings)
      })

      return Array.from(grouped.entries())
        .sort(([a], [b]) => a - b)
        .map(([year, savings]) => ({
          label: year.toString(),
          savings,
        }))
    }

    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.year, a.month - 1)
      const dateB = new Date(b.year, b.month - 1)
      return dateA.getTime() - dateB.getTime()
    })

    return sorted.map((entry) => ({
      ...entry,
      label: formatDate(entry.year, entry.month),
    }))
  }, [data, timeRange])

  return (
    <Card className="flex flex-col h-full w-full">
  <CardHeader className="pb-0">
    <div className="flex justify-between items-center flex-wrap gap-2 mb-5">
      <div>
        <CardTitle>Historical Savings</CardTitle>
      </div>
      <CardAction>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {timeRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardAction>
    </div>
  </CardHeader>

  <CardContent className="flex-1 flex justify-center items-center min-h-0">
    <ChartContainer config={chartConfig} className="w-full h-full">
      {filteredData.length > 0 ? (
        <AreaChart data={filteredData}>
          <defs>
            <linearGradient id="fillSavings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={fillGradient[0]} stopOpacity={0.8} />
              <stop offset="95%" stopColor={fillGradient[1]} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(value) => value}
                indicator="dot"
              />
            }
          />
          <Area
            dataKey="savings"
            type="monotone"
            fill="url(#fillSavings)"
            stroke={strokeColor}
            strokeWidth={2}
          />
        </AreaChart>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">No hay datos de ahorro para este rango de tiempo.</p>
        </div>
      )}
    </ChartContainer>
  </CardContent>
</Card>

  )
}
