/**
 * LRCLIB + MusicBrainz Orchestrator - STUBBED FOR PUBLIC SHOWCASE
 */

export type ISRCThenLRCLIBArgs = {
  title: string;
  album: string;
  artist?: string;
  allArtists?: string[];
  durationSeconds?: number;
  isrcs: string[];
  lrclibBaseUrl?: string;
  musixmatch?: {
    lyricsFormat?: any;
    allowLooseFallback?: boolean;
  };
  signal?: AbortSignal;
  onPhase?: (phase: any) => void;
};

export type ISRCThenLRCLIBResult = {
  source: "musixmatch" | "lrclib" | "none";
  syncedLyrics?: string;
  plainLyrics?: string;
  details?: any;
};

export async function fetchSyncedLyricsWithISRCThenLRCLIB(_args: ISRCThenLRCLIBArgs): Promise<ISRCThenLRCLIBResult> {
  return { source: "none" };
}