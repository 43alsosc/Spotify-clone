"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import {
  ArrowDown,
  MoreHorizontal,
  Play,
  Search,
  Shuffle,
  UserPlus2,
} from "lucide-react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="mx-4 rounded-[0.25rem]">
      <div className="mx-8 mb-8 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Button className="size-16 rounded-full bg-[#1ED760] text-[#121212] hover:scale-105">
            <Play className="size-6" fill="#121212" />
          </Button>
          <Button variant={"ghost"} className="size-16 hover:bg-transparent">
            <Shuffle className="size-8" />
          </Button>
          <Button
            variant={"ghost"}
            className="size-8 rounded-full bg-[#1ED760] hover:scale-105 hover:bg-[#1ED760]"
          >
            <ArrowDown className="size-6 text-[#121212]" />
          </Button>
          <Button variant={"ghost"} className="size-16 hover:bg-transparent">
            <UserPlus2 className="size-8" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} className="hover:bg-transparent">
                <MoreHorizontal className="size-8" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <UserPlus2 className="size-4" />
                Legg til i spilleliste
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2 pl-2">
          {!showSearch ? (
            <Button
              onClick={() => setShowSearch(true)}
              variant="ghost"
              size="icon"
              className="rounded-full text-gray-400 hover:text-white"
            >
              <Search className="h-5 w-5" />
            </Button>
          ) : (
            <div className="flex items-center gap-2 bg-[#2A2A2A] pl-2">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                placeholder="Søk i ditt bibliotek"
                className="h-9 w-full rounded-md bg-transparent text-sm outline-none"
                autoFocus
                onBlur={() => setShowSearch(false)}
                value={
                  (table.getColumn("title")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("title")?.setFilterValue(event.target.value)
                }
              />
            </div>
          )}
        </div>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="p-4">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
