import type { TTableProps, TTableColumn } from "./types";
import { use, useMemo, useState, type ChangeEventHandler } from "react";
type TSortDir = "asc" | "desc" | "none";

const nextDir = { none: "asc", asc: "desc", desc: "none" } as const;

export function Table<T extends { id: string }>(props: TTableProps<T>) {
  const { columns, datasource, search, comparator, initialData } = props;
  const initialRows = use(initialData);

  const [query, setQuery] = useState<string>("");
  const [sort, setSort] = useState<{
    columnId: TTableColumn<T>["id"];
    direction: TSortDir;
  } | null>(null);
  const [data, setData] = useState<T[]>(initialRows);
  const [currentPage, setCurrentPage] = useState(0);

  const next = () => {
    if (currentPage >= datasource.pages - 1) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    if (data.length <= nextPage * datasource.pageSize) {
      datasource
        .next(nextPage, datasource.pageSize)
        .then((data) => setData((prev) => [...prev, ...data]));
    }
  };

  const prev = () => {
    setCurrentPage(Math.max(currentPage - 1, 0));
  };

  const onSearch: ChangeEventHandler<HTMLInputElement> = (event) => {
    setCurrentPage(0);
    setQuery(event.target.value);
  };

  const onSort = (columnId: TTableColumn<T>["id"]) => {
    setSort((prev) => {
      const direction = prev?.columnId === columnId ? prev.direction : "none";
      return { columnId, direction: nextDir[direction] };
    });
  };

  const slice = useMemo(() => {
    const filtered = query
      ? search
        ? search(query, data)
        : data.filter((item) => item.id.includes(query))
      : data;
    const sorted =
      sort && comparator && sort.direction !== "none"
        ? [...filtered].sort(comparator(sort.columnId, sort.direction))
        : filtered;
    const start = currentPage * datasource.pageSize;
    return sorted.slice(start, start + datasource.pageSize);
  }, [data, query, search, sort, comparator, currentPage, datasource]);

  return (
    <div className="table">
      <input
        className="table-search"
        value={query}
        onChange={onSearch}
        type="search"
        aria-label="Search table"
        placeholder="Search…"
      />
      <div
        className="table-scroll"
        role="region"
        aria-label="Table"
        tabIndex={0}
      >
        <table>
          <thead>
            <tr>
              {columns.map((column) => {
                const direction =
                  sort?.columnId === column.id ? sort.direction : "none";
                return (
                  <th
                    key={column.id}
                    scope="col"
                    aria-sort={
                      comparator
                        ? direction === "asc"
                          ? "ascending"
                          : direction === "desc"
                            ? "descending"
                            : "none"
                        : undefined
                    }
                  >
                    {comparator ? (
                      <button
                        type="button"
                        className="table-sort"
                        onClick={() => onSort(column.id)}
                      >
                        {column.name}
                        <span className="table-sort-icon" aria-hidden="true">
                          {direction === "asc"
                            ? "↑"
                            : direction === "desc"
                              ? "↓"
                              : "↕"}
                        </span>
                      </button>
                    ) : (
                      column.name
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {slice.map((item) => (
              <tr key={item.id}>
                {columns.map((column) => (
                  <td key={column.id}>{column.renderer(item)}</td>
                ))}
              </tr>
            ))}
            {slice.length === 0 && (
              <tr>
                <td className="table-empty" colSpan={columns.length}>
                  No results
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <nav className="table-pagination" aria-label="Table pagination">
        <button type="button" disabled={currentPage === 0} onClick={prev}>
          Prev
        </button>
        <span aria-live="polite">
          {currentPage + 1} / {Math.max(1, datasource.pages)}
        </span>
        <button
          type="button"
          disabled={currentPage >= datasource.pages - 1}
          onClick={next}
        >
          Next
        </button>
      </nav>
    </div>
  );
}
