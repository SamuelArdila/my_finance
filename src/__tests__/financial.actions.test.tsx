vi.mock('@/actions/user.action', async () => {
  const actual = await vi.importActual<typeof import('@/actions/user.action')>('@/actions/user.action');
  return {
    ...actual,
    getUserId: vi.fn(),
  };
});

import { getFinancials, getGoalsById, createRegister, editRegister, deleteRegister } from "../actions/financial.actions";
import { prisma } from "@/lib/prisma";
import { vi } from "vitest";
import { getUserId } from "@/actions/user.action";


// Access prisma mocks from the global mock (set up in vitest.setup.ts)
const { findManyMock, findUniqueMock, createMock, updateMock } = (prisma as any).__mocks;
const revalidatePathMock = (globalThis as any).revalidatePathMock;

describe("financial.actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getFinancials", () => {
    it("returns undefined if no user is found", async () => {
      (getUserId as any).mockResolvedValue(null);
      const result = await getFinancials("incomes", true);
      expect(result?.userFinancials).toBeUndefined();
    });

    it("returns incomes when category is incomes", async () => {
      (getUserId as any).mockResolvedValue("user1");
      findManyMock.mockResolvedValueOnce([{ id: 1, amount: 100 }]);
      const result = await getFinancials("incomes", true);
      expect(findManyMock).toHaveBeenCalled();
      expect(result?.userFinancials).toEqual([{ id: 1, amount: 100 }]);
      expect(result?.category).toBe("incomes");
      expect(revalidatePathMock).toHaveBeenCalledWith("/");
    });

    it("returns expenses when category is expenses", async () => {
      (getUserId as any).mockResolvedValue("user1");
      findManyMock.mockResolvedValueOnce([{ id: 2, amount: 200 }]);
      const result = await getFinancials("expenses", true);
      expect(findManyMock).toHaveBeenCalled();
      expect(result?.userFinancials).toEqual([{ id: 2, amount: 200 }]);
      expect(result?.category).toBe("expenses");
      expect(revalidatePathMock).toHaveBeenCalledWith("/");
    });

    it("returns goals when category is goals", async () => {
      (getUserId as any).mockResolvedValue("user1");
      findManyMock.mockResolvedValueOnce([{ id: 3, amount: 300 }]);
      const result = await getFinancials("goals", true);
      expect(findManyMock).toHaveBeenCalled();
      expect(result?.userFinancials).toEqual([{ id: 3, amount: 300 }]);
      expect(result?.category).toBe("goals");
      expect(revalidatePathMock).toHaveBeenCalledWith("/");
    });

    it("handles searchTerm and state", async () => {
      (getUserId as any).mockResolvedValue("user1");
      findManyMock.mockResolvedValueOnce([]);
      await getFinancials("incomes", true, "salary");
      expect(findManyMock).toHaveBeenCalled();
    });
  });

  describe("getGoalsById", () => {
    it("returns the goal by id", async () => {
      findUniqueMock.mockResolvedValue({ id: 1, name: "Goal" });
      const result = await getGoalsById("1");
      expect(findUniqueMock).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual({ id: 1, name: "Goal" });
    });
  });

  describe("createRegister", () => {
    it("returns undefined if no user is found", async () => {
      (getUserId as any).mockResolvedValue(null);
      const result = await createRegister({
        name: "Test",
        amount: 100,
        type: "salary",
        category: "incomes",
      });
      expect(result).toBeUndefined();
    });

    it("creates an income register", async () => {
      (getUserId as any).mockResolvedValue("user1");
      createMock.mockResolvedValue({ id: 1, name: "Test" });
      const result = await createRegister({
        name: "Test",
        amount: 100,
        type: "salary",
        category: "incomes",
      });
      expect(createMock).toHaveBeenCalled();
      expect(revalidatePathMock).toHaveBeenCalledWith("/incomes");
      expect(result).toEqual({ id: 1, name: "Test" });
    });

    it("creates an expense register", async () => {
      (getUserId as any).mockResolvedValue("user1");
      createMock.mockResolvedValue({ id: 2, name: "Expense" });
      const result = await createRegister({
        name: "Expense",
        amount: 50,
        type: "food",
        category: "expenses",
      });
      expect(createMock).toHaveBeenCalled();
      expect(revalidatePathMock).toHaveBeenCalledWith("/expenses");
      expect(result).toEqual({ id: 2, name: "Expense" });
    });

    it("creates a goal register", async () => {
      (getUserId as any).mockResolvedValue("user1");
      createMock.mockResolvedValue({ id: 3, name: "Goal" });
      const result = await createRegister({
        name: "Goal",
        amount: 200,
        type: "save",
        imageURL: "img.png",
        category: "goals",
      });
      expect(createMock).toHaveBeenCalled();
      expect(revalidatePathMock).toHaveBeenCalledWith("/goals");
      expect(result).toEqual({ id: 3, name: "Goal" });
    });
  });

  describe("editRegister", () => {
    it("returns undefined if no user is found", async () => {
      (getUserId as any).mockResolvedValue(null);
      const result = await editRegister({
        id: 1,
        name: "Edit",
        amount: 100,
        type: "salary",
        category: "incomes",
      });
      expect(result).toBeUndefined();
    });

    it("updates an income register", async () => {
      (getUserId as any).mockResolvedValue("user1");
      updateMock.mockResolvedValue({ id: 1, name: "Edit" });
      const result = await editRegister({
        id: 1,
        name: "Edit",
        amount: 100,
        type: "salary",
        category: "incomes",
      });
      expect(updateMock).toHaveBeenCalled();
      expect(revalidatePathMock).toHaveBeenCalledWith("/incomes");
      expect(result).toEqual({ id: 1, name: "Edit" });
    });

    it("updates an expense register", async () => {
      (getUserId as any).mockResolvedValue("user1");
      updateMock.mockResolvedValue({ id: 2, name: "Expense" });
      const result = await editRegister({
        id: 2,
        name: "Expense",
        amount: 50,
        type: "food",
        category: "expenses",
      });
      expect(updateMock).toHaveBeenCalled();
      expect(revalidatePathMock).toHaveBeenCalledWith("/expenses");
      expect(result).toEqual({ id: 2, name: "Expense" });
    });

    it("updates a goal register", async () => {
      (getUserId as any).mockResolvedValue("user1");
      updateMock.mockResolvedValue({ id: 3, name: "Goal" });
      const result = await editRegister({
        id: 3,
        name: "Goal",
        amount: 200,
        type: "save",
        imageURL: "img.png",
        category: "goals",
      });
      expect(updateMock).toHaveBeenCalled();
      expect(revalidatePathMock).toHaveBeenCalledWith("/goals");
      expect(result).toEqual({ id: 3, name: "Goal" });
    });
  });

  describe("deleteRegister", () => {
    it("returns undefined if no user is found", async () => {
      (getUserId as any).mockResolvedValue(null);
      const result = await deleteRegister("incomes", 1);
      expect(result).toBeUndefined();
    });

    it("soft deletes an income register", async () => {
      (getUserId as any).mockResolvedValue("user1");
      updateMock.mockResolvedValue({ id: 1, state: false });
      const result = await deleteRegister("incomes", 1);
      expect(updateMock).toHaveBeenCalled();
      expect(revalidatePathMock).toHaveBeenCalledWith("/incomes");
      expect(result).toEqual({ id: 1, state: false });
    });

    it("soft deletes an expense register", async () => {
      (getUserId as any).mockResolvedValue("user1");
      updateMock.mockResolvedValue({ id: 2, state: false });
      const result = await deleteRegister("expenses", 2);
      expect(updateMock).toHaveBeenCalled();
      expect(revalidatePathMock).toHaveBeenCalledWith("/expenses");
      expect(result).toEqual({ id: 2, state: false });
    });

    it("soft deletes a goal register", async () => {
      (getUserId as any).mockResolvedValue("user1");
      updateMock.mockResolvedValue({ id: 3, state: false });
      const result = await deleteRegister("goals", 3);
      expect(updateMock).toHaveBeenCalled();
      expect(revalidatePathMock).toHaveBeenCalledWith("/goals");
      expect(result).toEqual({ id: 3, state: false });
    });
  });
}
);