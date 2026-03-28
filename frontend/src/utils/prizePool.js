/** PRD §07 — prize pool tier shares of total pool */
export const POOL_SHARE = {
  match5: 0.4,
  match4: 0.35,
  match3: 0.25,
};

export function tierShare(tier) {
  if (tier === 5) return POOL_SHARE.match5;
  if (tier === 4) return POOL_SHARE.match4;
  if (tier === 3) return POOL_SHARE.match3;
  return 0;
}

export function prizeAmountForMatch(poolAmount, matchCount) {
  const pool = Number(poolAmount) || 0;
  if (matchCount === 5) return pool * POOL_SHARE.match5;
  if (matchCount === 4) return pool * POOL_SHARE.match4;
  if (matchCount === 3) return pool * POOL_SHARE.match3;
  return 0;
}
