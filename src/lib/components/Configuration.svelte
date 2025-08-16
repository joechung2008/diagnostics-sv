<script lang="ts">
  import {
    Heading,
    Table,
    TableHead,
    TableHeadCell,
    TableBody,
    TableBodyRow,
    TableBodyCell,
  } from "flowbite-svelte";

  let { config }: App.ConfigurationProps = $props();

  const items: App.KeyValuePair<string>[] = $derived.by(() =>
    Object.entries(config).map(([key, value]) => ({
      key,
      value,
    }))
  );
</script>

<div>
  <Heading tag="h2" class="leading-loose">Configuration</Heading>
  <Table aria-label="Configuration">
    <TableHead>
      <TableHeadCell>Key</TableHeadCell>
      <TableHeadCell>Value</TableHeadCell>
    </TableHead>
    <TableBody>
      {#each items as item (item.key)}
        <TableBodyRow>
          <TableBodyCell>{item.key}</TableBodyCell>
          <TableBodyCell>{item.value}</TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
</div>
