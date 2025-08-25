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
  <div class="flex h-full flex-col">
    <Navbar breakpoint="sm" class="py-0 sm:py-0">
      <NavUl>
        <NavLi>
          <button
            type="button"
            class="w-full cursor-pointer text-left"
            onclick={() => {
              isOpen = !isOpen;
            }}
          >
            {environmentName}<ChevronDownOutline class="inline" />
          </button>
        </NavLi>
        <Dropdown bind:isOpen simple>
          {#each environments as env (env.key)}
            <DropdownItem onclick={env.onClick}>
              {env.text}
            </DropdownItem>
          {/each}
        </Dropdown>
        {#if showPaasServerless}
          <NavLi>
            <button
              type="button"
              class="w-full cursor-pointer text-left"
              onclick={() => {
                const paasserverless = extensions["paasserverless"];
                if (isExtensionInfo(paasserverless)) {
                  extension = paasserverless;
                }
              }}
            >
              paasserverless
            </button>
          </NavLi>
        {/if}
        <NavLi>
          <button
            type="button"
            class="w-full cursor-pointer text-left"
            onclick={() => {
              const websites = extensions["websites"];
              if (isExtensionInfo(websites)) {
                extension = websites;
              }
            }}
          >
            websites
          </button>
        </NavLi>
      </NavUl>
      <div class="flex">
        <DarkMode />
        <NavHamburger />
      </div>
    </Navbar>
    <Tabs tabStyle="underline" class="pb-4">
      <TabItem title="Extensions" onclick={() => selectTab("extensions")} />
      <TabItem title="Build Information" onclick={() => selectTab("build")} />
      <TabItem title="Server Information" onclick={() => selectTab("server")} />
    </Tabs>
    {#if selectedTab === "extensions"}
      <div class="box-border flex overflow-y-auto">
        <div class="flex size-full flex-row gap-1">
          <Extensions {extensions} {onLinkClick} />
          {#if extension && isExtensionInfo(extension)}
            <Extension {...extension} />
          {/if}
        </div>
      </div>
    {/if}
    {#if selectedTab === "build" && diagnostics.buildInfo}
      <div class="box-border flex overflow-y-auto">
        <BuildInfo {...diagnostics.buildInfo} />
      </div>
    {/if}
    {#if selectedTab === "server" && diagnostics.serverInfo}
      <div class="box-border flex overflow-y-auto">
        <ServerInfo {...diagnostics.serverInfo} />
      </div>
    {/if}
  </div>
{/if}
