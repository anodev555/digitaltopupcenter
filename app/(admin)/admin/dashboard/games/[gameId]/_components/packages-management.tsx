"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableSearch } from "@/components/data-table/data-table-search";
import { Packages } from "@/types/packages-types";
import { packagesColumns } from "./packages-columns";
import TopStats from "../../_components/top-stats";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function PackagesManagement({ data }: { data: Packages }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-row gap-1 justify-start items-center   ">
        <Avatar className="h-20 w-20">
          <AvatarImage src={data.rows[0].gameImageUrl ?? ""}></AvatarImage>
          <AvatarFallback>
            {data.rows[0].gameImageUrl?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span className="font-semibold text-2xl">
          <p>{data.rows[0].gameName}</p>
          <p className="text-muted-foreground text-xl">
            {data.rows[0].gameCode}
          </p>
        </span>
      </div>
      <TopStats name="Packages" stats={data.stats} />
      <DataTableSearch placeholder="Search packages..." />
      <DataTable
        columns={packagesColumns}
        data={data.rows}
        rowCount={data.total}
        page={data.page}
        perPage={data.perPage}
      />
    </div>
  );
}
