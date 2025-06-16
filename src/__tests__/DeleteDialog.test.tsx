import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteDialog from "../components/DeleteDialog";
import * as actions from "@/actions/financial.actions";
import { vi, Mock } from "vitest";

// Mock deleteRegister
vi.mock("@/actions/financial.actions", () => ({
  deleteRegister: vi.fn(),
}));

describe("DeleteDialog", () => {
  const onOpenChangeMock = vi.fn();
  const onSuccessMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders dialog content", () => {
    render(
      <DeleteDialog
        open={true}
        onOpenChange={onOpenChangeMock}
        category="incomes"
        id={1}
        onSuccess={onSuccessMock}
      />
    );

    expect(screen.getByText(/are you absolutely sure/i)).toBeInTheDocument();
    expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument();
    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
    expect(screen.getByText(/confirm delete/i)).toBeInTheDocument();
  });

  it("calls deleteRegister and handles success", async () => {
    (actions.deleteRegister as Mock<typeof actions.deleteRegister>).mockResolvedValueOnce(undefined);

    render(
      <DeleteDialog
        open={true}
        onOpenChange={onOpenChangeMock}
        category="expenses"
        id={42}
        onSuccess={onSuccessMock}
      />
    );

    fireEvent.click(screen.getByText(/confirm delete/i));

    await waitFor(() => {
      expect(actions.deleteRegister).toHaveBeenCalledWith("expenses", 42);
      expect(onOpenChangeMock).toHaveBeenCalledWith(false);
      expect(onSuccessMock).toHaveBeenCalledWith("Item deleted successfully!");
    });
  });

  it("handles error when deleteRegister fails", async () => {
    (actions.deleteRegister as Mock<typeof actions.deleteRegister>).mockRejectedValueOnce(new Error("API error"));

    render(
      <DeleteDialog
        open={true}
        onOpenChange={onOpenChangeMock}
        category="goals"
        id={99}
        onSuccess={onSuccessMock}
      />
    );

    fireEvent.click(screen.getByText(/confirm delete/i));

    await waitFor(() => {
      expect(actions.deleteRegister).toHaveBeenCalledWith("goals", 99);
      expect(onSuccessMock).toHaveBeenCalledWith("Error deleting item.");
    });
  });
});