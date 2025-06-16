import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Navbar from "../components/NavbarClient";
import { vi } from "vitest";

// Mock stackServerApp and its methods
vi.mock("@/stack", () => ({
  stackServerApp: {
    getUser: vi.fn(),
    urls: {
      signIn: "/sign-in",
      signOut: "/sign-out",
    },
  },
}));

// Mock UserButton
vi.mock("@stackframe/stack", () => ({
  UserButton: () => <div data-testid="user-button" />,
}));

describe("Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows Sign In when user is not authenticated", async () => {
    const { stackServerApp } = await import("@/stack");
    (stackServerApp.getUser as any).mockResolvedValue(null);

    // Because Navbar is async, you need to await render
    await render(<Navbar />);

    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.queryByText(/sign out/i)).not.toBeInTheDocument();
    expect(screen.queryByTestId("user-button")).not.toBeInTheDocument();
  });

  it("shows Sign Out and UserButton when user is authenticated", async () => {
    const { stackServerApp } = await import("@/stack");
    (stackServerApp.getUser as any).mockResolvedValue({ id: "user-123" });

    await render(<Navbar />);

    await waitFor(() => {
    const signOutLink = screen.getAllByRole("link").find(
      (el) => el.getAttribute("href") === "/sign-out"
    );
    expect(signOutLink).toBeDefined();
    expect(screen.getByTestId("user-button")).toBeInTheDocument();
    expect(screen.queryByText(/sign in/i)).not.toBeInTheDocument();
    });
  });

  it("renders navigation links", async () => {
    const { stackServerApp } = await import("@/stack");
    (stackServerApp.getUser as any).mockResolvedValue(null);

    await render(<Navbar />);

    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/income/i)).toBeInTheDocument();
    expect(screen.getByText(/expenses/i)).toBeInTheDocument();
    expect(screen.getByText(/goals/i)).toBeInTheDocument();
  });
});