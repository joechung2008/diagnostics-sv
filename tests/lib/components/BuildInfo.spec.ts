import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import BuildInfo from "../../../src/lib/components/BuildInfo.svelte";

describe("BuildInfo.svelte", () => {
  it("renders build version in the table", () => {
    render(BuildInfo, { buildVersion: "1.2.3" });

    // Table with accessible name
    expect(
      screen.getByRole("table", { name: /build info/i })
    ).toBeInTheDocument();

    // Column and value
    expect(screen.getByText("Build Version")).toBeInTheDocument();
    expect(screen.getByText("1.2.3")).toBeInTheDocument();
  });
});
