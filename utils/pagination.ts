const DEFAULT_PERPAGE = 5;
const MAX_PERPAGE = 50;
export const PAGESIZES = [5, 10, 20, 30, 40, 50];
export function parsePage(page: string | undefined): number {
  if (!page) return 1;
  const parsedPage = Number(page);
  if (!Number.isFinite(parsedPage) || parsedPage < 1) return 1;
  return Math.floor(parsedPage);
}

export function parsePerPage(perpage: string | undefined) {
  if (!perpage) return DEFAULT_PERPAGE;
  const parsedPerPage = Number(perpage);
  if (!Number.isFinite(parsedPerPage) || parsedPerPage <= 0) {
    return DEFAULT_PERPAGE;
  }

  return Math.min(Math.floor(parsedPerPage), MAX_PERPAGE);
}
