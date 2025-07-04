import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CreateDialog } from "../components/CreateDialog";
import * as actions from "@/actions/financial.actions";
import { vi, Mock } from 'vitest';

// Mock del FinancialDialogForm para controlar onSubmit y onCancel
vi.mock("./FinancialDialogForm", () => ({
  FinancialDialogForm: ({ onSubmit, onCancel, submitLabel }: any) => (
    <div>
      <button onClick={() => onSubmit({ name: "Test", amount: 100, type: "Unique" })}>
        {submitLabel}
      </button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));

vi.mock("@/actions/financial.actions", () => ({
  createRegister: vi.fn(),
}));

describe("CreateDialog", () => {
  const onOpenChangeMock = vi.fn();
  const onSuccessMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with default title and description", () => {
    render(
      <CreateDialog
        open={true}
        onOpenChange={onOpenChangeMock}
        category="incomes"
        onSuccess={onSuccessMock}
      />
    );

    expect(screen.getByText("Create New Item")).toBeInTheDocument();
    expect(screen.getByText("Fill out the form to create a new item.")).toBeInTheDocument();
    expect(screen.getByText("Create")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("renders with custom title", () => {
    render(
      <CreateDialog
        open={true}
        onOpenChange={onOpenChangeMock}
        category="expenses"
        title="Add Expense"
        onSuccess={onSuccessMock}
      />
    );

    expect(screen.getByText("Add Expense")).toBeInTheDocument();
  });

  it("calls createRegister and handles success", async () => {
    (actions.createRegister as Mock<typeof actions.createRegister>).mockResolvedValueOnce(undefined);

    render(
      <CreateDialog
        open={true}
        onOpenChange={onOpenChangeMock}
        category="goals"
        onSuccess={onSuccessMock}
      />
    );

    // Llenar Name
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Test" },
    });

    // Llenar Amount
    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: 100 },
    });

    fireEvent.click(screen.getByRole("combobox"));
    const uniqueOption = await screen.findByText(/unique/i);
    fireEvent.click(uniqueOption);

    // Llenar ImageURL (porque category === "goals")
    fireEvent.change(screen.getByLabelText(/image url/i), {
      target: { value: "https://example.com/image.png" },
    });

    // Click en crear
    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(actions.createRegister).toHaveBeenCalledWith({
        name: "Test",
        amount: 100,
        type: "Unique",
        imageURL: "https://example.com/image.png",
        category: "goals",
      });
    });

    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    expect(onSuccessMock).toHaveBeenCalledWith("Item created successfully!");
  });

  it("handles error when createRegister fails", async () => {
    (actions.createRegister as Mock<typeof actions.createRegister>).mockRejectedValueOnce(new Error("API Error"));

    render(
      <CreateDialog
        open={true}
        onOpenChange={onOpenChangeMock}
        category="expenses"
        onSuccess={onSuccessMock}
      />
    );

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: 100 } });
    fireEvent.click(screen.getByRole("combobox"));
    const uniqueOption = await screen.findByText(/unique/i);
    fireEvent.click(uniqueOption);
    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(actions.createRegister).toHaveBeenCalled();
    });

    expect(onSuccessMock).toHaveBeenCalledWith("Error creating item.");
  });

  it("closes dialog when cancel is clicked", () => {
    render(
      <CreateDialog
        open={true}
        onOpenChange={onOpenChangeMock}
        category="incomes"
        onSuccess={onSuccessMock}
      />
    );

    fireEvent.click(screen.getByText("Cancel"));

    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });

});
