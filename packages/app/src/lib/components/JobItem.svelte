<script lang="ts">
import type { Job } from "../types.js";

interface Props {
  job: Job;
}

let { job }: Props = $props();

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