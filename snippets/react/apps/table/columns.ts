import type { Stock, TTableColumn } from "./types";

export const columns: TTableColumn<Stock>[] = [
  { id: "symbol", name: "Symbol", renderer: (stock) => stock.symbol },
  { id: "name", name: "Name", renderer: (stock) => stock.name },
  {
    id: "price",
    name: "Price",
    renderer: (stock) => `$${stock.price.toFixed(2)}`,
  },
  {
    id: "change",
    name: "Change",
    renderer: (stock) => stock.change.toFixed(2),
  },
  {
    id: "changePercent",
    name: "% Change",
    renderer: (stock) => `${stock.changePercent.toFixed(2)}%`,
  },
  {
    id: "volume",
    name: "Volume",
    renderer: (stock) => stock.volume.toLocaleString("en-US"),
  },
  {
    id: "marketCap",
    name: "Market Cap",
    renderer: (stock) => stock.marketCap.toLocaleString("en-US"),
  },
  {
    id: "peRatio",
    name: "P/E Ratio",
    renderer: (stock) => stock.peRatio ?? "—",
  },
];
