import {
  searchRecordingByTitleAlbum,
  extractISRCs,
  recordingDurationSeconds,
  recordingArtistName,
  type MBRecording,
} from "./musicbrainz";
import { getLyricsBySignature, searchLyrics, type LRCLIBLyrics } from "./lrclib";

export type FindArgs = {
  title: string;
  album: string;
  artist?: string;
  musicbrainzBaseUrl?: string;
  lrclibBaseUrl?: string;
  preferCached?: boolean; // if true, try get-cached first
  signal?: AbortSignal;
};

export type FindResult = {
  query: { title: string; album: string; artist?: string };
  isrcs: string[];
  durationSeconds?: number;
  artistName?: string;
  musicbrainzRecordingId?: string;
  musicbrainzRecording?: MBRecording;
  lrclibId?: number;
  lyrics?: Pick<LRCLIBLyrics, "plainLyrics" | "syncedLyrics" | "instrumental"> & {
    trackName: string;
    artistName: string;
    albumName: string;
    duration: number;
  };
};

export async function findISRCsAndLyrics(args: FindArgs): Promise<FindResult> {
  const { title, album, artist, musicbrainzBaseUrl, lrclibBaseUrl, preferCached, signal } = args;

  const mb = await searchRecordingByTitleAlbum(title, album, { artist, baseUrl: musicbrainzBaseUrl, signal });
  const best = mb.best?.recording;
  const isrcs = extractISRCs(best);
  const durationSeconds = recordingDurationSeconds(best);
  const mbArtist = recordingArtistName(best) ?? artist;

  let lyrics: FindResult["lyrics"] | undefined;
  let lrclibId: number | undefined;

  // Try LRCLIB signature lookup when we have both artist and duration
  if (mbArtist && durationSeconds) {
    try {
      const data = await getLyricsBySignature(
        {
          track_name: title,
          artist_name: mbArtist,
          album_name: album,
          duration: durationSeconds,
        },
        { baseUrl: lrclibBaseUrl, cached: !!preferCached, signal }
      );
      lyrics = {
        trackName: data.trackName,
        artistName: data.artistName,
        albumName: data.albumName,
        duration: data.duration,
        syncedLyrics: data.syncedLyrics ?? undefined,
        plainLyrics: data.plainLyrics ?? undefined,
        instrumental: !!data.instrumental,
      };
      lrclibId = data.id;
    } catch (e: any) {
      // swallow 404 and continue to fallback search
      if (e?.code !== 404) {
        // Network or other error: rethrow to let caller decide
        // console.warn("LRCLIB signature lookup error", e);
      }
    }
  }

  // Fallback: search by fields
  if (!lyrics) {
    const results = await searchLyrics(
      { track_name: title, artist_name: mbArtist, album_name: album },
      { baseUrl: lrclibBaseUrl, signal }
    );
    const pick = results.find((r) => !!r.syncedLyrics) ?? results[0];
    if (pick) {
      lyrics = {
        trackName: pick.trackName,
        artistName: pick.artistName,
        albumName: pick.albumName,
        duration: pick.duration,
        syncedLyrics: pick.syncedLyrics ?? undefined,
        plainLyrics: pick.plainLyrics ?? undefined,
        instrumental: !!pick.instrumental,
      };
      lrclibId = pick.id;
    }
  }

  return {
    query: { title, album, artist },
    isrcs,
    durationSeconds,
    artistName: mbArtist,
    musicbrainzRecordingId: best?.id,
    musicbrainzRecording: best,
    lrclibId,
    lyrics,
  };
}
