<script lang="ts">
import JobFilters from "$lib/components/JobFilters.svelte";
import JobItem from "$lib/components/JobItem.svelte";

const jobs = [];
</script>

<div class="container mx-auto p-4">
  <div class="flex flex-col gap-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">Brut Jobs</h1>
    </div>

    <JobFilters />

    <div class="grid gap-4">
      {#each jobs as job (job.id)}
        <JobItem {job} />
      {:else}
        <div class="text-center py-8">
          No jobs found matching your filters.
        </div>
      {/each}
    </div>
  </div>
</div>