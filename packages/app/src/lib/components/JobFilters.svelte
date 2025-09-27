<script lang="ts">
import { getJobStore } from "../jobs.svelte.js";
import type { DateFilter, StatusFilter } from "../types.js";

const jobStore = getJobStore();

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All Jobs" },
  { value: "new", label: "New Jobs" },
  { value: "applied", label: "Applied Jobs" },
  { value: "hidden", label: "Hidden Jobs" },
];

const dateOptions: { value: DateFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "last_week", label: "Last Week" },
  { value: "last_month", label: "Last Month" },
];

function handleStatusFilter(status: StatusFilter) {
  jobStore.setStatusFilter(status);
}

function handleDateFilter(date: DateFilter) {
  jobStore.setDateFilter(date);
}
</script>

<div class="flex flex-col gap-4 mb-6">
  <div class="flex flex-col sm:flex-row gap-4">
    <div class="flex flex-col gap-2">
      <span class="text-sm font-medium">Filter by Status:</span>
      <div class="btn-group btn-group-horizontal">
        {#each statusOptions as option}
          <button
            class="btn btn-sm {jobStore.statusFilter === option.value ? 'btn-active' : 'btn-outline'}"
            onclick={() => handleStatusFilter(option.value)}
          >
            {option.label}
          </button>
        {/each}
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-sm font-medium">Filter by Date:</span>
      <div class="btn-group btn-group-horizontal">
        {#each dateOptions as option}
          <button
            class="btn btn-sm {jobStore.dateFilter === option.value ? 'btn-active' : 'btn-outline'}"
            onclick={() => handleDateFilter(option.value)}
          >
            {option.label}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <div class="text-sm text-base-content/70">
    Showing {jobStore.filteredJobs.length} job{jobStore.filteredJobs.length === 1 ? '' : 's'}
  </div>
</div>