<script lang="ts">
  import { setJobStore } from '$lib/jobs.svelte.js';
  import JobFilters from '$lib/components/JobFilters.svelte';
  import JobItem from '$lib/components/JobItem.svelte';

  const jobStore = setJobStore();
</script>

<div class="container mx-auto p-4">
  <div class="flex flex-col gap-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">Job Board</h1>
    </div>

    <JobFilters />

    <div class="grid gap-4">
      {#each jobStore.filteredJobs as job (job.id)}
        <JobItem {job} />
      {:else}
        <div class="text-center py-8 text-base-content/60">
          No jobs found matching your filters.
        </div>
      {/each}
    </div>
  </div>
</div>