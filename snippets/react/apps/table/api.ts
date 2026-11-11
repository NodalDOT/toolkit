import { stocks } from "./data";
import type { PaginatedAPIResponse, Stock } from "./types";

export type { PaginatedAPIResponse, Stock } from "./types";

export async function fetchStocks(
  page = 0,
  pageSize = 5,
): Promise<PaginatedAPIResponse<Stock>> {
  if (!Number.isSafeInteger(page) || page < 0) {
    throw new RangeError("page must be a non-negative safe integer");
  }
  if (!Number.isSafeInteger(pageSize) || pageSize < 1) {
    throw new RangeError("pageSize must be a positive safe integer");
  }

  await new Promise<void>((resolve) => setTimeout(resolve, 300));

  const start = page * pageSize;
  const data = stocks.slice(start, start + pageSize).map((stock): Stock => {
    const price = Number(
      (stock.price * (1 + (Math.random() * 2 - 1) * 0.05)).toFixed(2),
    );
    const change = Number((price - stock.price).toFixed(2));

    return {
      ...stock,
      price,
      change,
      changePercent: Number(((change / stock.price) * 100).toFixed(2)),
      volume: Math.round(stock.volume * (0.8 + Math.random() * 0.4)),
    };
  });

  return {
    data,
    total: stocks.length,
    page,
    pageSize,
    totalPages: Math.ceil(stocks.length / pageSize),
  };
}
