import { render, screen, fireEvent } from "@testing-library/svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";

const PUBLIC = "https://hosting.portal.azure.net/api/diagnostics";
const FAIRFAX = "https://hosting.azureportal.usgovcloudapi.net/api/diagnostics";
const MOONCAKE = "https://hosting.azureportal.chinacloudapi.cn/api/diagnostics";

type ExtensionInfo = {
  extensionName: string;
  config: Record<string, string> | undefined;
  stageDefinition: Record<string, string[]> | undefined;
};
type ExtensionError = { lastError: { errorMessage: string; time: string } };
type Extension = ExtensionInfo | ExtensionError;

type Diagnostics = {
  buildInfo: { buildVersion: string };
  extensions: Record<string, Extension>;
  serverInfo: {
    deploymentId: string;
    extensionSync: { totalSyncAllCount: number };
    hostname: string;
    nodeVersions: string;
    serverId: string;
    uptime: number;
  };
};

const baseDiagnostics: Diagnostics = {
  buildInfo: { buildVersion: "1.0.0" },
  extensions: {
    websites: {
      extensionName: "websites",
      config: undefined,
      stageDefinition: undefined,
    },
    paasserverless: {
      extensionName: "paasserverless",
      config: undefined,
      stageDefinition: undefined,
    },
  },
  serverInfo: {
    deploymentId: "dep-1",
    extensionSync: { totalSyncAllCount: 99 },
    hostname: "host-1",
    nodeVersions: "v20.12.0",
    serverId: "srv-1",
    uptime: 1234,
  },
};

const diagnosticsByEnv: Record<string, Diagnostics> = {
  [PUBLIC]: {
    ...baseDiagnostics,
    buildInfo: { buildVersion: "1.0.0" },
  },
  [FAIRFAX]: {
    ...baseDiagnostics,
    buildInfo: { buildVersion: "2.0.0" },
  },
  [MOONCAKE]: {
    ...baseDiagnostics,
    buildInfo: { buildVersion: "3.0.0" },
  },
};

const testMocks = vi.hoisted(() => ({
  fetchDiagnosticsMock: vi.fn<(env: string) => Promise<Diagnostics>>(),
}));

// Keep the real utils except for fetchDiagnostics
vi.mock("$lib/utils", async () => {
  const actual =
    await vi.importActual<typeof import("$lib/utils")>("$lib/utils");
  return {
    ...actual,
    fetchDiagnostics: testMocks.fetchDiagnosticsMock,
  };
});

vi.mock("../../src/lib/utils", async () => {
  const actual = await vi.importActual<typeof import("../../src/lib/utils")>(
    "../../src/lib/utils"
  );
  return {
    ...actual,
    fetchDiagnostics: testMocks.fetchDiagnosticsMock,
  };
});

// Mock svelte-query's createQuery with a minimal typed Svelte-like store that supports
// $query.data and $query.refetch() usage in the component.
vi.mock("@tanstack/svelte-query", () => {
  type QueryState<T> = {
    data: T | undefined;
    refetch: () => Promise<{ data: T }>;
  };

  function createStore<T>(initial: T) {
    let value = initial;
    const subs = new Set<(val: T) => void>();
    return {
      set(v: T) {
        value = v;
        subs.forEach((s) => s(value));
      },
      update(fn: (v: T) => T) {
        value = fn(value);
        subs.forEach((s) => s(value));
      },
      subscribe(run: (val: T) => void) {
        run(value);
        subs.add(run);
        return () => subs.delete(run);
      },
      get() {
        return value;
      },
    };
  }

  return {
    createQuery: <T>({ queryFn }: { queryFn: () => Promise<T> }) => {
      const store = createStore<QueryState<T>>({
        data: undefined,
        refetch: async () => {
          const data = await queryFn();
          store.update((v) => ({ ...v, data }));
          return { data };
        },
      });

      // Eagerly fetch once on creation
      setTimeout(() => {
        store.get().refetch();
      }, 0);

      return store;
    },
  };
});

// Stub only DarkMode from flowbite-svelte to avoid window.matchMedia usage in client scripts
vi.mock("flowbite-svelte", async () => {
  const actual =
    await vi.importActual<typeof import("flowbite-svelte")>("flowbite-svelte");
  // Provide a function component that returns a DOM node (Svelte 5 calls components without 'new')
  const DarkMode = () => {
    const el = document.createElement("div");
    el.setAttribute("data-stub", "DarkMode");
    return el;
  };
  return { ...actual, DarkMode };
});

import Page from "../../src/routes/+page.svelte";

describe("+page.svelte", () => {
  beforeEach(() => {
    testMocks.fetchDiagnosticsMock.mockReset();
    testMocks.fetchDiagnosticsMock.mockImplementation(
      async (env: string) => diagnosticsByEnv[env]
    );
    document.body.innerHTML = "";
    document.head.innerHTML = "";
  });

  it("loads diagnostics and shows default environment name", async () => {
    render(Page);

    // Initial fetch for Public environment

    // Environment name should show Public Cloud
    expect(await screen.findByText("Public Cloud")).toBeInTheDocument();

    // Tabs should render; verify Extensions tab content appears (sidebar label)
    expect(screen.getByText("Extensions")).toBeInTheDocument();
  });

  it("renders extension nav items", async () => {
    render(Page);

    // Wait for initial data
    await screen.findByText("Public Cloud");

    // Conditional nav item should exist (may appear in both navbar and sidebar)
    expect(screen.getAllByText("paasserverless").length).toBeGreaterThan(0);
    expect(screen.getAllByText("websites").length).toBeGreaterThan(0);
  });

  it("renders tab titles", async () => {
    render(Page);

    await screen.findByText("Public Cloud");

    expect(screen.getByText("Extensions")).toBeInTheDocument();
    expect(screen.getByText("Build Information")).toBeInTheDocument();
    expect(screen.getByText("Server Information")).toBeInTheDocument();
  });

  it("selects websites in navbar and shows its Extension details", async () => {
    render(Page);
    await screen.findByText("Public Cloud");

    // Click the navbar 'websites' item
    await fireEvent.click(screen.getAllByText("websites")[0]);

    // Extension component heading should show the selected extension name (h1)
    expect(
      await screen.findByRole("heading", { name: "websites" })
    ).toBeInTheDocument();
  });

  it("selects paasserverless in navbar and shows its Extension details (when available)", async () => {
    render(Page);
    await screen.findByText("Public Cloud");

    const items = screen.getAllByText("paasserverless");
    expect(items.length).toBeGreaterThan(0);

    await fireEvent.click(items[0]);

    expect(
      await screen.findByRole("heading", { name: "paasserverless" })
    ).toBeInTheDocument();
  });

  it("clicks an extension in the sidebar and shows its Extension details", async () => {
    render(Page);
    await screen.findByText("Public Cloud");

    // 'websites' appears in navbar and sidebar; click the last occurrence to prefer sidebar
    const links = screen.getAllByText("websites");
    await fireEvent.click(links[links.length - 1]);

    expect(
      await screen.findByRole("heading", { name: "websites" })
    ).toBeInTheDocument();
  });

  it("does not render paasserverless nav when extension is absent", async () => {
    // For this test, return diagnostics without paasserverless
    testMocks.fetchDiagnosticsMock.mockReset();
    testMocks.fetchDiagnosticsMock.mockImplementation(async () => ({
      buildInfo: { buildVersion: "1.0.0" },
      extensions: {
        websites: {
          extensionName: "websites",
          config: undefined,
          stageDefinition: undefined,
        },
      },
      serverInfo: {
        deploymentId: "dep-1",
        extensionSync: { totalSyncAllCount: 99 },
        hostname: "host-1",
        nodeVersions: "v20.12.0",
        serverId: "srv-1",
        uptime: 1234,
      },
    }));

    render(Page);
    await screen.findByText("Public Cloud");

    // paasserverless should not appear anywhere in the DOM
    expect(screen.queryByText("paasserverless")).toBeNull();
  });

  it("navigates between tabs and shows Build and Server info content", async () => {
    render(Page);
    await screen.findByText("Public Cloud");

    // Build tab
    await fireEvent.click(screen.getByText("Build Information"));
    expect(await screen.findByText("Build Version")).toBeInTheDocument();
    expect(screen.getByText("1.0.0")).toBeInTheDocument();

    // Server tab
    await fireEvent.click(screen.getByText("Server Information"));
    expect(await screen.findByText("Hostname")).toBeInTheDocument();
    expect(screen.getByText("host-1")).toBeInTheDocument();
    expect(screen.getByText("Uptime")).toBeInTheDocument();
    expect(screen.getByText("1234")).toBeInTheDocument();
  });
});
