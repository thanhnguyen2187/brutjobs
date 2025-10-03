import type {
  Category,
  CategoryEdit,
  Stats,
  Transaction,
  TransactionEdit,
} from "./types";

export type HttpClient = {
  fetchJobs({
    fromTimestamp,
    toTimestamp,
  }: {
    fromTimestamp?: number;
    toTimestamp?: number;
  }): Promise<{ data: unknown[] }>;
};

export function createHttpClient(baseUrl: string | undefined): HttpClient {
  return {
    async fetchJobs() {
      const url = new URL("/api/v1/jobs", baseUrl);
      const response = await fetch(url);
      const responseJson = (await response.json()) as { data: unknown[] };
      return {
        data: responseJson.data,
      };
    },
  };
}
