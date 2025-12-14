"use client";

import { useEffect, useState } from "react";
import { Search, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ITEMS_PER_PAGE = 10;

export default function DataTable({
  title,
  data,
  columns,
}: {
  title: string;
  data: any[];
  columns: { key: string; label: string }[];
}) {
  const [rows, setRows] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    filterRows();
  }, [query, rows]);

  const load = async () => {
    setLoading(true);
    setRows(data || []);
    setFiltered(data || []);
    setLoading(false);
  };

  const filterRows = () => {
    if (!query.trim()) {
      setFiltered(rows);
      setPage(1);
      return;
    }

    const q = query.toLowerCase();
    const f = rows.filter((row) =>
      Object.values(row).some((v) => String(v).toLowerCase().includes(q))
    );

    setFiltered(f);
    setPage(1);
  };

  const total = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const s = (page - 1) * ITEMS_PER_PAGE;
  const e = s + ITEMS_PER_PAGE;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="border-b p-6 flex flex-col md:flex-row justify-between">
            <h1 className="text-2xl font-bold">{title}</h1>

            <div className="relative md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center">Loading…</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center">No records found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    {columns.map((col) => (
                      <TableHead key={col.key}>{col.label}</TableHead>
                    ))}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filtered.slice(s, e).map((row, i) => (
                    <TableRow
                      key={i}
                      className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                    >
                      {columns.map((c) => (
                        <TableCell key={c.key}>{row[c.key]}</TableCell>
                      ))}

                      {/* Action buttons */}
                      <TableCell className="flex gap-3">
                        <Button size="icon" variant="outline">
                          <Pencil className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button size="icon" variant="outline">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Pagination */}
          {!loading && filtered.length > 0 && (
            <div className="border-t p-4 flex justify-center gap-3">
              <Button
                onClick={() => page > 1 && setPage(page - 1)}
                disabled={page === 1}
              >
                Prev
              </Button>

              <div className="px-4 py-2 bg-blue-500 text-white rounded-md">
                {page}
              </div>

              <Button
                onClick={() => page < total && setPage(page + 1)}
                disabled={page === total}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
