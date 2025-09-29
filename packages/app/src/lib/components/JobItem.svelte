<script lang="ts">
import { getJobStore } from "../jobs.svelte.js";
import type { Job } from "../types.js";

interface Props {
  job: Job;
}

let { job }: Props = $props();

const jobStore = getJobStore();

function handleStatusChange(newStatus: string) {
  jobStore.updateJobStatus(job.id, newStatus as any);
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "new":
      return "brutal-color-info";
    case "applied":
      return "brutal-color-warning";
    case "hidden":
      return "";
    case "interviewing":
      return "brutal-color-warning";
    case "rejected":
      return "brutal-color-danger";
    case "offer":
      return "brutal-color-success";
    case "accepted":
      return "brutal-color-success";
    default:
      return "";
  }
}

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
  return `${job.location.type} - ${job.location.country}`;
}

const nextStatuses = jobStore.getNextStatus(job.status);
</script>

<div class="brutal-box">
    <div class="p-4">
        <div class="flex justify-between items-start mb-3">
            <div class="flex-1">
                <h3 class="text-lg">{job.title}</h3>
                <p class="text-sm text-base-content/70 mb-2">{job.company}</p>
            </div>

            <button class="brutal-btn">Hide</button>
        </div>

        <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2 text-sm">
                <span class="font-medium">Location:</span>
                <span>{getLocationDisplay(job)}</span>
            </div>

            <div class="flex items-center gap-2 text-sm">
                <span class="font-medium">Level:</span>
                <div class="badge {getLevelBadgeClass(job.level)}">
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