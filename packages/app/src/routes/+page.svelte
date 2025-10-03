<script lang="ts">
import { onMount } from "svelte";
import JobFilters from "$lib/components/JobFilters.svelte";
import JobItem from "$lib/components/JobItem.svelte";
import { httpClient } from "$lib/default";
import { Page } from "$lib/types";

let pageState = $state(Page.createDefaultState());
onMount(() => {
  Page.advanceState({
    state: pageState,
    httpClient,
    event: {
      type: "new-date",
      value: pageState.filter.dateId,
    },
  });
});
</script>

<div class="container mx-auto p-4">
  <div class="flex flex-col gap-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">Brut Jobs</h1>
    </div>

    <JobFilters state={pageState}/>

    <div class="grid gap-4">
      {#if pageState.fetching === "none"}
        {#each pageState.jobs as job (job.id)}
          <JobItem {job} />
        {:else}
          <div class="text-center py-8">
            No jobs found matching your filters.
          </div>
        {/each}
      {:else if pageState.fetching === "in-progress"}
        <div class="text-center py-8">
          <span>Loading...</span>
        </div>
      {:else if pageState.fetching === "error"}
        <div class="text-center py-8">
          <span>Error happened! Please try again later!</span>
        </div>
      {/if}
    </div>
  </div>
</div>