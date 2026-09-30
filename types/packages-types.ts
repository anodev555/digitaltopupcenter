export type PackagesRows = {
  id: string;
  gameId: string;
  catalogueName: string;
  gameCurrencyName: string | null;
  costPriceUsd: string;
  sellPriceNpr: string | null;
  isActive: boolean;
  gameName: string;
  gameImageUrl: string | null;
  gameCode: string;
};

export type Packages = {
  rows: PackagesRows[];
  total: number;
  page: number;
  perPage: number;
  stats: { total: number; active: number; inactive: number };
};
