<script lang="ts">
import { httpClient } from "$lib/default";
import { type Job, Page } from "../types.js";

interface Props {
  job: Job;
  state: Page.State;
}

let { job, state }: Props = $props();

function getLevelBadgeClass(level: string) {
  switch (level) {
    case "junior":
      return "badge-outline badge-info";
    case "middle":
      return "badge-outline badge-warning";
    case "senior":
      return "badge-outline badge-error";
    default:
      return "badge-outline";
  }
}

function getLocationDisplay(job: Job) {
  return `${job.locationType} - ${job.locationCountry}`;
}

function getAvailableStatusAction(jobId: string) {
  if (state.jobIdsHidden.has(jobId)) {
    return "Show";
  } else {
    return "Hide";
  }
}

function handleStatusAction(jobId: string) {
  if (state.jobIdsHidden.has(jobId)) {
    Page.advanceState({
      state,
      event: {
        type: "job-id-shown",
        value: jobId,
      },
      httpClient,
    });
  } else {
    Page.advanceState({
      state,
      event: {
        type: "job-id-hidden",
        value: jobId,
      },
      httpClient,
    });
  }
}
</script>

<div class="brutal-box">
    <div class="p-4">
        <div class="flex justify-between items-start mb-3">
            <div class="flex-1">
                <h3 class="text-lg">{job.title}</h3>
                <p class="text-sm text-base-content/70 mb-2">{job.company}</p>
            </div>

            <button
                class="brutal-btn"
                onclick={() => handleStatusAction(job.id)}
            >
                {getAvailableStatusAction(job.id)}
            </button>
        </div>

        <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2 text-sm">
                <span class="font-medium">Location:</span>
                <span>{getLocationDisplay(job)}</span>
            </div>

            <div class="flex items-center gap-2 text-sm">
                <span class="font-medium">Level:</span>
                <div>
                    {job.level}
                </div>
            </div>

            {#if job.domains.length > 0}
                <div class="flex items-start gap-2 text-sm">
                    <span class="font-medium">Domains:</span>
                    <div class="flex flex-wrap gap-1">
                        {#each job.domains as domain}
                            <div
                                class="badge badge-outline badge-sm">{domain}</div>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>