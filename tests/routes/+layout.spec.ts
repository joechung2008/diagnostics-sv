import { render } from "@testing-library/svelte";
import Layout from "../../src/routes/+layout.svelte";
import { describe, it, expect, beforeEach } from "vitest";

describe("+layout.svelte", () => {
  beforeEach(() => {
    document.title = "";
  });

  it("sets the document title and includes a favicon", () => {
    render(Layout);

    // Title from layout head
    expect(document.title).toBe("Azure Portal Extension Dashboard");

    // Favicon link should be set
    const icon = document.head.querySelector('link[rel="icon"]');
    expect(icon).not.toBeNull();
  });
});
