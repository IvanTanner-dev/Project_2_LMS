import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import VideoPlayer from "../VideoPlayer";

describe("VideoPlayer", () => {
  const mockLesson = {
    title: "Intro to Algebra",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    is_completed: false,
  };

  it("renders the video and title when a lesson is provided", () => {
    render(<VideoPlayer lesson={mockLesson} onComplete={() => {}} />);

    // Check for the title
    expect(screen.getByText(/Intro to Algebra/i)).toBeInTheDocument();

    // Check for the iframe using the data-testid you added!
    const iframe = screen.getByTestId("video-iframe");
    expect(iframe).toBeInTheDocument();

    // Check if our helper function correctly converted the URL to embed format
    expect(iframe.src).toContain("embed/dQw4w9WgXcQ");
  });

  it("calls onComplete when the button is clicked", () => {
    const onCompleteMock = vi.fn(); // Creates a "spy" function
    render(<VideoPlayer lesson={mockLesson} onComplete={onCompleteMock} />);

    const button = screen.getByText(/Mark as Complete/i);
    button.click();

    expect(onCompleteMock).toHaveBeenCalledTimes(1);
  });

  it("shows the 'Select a lesson' placeholder when lesson is null", () => {
    render(<VideoPlayer lesson={null} />);
    expect(
      screen.getByText(/Select a lesson to begin your journey/i),
    ).toBeInTheDocument();
  });
});
