import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import Configuration from "../../../src/lib/components/Configuration.svelte";

describe("Configuration.svelte", () => {
  it("renders provided config key/value rows", () => {
    render(Configuration, {
      config: {
        API_URL: "https://api.example.com",
        FEATURE_X: "enabled",
      },
    });

    // Table with accessible name
    expect(
      screen.getByRole("table", { name: /configuration/i })
    ).toBeInTheDocument();

    // Headers
    expect(screen.getByText("Key")).toBeInTheDocument();
    expect(screen.getByText("Value")).toBeInTheDocument();

    // Rows
    expect(screen.getByText("API_URL")).toBeInTheDocument();
    expect(screen.getByText("https://api.example.com")).toBeInTheDocument();
    expect(screen.getByText("FEATURE_X")).toBeInTheDocument();
    expect(screen.getByText("enabled")).toBeInTheDocument();
  });
});
