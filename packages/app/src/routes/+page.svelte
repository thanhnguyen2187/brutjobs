<script lang="ts">
import JobFilters from "$lib/components/JobFilters.svelte";
import JobItem from "$lib/components/JobItem.svelte";
import { Page } from "$lib/types";

let pageState = $state(Page.createDefaultState());
</script>

<div class="container mx-auto p-4">
  <div class="flex flex-col gap-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">Brut Jobs</h1>
    </div>

    <JobFilters state={pageState}/>

    {#if pageState.fetching === "none"}
      <div class="grid gap-4">
        {#each pageState.jobs as job (job.id)}
          <JobItem {job} />
        {:else}
          <div class="text-center py-8">
            No jobs found matching your filters.
          </div>
        {/each}
      </div>
    {:else if pageState.fetching === "in-progress"}
      <div>
        <span>Loading...</span>
      </div>
    {:else if pageState.fetching === "error"}
      <div>
        <span>Error happened! Please try again later!</span>
      </div>
    {/if}
  </div>
</div>