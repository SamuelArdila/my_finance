import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EditDialog } from "../components/EditDialog";
import * as actions from "@/actions/financial.actions";
import { vi, Mock } from "vitest";

// Mock FinancialDialogForm to control onSubmit and onCancel
vi.mock("../components/FinancialDialogForm", () => ({
  FinancialDialogForm: ({ onSubmit, onCancel, submitLabel }: any) => (
    <div>
      <button onClick={() => onSubmit({ id: 1, name: "Edited", amount: 200, type: "Unique" })}>
        {submitLabel}
      </button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));

// Mock editRegister
vi.mock("@/actions/financial.actions", () => ({
  editRegister: vi.fn(),
}));

describe("EditDialog", () => {
  const onOpenChangeMock = vi.fn();
  const onSuccessMock = vi.fn();
  const item = { id: 1, name: "Test", amount: 100, type: "Unique" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with default title and description", () => {
    render(
      <EditDialog
        open={true}
        onOpenChange={onOpenChangeMock}
        category="incomes"
        item={item}
        onSuccess={onSuccessMock}
      />
    );

    expect(screen.getByText("Edit Item")).toBeInTheDocument();
    expect(screen.getByText("Edit the fields and save your changes.")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("calls editRegister and handles success", async () => {
    (actions.editRegister as Mock<typeof actions.editRegister>).mockResolvedValueOnce(undefined);

    render(
      <EditDialog
        open={true}
        onOpenChange={onOpenChangeMock}
        category="expenses"
        item={item}
        onSuccess={onSuccessMock}
      />
    );

    fireEvent.click(screen.getByText("Edit"));

    await waitFor(() => {
      expect(actions.editRegister).toHaveBeenCalledWith({
        id: 1,
        name: "Edited",
        amount: 200,
        type: "Unique",
        category: "expenses",
      });
      expect(onOpenChangeMock).toHaveBeenCalledWith(false);
      expect(onSuccessMock).toHaveBeenCalledWith("Item updated successfully!");
    });
  });

  it("handles error when editRegister fails", async () => {
    (actions.editRegister as Mock<typeof actions.editRegister>).mockRejectedValueOnce(new Error("API error"));

    render(
      <EditDialog
        open={true}
        onOpenChange={onOpenChangeMock}
        category="goals"
        item={item}
        onSuccess={onSuccessMock}
      />
    );

    fireEvent.click(screen.getByText("Edit"));

    await waitFor(() => {
      expect(actions.editRegister).toHaveBeenCalled();
      expect(onSuccessMock).toHaveBeenCalledWith("Error updating item.");
    });
  });
});