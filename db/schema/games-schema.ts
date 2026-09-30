import {
  boolean,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// Games from GET /v1/games; you switch on only the ones to show
export const games = pgTable("games", {
  id: uuid("id").primaryKey().defaultRandom(),
  g2bulkCode: varchar("g2bulk_code", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  imageUrl: text("image_url"),
  requiredFields: text("required_field").array().default(["userid"]),
  servers: text("servers").array().default([]),
  isActive: boolean("is_active").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Packages from GET /v1/games/:code/catalogue, keyed by catalogue_name
export const packages = pgTable(
  "packages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade", onUpdate: "cascade" }),

    catalogueName: varchar("catalogue_name", { length: 200 }).notNull(),
    gameCurrencyName: varchar("game_currency_name", { length: 200 }),
    costPriceUsd: numeric("cost_price_usd", {
      precision: 10,
      scale: 4,
    }).notNull(),
    sellPriceNpr: numeric("sell_price_npr", { precision: 10, scale: 2 }),
    isActive: boolean("is_active").notNull().default(false),
    available: boolean("available").notNull().default(true),
  },
  (t) => [unique().on(t.gameId, t.catalogueName)],
);

export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
export type Package = typeof packages.$inferSelect;
export type NewPackage = typeof packages.$inferInsert;
