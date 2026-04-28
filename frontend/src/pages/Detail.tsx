/**
 * Detail Page (Album/Playlist/Artist) - STUBBED FOR PUBLIC SHOWCASE
 */
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Play, Shuffle, ChevronLeft, Menu, ChevronUp } from "lucide-react";
import TopBar from "@/components/player/TopBar";
import Sidebar from "@/components/player/Sidebar";
import NowPlayingFull from "@/components/player/NowPlayingFull";
import QueuePanel from "@/components/player/QueuePanel";
import { VinylLoader } from "@/components/VinylLoader";
import album1 from "@/assets/album-1.jpg";

// Stubbed detail data
const stubData = {
 id: 'stub-album',
 name: 'Album Title',
 image: album1,
 primaryArtists: 'Artist Name',
 year: '2024',
 songs: [] as any[],
 songCount: 0,
};

export default function Detail() {
 const { type, id } = useParams<{ type: string; id: string }>();
 const navigate = useNavigate();

 const [loading, setLoading] = useState(false);
 const [data, setData] = useState<typeof stubData | null>(null);

 const [barHidden, setBarHidden] = useState(false);
 const [minimized, setMinimized] = useState(false);
 const [fullScreen, setFullScreen] = useState(false);
 const [sidebarOpen, setSidebarOpen] = useState(false);
 const [queueOpen, setQueueOpen] = useState(false);

 const topBarHeight = barHidden ? 0 : minimized ? 32 : 52;

 // For public showcase, just show placeholder UI
 const title = data?.name || "Detail Page";
 const image = data?.image || album1;
 const subtitle = data?.primaryArtists || type || "Item";
 const songs = data?.songs || [];
 const year = data?.year || "";
 const songCount = data?.songCount || 0;

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
     <ChevronUp className="h-3.5 w-3.5" /> Show player
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
       background: `radial-gradient(80% 60% at 50% 0%, #ff7a2b55 0%, #ff7a2b1f 35%, transparent 70%)`,
      }}
     />

     <div className="relative z-10 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 animate-fade-in">
      {/* Top action row */}
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
        className="shrink-0 overflow-hidden border border-white/15 h-[220px] w-[220px] md:h-[260px] md:w-[260px] rounded-2xl"
        style={{ boxShadow: `0 30px 80px -20px #ff7a2b80, 0 0 0 1px rgba(255,255,255,0.08) inset` }}
       >
        <img src={image} alt={title} className="h-full w-full object-cover" />
       </div>

       <div className="flex-1 min-w-0 space-y-3">
        <div className="text-[11px] uppercase tracking-[0.18em] font-semibold" style={{ color: '#ff7a2b' }}>
         {type || 'Album'}
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
         {title}
        </h1>
        <div className="text-base sm:text-lg text-white/85 font-medium">
         {subtitle}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-white/55">
         {songCount > 0 && <span>{songCount} songs</span>}
         {year && <><span>·</span><span>{year}</span></>}
        </div>

        {/* STUBBED - No play functionality */}
        <div className="flex flex-wrap items-center gap-3 pt-3">
         <button
          className="inline-flex items-center gap-1.5 px-4 h-8 rounded-md text-[13px] font-semibold text-black bg-white/30 cursor-not-allowed opacity-60"
          style={{ background: '#ff7a2b', boxShadow: `0 6px 18px #ff7a2b55` }}
          disabled
         >
          <Play className="h-3.5 w-3.5 ml-0.5" fill="currentColor" /> Play
         </button>
         <button
          className="inline-flex items-center gap-1.5 px-3.5 h-8 rounded-md text-[13px] font-semibold border border-white/10 bg-white/10 opacity-60 cursor-not-allowed"
         >
          <Shuffle className="h-3.5 w-3.5" /> Shuffle
         </button>
        </div>
       </div>
      </header>

      {/* STUBBED - No track list */}
      <section className="mt-10">
       <div className="text-center py-8 text-white/40">
        Content is stubbed for public showcase
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
 const mins = Math.floor(s / 60);
 const secs = s % 60;
 return `${mins}:${secs.toString().padStart(2, '0')}`;
}