/*
  Minimal LRCLIB client
  Docs summary:
  - GET /api/get?artist_name=&track_name=&album_name=&duration=
  - GET /api/get-cached?...
  - GET /api/search?q=... or track_name=...&artist_name=&album_name=
*/

export type LRCLIBLyrics = {
  id: number;
  trackName: string;
  artistName: string;
  albumName: string;
  duration: number; // seconds
  instrumental: boolean;
  plainLyrics?: string | null;
  syncedLyrics?: string | null;
};

export type LRCLIBGetParams = {
  track_name: string;
  artist_name: string;
  album_name: string;
  duration: number; // seconds
};

export type LRCLIBSearchParams = {
  q?: string;
  track_name?: string;
  artist_name?: string;
  album_name?: string;
};

export type LRCLIBOptions = {
  baseUrl?: string; // default https://lrclib.net
  signal?: AbortSignal;
  userAgent?: string; // used only in non-browser/proxy contexts
  cached?: boolean;
};

const DEFAULT_BASE = "https://lrclib.net";

export async function getLyricsBySignature(
  params: LRCLIBGetParams,
  opts: LRCLIBOptions = {}
): Promise<LRCLIBLyrics> {
  const base = (opts.baseUrl ?? DEFAULT_BASE).replace(/\/$/, "");
  const path = opts.cached ? "/api/get-cached" : "/api/get";
  const url = `${base}${path}?${new URLSearchParams({
    track_name: params.track_name,
    artist_name: params.artist_name,
    album_name: params.album_name,
    duration: String(params.duration),
  }).toString()}`;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (opts.userAgent) headers["User-Agent"] = opts.userAgent;

  const res = await fetch(url, { headers, signal: opts.signal });
  if (res.status === 404) {
    throw Object.assign(new Error("LRCLIB: Track not found"), { code: 404 });
  }
  if (!res.ok) {
    throw new Error(`LRCLIB get failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as LRCLIBLyrics;
}

export async function searchLyrics(
  params: LRCLIBSearchParams,
  opts: LRCLIBOptions = {}
): Promise<LRCLIBLyrics[]> {
  const base = (opts.baseUrl ?? DEFAULT_BASE).replace(/\/$/, "");
  const qs = new URLSearchParams();
  if (params.q) qs.set("q", params.q);
  if (params.track_name) qs.set("track_name", params.track_name);
  if (params.artist_name) qs.set("artist_name", params.artist_name);
  if (params.album_name) qs.set("album_name", params.album_name);

  const url = `${base}/api/search?${qs.toString()}`;
  const headers: Record<string, string> = { Accept: "application/json" };
  if (opts.userAgent) headers["User-Agent"] = opts.userAgent;

  const res = await fetch(url, { headers, signal: opts.signal });
  if (!res.ok) {
    throw new Error(`LRCLIB search failed: ${res.status} ${res.statusText}`);
  }
  const json = (await res.json()) as LRCLIBLyrics[] | { code: number; name: string; message: string };
  if (Array.isArray(json)) return json;
  throw new Error(`LRCLIB search error: ${json.name ?? "Unknown"}: ${json.message ?? ""}`);
}
