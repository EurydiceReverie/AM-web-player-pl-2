export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  /** Public CDN URL — lossy/lossless source. Browser plays via HTML5 Audio. */
  src: string;
  explicitContent?: boolean;
  isrc?: string; // Added for better matching
  hasLyrics?: boolean; // Whether track has lyrics available
  duration?: number; // Duration in seconds
}

/**
 * Empty default queue - will be populated by JioSaavn search/home results
 */
export const defaultQueue: Track[] = [];
