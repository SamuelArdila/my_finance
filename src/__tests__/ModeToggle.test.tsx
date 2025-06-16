import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ModeToggle from "../components/ModeToggle";
import { vi } from "vitest";

// Use a variable to control the theme
let themeValue = "light";
const setThemeMock = vi.fn();

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: themeValue,
    setTheme: setThemeMock,
  }),
}));

describe("ModeToggle", () => {
  beforeEach(() => {
    setThemeMock.mockClear();
    themeValue = "light"; // default for each test
  });

  it("calls setTheme with 'dark' when current theme is light", () => {
    render(<ModeToggle />);
    fireEvent.click(screen.getByRole("button", { name: /toggle theme/i }));
    expect(setThemeMock).toHaveBeenCalledWith("dark");
  });

  it("calls setTheme with 'light' when current theme is dark", () => {
    themeValue = "dark"; // set theme to dark for this test
    render(<ModeToggle />);
    fireEvent.click(screen.getByRole("button", { name: /toggle theme/i }));
    expect(setThemeMock).toHaveBeenCalledWith("light");
  });
});