import { fetchStocks } from "./api";
import { stocks } from "./data";
import type { Stock, TTableDataSource } from "./types";

export const dataSource = (pageSize = 5): TTableDataSource<Stock> => {
  if (!Number.isSafeInteger(pageSize) || pageSize < 1) {
    throw new RangeError("pageSize must be a positive safe integer");
  }

  return {
    pages: Math.ceil(stocks.length / pageSize),
    pageSize,
    next: async (page, size) => {
      const response = await fetchStocks(page, size);
      return response.data;
    },
  };
};
