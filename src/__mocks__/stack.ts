import { vi } from "vitest";

export const stackServerApp = {
  getUser: vi.fn().mockResolvedValue(null),
  urls: {},
};
