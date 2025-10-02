import { getContext, setContext } from "svelte";
import { SvelteSet } from "svelte/reactivity";
import type {
  FilterDate,
  FilterStatus,
  Job,
  JobStatus,
  JobStoreState,
} from "./types.js";

const JOB_STORE_KEY = Symbol("jobStore");

export class JobStore {
  jobs = $state<Job[]>([]);
  state: JobStoreState = $state("idling");
  filterStatus = $state<FilterStatus>("all");
  filterDate = $state<FilterDate>("all");

  idsHidden = $state(new SvelteSet());

  constructor() {}

  filterByStatus(status: FilterStatus) {
    switch (status) {
      case "new": {
        const nowMs = Date.now();
        const oneDayMs = 24 * 60 * 60 * 1000;
        return this.jobs.filter((job) => nowMs - job.datePosted <= oneDayMs);
      }
      case "hidden":
        return this.jobs.filter((job) => this.idsHidden.has(job.id));
      case "all":
        return this.jobs;
    }
  }

  get filteredJobs() {
    let filtered = this.jobs;

    if (this.filterStatus !== "all") {
      filtered = filtered.filter((job) => job.status === this.filterStatus);
    }

    if (this.filterDate !== "all") {
      const now = Date.now();
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      const oneMonth = 30 * 24 * 60 * 60 * 1000;

      if (this.filterDate === "last_week") {
        filtered = filtered.filter((job) => job.datePosted > now - oneWeek);
      } else if (this.filterDate === "last_month") {
        filtered = filtered.filter((job) => job.datePosted > now - oneMonth);
      }
    }

    return filtered.sort((a, b) => b.datePosted - a.datePosted);
  }

  updateJobStatus(jobId: string, newStatus: JobStatus) {
    const job = this.jobs.find((j) => j.id === jobId);
    if (job) {
      job.status = newStatus;
      job.dateUpdated = Date.now();
    }
  }

  setStatusFilter(filter: FilterStatus) {
    this.filterStatus = filter;
  }

  setDateFilter(filter: FilterDate) {
    this.filterDate = filter;
  }

  getNextStatus(currentStatus: JobStatus): JobStatus[] {
    switch (currentStatus) {
      case "new":
        return ["applied", "hidden"];
      case "applied":
        return ["interviewing", "rejected"];
      case "interviewing":
        return ["offer", "rejected"];
      case "offer":
        return ["accepted", "rejected"];
      default:
        return [];
    }
  }
}

export function createJobStore() {
  return new JobStore();
}

export function setJobStore() {
  const store = createJobStore();
  setContext(JOB_STORE_KEY, store);
  return store;
}

export function getJobStore(): JobStore {
  const store = getContext<JobStore>(JOB_STORE_KEY);
  if (!store) {
    throw new Error(
      "Job store not found. Make sure to call setJobStore() in a parent component.",
    );
  }
  return store;
}
