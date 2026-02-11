import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CourseCard from "../Coursecard";
import { BrowserRouter } from "react-router-dom";

const mockCourse = {
  id: 1,
  title: "Test Algebra",
  is_enrolled: true,
  progress_percentage: 100, // 👈 The "Bingo" condition
};

describe("CourseCard Component", () => {
  it("renders the Download Certificate button when progress is 100%", () => {
    render(
      <BrowserRouter>
        <CourseCard course={mockCourse} isEnrolled={true} />
      </BrowserRouter>,
    );

    const downloadBtn = screen.getByText(/Download Certificate/i);
    expect(downloadBtn).toBeInTheDocument();
  });

  it("does NOT render the Download button when progress is 50%", () => {
    const incompleteCourse = { ...mockCourse, progress_percentage: 50 };
    render(
      <BrowserRouter>
        <CourseCard course={incompleteCourse} isEnrolled={true} />
      </BrowserRouter>,
    );

    const downloadBtn = screen.queryByText(/Download Certificate/i);
    expect(downloadBtn).not.toBeInTheDocument();
  });
});
