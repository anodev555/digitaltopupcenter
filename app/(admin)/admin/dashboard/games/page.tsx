import React, { Suspense } from "react";
import Games from "./_components/games";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; perPage?: string; search?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="space-y-4">
      {/* Outside the keyed Suspense so the input keeps focus while results reload */}
      <Suspense
        // key={`${params.page}-${params.perPage}-${params.search}`}
        fallback={`Loading..`}
      >
        <Games params={params} />
      </Suspense>
    </div>
  );
}
