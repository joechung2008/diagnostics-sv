import { render, screen } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";
import Extensions from "../../../src/lib/components/Extensions.svelte";

describe("Extensions.svelte", () => {
  it("renders nav with extension links from ExtensionInfo entries", async () => {
    const onLinkClick = vi.fn();
    render(Extensions, {
      extensions: {
        extA: {
          extensionName: "Ext A",
          config: undefined,
          stageDefinition: undefined,
        },
        // Should be filtered out by isExtensionInfo
        extErr: {
          lastError: {
            errorMessage: "x",
            time: "now",
          },
        },
      },
      onLinkClick,
    });

    // Sidebar navigation exists with accessible name
    // The Flowbite Sidebar sets aria-label="Extensions"
    // Use role navigation to find it if exposed as such; fall back to text assertions
    expect(screen.getByText("Ext A")).toBeInTheDocument();
  });
});
