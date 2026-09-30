import { NextResponse } from "next/server";
import { isAxiosError } from "axios";
import { db } from "@/db";
import {
  gamesItem,
  getCatalogue,
  getFields,
  getServers,
  listGames,
} from "@/lib/g2bulk";
import { games, gameslist, packages } from "@/db/schema";
import { Server } from "http";

export const dynamic = "force-dynamic";

// TODO: protect with admin auth (login + role check) before going live.
// POST /api/loadgames -- sync G2Bulk catalog into games + packages.
// New rows arrive inactive; your is_active / sell_price_npr / sort_order
// are never overwritten by the sync.
export async function POST() {
  try {
    const allowedGames = await db
      .select({
        gameCode: gameslist.gameCode,
      })
      .from(gameslist);
    // console.log(allowedGames);
    const TargetGames = allowedGames.map((item) => item.gameCode);
    const allGames = await listGames();
    const AllowedGames: gamesItem[] = allGames.games.filter((item) =>
      TargetGames.includes(item.code),
    );
    console.log(AllowedGames);

    if (!AllowedGames || AllowedGames.length === 0) {
      return NextResponse.json(
        {
          error: "No games found from G2bulk",
        },
        {
          status: 404,
        },
      );
    }

    const failed: string[] = [];
    let synced = 0;
    for (const g of AllowedGames) {
      try {
        const [Fields, Servers, Catalogues] = await Promise.all([
          getFields(g.code),
          getServers(g.code),
          getCatalogue(g.code),
        ]);

        const fields = Fields?.info
          ? (Fields?.info?.fields ?? ["userid"])
          : ["userid"];
        const servers = Servers ? Object.keys(Servers?.servers) : [];

        const [Game] = await db
          .insert(games)
          .values({
            g2bulkCode: g.code,
            name: g.name,
            imageUrl: g.image_url,
            requiredFields: fields,
            servers: servers,
          })
          .onConflictDoUpdate({
            target: [games.g2bulkCode],
            set: {
              name: g.name,
              imageUrl: g.image_url,
              requiredFields: fields,
              servers: servers,
              updatedAt: new Date(),
            },
          })
          .returning({
            id: games.id,
          });

        //catalogues
        const cataloueItems = Catalogues.catalogues ?? [];

        for (const catalogue of cataloueItems) {
          if (!catalogue.name) continue;
          const amount = String(catalogue.amount);

          await db
            .insert(packages)
            .values({
              gameId: Game.id,
              catalogueName: catalogue.name,
              costPriceUsd: amount,
            })
            .onConflictDoUpdate({
              target: [packages.gameId, packages.catalogueName],
              set: {
                costPriceUsd: amount,
                available: true,
              },
            });
        }
        synced++;
      } catch (e) {
        // One broken game must not abort the whole sync.
        failed.push(g.code);
        console.error(`loadgames: skipped ${g.code}`, e);
      }
    }

    return NextResponse.json({ synced, failed });
  } catch (error) {
    console.log(error);
    if (isAxiosError(error)) {
      return NextResponse.json(
        { error: `${error.response?.status} : ${error.message}` },
        { status: error.response?.status ?? 500 },
      );
    }

    return NextResponse.json(
      {
        error: `${error instanceof Error ? `${error.message}` : "Failed to sync or load games"}`,
      },
      { status: 500 },
    );
  }
}
