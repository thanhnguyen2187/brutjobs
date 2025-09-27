import { getContext, setContext } from "svelte";
import type { DateFilter, Job, JobStatus, StatusFilter } from "./types.js";

const JOB_STORE_KEY = Symbol("jobStore");

export class JobStore {
  jobs = $state<Job[]>([]);
  statusFilter = $state<StatusFilter>("all");
  dateFilter = $state<DateFilter>("all");

  constructor() {
    this.loadSampleData();
  }

  private loadSampleData() {
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const oneMonth = 30 * 24 * 60 * 60 * 1000;

    this.jobs = [
      {
        id: "1",
        title: "Senior Frontend Developer",
        company: "TechCorp",
        location: { type: "remote", country: "USA" },
        level: "senior",
        domains: ["web development", "AI"],
        status: "new",
        datePosted: now - oneWeek / 2,
        dateUpdated: now - oneWeek / 2,
      },
      {
        id: "2",
        title: "Blockchain Engineer",
        company: "CryptoStart",
        location: { type: "hybrid", country: "Global" },
        level: "middle",
        domains: ["blockchain/cryptocurrency", "finance"],
        status: "applied",
        datePosted: now - oneWeek,
        dateUpdated: now - oneWeek / 3,
      },
      {
        id: "3",
        title: "Junior Data Scientist",
        company: "DataHub",
        location: { type: "onsite", country: "Vietnam" },
        level: "junior",
        domains: ["data science", "AI"],
        status: "interviewing",
        datePosted: now - oneMonth / 2,
        dateUpdated: now - oneWeek / 4,
      },
      {
        id: "4",
        title: "DevOps Engineer",
        company: "CloudTech",
        location: { type: "remote", country: "USA" },
        level: "middle",
        domains: ["devops", "databases"],
        status: "hidden",
        datePosted: now - oneMonth,
        dateUpdated: now - oneMonth,
      },
      {
        id: "5",
        title: "Cybersecurity Specialist",
        company: "SecureNet",
        location: { type: "hybrid", country: "Global" },
        level: "senior",
        domains: ["cybersecurity", "finance"],
        status: "rejected",
        datePosted: now - oneMonth - oneWeek,
        dateUpdated: now - oneWeek,
      },
    ];
  }

  get filteredJobs() {
    let filtered = this.jobs;

    if (this.statusFilter !== "all") {
      filtered = filtered.filter((job) => job.status === this.statusFilter);
    }

    if (this.dateFilter !== "all") {
      const now = Date.now();
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      const oneMonth = 30 * 24 * 60 * 60 * 1000;

      if (this.dateFilter === "last_week") {
        filtered = filtered.filter((job) => job.datePosted > now - oneWeek);
      } else if (this.dateFilter === "last_month") {
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

  setStatusFilter(filter: StatusFilter) {
    this.statusFilter = filter;
  }

  setDateFilter(filter: DateFilter) {
    this.dateFilter = filter;
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
