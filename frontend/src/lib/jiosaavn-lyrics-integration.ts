/**
 * JioSaavn Lyrics Integration - STUBBED FOR PUBLIC SHOWCASE
 */
import { jiosaavnApi } from './jiosaavn-api';
import type { LyricsResult } from './musixmatch-types';

export interface JioSaavnTrack {
  id: string;
  name: string;
  isrc?: string;
  artists: {
    primary: Array<{ name: string; id: string }>;
    featured?: Array<{ name: string; id: string }>;
    all?: Array<{ name: string; id: string }>;
  };
  album: {
    id: string | null;
    name: string | null;
    url?: string | null;
  };
  duration?: number;
  year?: string;
  releaseDate?: string;
  hasLyrics?: boolean;
  lyricsId?: string | null;
}

export interface LyricsSearchResult {
  success: boolean;
  lyrics: LyricsResult | null;
  metadata: {
    trackName: string;
    artistName: string;
    albumName: string;
    searchMethod: 'metadata' | 'isrc' | 'jiosaavn';
    format: 'enhanced';
  };
  error?: string;
}

export class JioSaavnLyricsIntegration {
  async initialize(): Promise<void> {}
  async getLyricsForTrack(_track: JioSaavnTrack): Promise<LyricsSearchResult> {
    return {
      success: false,
      lyrics: null,
      metadata: { trackName: '', artistName: '', albumName: '', searchMethod: 'metadata', format: 'enhanced' },
      error: 'STUBBED'
    };
  }
  async getLyricsForTracks(_tracks: JioSaavnTrack[]): Promise<LyricsSearchResult[]> { return []; }
  isInitialized(): boolean { return false; }
}

export function getLyricsIntegration(): JioSaavnLyricsIntegration {
  return new JioSaavnLyricsIntegration();
}

export async function fetchLyricsForTrack(_track: JioSaavnTrack): Promise<LyricsSearchResult> {
  return {
    success: false,
    lyrics: null,
    metadata: { trackName: '', artistName: '', albumName: '', searchMethod: 'metadata', format: 'enhanced' },
    error: 'STUBBED'
  };
}

export default JioSaavnLyricsIntegration;