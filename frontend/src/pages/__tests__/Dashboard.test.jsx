import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Dashboard from "../Dashboard";
import { BrowserRouter } from "react-router-dom";

const mockCourses = [
  { id: 1, title: "React Basics", progress_percentage: 50, is_enrolled: true },
  { id: 2, title: "Django API", progress_percentage: 0, is_enrolled: false },
];

describe("Dashboard Page", () => {
  it("filters courses based on search input", () => {
    render(
      <BrowserRouter>
        <Dashboard courses={mockCourses} onEnroll={() => {}} />
      </BrowserRouter>,
    );

    // 1. Initially, both should be visible
    expect(screen.getByText(/React Basics/i)).toBeInTheDocument();
    expect(screen.getByText(/Django API/i)).toBeInTheDocument();

    // 2. Find the search input and type "React"
    const searchInput = screen.getByPlaceholderText(/Search your courses.../i);
    fireEvent.change(searchInput, { target: { value: "React" } });

    // 3. Check that "React Basics" is still there, but "Django API" is gone
    expect(screen.getByText(/React Basics/i)).toBeInTheDocument();
    expect(screen.queryByText(/Django API/i)).not.toBeInTheDocument();
  });

  it('shows a "No matches" message when search finds nothing', () => {
    render(
      <BrowserRouter>
        <Dashboard courses={mockCourses} onEnroll={() => {}} />
      </BrowserRouter>,
    );

    const searchInput = screen.getByPlaceholderText(/Search your courses.../i);
    fireEvent.change(searchInput, { target: { value: "NonExistentCourse" } });

    expect(screen.getByText(/No matches in the catalog/i)).toBeInTheDocument();
  });
});
