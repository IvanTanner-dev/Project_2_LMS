import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fireConfetti } from "../confetti";
import confetti from "canvas-confetti";

// 1. Mock the external confetti library
vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
}));

describe("Confetti Utility", () => {
  beforeEach(() => {
    vi.useFakeTimers(); // Enable fake timers
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers(); // Clean up
  });

  it("triggers confetti multiple times over the duration", () => {
    fireConfetti();

    // 2. Fast-forward 250ms (the first interval)
    vi.advanceTimersByTime(250);

    // Check if the confetti library was called
    expect(confetti).toHaveBeenCalled();

    // 3. Fast-forward to the end of the duration (3000ms)
    vi.advanceTimersByTime(3000);

    const callCountBeforeClear = confetti.mock.calls.length;

    // 4. Move forward more—it should have stopped firing
    vi.advanceTimersByTime(1000);
    expect(confetti.mock.calls.length).toBe(callCountBeforeClear);
  });
});
