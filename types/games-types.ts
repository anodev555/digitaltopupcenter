export type GamesRows = {
  id: string;
  g2bulkCode: string;
  name: string;
  imageUrl: string | null;
  requiredFields: string[] | null;
  servers: string[] | null;
  isActive: boolean;
  updatedAt: Date;
  totalPackages: number;
};

export type Games = {
  rows: GamesRows[];
  total: number;
  page: number;
  perPage: number;
  stats: { total: number; active: number; inactive: number };
};
