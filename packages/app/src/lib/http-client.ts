import type { Job } from "$lib/types";

export type HttpClient = {
  fetchJobs({
    fromTimestamp,
    toTimestamp,
  }: {
    fromTimestamp?: number;
    toTimestamp?: number;
  }): Promise<{ data: Job[] }>;
};

export function createHttpClient(baseUrl: string | undefined): HttpClient {
  return {
    async fetchJobs() {
      const url = new URL("/api/v1/jobs", baseUrl);
      const response = await fetch(url);
      const responseJson = (await response.json()) as { data: Job[] };
      return {
        data: responseJson.data,
      };
    },
  };
}
