import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import ServerInfo from "../../../src/lib/components/ServerInfo.svelte";

describe("ServerInfo.svelte", () => {
  it("renders provided server info rows", () => {
    render(ServerInfo, {
      hostname: "my-host",
      uptime: 12345,
      serverId: "srv-001",
      deploymentId: "dep-abc",
      nodeVersions: "v20.12.0",
      extensionSync: { totalSyncAllCount: 42 },
    });

    // Table with accessible name
    expect(
      screen.getByRole("table", { name: /server info/i })
    ).toBeInTheDocument();

    // A few key rows and values
    expect(screen.getByText("Hostname")).toBeInTheDocument();
    expect(screen.getByText("my-host")).toBeInTheDocument();

    expect(screen.getByText("Node Versions")).toBeInTheDocument();
    expect(screen.getByText("v20.12.0")).toBeInTheDocument();

    expect(
      screen.getByText("Extension Sync | Total Sync All Count")
    ).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });
});
