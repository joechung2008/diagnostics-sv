<script lang="ts">
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from "flowbite-svelte";

  let { buildVersion }: BuildInfoProps = $props();

  const items = [{ name: "Build Version", value: buildVersion }];
</script>

<Table aria-label="Build Info">
  <TableHead>
    <TableHeadCell>Name</TableHeadCell>
    <TableHeadCell>Value</TableHeadCell>
  </TableHead>
  <TableBody>
    {#each items as item (item.name)}
      <TableBodyRow>
        <TableBodyCell>{item.name}</TableBodyCell>
        <TableBodyCell>{item.value}</TableBodyCell>
      </TableBodyRow>
    {/each}
  </TableBody>
</Table>
