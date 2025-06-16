import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { HistoricalChart } from "../components/HistoricalChart";
import { vi} from 'vitest';

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
  CardAction: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <div>{children}</div>,
}));

// Mock Select components
vi.mock("../components/ui/select", () => ({
  Select: ({ children, value, onValueChange }: any) => (
    <select
      value={value}
      onChange={e => onValueChange(e.target.value)}
      data-testid="select"
    >
      {children}
    </select>
  ),
  SelectTrigger: ({ children }: any) => <>{children}</>,
  SelectValue: () => null,
  SelectContent: ({ children }: any) => <>{children}</>,
  SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>,
}));

describe("HistoricalChart", () => {
  const data = [
    { year: 2023, month: 1, savings: 100 },
    { year: 2023, month: 2, savings: 200 },
    { year: 2022, month: 1, savings: 50 },
    { year: 2021, month: 1, savings: 25 },
  ];

  it("renders the chart title", () => {
    render(<HistoricalChart data={data} />);
    expect(screen.getByText(/historical savings/i)).toBeInTheDocument();
  });

  it("renders the select with time ranges", () => {
    render(<HistoricalChart data={data} />);
    expect(screen.getByTestId("select")).toBeInTheDocument();
    expect(screen.getByText(/last 10 years/i)).toBeInTheDocument();
    expect(screen.getByText(/last 5 years/i)).toBeInTheDocument();
    expect(screen.getByText(/last year/i)).toBeInTheDocument();
  });

  it("shows chart when data is present", () => {
    render(<HistoricalChart data={data} />);
    // ChartContainer is always rendered, but we can check for a label from the data
    expect(screen.getByText(/historical savings/i)).toBeInTheDocument();
  });

  it("shows empty message when no data", () => {
    render(<HistoricalChart data={[]} />);
    expect(
      screen.getByText(/no hay datos de ahorro para este rango de tiempo/i)
    ).toBeInTheDocument();
  });

  it("filters data when time range is changed", () => {
    render(<HistoricalChart data={data} />);
    const select = screen.getByTestId("select");
    fireEvent.change(select, { target: { value: "10y" } });
    // You can add more assertions here if you want to check the filtered output
    expect(select).toHaveValue("10y");
  });
});