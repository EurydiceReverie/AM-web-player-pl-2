/**
 * Musixmatch TypeScript Type Definitions - STUBBED FOR PUBLIC SHOWCASE
 */

export type LyricsFormat = 'standard' | 'enhanced' | 'lyricsx' | 'custom';

export interface MusixmatchConfig {
  tokensLimit?: number;
  lyricsFormat?: LyricsFormat;
  customTimeDecimals?: boolean;
}

export interface TrackSearchParams {
  trackName: string;
  artistName: string;
  albumName?: string;
}

export interface MusixmatchTrack {
  track_id: number;
  commontrack_id: number;
  has_lyrics: number;
  has_subtitles: number;
  has_richsync: number;
  track_name: string;
  artist_name: string;
  album_name: string;
  track_isrc?: string;
  track_length?: number;
  first_release_date?: string;
}

export interface LyricsResult {
  embedded?: string;
  synced?: string;
  plainLyrics?: string;
}

export interface RichSyncWord {
  c: string;
  o: number;
}

export interface RichSyncLine {
  ts: number;
  te: number;
  x: string;
  l: RichSyncWord[];
}

export interface SearchParams {
  isrc?: string;
  trackName?: string;
  artistName?: string;
  albumName?: string;
}

export interface LyricsMetadata {
  track?: MusixmatchTrack;
  format: LyricsFormat;
  isSynced: boolean;
  lyricsType: 'richsync' | 'subtitle' | 'plain';
}