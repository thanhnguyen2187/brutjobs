import {
  format,
  parse,
  parseISO,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { formatDateDisplay } from "$lib/date";
import type { HttpClient } from "./http-client";

export type Stats = {
  totalIncomeVND: number;
  totalExpenseVND: number;
  currentBalanceVND: number;
  chartData: { label: string; value: number }[];
};

export type Transaction = {
  id: string | null;
  dateTimestamp: number;
  description: string;
  amount: number;
  categoryId: string | null;
};

export type TransactionEdit = Transaction & {
  dateString: string;
  type: "income" | "expense";
};

export type Category = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type CategoryEdit = { id: string | null; name: string };

export type CategoryDisplay = Category & {
  createdAtCorrected: string;
  updatedAtCorrected: string;
};

export function createTransactionEmpty(): TransactionEdit {
  return {
    id: null,
    dateTimestamp: 0,
    description: "",
    amount: 10000,
    categoryId: null,
    dateString: "",
    type: "expense",
  };
}

export function createTransactionEdit(
  transaction: Transaction,
): TransactionEdit {
  return {
    ...transaction,
    dateString: format(
      new Date(transaction.dateTimestamp * 1_000),
      "yyyy-MM-dd'T'HH:mm",
    ),
    type: transaction.amount > 0 ? "income" : "expense",
    amount: Math.abs(transaction.amount),
  };
}

export function createCategoryEmpty(): CategoryEdit {
  return {
    id: null,
    name: "",
  };
}

export function createCategoryDisplay(category: Category): CategoryDisplay {
  const createdAtParsed = parse(
    `${category.createdAt}Z`,
    "yyyy-MM-dd HH:mm:ssX",
    new Date(),
  );
  const createdAtCorrected = formatDateDisplay(
    createdAtParsed.getTime() / 1_000,
  );
  const updatedAtParsed = parse(
    `${category.updatedAt}Z`,
    "yyyy-MM-dd HH:mm:ssX",
    new Date(),
  );
  const updatedAtCorrected = formatDateDisplay(
    updatedAtParsed.getTime() / 1_000,
  );
  return {
    ...category,
    createdAtCorrected,
    updatedAtCorrected,
  };
}

export type JobStatus =
  | "new"
  | "applied"
  | "hidden"
  | "interviewing"
  | "rejected"
  | "offer"
  | "accepted";
export type LocationType = "remote" | "hybrid" | "onsite";
export type Country = "USA" | "Vietnam" | "Global";
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
  location: {
    type: LocationType;
    country: Country;
  };
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
            fromDate = subDays(toDate, 30);
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
    return {
      jobs: [],
      jobIdsHidden: new Set(),
      fetching: "none",
      filter: JobFilter.createDefault(),
    };
  }
}

export function createJobEmpty(): Job {
  return {
    id: crypto.randomUUID(),
    title: "",
    company: "",
    location: {
      type: "remote",
      country: "Global",
    },
    level: "middle",
    domains: [],
    status: "new",
    datePosted: Date.now(),
    dateUpdated: Date.now(),
  };
}
