"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import SearchBar from "@/components/shared/search-bar";
import type { AvailableGame } from "../actions/get-available-games";
import GameCard from "./game-card";

export default function GamesGrid({
  games,
  page,
  hasMore,
}: {
  games: AvailableGame[];
  page: number;
  hasMore: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searching, setSearching] = useState(false);
  const loading = isPending || searching;

  function loadMore() {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page + 1));
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div className="space-y-6">
      <SearchBar placeholder="Search games..." onPendingChange={setSearching} />

      {games.length ? (
        <div
          className={`grid grid-cols-2 gap-3 transition-opacity sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 ${loading ? "opacity-60" : ""}`}
        >
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-muted-foreground">
          No games found.
        </p>
      )}

      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="lg"
            disabled={loading}
            onClick={loadMore}
          >
            {isPending && <Spinner />}
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
