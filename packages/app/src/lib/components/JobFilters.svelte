<script lang="ts">
import { getContext } from "svelte";
import type { HttpClient } from "$lib/http-client";
import useLocalStorage from "$lib/use-local-storage.svelte";
import { type JobFilter, Page } from "../types.js";

const httpClient = getContext<HttpClient>("HTTP_CLIENT");
const { state }: { state: Page.State } = $props();
const filter = $derived(state.filter);

const statusOptions: {
  value: JobFilter.Status;
  label: string;
}[] = [
  { value: "new", label: "New" },
  { value: "hidden", label: "Hidden" },
  { value: "all", label: "All" },
];

const dateOptions: { value: JobFilter.Date; label: string }[] = [
  { value: "last-7-days", label: "Last Week" },
  { value: "last-30-days", label: "Last Month" },
  { value: "all", label: "All" },
];

function handleStatusFilter(value: JobFilter.Status) {
  Page.advanceState({
    state,
    event: { type: "new-status", value },
    httpClient,
  });
}

function handleDateFilter(value: JobFilter.Date) {
  Page.advanceState({
    state,
    event: { type: "new-date", value },
    httpClient,
  });
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
                        class:brutal-btn-selected={option.value === filter.status}
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
                        class:brutal-btn-selected={option.value === filter.dateId}
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
