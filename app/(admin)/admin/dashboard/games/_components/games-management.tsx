"use client";

import { DataTable } from "@/components/data-table/data-table";
import { Games } from "@/types/games-types";
import { gamesColumns } from "./games-columns";
import { DataTableSearch } from "@/components/data-table/data-table-search";
import TopStats from "./top-stats";

export default function GamesManagement({ data }: { data: Games }) {
  return (
    <div className="space-y-4">
      <TopStats name="Games" stats={data.stats} />
      <DataTableSearch placeholder="Search games..." />

      <DataTable
        columns={gamesColumns}
        data={data.rows}
        rowCount={data.total}
        page={data.page}
        perPage={data.perPage}
      />
    </div>
  );
}
