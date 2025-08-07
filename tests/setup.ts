import "@testing-library/jest-dom/vitest";
import {
  matchMedia as mockMatchMedia,
  MediaQueryListEvent as MockMediaQueryListEvent,
} from "mock-match-media";

// Ensure window.matchMedia and MediaQueryListEvent exist in jsdom
if (typeof window !== "undefined") {
  window.matchMedia = mockMatchMedia;

  if (typeof window.MediaQueryListEvent === "undefined") {
    window.MediaQueryListEvent =
      MockMediaQueryListEvent as unknown as typeof window.MediaQueryListEvent;
  }
}
