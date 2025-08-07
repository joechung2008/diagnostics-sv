<script lang="ts">
  import favicon from "$lib/assets/favicon.ico";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import "../app.css";

  let { children } = $props();

  const queryClient = new QueryClient();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>Azure Portal Extension Dashboard</title>
</svelte:head>

<QueryClientProvider client={queryClient}>
  {@render children?.()}
</QueryClientProvider>
