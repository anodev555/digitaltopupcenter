import { Suspense } from "react";
import Shop from "./_components/shop";
import type { GetAvailableGamesParams } from "./actions/get-available-games";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<GetAvailableGamesParams>;
}) {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6">
      <h1 className="text-2xl font-semibold">Shop</h1>
      {/* No `key`: on search/load more the old UI stays mounted until the new
          data arrives, so the search input keeps focus */}
      <Suspense fallback={<p className="text-muted-foreground">Loading...</p>}>
        <Shop searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
