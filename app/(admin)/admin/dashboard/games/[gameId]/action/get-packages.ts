"use server";

import { db } from "@/db";
import { games, packages } from "@/db/schema";
import { Packages } from "@/types/packages-types";
import { parsePage, parsePerPage } from "@/utils/pagination";
import { eq, asc, and, ilike, or, count, sql } from "drizzle-orm";
import { Response } from "@/types/response-types";

export type GetPackagesParams = {
  page?: string;
  perPage?: string;
  search?: string;
  gameId: string;
};

export default async function GetPackages({
  page,
  perPage,
  search,
  gameId,
}: GetPackagesParams): Promise<Response<Packages>> {
  try {
    const Page = parsePage(page);
    const PerPage = parsePerPage(perPage);
    const offset = (Page - 1) * PerPage;
    // Escape LIKE wildcards so user input is matched literally
    const searchQuery = search?.trim().replace(/[\\%_]/g, "\\$&");
    const where = and(
      searchQuery
        ? or(
            ilike(games.name, `%${searchQuery}%`),
            ilike(games.g2bulkCode, `%${searchQuery}%`),
          )
        : undefined,
      eq(packages.gameId, gameId),
    );

    const [rows, [{ total }], [stats]] = await Promise.all([
      db
        .select({
          id: packages.id,
          gameId: packages.gameId,
          catalogueName: packages.catalogueName,
          gameCurrencyName: packages.gameCurrencyName,
          costPriceUsd: packages.costPriceUsd,
          sellPriceNpr: packages.sellPriceNpr,
          gameCode: games.g2bulkCode,
          isActive: packages.isActive,
          gameName: games.name,
          gameImageUrl: games.imageUrl,
        })
        .from(packages)
        .innerJoin(games, eq(games.id, packages.gameId))
        .where(where)
        .offset(offset)
        .limit(PerPage)
        .orderBy(asc(packages.costPriceUsd)),
      db.select({ total: count() }).from(packages).where(where),
      db
        .select({
          total: count(),
          active: sql<number>`count(*) filter (where ${packages.isActive})::int`,
        })
        .from(packages),
    ]);

    return {
      success: true,
      data: {
        rows,
        total,
        perPage: PerPage,
        page: Page,
        stats: {
          total: stats.total,
          active: stats.active,
          inactive: Number(stats.total) - Number(stats.active),
        },
      },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,

      message: `${error instanceof Error ? error.message : "Failed to get games data!"}`,
    };
  }
}
