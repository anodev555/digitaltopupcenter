CREATE TABLE "games" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"g2bulk_code" varchar(100) NOT NULL UNIQUE,
	"name" varchar(200) NOT NULL,
	"image_url" text,
	"required_field" text[] DEFAULT '{userid}'::text[],
	"servers" text[] DEFAULT '{}'::text[],
	"is_active" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "packages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"game_id" uuid NOT NULL,
	"catalogue_name" varchar(200) NOT NULL,
	"display_name" varchar(200),
	"cost_price_usd" numeric(10,4) NOT NULL,
	"sell_price_npr" numeric(10,2),
	"is_active" boolean DEFAULT false NOT NULL,
	"available" boolean DEFAULT true NOT NULL,
	CONSTRAINT "packages_game_id_catalogue_name_unique" UNIQUE("game_id","catalogue_name")
);
--> statement-breakpoint
ALTER TABLE "packages" ADD CONSTRAINT "packages_game_id_games_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;