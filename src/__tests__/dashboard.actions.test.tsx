vi.mock('@/actions/user.action', async () => {
  const actual = await vi.importActual<typeof import('@/actions/user.action')>('@/actions/user.action');
  return {
    ...actual,
    getUserId: vi.fn(),
  };
});

import { calculateAndGetUserSavings } from "../actions/dashboard.actions";
import { prisma } from "@/lib/prisma";
import { vi } from "vitest";
import { getUserId } from "@/actions/user.action";

// Mock date-fns
vi.mock("date-fns", () => ({
  startOfMonth: (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1),
}));

describe("calculateAndGetUserSavings", () => {
  let updateManyMock: any, findManyMock: any, upsertMock: any;

  beforeEach(() => {
    // Cast prisma to any to access __mocks for testing
    updateManyMock = (prisma as any).__mocks.updateManyMock;
    findManyMock = (prisma as any).__mocks.findManyMock;
    upsertMock = (prisma as any).__mocks.upsertMock;
    vi.clearAllMocks();
  });

  it("returns undefined if no user is found", async () => {
    (getUserId as any).mockResolvedValue(null);
    const result = await calculateAndGetUserSavings();
    expect(result).toBeUndefined();
  });

  it("calculates savings and returns dashboard data", async () => {
    (getUserId as any).mockResolvedValue("user1");

    // Mock incomes and expenses
    findManyMock
      .mockResolvedValueOnce([]) // incomes.updateMany
      .mockResolvedValueOnce([]) // expenses.updateMany
      .mockResolvedValueOnce([{ amount: 100 }, { amount: 200 }]) // incomes.findMany
      .mockResolvedValueOnce([{ amount: 50 }]) // expenses.findMany
      .mockResolvedValueOnce([]) // monthlySavings.findMany (allSavings)
      .mockResolvedValueOnce([]); // goals.findMany

    upsertMock.mockResolvedValue({});

    const result = await calculateAndGetUserSavings();

    expect(getUserId).toHaveBeenCalled();
    expect(updateManyMock).toHaveBeenCalled();
    expect(upsertMock).toHaveBeenCalled();
    expect(result).toHaveProperty("allSavings");
    expect(result).toHaveProperty("incomes");
    expect(result).toHaveProperty("expenses");
    expect(result).toHaveProperty("goals");
  });

  it("throws and logs error if something fails", async () => {
    (getUserId as any).mockRejectedValue(new Error("fail"));
    const spy = vi.spyOn(console, "error").mockImplementation(() => { });
    await expect(calculateAndGetUserSavings()).rejects.toThrow("fail");
    expect(spy).toHaveBeenCalledWith(
      "Error Getting Dashboard:",
      expect.any(Error)
    );
    spy.mockRestore();
  });

  it("calculates savings with empty incomes and expenses", async () => {
    (getUserId as any).mockResolvedValue("user1");

    findManyMock
      .mockResolvedValueOnce([]) // incomes.updateMany
      .mockResolvedValueOnce([]) // expenses.updateMany
      .mockResolvedValueOnce([]) // incomes.findMany
      .mockResolvedValueOnce([]) // expenses.findMany
      .mockResolvedValueOnce([]) // monthlySavings.findMany (allSavings)
      .mockResolvedValueOnce([]); // goals.findMany

    upsertMock.mockResolvedValue({});

    const result = await calculateAndGetUserSavings();

    expect(result).toHaveProperty("allSavings");
    expect(result).toHaveProperty("incomes");
    expect(result).toHaveProperty("expenses");
    expect(result).toHaveProperty("goals");
  });

});