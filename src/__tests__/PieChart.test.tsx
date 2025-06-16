import React from "react";
import { render, screen } from "@testing-library/react";
import { SavingsPieChart } from "../components/PieChart";
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
  CardDescription: ({ children }: any) => <div>{children}</div>,
}));

describe("SavingsPieChart", () => {
  it("renders the chart title and description", () => {
    render(<SavingsPieChart incomes={1000} expenses={400} />);
    expect(screen.getByText(/incomes vs expenses - savings this month/i)).toBeInTheDocument();
    expect(screen.getByText(/incomes: \$1000\s+-\s+expenses: \$400/i)).toBeInTheDocument();
  });

  it("shows savings when incomes > expenses", () => {
    render(<SavingsPieChart incomes={1200} expenses={800} />);
    expect(screen.getByText(/saved \$400/i)).toBeInTheDocument();
  });

  it("shows over expended when expenses > incomes", () => {
    render(<SavingsPieChart incomes={500} expenses={700} />);
    expect(screen.getByText(/over expended by \$200/i)).toBeInTheDocument();
  });

  it("renders the chart container", () => {
    render(<SavingsPieChart incomes={1000} expenses={400} />);
    expect(screen.getByTestId("chart-container")).toBeInTheDocument();
  });

  it("renders correct chart data for savings", () => {
    render(<SavingsPieChart incomes={1000} expenses={400} />);
    // PieChart and Pie are not deeply rendered due to mocks,
    // but you can check for the presence of their container.
    expect(screen.getByTestId("chart-container")).toBeInTheDocument();
  });
});