<script lang="ts">
import { getJobStore } from "../jobs.svelte.js";
import type { DateFilter, StatusFilter } from "../types.js";

const jobStore = getJobStore();

const statusOptions: { value: StatusFilter; label: string; active: boolean }[] =
  [
    { value: "all", label: "All", active: true },
    { value: "new", label: "New", active: false },
    { value: "applied", label: "Applied", active: false },
    { value: "hidden", label: "Hidden", active: false },
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
  <div class="flex flex-col md:flex-row gap-2 sm:gap-8">
    <div class="flex flex-col gap-2">
      <span class="text-sm font-medium">Filter by Status:</span>
      <div class="flex gap-2">
        {#each statusOptions as option}
          <button
            class="brutal-btn"
            class:brutal-btn-selected={option.active}
            onclick={() => handleStatusFilter(option.value)}
          >
            {option.label}
          </button>
        {/each}
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-sm font-medium">Filter by Date:</span>
      <div class="flex gap-2">
        {#each dateOptions as option}
          <button
            class="brutal-btn"
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