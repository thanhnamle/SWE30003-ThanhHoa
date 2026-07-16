import { ReactNode } from "react";

interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string | number;
}

export function DataTable<T>({ data, columns, keyExtractor }: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground bg-card border border-border rounded-md">
        No data available.
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto bg-card border border-border rounded-md">
      <table className="w-full text-sm text-left">
        <thead className="bg-muted text-muted-foreground font-medium border-b border-border">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="h-12 px-4 align-middle">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((item) => (
            <tr key={keyExtractor(item)} className="hover:bg-muted/50 transition-colors">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="p-4 align-middle">
                  {col.cell ? col.cell(item) : String(col.accessorKey ? item[col.accessorKey] : '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
