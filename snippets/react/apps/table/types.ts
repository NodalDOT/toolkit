import type { ReactNode } from "react";

export type Stock = {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  peRatio: number | null;
};

export type PaginatedAPIResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type TTableDataSource<T> = {
  pageSize: number;
  pages: number;
  next: (page: number, pageSize: number) => Promise<T[]>;
};

export type TTableColumn<T> = {
  id: Extract<keyof T, string | number>;
  name: string;
  renderer: (item: T) => ReactNode;
  sort?: "asc" | "desc" | "none";
};

export type TTableProps<T extends { id: string }> = {
  initialData: Promise<T[]>;
  columns: TTableColumn<T>[];
  datasource: TTableDataSource<T>;
  search?: (query: string, data: T[]) => T[];
  comparator?: (
    columnId: Extract<keyof T, string | number>,
    direction: "asc" | "desc",
  ) => (a: T, b: T) => number;
};
