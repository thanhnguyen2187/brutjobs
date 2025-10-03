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
      await new Promise((resolve) => setTimeout(resolve, 3_000));
      return {
        data: [],
      };
    },
  };
}
