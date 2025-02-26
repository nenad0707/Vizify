"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QuickActions } from "./QuickActions";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowUp, ArrowDown, CalendarDays } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface BusinessCard {
  id: string;
  name: string;
  title: string;
  color: string;
  createdAt?: string;
  isFavorite?: boolean;
}

export function TableView({ cards }: { cards: BusinessCard[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<BusinessCard>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 font-medium">
          <div 
            className="h-6 w-6 rounded-full flex items-center justify-center text-xs text-white"
            style={{ backgroundColor: row.original.color }}
          >
            {row.original.name.charAt(0)}
          </div>
          <span>{row.getValue("name")}</span>
          {row.original.isFavorite && (
            <Star className="h-3 w-3 text-chart-4 fill-chart-4" />
          )}
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.getValue("title")}
        </span>
      ),
    },
    {
      accessorKey: "color",
      header: "Color",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full border border-border/50"
            style={{ backgroundColor: row.getValue("color") }}
          ></div>
          <span className="text-xs text-muted-foreground font-mono">
            {row.getValue("color")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-1 hover:text-primary"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : null}
          </button>
        );
      },
      cell: ({ row }) => {
        const date = row.getValue("createdAt");
        if (!date) return "N/A";
        return (
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <CalendarDays className="h-3 w-3" />
            {new Date(date as string).toLocaleDateString()}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => <QuickActions card={row.original} />,
    },
  ];

  const table = useReactTable({
    data: cards,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="rounded-md border border-border/40 overflow-hidden bg-card/70 backdrop-blur-sm shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-border/40 hover:bg-muted/20">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="py-3 text-muted-foreground font-medium">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-border/20 hover:bg-muted/20 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No cards found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}