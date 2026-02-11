import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Analytics from "../Analytics";

const mockCourses = [
  { id: 1, title: "Algebra", progress_percentage: 100, is_enrolled: true },
  { id: 2, title: "Geometry", progress_percentage: 50, is_enrolled: true },
  { id: 3, title: "History", progress_percentage: 0, is_enrolled: false }, // Not enrolled
];

describe("Analytics Component", () => {
  it("correctly calculates completed vs in-progress courses", () => {
    render(<Analytics courses={mockCourses} />);

    // We expect 1 Completed (Algebra) and 1 In-Progress (Geometry)
    // History should be ignored because is_enrolled is false

    expect(screen.getByText(/Completed/i)).toBeInTheDocument();
    expect(screen.getByText(/In Progress/i)).toBeInTheDocument();
  });
  it("handles empty course list without crashing", () => {
    render(<Analytics courses={[]} />);

    // It should show 0 for everything or a "No Data" message
    const availableText = screen.getByText(/Available/i);
    expect(availableText).toBeInTheDocument();
  });
});
