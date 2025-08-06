<script lang="ts">
  import {
    Heading,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from "flowbite-svelte";

  let { stageDefinition }: StageDefinitionProps = $props();

  const items: KeyValuePair<string[]>[] = $derived.by(() =>
    Object.entries(stageDefinition).map(([key, value]) => ({
      key,
      value,
    }))
  );
</script>

<div>
  <Heading tag="h2" class="leading-loose">Stage Definitions</Heading>
  <Table aria-label="Stage Definitions">
    <TableHead>
      <TableHeadCell>Key</TableHeadCell>
      <TableHeadCell>Value</TableHeadCell>
    </TableHead>
    <TableBody>
      {#each items as item (item.key)}
        <TableBodyRow>
          <TableBodyCell>{item.key}</TableBodyCell>
          <TableBodyCell>{item.value.join(", ")}</TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
</div>
