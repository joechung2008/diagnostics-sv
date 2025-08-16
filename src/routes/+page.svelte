<script lang="ts">
  import BuildInfo from "$lib/components/BuildInfo.svelte";
  import Extension from "$lib/components/Extension.svelte";
  import Extensions from "$lib/components/Extensions.svelte";
  import ServerInfo from "$lib/components/ServerInfo.svelte";
  import { fetchDiagnostics, isExtensionInfo } from "$lib/utils";
  import { createQuery } from "@tanstack/svelte-query";
  import {
    DarkMode,
    Dropdown,
    DropdownItem,
    Navbar,
    NavHamburger,
    NavLi,
    NavUl,
    TabItem,
    Tabs,
  } from "flowbite-svelte";
  import { ChevronDownOutline } from "flowbite-svelte-icons";

  type Diagnostics = App.Diagnostics;
  type ExtensionInfo = App.ExtensionInfo;
  type KeyedNavLink = App.KeyedNavLink;

  enum Environment {
    Public = "https://hosting.portal.azure.net/api/diagnostics",
    Fairfax = "https://hosting.azureportal.usgovcloudapi.net/api/diagnostics",
    Mooncake = "https://hosting.azureportal.chinacloudapi.cn/api/diagnostics",
  }

  let extension = $state<ExtensionInfo>();
  let environment = $state(Environment.Public);
  let isOpen = $state(false);
  let selectedTab = $state("extensions");

  const query = createQuery<Diagnostics>({
    queryKey: ["diagnostics"],
    queryFn: () => fetchDiagnostics(environment),
    refetchOnWindowFocus: false,
  });

  const diagnostics = $derived.by(() => $query.data);

  const extensions = $derived.by(() => diagnostics?.extensions ?? {});

  const environmentName = $derived.by(() => {
    switch (environment) {
      case Environment.Public:
        return "Public Cloud";
      case Environment.Fairfax:
        return "Fairfax";
      case Environment.Mooncake:
        return "Mooncake";
      default:
        return "Select environment";
    }
  });

  const showPaasServerless = $derived.by(() =>
    isExtensionInfo(extensions["paasserverless"])
  );

  const environments = $derived.by(() => [
    {
      key: "public",
      text: "Public Cloud",
      selected: environment === Environment.Public,
      onClick: () => {
        environment = Environment.Public;
        extension = undefined;
        isOpen = false;
        $query.refetch();
      },
    },
    {
      key: "fairfax",
      text: "Fairfax",
      selected: environment === Environment.Fairfax,
      onClick: () => {
        environment = Environment.Fairfax;
        extension = undefined;
        isOpen = false;
        $query.refetch();
      },
    },
    {
      key: "mooncake",
      text: "Mooncake",
      selected: environment === Environment.Mooncake,
      onClick: () => {
        environment = Environment.Mooncake;
        extension = undefined;
        isOpen = false;
        $query.refetch();
      },
    },
  ]);

  function onLinkClick(item?: KeyedNavLink) {
    if (item) {
      const ext = extensions[item.key];
      if (isExtensionInfo(ext)) {
        extension = ext;
      }
    }
  }

  function selectTab(tab: string) {
    selectedTab = tab;
  }
</script>

{#if diagnostics}
  <Navbar breakpoint="sm">
    <NavUl>
      <NavLi
        class="cursor-pointer"
        onclick={() => {
          isOpen = !isOpen;
        }}
      >
        {environmentName}<ChevronDownOutline class="inline" />
      </NavLi>
      <Dropdown bind:isOpen simple>
        {#each environments as env (env.key)}
          <DropdownItem onclick={env.onClick}>
            {env.text}
          </DropdownItem>
        {/each}
      </Dropdown>
      {#if showPaasServerless}
        <NavLi
          class="cursor-pointer"
          onclick={() => {
            const paasserverless = extensions["paasserverless"];
            if (isExtensionInfo(paasserverless)) {
              extension = paasserverless;
            }
          }}
        >
          paasserverless
        </NavLi>
      {/if}
      <NavLi
        class="cursor-pointer"
        onclick={() => {
          const websites = extensions["websites"];
          if (isExtensionInfo(websites)) {
            extension = websites;
          }
        }}
      >
        websites
      </NavLi>
    </NavUl>
    <div class="flex">
      <DarkMode />
      <NavHamburger />
    </div>
  </Navbar>
  <Tabs>
    <TabItem
      open={selectedTab === "extensions"}
      title="Extensions"
      onclick={() => selectTab("extensions")}
    >
      <div class="flex flex-row gap-4">
        <Extensions {extensions} {onLinkClick} />
        <div class="grow">
          {#if extension && isExtensionInfo(extension)}
            <Extension {...extension} />
          {/if}
        </div>
      </div>
    </TabItem>
    <TabItem
      open={selectedTab === "build"}
      title="Build Information"
      onclick={() => selectTab("build")}
    >
      <BuildInfo {...diagnostics.buildInfo} />
    </TabItem>
    <TabItem
      open={selectedTab === "server"}
      title="Server Information"
      onclick={() => selectTab("server")}
    >
      <ServerInfo {...diagnostics.serverInfo} />
    </TabItem>
  </Tabs>
{/if}
