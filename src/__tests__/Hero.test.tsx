import { render, screen, fireEvent } from "@testing-library/react";
import Hero from "../components/Hero";
import React from "react";
import { vi } from "vitest";

// Mock the SignUp component from @stackframe/stack
vi.mock("@stackframe/stack", () => ({
  SignUp: () => <div data-testid="signup-modal">SignUp Component</div>,
}));

describe("Hero", () => {
  it("renders headline and Get Started button", () => {
    render(<Hero />);
    expect(screen.getByText(/your money, under control/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /get started/i })).toBeInTheDocument();
  });

  it("shows signup modal when Get Started is clicked", () => {
    render(<Hero />);
    fireEvent.click(screen.getByRole("button", { name: /get started/i }));
    expect(screen.getByTestId("signup-modal")).toBeInTheDocument();
  });

  it("shows signup modal when hero image is clicked", () => {
    render(<Hero />);
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    expect(screen.getByTestId("signup-modal")).toBeInTheDocument();
  });

  it("closes signup modal when close button is clicked", () => {
    render(<Hero />);
    fireEvent.click(screen.getByRole("button", { name: /get started/i }));
    expect(screen.getByTestId("signup-modal")).toBeInTheDocument();

    // Find the close button by its label (✕)
    fireEvent.click(screen.getByRole("button", { name: /✕/i }));
    expect(screen.queryByTestId("signup-modal")).not.toBeInTheDocument();
  });
});