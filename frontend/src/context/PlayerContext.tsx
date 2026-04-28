import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode } from "react";
import { defaultQueue, Track } from "@/lib/tracks";
import type { ParsedLyrics } from "@/types/lyrics";
import { fetchLyricsForTrack } from "@/lib/jiosaavn-lyrics-integration";
import { parseLyrics } from "@/utils/lyricsParser";

interface PlayerContextValue {
  queue: Track[];
  currentIndex: number;
  current: Track | undefined;
  playing: boolean;
  progress: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeatMode: number; // 0: off, 1: all, 2: one
  lyrics: ParsedLyrics | null;
  loadingLyrics: boolean;
  activeLineIndex: number;
  showLyrics: boolean;
  setShowLyrics: (v: boolean) => void;
  // LRCLIB fallback UI phase for iOS spinner in NowPlayingFull
  lyricsFallbackPhase: 'idle' | 'lrclib' | 'done';
  setLyricsFallbackPhase: (p: 'idle' | 'lrclib' | 'done') => void;
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  seek: (seconds: number) => void;
  setVolume: (v: number) => void;
  next: () => void;
  prev: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  playIndex: (i: number) => void;
  removeFromQueue: (id: string) => void;
  playTrack: (track: Track) => void;
  setQueue: (tracks: Track[]) => void;
  reorderQueue: (startIndex: number, endIndex: number) => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

const cleanMetadata = (text: string) => {
  if (!text) return "";
  return text
    .split(/\s*[\(\[-\s]\s*(?:feat|ft|with|prod|remix|edit|version|single|album|official|lyrics|lyric|video|from|movie|soundtrack|hindi|punjabi|tamil|telugu|kannada|malayalam|bengali|marathi|gujarati|assamese|odia|rajasthani|haryanvi|bhojpuri|urdu|english|original)\b/i)[0]
    .replace(/[^\w\s\u0900-\u097F]/g, " ") 
    .trim();
};

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  if (!audioRef.current && typeof window !== "undefined") {
    audioRef.current = new Audio();
    audioRef.current.preload = "metadata";
  }

  const [queue, setQueueState] = useState<Track[]>(defaultQueue);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.5); 
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState(1); 

  // Shared Lyrics states
  const [lyrics, setLyrics] = useState<ParsedLyrics | null>(null);
  const [loadingLyrics, setLoadingLyrics] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState(-1);
  const [showLyrics, setShowLyrics] = useState(false);
  // iOS spinner control for LRCLIB fallback in expanded Now Playing
  const [lyricsFallbackPhase, setLyricsFallbackPhase] = useState<'idle' | 'lrclib' | 'done'>('idle');

  const current = queue[currentIndex];

  useEffect(() => {
    if (!current?.id || current.id.startsWith('t')) {
      setLyrics(null);
      return;
    }

    let active = true;
    async function getLyrics() {
      setLoadingLyrics(true);
      setLyrics(null);
      try {
        const cleanTitle = cleanMetadata(current.title);
        const artistList = current.artist.split(',').map(a => cleanMetadata(a.trim()));
        const cleanArtist = artistList[0];
        const cleanAlbum = cleanMetadata(current.album);

        const trackData: any = {
          id: current.id,
          name: cleanTitle,
          artists: { primary: artistList.map(name => ({ name, id: "" })) },
          album: { name: cleanAlbum, id: "" },
          isrc: current.isrc,
          hasLyrics: current.hasLyrics,
          duration: current.duration
        };
        
        const result = await fetchLyricsForTrack(trackData);
        if (!active) return;

        if (result.success && result.lyrics) {
          // Prefer synced; if only embedded is present, still show as static
          const synced = result.lyrics.synced || result.lyrics.embedded; // embedded might be plain
          const parsed = parseLyrics(synced || '');
          setLyrics(parsed);
          return; // cleaned unreachable branch
          
        }
      } catch (err) {
        // console.error("Lyrics fetch failed:", err);
      } finally {
        if (active) setLoadingLyrics(false);
      }
    }

    getLyrics();
    return () => { active = false; };
  }, [current?.id]);

  useEffect(() => {
    if (!lyrics || lyrics.type === 'static') {
      setActiveLineIndex(-1);
      return;
    }
    const index = lyrics.lines.findIndex(
      (line) => progress >= line.startTime && progress < line.endTime
    );
    setActiveLineIndex(index);
  }, [progress, lyrics]);

  const next = useCallback(() => {
    const a = audioRef.current;
    if (repeatMode === 2) {
      if (a) { a.currentTime = 0; a.play().catch(() => {}); setPlaying(true); }
      return;
    }
    if (shuffle) {
      let nextIndex;
      do { nextIndex = Math.floor(Math.random() * queue.length); } 
      while (nextIndex === currentIndex && queue.length > 1);
      setCurrentIndex(nextIndex);
      setPlaying(true);
    } else {
      const nextIdx = currentIndex + 1;
      if (nextIdx < queue.length) {
        setCurrentIndex(nextIdx);
        setPlaying(true);
      } else if (repeatMode === 1) {
        setCurrentIndex(0);
        setPlaying(true);
      } else {
        setPlaying(false);
      }
    }
  }, [queue, shuffle, repeatMode, currentIndex]);

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + queue.length) % queue.length);
  }, [queue.length]);

  const toggleShuffle = useCallback(() => setShuffle((s) => !s), []);
  const toggleRepeat = useCallback(() => setRepeatMode((m) => (m + 1) % 3), []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a || !current) return;
    a.src = current.src;
    a.load();
    if (playing) {
      a.play().then(() => {}).catch(() => {});
    }
  }, [current]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing && a.paused) {
      a.play().then(() => {}).catch(() => {});
    } else if (!playing && !a.paused) {
      a.pause();
    }
  }, [playing]); 

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setProgress(a.currentTime);
    const onMeta = () => setDuration(a.duration || 0);
    const onEnd = () => {
      if (repeatMode === 2) {
        a.currentTime = 0;
        a.play().catch(() => setPlaying(false));
      } else next();
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.volume = volume;
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnd);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
    };
  }, [queue.length, repeatMode, next, volume]);

  const play = useCallback(() => audioRef.current?.play().catch(() => setPlaying(false)), []);
  const pause = useCallback(() => audioRef.current?.pause(), []);
  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => setPlaying(false));
    else a.pause();
  }, []);
  const seek = useCallback((s: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = s;
    setProgress(s);
  }, []);
  const setVolume = useCallback((v: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = v;
    setVolumeState(v);
  }, []);
  
  const playIndex = useCallback((i: number) => {
    setCurrentIndex(i);
    setPlaying(true);
    setTimeout(() => audioRef.current?.play().catch(() => setPlaying(false)), 0);
  }, []);
  
  const removeFromQueue = useCallback(() => {}, []);

  const playTrack = useCallback((track: Track, addToCurrentQueue = false) => {
    const a = audioRef.current;
    if (!a) return;
    if (addToCurrentQueue) {
      setQueueState((currentQueue) => {
        const trackIndex = currentQueue.findIndex(t => t.id === track.id);
        if (trackIndex >= 0) {
          setCurrentIndex(trackIndex);
          return currentQueue;
        }
        const newQueue = [...currentQueue];
        newQueue.splice(currentIndex + 1, 0, track);
        setCurrentIndex(currentIndex + 1);
        return newQueue;
      });
    } else {
      setQueueState([track]);
      setCurrentIndex(0);
    }
    a.src = track.src;
    a.load();
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [currentIndex]);

  const setQueue = useCallback((tracks: Track[]) => {
    setQueueState(tracks);
    setCurrentIndex(0);
    const a = audioRef.current;
    if (a && tracks.length > 0) {
      a.src = tracks[0].src;
      a.load();
    }
  }, []);

  const reorderQueue = useCallback((startIndex: number, endIndex: number) => {
    setQueueState((currentQueue) => {
      const result = Array.from(currentQueue);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      if (startIndex === currentIndex) setCurrentIndex(endIndex);
      else if (startIndex < currentIndex && endIndex >= currentIndex) setCurrentIndex(currentIndex - 1);
      else if (startIndex > currentIndex && endIndex <= currentIndex) setCurrentIndex(currentIndex + 1);
      return result;
    });
  }, [currentIndex]);

  const value = useMemo<PlayerContextValue>(() => ({
    queue, currentIndex, current, playing, progress, duration, volume, shuffle, repeatMode,
    lyrics, loadingLyrics, activeLineIndex, showLyrics, setShowLyrics,
    // expose LRCLIB fallback phase controls
    lyricsFallbackPhase, setLyricsFallbackPhase,
    togglePlay, play, pause, seek, setVolume, next, prev, toggleShuffle, toggleRepeat, playIndex, removeFromQueue,
    playTrack, setQueue, reorderQueue,
  }), [queue, currentIndex, current, playing, progress, duration, volume, shuffle, repeatMode, lyrics, loadingLyrics, activeLineIndex, showLyrics, lyricsFallbackPhase, setLyricsFallbackPhase, togglePlay, play, pause, seek, setVolume, next, prev, toggleShuffle, toggleRepeat, playIndex, removeFromQueue, playTrack, setQueue, reorderQueue]);

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside PlayerProvider");
  return ctx;
}
