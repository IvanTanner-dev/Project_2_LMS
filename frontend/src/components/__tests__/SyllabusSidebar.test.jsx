import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SyllabusSidebar from "../SyllabusSidebar";

const mockLessons = [
  { id: 1, title: "Algebra Basics", is_completed: true },
  { id: 2, title: "Advanced Functions", is_completed: false },
];

describe("SyllabusSidebar", () => {
  it("renders all lesson titles", () => {
    render(
      <SyllabusSidebar
        lessons={mockLessons}
        activeLessonId={1}
        onSelectLesson={() => {}}
      />,
    );

    expect(screen.getByText(/Algebra Basics/i)).toBeInTheDocument();
    expect(screen.getByText(/Advanced Functions/i)).toBeInTheDocument();
  });

  it("calls onSelectLesson when a lesson is clicked", () => {
    const onSelectMock = vi.fn();
    render(
      <SyllabusSidebar
        lessons={mockLessons}
        activeLessonId={1}
        onSelectLesson={onSelectMock}
      />,
    );

    const secondLesson = screen.getByText(/Advanced Functions/i);
    fireEvent.click(secondLesson);

    expect(onSelectMock).toHaveBeenCalledWith(mockLessons[1]);
  });
});
