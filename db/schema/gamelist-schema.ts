import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const gameslist = pgTable("games_list", {
  id: uuid().primaryKey().defaultRandom(),
  gameCode: varchar("game_code", { length: 100 }).unique().notNull(),
  
});
