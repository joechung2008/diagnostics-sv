<script lang="ts">
  import favicon from "$lib/assets/favicon.ico";
  import "../app.css";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>Azure Portal Extension Dashboard</title>
</svelte:head>

{@render children?.()}
