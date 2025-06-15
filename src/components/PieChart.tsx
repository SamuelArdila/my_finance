"use client"

import { Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useTheme } from "next-themes"

export const description = "A pie chart with a label"

const chartData = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
    { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
    { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    chrome: {
        label: "Chrome",
        color: "var(--chart-1)",
    },
    safari: {
        label: "Safari",
        color: "var(--chart-2)",
    },
    firefox: {
        label: "Firefox",
        color: "var(--chart-3)",
    },
    edge: {
        label: "Edge",
        color: "var(--chart-4)",
    },
    other: {
        label: "Other",
        color: "var(--chart-5)",
    },
} satisfies ChartConfig

interface SavingsPieChartProps {
    incomes: number;
    expenses: number;
}

export function SavingsPieChart({ incomes, expenses }: Readonly<SavingsPieChartProps>) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const savings = incomes - expenses;

    const isOverSpent = expenses > incomes;

    const savingsValue = Math.abs(incomes - expenses);

    const calExpenses = isOverSpent ? incomes : expenses;

    let savingsFillColor;

    if (isOverSpent) {
        savingsFillColor = isDark ? "#f87171" : "#ef4444"; // rojo
    } else {
        savingsFillColor = isDark ? "#60a5fa" : "#2563eb"; // azul
    }


    const chartData = [
        {
            name: "Expenses",
            value: calExpenses,
            fill: isDark ? "#1e40af" : "#3b82f6", // azul
        },
        {
            name: isOverSpent ? "Over Expense" : "Savings",
            value: savingsValue,
            fill: savingsFillColor,
        },
    ];


    return (
        <Card className="flex flex-col h-full w-full">
            <CardHeader className="pb-0">
                <CardTitle>Incomes vs Expenses - Savings this Month</CardTitle>
                <CardDescription>{`Incomes: $${incomes}  -  Expenses: $${expenses}`}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex justify-center items-center min-h-0 p-0">
                <ChartContainer
                    config={chartConfig}
                    className="w-full max-w-[300px] aspect-square"
                >
                    <PieChart width={300} height={300}>
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <Pie data={chartData} dataKey="value" nameKey="name" />
                    </PieChart>
                </ChartContainer>
            </CardContent>

            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    {isOverSpent
                        ? `Over expended by $${Math.abs(savings)}`
                        : `Saved $${savings}`}
                </div>
            </CardFooter>
        </Card>
    );
}
