<script lang="ts">
import { getJobStore } from "../jobs.svelte.js";
import type { FilterDate, FilterStatus } from "../types.js";

const jobStore = getJobStore();

const statusOptions: { value: FilterStatus; label: string; active: boolean }[] =
  [
    { value: "new", label: "New", active: true },
    { value: "hidden", label: "Hidden", active: false },
    { value: "all", label: "All", active: false },
  ];

const dateOptions: { value: FilterDate; label: string }[] = [
  { value: "last_week", label: "Last Week" },
  { value: "last_month", label: "Last Month" },
  { value: "all", label: "All" },
];

function handleStatusFilter(status: FilterStatus) {
  jobStore.setStatusFilter(status);
}

function handleDateFilter(date: FilterDate) {
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
