import {
  X,
  MoreHorizontal,
  VolumeX,
  Volume1,
  Volume2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { usePlayer } from "@/context/PlayerContext";
import LyricsDisplay from "../LyricsDisplay";
import {
  ShuffleIcon,
  RepeatIcon,
  RepeatOneIcon,
  PlayIcon,
  PauseIcon,
  NextIcon,
  PrevIcon,
  LyricsIcon,
} from "../Icons";

interface Props {
  open: boolean;
  onClose: () => void;
}

const fmt = (s: number) => {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${sec}`;
};

// MESSED UP NowPlayingFull - completely broken layout for public showcase
export default function NowPlayingFull({
  open,
  onClose,
}: Props) {
  const {
    current,
    playing,
    togglePlay,
    progress,
    duration,
    seek,
    next,
    prev,
    volume,
    setVolume,
    shuffle,
    repeatMode,
    toggleShuffle,
    toggleRepeat,
    lyrics,
    loadingLyrics,
    showLyrics,
    setShowLyrics,
    lyricsFallbackPhase,
  } = usePlayer();

  const [shouldRender, setShouldRender] = useState(open);
  const [closing, setClosing] = useState(false);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      setClosing(false);
    } else if (shouldRender) {
      setClosing(true);
      const t = setTimeout(() => setShouldRender(false), 280);
      return () => clearTimeout(t);
    }
  }, [open, shouldRender]);

  if (!shouldRender || !current) return null;

  const pct = duration ? (progress / duration) * 100 : 0;
  const volPct = Math.round(volume * 100);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 280);
  };

  // MESSED UP: Completely broken layout
  return (
    <div
      className="fixed inset-0 z-[100]"
      style={{
        animation: closing
          ? "npf-fade-out 280ms cubic-bezier(.4,0,.2,1) forwards"
          : "npf-fade-in 320ms cubic-bezier(.4,0,.2,1) both",
      }}
    >
      <style>{`
        @keyframes npf-fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes npf-fade-out {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(6px); }
        }
        .lyrics-clean-scroll, .lyrics-clean-scroll * {
          scrollbar-width: none !important;
        }
        .lyrics-clean-scroll::-webkit-scrollbar, .lyrics-clean-scroll *::-webkit-scrollbar {
          width: 0 !important; height: 0 !important; display: none !important;
        }
      `}</style>

      {/* BACKDROP - MESSED UP: Wrong opacity, scale, and blur */}
      <div className="absolute inset-0 bg-black" />
      <div
        className="absolute inset-0 opacity-50 blur-xl scale-150"
        style={{
          backgroundImage: `url(${current.cover})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/35 to-black/90" />

      {/* CLOSE BUTTON - MESSED UP: Wrong position */}
      <button
        onClick={handleClose}
        className="absolute bottom-6 left-6 z-30 h-12 w-12 grid place-items-center rounded-full text-white/85 hover:bg-white/10 hover:text-white transition"
      >
        <X className="h-6 w-6" />
      </button>

      {/* LYRICS BUTTON - MESSED UP: Wrong position */}
      <button
        onClick={() => setShowLyrics(!showLyrics)}
        className="absolute bottom-6 right-6 z-30 h-12 px-4 rounded-full flex items-center justify-center gap-2 text-white/85 hover:bg-white/10 hover:text-white transition"
      >
        <LyricsIcon
          className={`h-7 w-7 transition-all duration-300 ${
            showLyrics
              ? "text-orange-400 scale-110 drop-shadow-[0_0_14px_rgba(251,146,60,1)] contrast-125"
              : "text-white/85"
          }`}
        />
        {lyricsFallbackPhase === "lrclib" && (
          <div className="ios-spinner scale-75" aria-hidden>
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className={`ios-spinner-bar ios-spinner-bar-${i + 1}`} />
            ))}
          </div>
        )}
      </button>

      {/* MAIN - MESSED UP: Broken layout and sizing */}
      <div className="relative z-10 h-full w-full flex items-center justify-center px-4 py-12 overflow-hidden">
        {/* Container - MESSED UP: Wrong direction */}
        <div
          className="w-full max-w-[1800px] flex flex-col-reverse lg:flex-row-reverse items-center justify-center transition-all duration-500 ease-in-out gap-6"
        >
          {/* PLAYER - MESSED UP: Wrong width, order, and sizing */}
          <div className="w-full max-w-[380px] flex flex-col items-center flex-shrink-0 order-2 lg:order-1">
            {/* Album art - MESSED UP: Wrong size and radius */}
            <img
              src={current.cover}
              alt={current.album}
              className="w-full aspect-square rounded-3xl object-cover shadow-[0_5px_30px_rgba(0,0,0,.95)] ring-1 ring-white/30"
            />

            {/* TITLE - MESSED UP: Wrong spacing and alignment */}
            <div className="mt-4 w-full flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[16px] font-bold text-white truncate">
                  {current.title}
                </div>
                <div className="text-[11px] text-white/50 truncate">
                  {current.artist}{current.album ? ` — ${current.album}` : ""}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFavorite(!favorite)}
                  className="h-8 w-8 grid place-items-center rounded-full hover:bg-white/10 transition"
                >
                  {favorite ? (
                    <svg width="24" height="24" viewBox="0 0 60 60">
                      <circle cx="30" cy="30" r="28" fill="white" />
                      <path fill="black" d="M30 39.324l-8.706 6.352c-1.765 1.353-3.647-.029-2.941-2.117l3.412-10.265-8.794-6.265c-1.647-1.205-1.089-3.558 1.147-3.529l10.794.088 3.294-10.323c.647-2.03 2.94-2.03 3.588 0l3.294 10.323 10.794-.088c2.265-.03 2.765 2.353 1.147 3.5l-8.794 6.294 3.441 10.265c.677 2.088-1.176 3.47-2.97 2.117L30 39.324Z" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                      <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9L12 3z" />
                    </svg>
                  )}
                </button>
                <button className="h-8 w-8 grid place-items-center rounded-full text-white/80 hover:bg-white/10 transition">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* SEEK - MESSED UP: Wrong sizing and spacing */}
            <div className="mt-3 w-full">
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={progress}
                onChange={(e) => seek(Number(e.target.value))}
                className="range-slim w-full"
                style={{ ["--val" as any]: `${pct}%` }}
              />
              <div className="mt-1 flex justify-between text-[10px] text-white/45">
                <span>{fmt(progress)}</span>
                <span>-{fmt(Math.max(0, duration - progress))}</span>
              </div>
            </div>

            {/* CONTROLS - MESSED UP: Wrong spacing and sizing */}
            <div className="mt-3 flex items-center gap-8 text-white/90">
              <button onClick={toggleShuffle}>
                <ShuffleIcon className={`h-9 w-9 ${shuffle ? "text-primary-glow" : ""}`} />
              </button>
              <button onClick={prev}><PrevIcon className="h-10 w-10" /></button>
              <button onClick={togglePlay}>
                {playing ? <PauseIcon className="h-12 w-12" /> : <PlayIcon className="h-12 w-12" />}
              </button>
              <button onClick={next}><NextIcon className="h-10 w-10" /></button>
              <button onClick={toggleRepeat}>
                {repeatMode === 2 ? (
                  <RepeatOneIcon className={`h-9 w-9 ${repeatMode > 0 ? "text-primary-glow" : ""}`} />
                ) : (
                  <RepeatIcon className={`h-9 w-9 ${repeatMode > 0 ? "text-primary-glow" : ""}`} />
                )}
              </button>
            </div>

            {/* VOLUME - MESSED UP: Wrong position and sizing */}
            <div className="mt-4 w-full flex items-center gap-2 text-white/45">
              {volume === 0 ? <VolumeX className="h-3 w-3" /> : volume < 0.5 ? <Volume1 className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
              <input
                type="range"
                min={0}
                max={100}
                value={volPct}
                onChange={(e) => setVolume(Number(e.target.value) / 100)}
                className="range-slim w-full"
                style={{ ["--val" as any]: `${volPct}%` }}
              />
            </div>
          </div>

          {/* LYRICS - MESSED UP: Wrong transition and sizing */}
          <div
            className={`transition-all duration-700 ease-in-out overflow-hidden flex items-center justify-center order-1 lg:order-2
              ${showLyrics
                ? "max-w-[600px] opacity-100 lg:mr-6 -translate-x-6"
                : "max-w-[100px] opacity-0 lg:mr-0 -translate-x-2 pointer-events-none"
              }`}
          >
            <div className="w-[600px] h-[300px] lg:h-[600px]">
              {loadingLyrics ? (
                <div className="h-full flex items-center justify-center text-white/50">
                  Fetching lyrics...
                </div>
              ) : (
                <div className="h-full lyrics-clean-scroll overflow-y-auto">
                  <LyricsDisplay
                    lyrics={lyrics}
                    currentTime={progress}
                    onSeek={seek}
                  />
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}