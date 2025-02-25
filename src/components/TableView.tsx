"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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
import { QuickActions } from "./QuickActions";

export function TableView({
  cards,
}: {
  cards: {
    id: string;
    name: string;
    title: string;
    color: string;
    createdAt?: string;
  }[];
}) {
  const columns: ColumnDef<typeof cards[0]>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "color",
      header: "Color",
      cell: ({ row }) => (
        <div
          className="w-6 h-6 rounded-full"
          style={{ backgroundColor: row.getValue("color") }}
        ></div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const rawDate = row.getValue("createdAt");
        if (!rawDate) return "N/A";
        return new Date(rawDate as string).toLocaleDateString();
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <QuickActions card={row.original} />,
    },
  ];

  const table = useReactTable({
    data: cards,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
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
                No cards found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
