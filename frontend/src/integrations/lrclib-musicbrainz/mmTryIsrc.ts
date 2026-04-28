import { MusixmatchClient } from '@/lib/musixmatch-client';

/**
 * Try to fetch synced lyrics from Musixmatch strictly by a list of ISRCs.
 * Returns the first synced lyrics string found, or undefined if none.
 */
export async function tryMusixmatchByISRC(
  isrcs: string[],
  opts: { format?: 'enhanced' | 'lyricsx' | 'standard' } = {}
): Promise<string | undefined> {
  const mm = new MusixmatchClient({ lyricsFormat: opts.format ?? 'enhanced' });
  for (const isrc of isrcs) {
    if (!isrc) continue;
    try {
      const track = await mm.getTrackByIsrc(isrc);
      if (!track) continue;

      // Prefer richsync
      if ((track as any).has_richsync === 1) {
        const rs = await mm.getRichSyncById(track.track_id);
        if (rs?.richsync_body) {
          const parsed = mm.parseRichSyncLyrics(rs.richsync_body);
          if (parsed) return parsed;
        }
      }
      // Then subtitles (line-synced)
      if (!((track as any).has_richsync === 1) && (track as any).has_subtitles === 1) {
        const sub = await mm.getSubtitleById((track as any).commontrack_id);
        if (sub?.subtitle_body) {
          return sub.subtitle_body;
        }
      }
    } catch (e) {
      // ignore and try next ISRC
      console.warn('Musixmatch ISRC attempt failed (non-fatal):', e);
      continue;
    }
  }
  return undefined;
}
