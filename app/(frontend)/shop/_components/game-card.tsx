import Link from "next/link";
import { Gamepad2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AvailableGame } from "../actions/get-available-games";

export default function GameCard({ game }: { game: AvailableGame }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-muted">
        {game.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={game.imageUrl}
            alt={game.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <Gamepad2 className="size-10" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-3">
        <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5">
          {game.name}
        </h3>
        <Button asChild className="w-full">
          <Link href={`/shop/${game.id}`}>
            <ShoppingCart />
            Buy now
          </Link>
        </Button>
      </div>
    </div>
  );
}
