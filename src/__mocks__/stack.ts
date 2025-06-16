import { vi } from "vitest";

let userValue: any = null;

export const setUserValue = (val: any) => { userValue = val; };

export const stackServerApp = {
  getUser: vi.fn(() => Promise.resolve(userValue)),
  urls: {
    signIn: "/signin",
    signOut: "/signout",
  },
};

// Optionally export getUserMock for clearing in tests
export const __getUserMock = stackServerApp.getUser;
