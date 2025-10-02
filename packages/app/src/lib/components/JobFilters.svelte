<script lang="ts">
import { Jobs } from "$lib/jobs-v2.svelte";
import type { JobFilter } from "../types.js";

const state: JobFilter.State = $state(Jobs.createDefaultFilterState());

const statusOptions: {
  value: JobFilter.Status;
  label: string;
  active: boolean;
}[] = [
  { value: "new", label: "New", active: true },
  { value: "hidden", label: "Hidden", active: false },
  { value: "all", label: "All", active: false },
];

const dateOptions: { value: JobFilter.Date; label: string }[] = [
  { value: "last-week", label: "Last Week" },
  { value: "last-month", label: "Last Month" },
  { value: "all", label: "All" },
];

function handleStatusFilter(value: JobFilter.Status) {
  Jobs.advanceFilterState({ state, event: { type: "new-status", value } });
}

function handleDateFilter(value: JobFilter.Date) {
  Jobs.advanceFilterState({ state, event: { type: "new-date", value } });
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
                        class:brutal-btn-selected={option.value === state.status}
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
                        class:brutal-btn-selected={option.value === state.dateId}
                        onclick={() => handleDateFilter(option.value)}
                    >
                        {option.label}
                    </button>
                {/each}
            </div>
        </div>
    </div>

    <div class="text-sm text-base-content/70">
        Showing {0} job(s)
    </div>
</div>
