"use server";

import { count, ilike, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { games, packages } from "@/db/schema";
import { Games } from "@/types/games-types";
import { Response } from "@/types/response-types";
import { parsePage, parsePerPage } from "@/utils/pagination";
import { eq } from "drizzle-orm";
export type GetGamesParams = {
  page?: string;
  perPage?: string;
  search?: string;
};

export default async function GetGames(
  params: GetGamesParams = {},
): Promise<Response<Games>> {
  try {
    const page = parsePage(params.page);
    const perPage = parsePerPage(params.perPage);

    // Escape LIKE wildcards so user input is matched literally
    const search = params.search?.trim().replace(/[\\%_]/g, "\\$&");
    const where = search
      ? or(
          ilike(games.name, `%${search}%`),
          ilike(games.g2bulkCode, `%${search}%`),
        )
      : undefined;

    const [rows, [{ total }], [stats]] = await Promise.all([
      db
        .select({
          id: games.id,
          g2bulkCode: games.g2bulkCode,
          name: games.name,
          imageUrl: games.imageUrl,
          requiredFields: games.requiredFields,
          servers: games.servers,
          isActive: games.isActive,
          sortOrder: games.sortOrder,
          updatedAt: games.updatedAt,
          // count(packages.id) ignores NULLs, so games with no packages get 0
          totalPackages: sql<number>`count(${packages.id})::int`,
        })
        .from(games)
        .leftJoin(packages, eq(games.id, packages.gameId))
        .where(where)
        .groupBy(games.id)
        .orderBy() // stable order so pages don't overlap
        .limit(perPage)
        .offset((page - 1) * perPage),
      db.select({ total: count() }).from(games).where(where),
      // Overall metrics: all games, ignoring search and pagination
      db
        .select({
          total: count(),
          active: sql<number>`count(*) filter (where ${games.isActive})::int`,
        })
        .from(games),
    ]);

    return {
      success: true,
      data: {
        rows,
        total,
        page,
        perPage,
        stats: {
          total: stats.total,
          active: stats.active,
          inactive: stats.total - stats.active,
        },
      },
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: `${error instanceof Error ? error.message : "Failed to get games data!"}`,
    };
  }
}
