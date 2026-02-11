import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CourseDetail from "../CourseDetail";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { fireConfetti } from "../../utils/confetti";

// 1. Mock Axios
vi.mock("axios");

// 2. Mock useParams to return id: "1"
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "1" }),
  };
});

// Tell Vitest to mock this specific function
vi.mock("../../utils/confetti", () => ({
  fireConfetti: vi.fn(),
}));

const mockCourseData = {
  data: {
    id: 1,
    title: "React Mastery",
    lessons: [
      {
        id: 101,
        title: "Hooks 101",
        video_url: "youtube.com/1",
        is_completed: false,
      },
      {
        id: 102,
        title: "Testing Vitest",
        video_url: "youtube.com/2",
        is_completed: false,
      },
    ],
  },
};

describe("CourseDetail Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("access_token", "fake-token");

    // Mock GET for initial load
    axios.get.mockResolvedValue(mockCourseData);

    // Mock PATCH/POST for button clicks
    // We return a mock response that has a 'data' property
    const successResponse = { data: { id: 101, is_completed: true } };

    if (axios.patch) axios.patch.mockResolvedValue(successResponse);
    if (axios.post) axios.post.mockResolvedValue(successResponse);
  });

  it("loads course data and displays the first incomplete lesson", async () => {
    render(
      <BrowserRouter>
        <CourseDetail />
      </BrowserRouter>,
    );

    // Wait for the page title to confirm loading is finished
    await waitFor(() => {
      expect(screen.getByText(/React Mastery/i)).toBeInTheDocument();
    });

    // 1. Check the Sidebar (The list item)
    // We use getAllByText and check the count, OR query by role
    const sidebarLesson = screen.getByRole("button", { name: /Hooks 101/i });
    expect(sidebarLesson).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /Mark as Complete/i });
    fireEvent.click(button);

    // 2. Check the Video Player Header (The <h2> title)
    // This confirms the "Smart Selector" actually pushed it to the player
    const activeHeader = screen.getByRole("heading", {
      name: /Hooks 101/i,
      level: 2,
    });
    expect(activeHeader).toBeInTheDocument();
  });

  it("calls fireConfetti when the course is finished", async () => {
    // 1. Setup mock data where all lessons are completed
    const completedData = {
      data: {
        ...mockCourseData.data,
        lessons: mockCourseData.data.lessons.map((l) => ({
          ...l,
          is_completed: true,
        })),
      },
    };
    axios.get.mockResolvedValue(completedData);

    render(
      <BrowserRouter>
        <CourseDetail />
      </BrowserRouter>,
    );

    // 2. We MUST wait for the UI to update.
    // This gives the useEffect time to run and trigger fireConfetti.
    await waitFor(() => {
      expect(screen.getByText(/Course Completed!/i)).toBeInTheDocument();
    });

    // 3. Now that the UI has updated, the function should have been called
    expect(fireConfetti).toHaveBeenCalled();
  });

  it("shows the completion overlay when progress is 100%", async () => {
    // Modify mock for a completed course
    const completedData = {
      data: {
        ...mockCourseData.data,
        lessons: mockCourseData.data.lessons.map((l) => ({
          ...l,
          is_completed: true,
        })),
      },
    };
    axios.get.mockResolvedValue(completedData);

    render(
      <BrowserRouter>
        <CourseDetail />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Course Completed!/i)).toBeInTheDocument();
    });
  });
});
