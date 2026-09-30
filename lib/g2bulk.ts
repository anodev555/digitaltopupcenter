import { isAxiosError } from "axios";
import { api, g2bulkGuard } from "./axois";

const keyHeader = () => ({ "X-API-Key": process.env.G2BULK_API_KEY ?? "" });

// Public catalog endpoints (no key). Shapes marked "confirm" in the
// integration guide -- callers must normalize defensively.

export type gamesItem = {
  id: number;
  code: string;
  name: string;
  image_url: string;
};
export type GamesType = {
  games: gamesItem[];
};

//fetch all direct-topup games
export async function listGames(): Promise<GamesType> {
  return (await api.get("/games")).data;
}
type getFieldResponseType = {
  info: {
    fields: string[];
    notes: string;
  };
};
// 404 = G2Bulk has no field schema for this game ("game fields not
// available") -> null; caller falls back to a default field set.
export async function getFields(
  game: string,
): Promise<getFieldResponseType | null> {
  try {
    return (await api.post("/games/fields", { game })).data;
  } catch (e) {
    if (
      isAxiosError(e) &&
      (e.response?.status === 404 || e.response?.status === 403)
    )
      return null;
    throw e;
  }
}

// 403 = this game needs no server -> null (per guide).
type getServersResponseType = {
  servers: Record<string, string>;
};
export async function getServers(
  game: string,
): Promise<getServersResponseType | null> {
  try {
    return (await api.post("/games/servers", { game })).data;
  } catch (e) {
    if (isAxiosError(e) && e.response?.status === 403) return null;
    throw e;
  }
}
type catalogueItem = {
  id: number;
  name: string;
  amount: number;
};
type gameInfo = {
  code: string;
  image_url: string;
  name: string;
};
type getCatalogueResponseType = {
  catalogues: catalogueItem[];
  game: gameInfo;
};

export async function getCatalogue(
  code: string,
): Promise<getCatalogueResponseType> {
  return (await api.get(`/games/${code}/catalogue`)).data;
}

// Authed (key) endpoints -- guarded: stop on first 401 to avoid an IP ban.
export async function getMe(): Promise<unknown> {
  g2bulkGuard();
  return (await api.get("/getMe", { headers: keyHeader() })).data;
}

export async function checkPlayer(
  body: Record<string, unknown>,
): Promise<unknown> {
  return (await api.post("/games/checkPlayerId", body)).data;
}

export async function placeOrder(
  code: string,
  body: Record<string, unknown>,
  idempotencyKey: string,
) {
  g2bulkGuard();
  return api.post(`/games/${code}/order`, body, {
    headers: { ...keyHeader(), "X-Idempotency-Key": idempotencyKey },
    validateStatus: () => true,
  });
}
