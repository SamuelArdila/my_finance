import React from "react";
import { render, screen } from "@testing-library/react";
import { GoalsRadialChart } from "../components/RadialChart";
import { vi } from "vitest";

// Mock next-themes
vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light" }),
}));

// Mock ChartContainer and children to avoid rendering recharts internals
vi.mock("../components/ui/chart", () => ({
  ChartContainer: ({ children }: any) => <div data-testid="chart-container">{children}</div>,
  ChartTooltip: ({ children }: any) => <div>{children}</div>,
  ChartTooltipContent: ({ children }: any) => <div>{children}</div>,
}));

// Mock Card components
vi.mock("../components/ui/card", () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardFooter: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <div>{children}</div>,
}));

describe("GoalsRadialChart", () => {
  it("renders the chart title", () => {
    render(<GoalsRadialChart incomes={1000} expenses={400} savings={200} goals={1000} />);
    expect(screen.getByText(/progress to goals/i)).toBeInTheDocument();
  });

  it("shows the 'goal achieved' message when projectedSavings >= goals", () => {
    render(<GoalsRadialChart incomes={1000} expenses={0} savings={0} goals={1000} />);
    expect(screen.getByText(/goal achieved! you have made it to 100% or more/i)).toBeInTheDocument();
  });

  it("shows the remaining amount when projectedSavings < goals", () => {
    render(<GoalsRadialChart incomes={500} expenses={100} savings={100} goals={1000} />);
    expect(screen.getByText(/\$500\.00 more to achieve your goal\./i)).toBeInTheDocument();
  });

  it("renders the chart container", () => {
    render(<GoalsRadialChart incomes={1000} expenses={400} savings={200} goals={1000} />);
    expect(screen.getByTestId("chart-container")).toBeInTheDocument();
  });
});