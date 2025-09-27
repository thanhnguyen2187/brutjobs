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
      return "brutal-alert-info";
    case "applied":
      return "brutal-alert-warning";
    case "hidden":
      return "";
    case "interviewing":
      return "brutal-alert-warning";
    case "rejected":
      return "brutal-alert-danger";
    case "offer":
      return "brutal-alert-success";
    case "accepted":
      return "brutal-alert-success";
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
            <div
                class="brutal-alert {getStatusBadgeClass(job.status)}"
            >{job.status}</div>
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

        {#if nextStatuses.length > 0}
            <select class="brutal-select">
                <option>(pick to change status)</option>
                {#each nextStatuses as status}
                    <option>{status}</option>
                {/each}
            </select>
        {/if}
    </div>
</div>