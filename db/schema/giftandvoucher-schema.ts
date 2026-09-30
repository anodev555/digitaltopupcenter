import {
  boolean,
  integer,
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const giftvoucher = pgTable(
  "gifts_vouchers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    giftvoucherId: integer("giftvoucher_id").notNull().unique(),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description"),
    imageUrl: text("imageUrl"),
    customEmojiId: varchar("custom_emoji_id", { length: 200 }),
    productCount: integer("product_count").notNull(),
    isActive: boolean("is_active").default(false),
  },
  (table) => [],
);
