const store = new Map<string, number[]>();

function cleanup(now: number, windowMs: number) {
  for (const [key, hits] of store) {
    const filtered = hits.filter((t) => now - t < windowMs);
    if (filtered.length === 0) store.delete(key);
    else store.set(key, filtered);
  }
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  cleanup(now, windowMs);
  const hits = store.get(key) ?? [];
  if (hits.length >= limit) {
    const retryAfter = Math.ceil((hits[0] + windowMs - now) / 1000);
    return { ok: false, retryAfter } as const;
  }
  hits.push(now);
  store.set(key, hits);
  return { ok: true } as const;
}