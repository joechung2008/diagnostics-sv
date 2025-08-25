<script lang="ts">
  import { byKey, isExtensionInfo, toNavLink } from "$lib/utils";
  import { Sidebar, SidebarGroup, SidebarItem } from "flowbite-svelte";

  let { extensions, onLinkClick }: App.ExtensionsProps = $props();

  const links = $derived.by(() =>
    Object.values(extensions).filter(isExtensionInfo).map(toNavLink).sort(byKey)
  );
</script>

<div class="flex flex-none flex-col gap-0.5 overflow-y-auto p-1">
  <Sidebar
    alwaysOpen
    aria-label="Extensions"
    position="static"
    class="!z-0 w-auto"
  >
    <SidebarGroup>
      {#each links as link (link.key)}
        <SidebarItem
          label={link.name}
          onclick={() => onLinkClick?.(link)}
          class="cursor-pointer"
          tabindex={0}
        />
      {/each}
    </SidebarGroup>
  </Sidebar>
</div>
