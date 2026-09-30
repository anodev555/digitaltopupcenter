CREATE TABLE "games_list" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"game_code" varchar(100) UNIQUE
);
