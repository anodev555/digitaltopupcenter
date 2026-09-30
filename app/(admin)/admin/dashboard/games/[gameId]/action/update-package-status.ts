"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { games, packages } from "@/db/schema";
import { Response } from "@/types/response-types";

// TODO: protect with admin auth (login + role check) before going live.
export default async function UpdatePackageStatus(
  packageId: string,
  isActive: boolean,
): Promise<Response<null>> {
  try {
    if (!packageId) {
      return {
        success: false,
        message: "Package id is not selected!",
      };
    }
    const [Package] = await db
      .select({ id: packages.id })
      .from(packages)
      .where(eq(packages.id, packageId))
      .limit(1);

    if (!Package) {
      return { success: false, message: "Game not found" };
    }

    await db
      .update(packages)
      .set({ isActive })
      .where(eq(packages.id, Package.id));

    revalidatePath(`/dashboard/games/${Package.id}`);
    return { success: true, data: null };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: `${error instanceof Error ? error.message : "Failed to update game status!"}`,
    };
  }
}
