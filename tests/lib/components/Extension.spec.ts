import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import Extension from "../../../src/lib/components/Extension.svelte";

describe("Extension.svelte", () => {
  it("renders extension name heading", () => {
    render(Extension, {
      extensionName: "MyExt",
      config: undefined,
      stageDefinition: undefined,
    });

    expect(
      screen.getByRole("heading", { name: "MyExt", level: 1 })
    ).toBeInTheDocument();
  });
});
