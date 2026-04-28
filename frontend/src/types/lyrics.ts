// Lyrics Types based on Spicy Lyrics implementation

export interface LyricsSyllable {
  text: string;
  startTime: number;
  endTime: number;
}

export interface LyricsLine {
  text: string;
  startTime: number;
  endTime: number;
  syllables?: LyricsSyllable[];
  romanizedText?: string;
}

export interface AudioAnalysisData {
  track: {
    tempo: number;
    loudness: number;
    duration: number;
  };
  sections: Array<{
    start: number;
    duration: number;
    confidence: number;
    loudness: number;
    tempo: number;
    key: number;
    mode: number;
    time_signature: number;
  }>;
  beats: Array<{
    start: number;
    duration: number;
    confidence: number;
  }>;
  segments: Array<{
    start: number;
    duration: number;
    confidence: number;
    loudness_start: number;
    loudness_max_time: number;
    loudness_max: number;
    loudness_end?: number;
  }>;
}

export type LyricsType = 'syllable' | 'line' | 'static';

export interface ParsedLyrics {
  type: LyricsType;
  lines: LyricsLine[];
  title?: string;
  artist?: string;
}
