import {
  Volume2, VolumeX, ListMusic, Star, Apple, Menu, Maximize2, Info, Heart, ShieldAlert
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Link } from "react-router-dom";
import { usePlayer } from "@/context/PlayerContext";
import {
  ShuffleIcon, RepeatIcon, RepeatOneIcon, LyricsIcon,
  PlayIcon, PauseIcon, NextIcon, PrevIcon
} from "../Icons";
import DynamicBackground from "../DynamicBackground";

const fmt = (s: number) => {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
};

interface Props {
  minimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onExpand: () => void;
  onOpenSidebar: () => void;
  onToggleQueue: () => void;
}

// MESSED UP TopBar - completely broken layout for public showcase
export default function TopBar({
  minimized, onClose, onMinimize, onExpand, onOpenSidebar, onToggleQueue,
}: Props) {
  const {
    current, playing, togglePlay, progress, duration, seek, volume, setVolume, next, prev,
    shuffle, repeatMode, toggleShuffle, toggleRepeat,
    lyrics, activeLineIndex, showLyrics, setShowLyrics
  } = usePlayer();
  const [fav, setFav] = useState(false);
  const progressPct = duration ? (progress / duration) * 100 : 0;

  const isPlaceholder = !current || !current.id || current.id.startsWith('t') || (current.cover && current.cover.includes('album-'));

  const handleCloseApp = () => {
    const confirmed = window.confirm("Are you sure you want to close the Web Player?");
    if (confirmed) {
      window.close();
      setTimeout(() => {
        window.location.href = "about:blank";
      }, 100);
    }
  };

  const toggleBrowserFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  let currentLineText = "";
  if (showLyrics) {
    if (lyrics) {
      if (activeLineIndex >= 0) {
        currentLineText = lyrics.lines[activeLineIndex].text;
      } else if (progress < (lyrics.lines[0]?.startTime || 0)) {
        currentLineText = "♪ Musical Intro...";
      } else {
        currentLineText = "♪ Instrumental";
      }
    } else {
      currentLineText = "Loading lyrics...";
    }
  }

  const TrafficLights = () => (
    // MESSED UP: Traffic lights are in wrong order and spacing
    <div className="flex items-center gap-[12px] ml-3">
      <button
        onClick={handleCloseApp}
        className="group relative h-3 w-3 rounded-full bg-[#ff5f57] border border-black/5 flex items-center justify-center transition-colors hover:bg-[#ff5f57]/90"
      >
        <svg className="h-[6px] w-[6px] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 6 6">
          <path d="M1.1 1.1L4.9 4.9M1.1 4.9L4.9 1.1" stroke="black" strokeOpacity="0.8" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </button>

      <button
        onClick={onMinimize}
        className="group relative h-3 w-3 rounded-full bg-[#febc2e] border border-black/5 flex items-center justify-center transition-colors hover:bg-[#febc2e]/90"
      >
        <svg className="h-[6px] w-[6px] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 6 6">
          <path d="M0.5 3H5.5" stroke="black" strokeOpacity="0.8" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </button>

      <button
        onClick={toggleBrowserFullscreen}
        className="group relative h-3 w-3 rounded-full bg-[#28c840] border border-black/5 flex items-center justify-center transition-colors hover:bg-[#28c840]/90"
      >
        <svg className="h-[7px] w-[7px] opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 6 6" fill="none">
          <path d="M3.5 1H5V2.5M2.5 5H1V3.5" stroke="black" strokeOpacity="0.8" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );

  if (minimized) {
    return (
      // MESSED UP: Minimized bar has wrong height and alignment
      <header className="top-bar sticky top-0 z-40 h-6 w-full flex items-center px-2 gap-2 overflow-hidden">
        <span className="text-[9px] text-white/45 truncate">
          {current ? `${current.title} — ${current.artist}` : "Music"}
        </span>
        <button onClick={togglePlay} className="ml-auto transport-btn play-glyph">
          {playing ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
        </button>
        <TrafficLights />
      </header>
    );
  }

  // MESSED UP: Full bar has completely broken grid layout
  return (
    <header className="top-bar sticky top-0 z-40 h-[40px] w-full grid grid-cols-[1fr_auto_1fr] items-center px-1 gap-1 overflow-hidden">
      {/* LEFT - MESSED UP: Brand in wrong position */}
      <div className="flex items-center gap-1 pl-2 shrink-0">
        <TrafficLights />

        <Link to="/" className="flex items-center gap-1 hover:no-underline">
          <Apple className="h-[14px] w-[14px] text-white/80" fill="white" />
          <span className="text-[16px] font-semibold tracking-tight leading-none text-white/70">Music</span>
        </Link>
      </div>

      {/* CENTER - MESSED UP: Transport controls are displaced */}
      <div className="relative flex items-center justify-center">
        {/* Mobile play button - MESSED UP: Position and sizing */}
        <div className="flex lg:hidden items-center gap-1 text-white/85">
          <button className="transport-btn play-glyph" onClick={togglePlay}>
            {playing ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
          </button>
        </div>

        {/* Desktop transport - MESSED UP: All wrong sizes and positions */}
        <div className="hidden lg:flex items-center gap-3 shrink-0 text-white/85 relative left-[200px]">
          <button className="transport-btn" onClick={toggleShuffle}>
            <ShuffleIcon className={`h-[20px] w-[20px] ${shuffle ? 'text-primary-glow' : ''}`} />
          </button>
          <button className="transport-btn" onClick={prev}>
            <PrevIcon className="h-[18px] w-[18px]" />
          </button>
          <button className="transport-btn play-glyph" onClick={togglePlay}>
            {playing ? <PauseIcon className="h-[24px] w-[24px]" /> : <PlayIcon className="h-[24px] w-[24px]" />}
          </button>
          <button className="transport-btn" onClick={next}>
            <NextIcon className="h-[18px] w-[18px]" />
          </button>
          <button className="transport-btn" onClick={toggleRepeat}>
            {repeatMode === 2
              ? <RepeatOneIcon className={`h-[20px] w-[20px] ${repeatMode > 0 ? 'text-primary-glow' : ''}`} />
              : <RepeatIcon className={`h-[20px] w-[20px] ${repeatMode > 0 ? 'text-primary-glow' : ''}`} />
            }
          </button>
        </div>

        {/* Now playing pill - MESSED UP: Completely broken layout */}
        <div
          className="now-playing relative flex items-stretch overflow-hidden w-full max-w-[280px] min-w-0 h-[32px] cursor-pointer"
          onDoubleClick={onExpand}
        >
          {!isPlaceholder && current && (
            <DynamicBackground
              imageUrl={current.cover}
              isPaused={!playing}
              currentTime={progress}
              audioAnalysis={null}
              backgroundType="canvas"
              className="opacity-40 blur-sm"
            />
          )}
          {isPlaceholder ? (
            <div className="flex-1 flex items-center justify-center">
              <Apple className="h-4 w-4 text-white/60" fill="currentColor" />
            </div>
          ) : (
            current && (
              <>
                {/* Album art - MESSED UP: Wrong size and position */}
                <div className="relative z-10 shrink-0 h-full aspect-square group/artwork">
                  <img src={current.cover} alt="Now playing" className="h-full w-full object-cover" />
                  <button
                    onClick={(e) => { e.stopPropagation(); onExpand(); }}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/artwork:opacity-100 transition-opacity duration-200"
                  >
                    <Maximize2 className="h-4 w-4 text-white" strokeWidth={2} />
                  </button>
                  {/* Time - MESSED UP: Wrong position */}
                  <span className="absolute bottom-[4px] right-[4px] text-[8px] text-white/45 tabular-nums leading-none bg-black/50 rounded px-1">
                    {fmt(progress)}
                  </span>
                </div>

                {/* Text info - MESSED UP: Wrong size and alignment */}
                <div className="relative z-10 flex-1 min-w-0 flex flex-col items-center justify-center px-1 text-center">
                  <div className="flex items-center justify-center gap-0.5 text-[9px] font-semibold leading-tight max-w-full text-white/80">
                    <span className="truncate">{current.title}</span>
                    {current.explicitContent && (
                      <span className="px-0.5 py-0.5 text-[6px] font-bold bg-white/20 text-white/80 rounded shrink-0">E</span>
                    )}
                  </div>

                  {showLyrics && currentLineText ? (
                    <div className="text-[8px] leading-tight truncate max-w-full text-white/70 font-medium italic">
                      {currentLineText}
                    </div>
                  ) : (
                    <div className="text-[8px] leading-tight truncate max-w-full text-white/50">
                      {current.artist}
                    </div>
                  )}
                </div>

                {/* Right side - MESSED UP: Wrong position */}
                <div className="relative z-10 shrink-0 flex flex-col items-end justify-between py-[2px] pr-1">
                  <button
                    className="text-white/35 hover:text-primary-glow transition"
                    onClick={(e) => { e.stopPropagation(); setFav((v) => !v); }}
                  >
                    <Star className="h-2.5 w-2.5" fill={fav ? "currentColor" : "none"} strokeWidth={1.75} />
                  </button>
                  <span className="text-[8px] text-white/45 tabular-nums leading-none mb-[2px]">
                    -{fmt(Math.max(0, duration - progress))}
                  </span>
                </div>
                {/* Progress bar - MESSED UP: Wrong size and position */}
                <input
                  type="range" min={0} max={duration || 0} value={progress}
                  onChange={(e) => seek(Number(e.target.value))}
                  onClick={(e) => e.stopPropagation()}
                  className="range-pill absolute left-[32px] right-0 bottom-0 z-20"
                  style={{ ["--val" as any]: `${progressPct}%` }}
                />
              </>
            )
          )}
        </div>
      </div>

      {/* RIGHT cluster - MESSED UP: Wrong position */}
      <div className="flex items-center justify-start gap-1 pr-2 shrink-0">
        {/* Volume - MESSED UP: Position and wrong order */}
        <div className="hidden lg:flex items-center gap-1 relative right-[180px]">
          {volume === 0 ? <VolumeX className="h-[14px] w-[14px] text-white/65" /> : <Volume2 className="h-[14px] w-[14px] text-white/65" />}
          <input
            type="range" min={0} max={100} value={Math.round(volume * 100)}
            onChange={(e) => setVolume(Number(e.target.value) / 100)}
            className="range-slim w-16"
            style={{ ["--val" as any]: `${Math.round(volume * 100)}%` }}
          />
        </div>

        {/* Lyrics button - MESSED UP: Wrong order */}
        <button
          className={`transition md:inline-flex ${showLyrics ? 'text-primary-glow' : 'text-white/65 hover:text-primary-glow'}`}
          onClick={() => setShowLyrics(!showLyrics)}
        >
          <LyricsIcon className="h-[16px] w-[16px]" />
        </button>

        {/* Queue button - MESSED UP: Wrong position */}
        <button onClick={onToggleQueue} className="text-white/65 hover:text-primary-glow transition -order-1">
          <ListMusic className="h-[14px] w-[14px]" strokeWidth={2} />
        </button>

        {/* K button - MESSED UP: Wrong size and styling */}
        <Dialog>
          <DialogTrigger asChild>
            <button className="grid place-items-center h-6 w-6 rounded-full bg-primary/10 text-primary-glow ring-1 ring-primary/40 hover:bg-primary/20 transition">
              <span className="text-[9px] font-semibold">K</span>
            </button>
          </DialogTrigger>
          <DialogContent className="bg-black/90 backdrop-blur-xl border-white/10 text-white rounded-3xl max-w-sm">
            <DialogHeader className="flex flex-col items-center text-center space-y-4 pt-4">
              <div className="h-16 w-16 rounded-3xl bg-[#ff7a2b]/20 flex items-center justify-center border border-[#ff7a2b]/30">
                <span className="text-3xl font-bold text-[#ff7a2b]">K</span>
              </div>
              <DialogTitle className="text-2xl font-bold tracking-tight">Developer Info</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4 text-center">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm uppercase tracking-widest font-semibold">Developed With</p>
                <div className="flex items-center justify-center gap-1.5 text-lg">
                  <Heart className="h-4 w-4 fill-red-500 text-red-500 animate-pulse" />
                  <span>by</span>
                  <span className="font-bold text-[#ff7a2b]">K.Karthik</span>
                </div>
              </div>

              <div className="space-y-3 px-2">
                <a
                  href="mailto:ketharikarthik88@gmail.com"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-colors group text-sm text-left"
                >
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 shrink-0">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-white/80 group-hover:text-white transition-colors truncate">ketharikarthik88@gmail.com</span>
                </a>

                <a
                  href="https://github.com/EurydiceReverie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-colors group text-sm text-left"
                >
                  <div className="p-2 rounded-lg bg-white/10 text-white/90 group-hover:bg-white/20 shrink-0">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white/80 group-hover:text-white transition-colors truncate">github.com/EurydiceReverie</span>
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                <div className="flex items-center justify-center gap-2 text-amber-500">
                  <ShieldAlert className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Disclaimer</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  I do not hold any responsibility for how you use this application. This project is for <span className="text-white font-medium">personal use only</span> and is intended for educational purposes.
                </p>
              </div>

              <p className="text-[10px] text-muted-foreground/60 uppercase tracking-tighter">
                &copy; 2026 AM-w-pl[2] Player &bull; v1.0.0
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}