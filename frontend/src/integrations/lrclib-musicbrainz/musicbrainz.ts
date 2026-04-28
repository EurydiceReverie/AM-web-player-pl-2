/*
  Minimal MusicBrainz client focused on searching recordings by
  title + album (+ optional artist) and extracting ISRCs and duration.
  Designed for browser usage with optional proxying.
*/

export type MBArtistCredit = {
  name?: string;
  artist?: { id: string; name: string; "sort-name"?: string };
  joinphrase?: string;
};

export type MBRelease = {
  id: string;
  title: string;
  date?: string;
};

export type MBRecording = {
  id: string;
  title: string;
  length?: number; // milliseconds
  isrcs?: string[];
  releases?: MBRelease[];
  "artist-credit"?: MBArtistCredit[];
};

export type MBRecordingSearchResponse = {
  created: string;
  count: number;
  offset: number;
  recordings?: MBRecording[];
};

export type MBSearchOptions = {
  artist?: string;
  durationSeconds?: number;
  baseUrl?: string; // e.g. "/proxy/https://musicbrainz.org/ws/2"
  limit?: number;
  signal?: AbortSignal;
};

export type MBBestMatch = {
  recording: MBRecording;
  score: number;
  albumMatch?: string; // selected release title used for match
};

export type MBSearchResult = {
  query: { title: string; album: string; artist?: string };
  endpoint: string;
  items: MBRecording[];
  best?: MBBestMatch;
};

function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function joinArtistCredit(credits?: MBArtistCredit[]): string | undefined {
  if (!credits || !credits.length) return undefined;
  return credits
    .map((c) => (c?.artist?.name ?? c?.name ?? "") + (c?.joinphrase ?? ""))
    .join("")
    .trim();
}

export async function searchRecordingByTitleAlbum(
  title: string,
  album: string,
  opts: MBSearchOptions = {}
): Promise<MBSearchResult> {
  const baseUrl = (opts.baseUrl ?? "https://musicbrainz.org/ws/2").replace(/\/$/, "");
  const inc = "isrcs+releases+artist-credits";
  const q = [
    `recording:(${title})`,
    album ? `release:(${album})` : undefined,
    opts.artist ? `artist:(${opts.artist})` : undefined,
  ]
    .filter(Boolean)
    .join(" AND ");

  const url = `${baseUrl}/recording?query=${encodeURIComponent(q)}&fmt=json&limit=${
    opts.limit ?? 10
  }&inc=${encodeURIComponent(inc)}`;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  // Browsers cannot set User-Agent. If you route through a proxy, set it there.
  // headers["User-Agent"] = "LyricsApp/0.1 (https://example.com)";

  const res = await fetch(url, { headers, signal: opts.signal });
  if (!res.ok) {
    throw new Error(`MusicBrainz search failed: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as MBRecordingSearchResponse;
  const items = data.recordings ?? [];

  const normTitle = normalize(title);
  const normAlbum = normalize(album);
  const normArtist = opts.artist ? normalize(opts.artist) : undefined;

  let best: MBBestMatch | undefined;
  for (const rec of items) {
    const recTitle = normalize(rec.title);
    const recArtist = normalize(joinArtistCredit(rec["artist-credit"]) ?? "");
    let maxAlbumMatchTitle: string | undefined;
    let score = 0;

    // Title Score (Max 10)
    if (recTitle === normTitle) score += 10;
    else if (recTitle.includes(normTitle) || normTitle.includes(recTitle)) score += 5;

    // Artist Score (Max 10)
    if (normArtist) {
      if (recArtist === normArtist) score += 10;
      else if (recArtist.includes(normArtist) || normArtist.includes(recArtist)) score += 5;
    }

    // Album Score (Max 5)
    if (rec.releases && rec.releases.length) {
      for (const rel of rec.releases) {
        const r = normalize(rel.title);
        if (r === normAlbum) {
          score += 5;
          maxAlbumMatchTitle = rel.title;
          break;
        } else if (r.includes(normAlbum) || normAlbum.includes(r)) {
          score += 2;
          maxAlbumMatchTitle = rel.title;
        }
      }
    }

    // Duration Score (Max 10) - CRITICAL for correct version
    if (opts.durationSeconds && rec.length) {
      const recDuration = Math.round(rec.length / 1000);
      const diff = Math.abs(opts.durationSeconds - recDuration);
      if (diff <= 2) score += 10; // near perfect
      else if (diff <= 5) score += 5; // very close
      else if (diff <= 10) score += 2; // acceptable
      else score -= 10; // likely different version
    }

    if (!best || score > best.score) {
      best = { recording: rec, score, albumMatch: maxAlbumMatchTitle };
    }
  }

  return {
    query: { title, album, artist: opts.artist },
    endpoint: baseUrl,
    items,
    best,
  };
}

export function extractISRCs(rec?: MBRecording): string[] {
  if (!rec) return [];
  return Array.from(new Set([...(rec.isrcs ?? [])]));
}

export function recordingDurationSeconds(rec?: MBRecording): number | undefined {
  if (!rec?.length || rec.length <= 0) return undefined;
  return Math.round(rec.length / 1000);
}

export function recordingArtistName(rec?: MBRecording): string | undefined {
  return joinArtistCredit(rec?.["artist-credit"]);
}
