import { NextResponse } from "next/server";
import { isAxiosError } from "axios";
import { db } from "@/db";
import { getCatalogue, getFields, getServers, listGames } from "@/lib/g2bulk";
import { games, packages } from "@/db/schema";
import { sql, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
const toTextArray = (a: string[]) =>
  a.length
    ? sql`ARRAY[${sql.join(
        a.map((v) => sql`${v}`),
        sql`, `,
      )}]::text[]`
    : sql`ARRAY[]::text[]`;

export async function POST() {
  try {
    // const allowedGames = await db
    //   .select({
    //     gameCode: gameslist.gameCode,
    //   })
    //   .from(gameslist);
    // console.log(allowedGames);
    // const TargetGames = allowedGames.map((item) => item.gameCode);
    const allGames = await listGames();
    // const AllowedGames: gamesItem[] = allGames.games.filter((item) =>
    //   TargetGames.includes(item.code),
    // );
    // console.log(AllowedGames);

    if (!allGames.games || allGames.games.length === 0) {
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
    for (const g of allGames.games) {
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

        await db
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
            setWhere: sql`
            ${games.name} IS DISTINCT FROM ${g.name}
            OR ${games.imageUrl} IS DISTINCT FROM ${g.image_url}
           OR ${games.requiredFields} IS DISTINCT FROM ${toTextArray(fields)}
  OR ${games.servers} IS DISTINCT FROM ${toTextArray(servers)}`,
          });

        const [Game] = await db
          .select({
            id: games.id,
          })
          .from(games)
          .where(eq(games.g2bulkCode, g.code));

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
              setWhere: sql`
              ${packages.costPriceUsd} IS DISTINCT FROM ${amount}::numeric
              
              `,
            });
        }
        synced++;
      } catch (e) {
        // One broken game must not abort the whole sync.
        failed.push(g.code);
        console.error(`loadgames: skipped ${g.code}`, e);
      }
    }
    console.log({ synced, failed });
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
        error: "Failed to sync or load games",
      },
      { status: 500 },
    );
  }
}
