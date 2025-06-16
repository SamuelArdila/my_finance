import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FinancialsTable from "../components/FinancialsTable";
import { vi } from "vitest";

// Mock EditDialog and DeleteDialog to control their behavior
vi.mock("../components/EditDialog", () => ({
  EditDialog: ({ open, onOpenChange, item }: any) =>
    open ? (
      <div>
        <span>EditDialog Open for {item.name}</span>
        <button onClick={() => onOpenChange(false)}>Close Edit</button>
      </div>
    ) : null,
}));

vi.mock("../components/DeleteDialog", () => ({
  default: ({ open, onOpenChange, id }: any) =>
    open ? (
      <div>
        <span>DeleteDialog Open for {id}</span>
        <button onClick={() => onOpenChange(false)}>Close Delete</button>
      </div>
    ) : null,
}));

describe("FinancialsTable", () => {
  const financials = {
  success: true,
  userFinancials: [
    { id: 1, name: "Salary", amount: 1000, type: "Unique", createdAt: new Date() },
    { id: 2, name: "Groceries", amount: 200, type: "Monthly", createdAt: new Date() },
  ],
  category: "incomes",
};

  it("renders table headers and rows", () => {
    render(<FinancialsTable financials={financials} />);
    expect(screen.getByText(/name/i)).toBeInTheDocument();
    expect(screen.getByText(/amount/i)).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /type/i })).toBeInTheDocument();
    expect(screen.getByText("Salary")).toBeInTheDocument();
    expect(screen.getByText("Groceries")).toBeInTheDocument();
  });

  it("opens EditDialog when edit button is clicked", () => {
    render(<FinancialsTable financials={financials} />);
    // Simulate clicking the first edit button
    fireEvent.click(screen.getAllByRole("button", { name: /edit/i })[0]);
    expect(screen.getByText(/EditDialog Open for Salary/)).toBeInTheDocument();
  });

  it("opens DeleteDialog when delete button is clicked", () => {
    render(<FinancialsTable financials={financials} />);
    // Simulate clicking the first delete button
    fireEvent.click(screen.getAllByRole("button", { name: /delete/i })[0]);
    expect(screen.getByText(/DeleteDialog Open for 1/)).toBeInTheDocument();
  });
});