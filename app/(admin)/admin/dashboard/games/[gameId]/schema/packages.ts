import { z } from "zod";

export const updatePackageSchema = z.object({
  sellPriceNpr: z
    .string()
    .trim()
    .min(1, "Selling price is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid amount (max 2 decimals)")
    .refine((v) => Number(v) > 0, "Price must be greater than 0")
    .refine((v) => Number(v) < 100_000_000, "Price is too large"),
  gameCurrencyName: z
    .string()
    .trim()
    .max(200, "Currency name must be 200 characters or less")
    .optional(),
});

export type UpdatePackageValuesType = z.infer<typeof updatePackageSchema>;
