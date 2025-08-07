import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import StageDefinition from "../../../src/lib/components/StageDefinition.svelte";

describe("StageDefinition.svelte", () => {
  it("renders stage definitions table with provided data", () => {
    const mockStageDefinition = {
      foo: ["bar", "baz"],
      alpha: ["beta"],
    };
    const { getByText } = render(StageDefinition, {
      props: { stageDefinition: mockStageDefinition },
    });

    // Heading
    expect(getByText("Stage Definitions")).toBeInTheDocument();
    // Table content
    expect(getByText("foo")).toBeInTheDocument();
    expect(getByText("bar, baz")).toBeInTheDocument();
    expect(getByText("alpha")).toBeInTheDocument();
    expect(getByText("beta")).toBeInTheDocument();
  });
});
