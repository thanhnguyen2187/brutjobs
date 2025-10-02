import type { Job, JobFilterState, JobStatus } from "$lib/types";

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

  export function createDefaultFilterState(): JobFilterState {
    return {
      status: "new",
      dateId: "last-week",
      fromTimestampMs: undefined,
      toTimestampMs: undefined,
    };
  }
}
