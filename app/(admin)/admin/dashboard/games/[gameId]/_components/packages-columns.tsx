"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { features } from "@/components/data-table/data-table";
import { PackagesRows } from "@/types/packages-types";
import PackageStatusSwitch from "./packagestatus-switch";
import EditPackages from "./packages-edit-dialog";

export const packagesColumns: ColumnDef<typeof features, PackagesRows>[] = [
  { accessorKey: "catalogueName", header: "Package" },
  {
    accessorKey: "gameCurrencyName",
    header: "Currency Name",
    cell: ({ row }) => <span>{row.original.gameCurrencyName ?? "-"}</span>,
  },
  {
    accessorKey: "costPriceUsd",
    header: "Cost (USD)",
    cell: ({ row }) => (
      <span>${Number(row.original.costPriceUsd).toFixed(3)}</span>
    ),
  },
  {
    accessorKey: "sellPriceNpr",
    header: "Sell price (NPR)",
    cell: ({ row }) => (
      <span>
        {row.original.sellPriceNpr
          ? `Rs ${row.original.sellPriceNpr}`
          : "Not set"}
      </span>
    ),
  },
  // {
  //   accessorKey: "available",
  //   header: "Available",
  //   cell: ({ row }) => <span>{row.original.available ? "Yes" : "No"}</span>,
  // },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <PackageStatusSwitch
        isActive={row.original.isActive}
        packageId={row.original.id}
      />
    ),
  },
  {
    accessorKey: "Actions",
    header: "Update",
    cell: ({ row }) => <EditPackages data={row.original} />,
  },
];
