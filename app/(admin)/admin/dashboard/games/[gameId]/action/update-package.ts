"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { packages } from "@/db/schema";
import { Response } from "@/types/response-types";
import {
  updatePackageSchema,
  type UpdatePackageValuesType,
} from "../schema/packages";

// TODO: protect with admin auth (login + role check) before going live.
export default async function UpdatePackage(
  packageId: string,
  values: UpdatePackageValuesType,
): Promise<Response<null>> {
  try {
    if (!packageId) {
      return { success: false, message: "Package id is not selected!" };
    }

    // Re-validate on the server: never trust the client
    const parsed = updatePackageSchema.safeParse(values);
    if (!parsed.success) {
      const { fieldErrors } = z.flattenError(parsed.error);
      return {
        success: false,
        message: "Invalid data",
        fieldErros: fieldErrors,
      };
    }

    const [pkg] = await db
      .select({ id: packages.id, gameId: packages.gameId })
      .from(packages)
      .where(eq(packages.id, packageId))
      .limit(1);

    if (!pkg) {
      return { success: false, message: "Package not found" };
    }

    // Only these two fields are editable; everything else is synced from G2Bulk
    await db
      .update(packages)
      .set({
        sellPriceNpr: parsed.data.sellPriceNpr,
        gameCurrencyName: parsed.data.gameCurrencyName || null,
      })
      .where(eq(packages.id, pkg.id));

    revalidatePath(`/dashboard/games/${pkg.gameId}`);
    return { success: true, data: null };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: `${error instanceof Error ? error.message : "Failed to update package!"}`,
    };
  }
}
