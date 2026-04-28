/**
 * Musixmatch TypeScript Client - STUBBED FOR PUBLIC SHOWCASE
 */

export type LyricsFormat = 'standard' | 'enhanced' | 'lyricsx' | 'custom';

export interface MusixmatchConfig {
  allowLooseFallback?: boolean;
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
}

export interface LyricsResult {
  embedded?: string;
  synced?: string;
}

export class MusixmatchClient {
  constructor(_config: MusixmatchConfig = {}) {}
  async initialize(): Promise<void> {}
  async getTrackByIsrc(_isrc: string): Promise<MusixmatchTrack | null> { return null; }
  async getTrackByMetadata(_params: TrackSearchParams): Promise<MusixmatchTrack | null> { return null; }
  async getLyricsById(_trackId: number): Promise<{ lyrics_body: string } | null> { return null; }
  async getSubtitleById(_commonTrackId: number): Promise<{ subtitle_body: string } | null> { return null; }
  async getRichSyncById(_trackId: number): Promise<{ richsync_body: string } | null> { return null; }
  async getLyricsByMetadata(_params: TrackSearchParams): Promise<any> { return null; }
  async searchTracks(_query: string): Promise<MusixmatchTrack[]> { return []; }
  async searchTrack(_params: { isrc?: string } & Partial<TrackSearchParams>): Promise<LyricsResult | null> { return null; }
  getLyricsFormat(): LyricsFormat { return 'standard'; }
  setLyricsFormat(_format: LyricsFormat): void {}
}

export default MusixmatchClient;