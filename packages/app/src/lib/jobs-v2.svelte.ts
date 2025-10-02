import type { Job, JobFilter, JobStatus } from "$lib/types";

export namespace Jobs {
  export function fetchByTimeRange({
    fromTimestampMs = undefined,
    toTimestampMs = undefined,
  }: {
    fromTimestampMs: number | undefined;
    toTimestampMs: number | undefined;
  }) {
    throw new Error("unimplemented");
  }

  export function filterByStatus({
    jobs,
    value,
    jobIdsHidden,
  }: {
    value: JobStatus;
    jobs: Job[];
    jobIdsHidden: Set<string>;
  }) {
    throw new Error("unimplemented");
  }

  export function createDefaultFilterState(): JobFilter.State {
    return {
      status: "new",
      dateId: "last-week",
      fromTimestampMs: undefined,
      toTimestampMs: undefined,
    };
  }

  export function advanceFilterState({
    state,
    event,
  }: {
    state: JobFilter.State;
    event: JobFilter.Event;
  }) {
    switch (event.type) {
      case "new-status":
        state.status = event.value;
        break;
      case "new-date":
        state.dateId = event.value;
        break;
      default:
        throw new Error("Jobs.advanceFilterState: unreachable code!");
    }
  }
}
