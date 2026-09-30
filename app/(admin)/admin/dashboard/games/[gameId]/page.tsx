import { Suspense } from "react";
import Packages from "./_components/packages";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ gameId: string }>;
  searchParams: Promise<{ page?: string; perPage?: string; search?: string }>;
}) {
  const { gameId } = await params;
  const query = await searchParams;
  return (
    <div>
      <Suspense
        key={`${gameId}-${query.page}-${query.perPage}-${query.search}`}
        fallback={`Loading..`}
      >
        <Packages params={{ ...query, gameId }} />
      </Suspense>
    </div>
  );
}
