import { getUserDetails, getUserId } from "@/actions/user.action";
import { stackServerApp } from "@/stack";
import { vi } from "vitest";

// Mock @neondatabase/serverless
const sqlMock = vi.fn();
vi.mock("@neondatabase/serverless", () => ({
  neon: vi.fn(() => sqlMock),
}));

describe("getUserDetails", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...OLD_ENV, DATABASE_URL: "postgres://test" };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("throws if DATABASE_URL is not set", async () => {
    process.env.DATABASE_URL = "";
    await expect(getUserDetails("abc")).rejects.toThrow("DATABASE_URL is not set");
  });

  it("returns null if userId is not provided", async () => {
    const result = await getUserDetails(undefined);
    expect(result).toBeNull();
  });

  it("returns user from database", async () => {
    sqlMock.mockResolvedValueOnce([{ id: "abc", name: "Test User" }]);
    const result = await getUserDetails("abc");
    expect(sqlMock).toHaveBeenCalledWith`SELECT * FROM neon_auth.users_sync WHERE id = ${"abc"};`;
    expect(result).toEqual({ id: "abc", name: "Test User" });
  });
});

describe("getUserId", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns undefined if stackServerApp.getUser returns null", async () => {
    (stackServerApp.getUser as any).mockResolvedValue(null);
    const result = await getUserId();
    expect(result).toBeUndefined();
  });

  it("returns user id if stackServerApp.getUser returns user", async () => {
    (stackServerApp.getUser as any).mockResolvedValue({ id: "user-123" });
    const result = await getUserId();
    expect(result).toBe("user-123");
  });
});