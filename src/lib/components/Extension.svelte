<script lang="ts">
  import { Heading } from "flowbite-svelte";
  import Configuration from "./Configuration.svelte";
  import StageDefinition from "./StageDefinition.svelte";

  let { config, extensionName, stageDefinition }: App.ExtensionProps = $props();
</script>

<div class="root">
  <Heading tag="h1">
    {extensionName}
  </Heading>
  {#if config}
    <Configuration {config} />
  {/if}
  {#if stageDefinition}
    <StageDefinition {stageDefinition} />
  {/if}
</div>
