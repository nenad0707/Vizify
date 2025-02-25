"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { QuickActions } from "@/components/QuickActions";

export function TableView({ cards }: { cards: { id: string; name: string; title: string; color: string; createdAt: string }[] }) {
  const columns: ColumnDef<typeof cards[0]>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "title", header: "Title" },
    { accessorKey: "color", header: "Color", cell: ({ row }) => <div className="w-6 h-6 rounded-full" style={{ backgroundColor: row.getValue("color") }}></div> },
    { accessorKey: "createdAt", header: "Created At", cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString() },
    { id: "actions", header: "Actions", cell: ({ row }) => <QuickActions card={row.original} /> },
  ];

  const table = useReactTable({ data: cards, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
