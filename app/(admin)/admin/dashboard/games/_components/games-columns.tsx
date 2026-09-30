"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { features } from "@/components/data-table/data-table";
import { GamesRows } from "@/types/games-types";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import GameStatusSwitch from "./gamestatus-switch";
import { PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export const gamesColumns: ColumnDef<typeof features, GamesRows>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className=" flex flex-row  items-center gap-2">
        <Avatar>
          <AvatarImage src={`${row.original.imageUrl}`} />
          <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span>{row.original.name}</span>
      </div>
    ),
  },
  { accessorKey: "g2bulkCode", header: "Code" },
  {
    accessorKey: "totalPackages",
    header: "Packages",
    cell: ({ row }) => (
      <Link href={`/admin/dashboard/games/${row.original.id}`}>
        <Button
          variant="default"
          className="flex flex-row gap-1 items-center justify-center font-semibold"
        >
          <PackageSearch size={30} />
          {row.original.totalPackages}
        </Button>
      </Link>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <GameStatusSwitch
        isActive={row.original.isActive}
        gameid={row.original.id}
      />
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Last UpdatedAt",
    cell: ({ row }) => (
      <span>
        {row.original.updatedAt.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          hour: "numeric",
          minute: "2-digit",
        })}
      </span>
    ),
  },
];
