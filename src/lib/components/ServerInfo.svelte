<script lang="ts">
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from "flowbite-svelte";

  let {
    deploymentId,
    extensionSync,
    hostname,
    nodeVersions,
    serverId,
    uptime,
  }: ServerInfoProps = $props();

  const items = [
    { name: "Hostname", value: hostname },
    { name: "Uptime", value: uptime },
    { name: "Server ID", value: serverId },
    { name: "Deployment ID", value: deploymentId },
    { name: "Node Versions", value: nodeVersions },
    {
      name: "Extension Sync | Total Sync All Count",
      value: extensionSync.totalSyncAllCount,
    },
  ];
</script>

<Table aria-label="Server Info">
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
