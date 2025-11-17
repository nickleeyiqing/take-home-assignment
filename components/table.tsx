"use client";

import { useState, useMemo } from "react";
import Pagination from "./pagination";

type TableProps = {
  columns: string[];
  data: any[];
  rowsPerPage?: number;
};

export default function Table({ columns, data, rowsPerPage = 5 }: TableProps) {
  const [page, setPage] = useState(1);
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filterText, setFilterText] = useState("");

  const filtered = useMemo(() => {
    return data.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(filterText.toLowerCase())
      )
    );
  }, [data, filterText]);

  const sorted = useMemo(() => {
    if (!sortCol) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortCol];
      const bv = b[sortCol];

      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortCol, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * rowsPerPage;
  const visibleRows = sorted.slice(start, start + rowsPerPage);

  const handleSort = (col: string) => {
    if (sortCol === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 space-y-3">
      <h2 className="font-semibold">Generic Table</h2>
      <input
        value={filterText}
        onChange={(e) => {
          setPage(1);
          setFilterText(e.target.value);
        }}
        placeholder="Filter..."
        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-sm text-white"
      />

      <div className="overflow-hidden border border-slate-700 rounded">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-800 text-slate-300">
              {columns.map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  className="px-4 py-2 border-b border-slate-700 cursor-pointer hover:bg-slate-700"
                >
                  <div className="flex items-center gap-2">
                    {col}
                    {sortCol === col && (sortDir === "asc" ? "▲" : "▼")}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {visibleRows.map((row, idx) => (
              <tr
                key={idx}
                className="border-t border-slate-800 hover:bg-slate-800"
              >
                {columns.map((col) => (
                  <td
                    key={col}
                    className="px-4 py-2 border-l border-slate-800 text-slate-200"
                  >
                    {String(row[col])}
                  </td>
                ))}
              </tr>
            ))}

            {visibleRows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-4 text-slate-500"
                >
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={safePage}
        totalPages={totalPages}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />
    </div>
  );
}
