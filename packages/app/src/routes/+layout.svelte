<script lang="ts">
import "../app.css";

let { children } = $props();
</script>

<svelte:head>
	<title>Brut Jobs</title>
</svelte:head>

<main class="container mx-auto p-4">
	{@render children?.()}
</main>
