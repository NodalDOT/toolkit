import { Suspense } from "react";
import { Table } from "./Table";
import { columns } from "./columns";
import { dataSource } from "./datasource";
import { defaultComparator } from "./utils";

const datasource = dataSource();
const initialData = datasource.next(0, datasource.pageSize);

export function App() {
  return (
    <main>
      <Suspense
        fallback={
          <div className="table-loader" role="status">
            Loading…
          </div>
        }
      >
        <Table
          initialData={initialData}
          columns={columns}
          datasource={datasource}
          comparator={defaultComparator}
          search={(query, data) =>
            data.filter((stock) =>
              Object.values(stock).some((value) =>
                String(value).toLowerCase().includes(query.toLowerCase()),
              ),
            )
          }
        />
      </Suspense>
    </main>
  );
}
