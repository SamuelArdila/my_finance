import React from "react";
import { render, screen } from "@testing-library/react";
import { GoalsList } from "../components/GoalsList";

describe("GoalsList", () => {
  const goals = [
    {
      id: 1,
      name: "Buy a Car",
      type: "Unique",
      amount: 5000,
      state: false,
      createdAt: new Date(),
      updatedAt: null,
      userId: "user1",
      imageURL: "https://example.com/car.jpg",
    },
    {
      id: 2,
      name: "Vacation",
      type: "Monthly",
      amount: 1200,
      state: true,
      createdAt: new Date(),
      updatedAt: null,
      userId: "user1",
      imageURL: null,
    },
  ];

  it("renders all goals", () => {
    render(<GoalsList goals={goals} />);
    expect(screen.getByText("Buy a Car")).toBeInTheDocument();
    expect(screen.getByText("Vacation")).toBeInTheDocument();
  });

  it("renders goal types and amounts", () => {
    render(<GoalsList goals={goals} />);
    expect(screen.getByText("Unique")).toBeInTheDocument();
    expect(screen.getByText("Monthly")).toBeInTheDocument();
    expect(screen.getByText("$5000.00")).toBeInTheDocument();
    expect(screen.getByText("$1200.00")).toBeInTheDocument();
  });

  it("renders goal images when imageURL is present", () => {
    render(<GoalsList goals={goals} />);
    const img = screen.getByAltText("Buy a Car") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe("https://example.com/car.jpg");
  });

  it("does not render image if imageURL is null", () => {
    render(<GoalsList goals={goals} />);
    // Only one image should be rendered
    expect(screen.getAllByRole("img").length).toBe(1);
  });
});