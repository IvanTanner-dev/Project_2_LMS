import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MyCourses from "../MyCourses";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

vi.mock("axios");

const mockEnrolledCourses = {
  data: [
    {
      id: 1,
      title: "React Mastery",
      description: "Learn Hooks",
      category: "Frontend",
    },
    {
      id: 2,
      title: "Django Pro",
      description: "Master APIs",
      category: "Backend",
    },
  ],
};

describe("MyCourses Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("access_token", "fake-token");
  });
  it("renders the list of enrolled courses", async () => {
    axios.get.mockResolvedValue(mockEnrolledCourses);

    render(
      <BrowserRouter>
        <MyCourses />
      </BrowserRouter>,
    );

    // Wait for courses to load
    await waitFor(() => {
      expect(screen.getByText(/React Mastery/i)).toBeInTheDocument();
      expect(screen.getByText(/Django Pro/i)).toBeInTheDocument();
    });

    // Check that we see the "My Courses" heading
    expect(
      screen.getByRole("heading", { name: /My Courses/i }),
    ).toBeInTheDocument();
  });

  it("shows an empty state message when no courses are enrolled", async () => {
    axios.get.mockResolvedValue({ data: [] });

    render(
      <BrowserRouter>
        <MyCourses />
      </BrowserRouter>,
    );

    await waitFor(() => {
      // Updated to match the actual text in your HTML dump
      expect(
        screen.getByText(/You haven't joined any courses yet/i),
      ).toBeInTheDocument();
    });
  });
});
