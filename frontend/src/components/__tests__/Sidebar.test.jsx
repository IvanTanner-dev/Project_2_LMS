import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Sidebar from "../Sidebar";
import { BrowserRouter } from "react-router-dom";

describe("Sidebar Component", () => {
  it("renders all navigation links", () => {
    // 1. Mock the courses array the sidebar needs for calculation
    const mockCourses = [{ id: 1, progress_percentage: 50, is_enrolled: true }];

    render(
      <BrowserRouter>
        <Sidebar courses={mockCourses} />
      </BrowserRouter>,
    );

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/My Courses/i)).toBeInTheDocument();
  });
});
