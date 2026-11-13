/** 25000000 -> "25,000,000" (stable across server/client; no locale surprises) */
export const formatAmount = (n: number) =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const formatRWF = (n: number) => `${formatAmount(n)} RWF`;
