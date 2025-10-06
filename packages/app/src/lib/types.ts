import { subDays } from "date-fns";
import type { HttpClient } from "./http-client";

export type JobStatus =
  | "new"
  | "applied"
  | "hidden"
  | "interviewing"
  | "rejected"
  | "offer"
  | "accepted";
export type JobLevel = "junior" | "middle" | "senior";
export type JobDomain =
  | "blockchain/cryptocurrency"
  | "finance"
  | "databases"
  | "AI"
  | "web development"
  | "mobile development"
  | "devops"
  | "data science"
  | "cybersecurity"
  | "gaming";

export type Job = {
  id: string;
  title: string;
  company: string;
  locationType: string;
  locationCountry: string;
  level: JobLevel;
  domains: JobDomain[];
  status: JobStatus;
  datePosted: number;
  dateUpdated: number;
};

export type JobStoreState = "idling" | "loading" | "error";

export namespace JobFilter {
  export type Date = "last-7-days" | "last-30-days" | "all";
  export type Status = "new" | "applied" | "hidden" | "all";

  export type State = {
    status: Status;
    dateId: Date;
    fromTimestampMs: number | undefined;
    toTimestampMs: number | undefined;
  };

  export type Event =
    | {
        type: "new-status";
        value: Status;
      }
    | {
        type: "new-date";
        value: Date;
      };

  export function createDefault(): State {
    return {
      status: "new",
      dateId: "last-7-days",
      fromTimestampMs: undefined,
      toTimestampMs: undefined,
    };
  }
}

export namespace Page {
  export type State = {
    jobs: Job[];
    fetching: "none" | "in-progress" | "error";
    filter: JobFilter.State;
    jobIdsHidden: Set<string>;
  };

  export type Event =
    | {
        type: "job-id-hidden";
        value: string;
      }
    | {
        type: "job-id-shown";
        value: string;
      }
    | {
        type: "new-status";
        value: JobFilter.Status;
      }
    | {
        type: "new-date";
        value: JobFilter.Date;
      };

  export function advanceState({
    state,
    event,
    httpClient,
  }: {
    state: State;
    event: Event;
    httpClient: HttpClient;
  }) {
    switch (true) {
      case event.type === "new-date": {
        state.filter.dateId = event.value;
        let fromDate: Date | undefined;
        let fromTimestampMs: number | undefined;
        const toDate = new Date();
        let toTimestampMs: number | undefined;
        switch (event.value) {
          case "last-7-days":
            fromDate = subDays(toDate, 7);
            fromTimestampMs = fromDate?.getTime();
            toTimestampMs = toDate?.getTime();
            break;
          case "last-30-days":
            fromDate = subDays(toDate, 30);
            fromTimestampMs = fromDate?.getTime();
            toTimestampMs = toDate?.getTime();
            break;
          case "all":
            fromTimestampMs = undefined;
            toTimestampMs = undefined;
            break;
        }

        state.fetching = "in-progress";
        httpClient
          .fetchJobs({
            fromTimestamp: fromTimestampMs,
            toTimestamp: toTimestampMs,
          })
          .then((response) => {
            state.jobs = response.data;
            state.fetching = "none";
          })
          .catch((err) => {
            console.error(err);
            state.fetching = "error";
          });
        break;
      }
      case event.type === "new-status":
        state.filter.status = event.value;
        break;
      case event.type === "job-id-hidden":
        state.jobIdsHidden.add(event.value);
        break;
      case event.type === "job-id-shown":
        state.jobIdsHidden.delete(event.value);
        break;
    }
  }

  export function createDefaultState(): State {
    const state: State = {
      jobs: [],
      jobIdsHidden: new Set(),
      fetching: "none",
      filter: JobFilter.createDefault(),
    };
    return state;
  }

  export function listJobs(state: State, jobIdsHidden: string[]): Job[] {
    switch (state.filter.status) {
      case "new":
        return state.jobs.filter((job) => !jobIdsHidden.includes(job.id));
      case "hidden":
        return state.jobs.filter((job) => jobIdsHidden.includes(job.id));
      // case "all":
      default:
        return state.jobs;
    }
  }
}
