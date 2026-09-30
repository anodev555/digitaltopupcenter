"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { games } from "@/db/schema";
import { Response } from "@/types/response-types";

// TODO: protect with admin auth (login + role check) before going live.
export default async function UpdateGameStatus(
  gameId: string,
  isActive: boolean,
): Promise<Response<null>> {
  try {
    const [game] = await db
      .select({ id: games.id })
      .from(games)
      .where(eq(games.id, gameId))
      .limit(1);

    if (!game) {
      return { success: false, message: "Game not found" };
    }

    await db.update(games).set({ isActive }).where(eq(games.id, gameId));

    revalidatePath("/dashboard/games");
    return { success: true, data: null };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: `${error instanceof Error ? error.message : "Failed to update game status!"}`,
    };
  }
}
