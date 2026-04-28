/**
 * Radio Station Page - STUBBED FOR PUBLIC SHOWCASE
 */
import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Play, Radio, RefreshCw, ChevronLeft, Menu } from "lucide-react";
import TopBar from "@/components/player/TopBar";
import Sidebar from "@/components/player/Sidebar";
import NowPlayingFull from "@/components/player/NowPlayingFull";
import QueuePanel from "@/components/player/QueuePanel";
import { VinylLoader } from "@/components/VinylLoader";
import album1 from "@/assets/album-1.jpg";

// Stubbed station data
const stubTracks: any[] = [];

export default function RadioStation() {
 const { id } = useParams<{ id: string }>();
 const navigate = useNavigate();
 const [searchParams] = useSearchParams();
 const stationName = searchParams.get('name') || 'Radio Station';
 const stationImage = searchParams.get('img') || '';
 const stationColor = searchParams.get('color') || '#ff7a2b';

 const [loading, setLoading] = useState(false);
 const [tracks] = useState<any[]>([]);
 const [waveActive, setWaveActive] = useState(false);

 const [barHidden, setBarHidden] = useState(false);
 const [minimized, setMinimized] = useState(false);
 const [fullScreen, setFullScreen] = useState(false);
 const [sidebarOpen, setSidebarOpen] = useState(false);
 const [queueOpen, setQueueOpen] = useState(false);

 const topBarHeight = barHidden ? 0 : minimized ? 32 : 52;

 const handlePlayAll = () => {
  // STUBBED - no playback
  setWaveActive(true);
 };

 const handleRefresh = () => {
  // STUBBED - no refresh
 };

 if (loading) {
  return (
   <div className="flex h-screen items-center justify-center bg-background text-foreground">
    <div className="text-center space-y-4">
     <VinylLoader size="lg" albumCover={stationImage || album1} />
    </div>
   </div>
  );
 }

 return (
  <div className="min-h-screen text-foreground">
   {!barHidden && (
    <TopBar
     minimized={minimized}
     onClose={() => setBarHidden(true)}
     onMinimize={() => setMinimized((v) => !v)}
     onExpand={() => setFullScreen(true)}
     onOpenSidebar={() => setSidebarOpen(true)}
     onToggleQueue={() => setQueueOpen((v) => !v)}
    />
   )}

   {barHidden && (
    <button
     onClick={() => setBarHidden(false)}
     className="fixed top-3 left-3 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 text-xs"
     aria-label="Show player bar"
    >
     <ChevronLeft className="h-3.5 w-3.5" /> Show player
    </button>
   )}

   <div className="flex">
    <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    <main
     className="flex-1 overflow-y-auto thin-scroll relative"
     style={{ height: `calc(100vh - ${topBarHeight}px)` }}
    >
     {/* Hero gradient */}
     <div
      className="absolute inset-x-0 top-0 h-[520px] pointer-events-none -z-0"
      style={{
       background: `radial-gradient(80% 60% at 50% 0%, ${stationColor}55 0%, ${stationColor}1f 35%, transparent 70%)`,
      }}
     />

     <div className="relative z-10 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 animate-fade-in">
      {/* Back button */}
      <div className="flex items-center justify-between mb-6">
       <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-white/75 hover:text-white transition"
       >
        <ChevronLeft className="h-5 w-5" /> Back
       </button>
       <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden grid place-items-center h-9 w-9 rounded-full bg-white/[0.06] border border-white/10"
        aria-label="Menu"
       >
        <Menu className="h-4 w-4" />
       </button>
      </div>

      {/* Hero header */}
      <header className="flex flex-col md:flex-row md:items-end gap-6 md:gap-8">
       <div
        className="shrink-0 h-[220px] w-[220px] md:h-[260px] md:w-[260px] rounded-2xl overflow-hidden border border-white/15 relative"
        style={{ boxShadow: `0 30px 80px -20px ${stationColor}80, 0 0 0 1px rgba(255,255,255,0.08) inset` }}
       >
        <img src={stationImage || album1} alt={stationName} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
         <Radio className="h-4 w-4" style={{ color: stationColor }} />
         <span className="text-[10px] uppercase tracking-wider bg-black/55 backdrop-blur-md border border-white/10 rounded-full px-2 py-0.5">
          LIVE
         </span>
        </div>
       </div>

       <div className="flex-1 min-w-0 space-y-3">
        <div className="text-[11px] uppercase tracking-[0.18em] font-semibold" style={{ color: stationColor }}>
         Radio Station
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
         {stationName}
        </h1>
        <div className="text-base sm:text-lg text-white/85 font-medium">
         24/7 Live
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-white/55">
         <span>Station is stubbed for public showcase</span>
        </div>

        {/* STUBBED - no playback */}
        <div className="flex flex-wrap items-center gap-3 pt-3">
         <button
          onClick={handlePlayAll}
          className="inline-flex items-center gap-1.5 px-4 h-8 rounded-md text-[13px] font-semibold text-black opacity-60 cursor-not-allowed"
          style={{ background: stationColor, boxShadow: `0 6px 18px ${stationColor}55` }}
          disabled
         >
          <Play className="h-3.5 w-3.5 ml-0.5" fill="currentColor" /> Play
         </button>
         <button
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 h-8 rounded-md text-[13px] font-semibold bg-white/10 border border-white/10 opacity-60 cursor-not-allowed"
         >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
         </button>
        </div>
       </div>
      </header>

      {/* STUBBED - no tracks */}
      <section className="mt-10">
       <div className="text-center py-8 text-white/40">
        Radio station content is stubbed for public showcase
       </div>
      </section>

      <div className="h-16" />
     </div>
   </main>
   </div>

   <NowPlayingFull open={fullScreen} onClose={() => setFullScreen(false)} />
   <QueuePanel open={queueOpen} onClose={() => setQueueOpen(false)} />
  </div>
 );
}

function formatDuration(seconds: string | number) {
 const s = typeof seconds === 'string' ? parseInt(seconds) : seconds;
 if (isNaN(s)) return '--:--';
 const mins = Math.floor(s / 60);
 const secs = s % 60;
 return `${mins}:${secs.toString().padStart(2, '0')}`;
}