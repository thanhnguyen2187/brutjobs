<script lang="ts">
import "../app.css";
import { httpClient } from "$lib/default";
import { setContext } from "svelte";

let { children } = $props();

setContext("HTTP_CLIENT", httpClient);
</script>

<svelte:head>
	<title>Brut Jobs</title>
</svelte:head>

<main class="container mx-auto p-4">
	{@render children?.()}
</main>
