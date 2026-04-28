/**
 * Browse/Search Page - STUBBED FOR PUBLIC SHOWCASE
 */
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "@/components/player/Sidebar";
import TopBar from "@/components/player/TopBar";
import NowPlayingFull from "@/components/player/NowPlayingFull";
import QueuePanel from "@/components/player/QueuePanel";
import { usePlayer } from "@/context/PlayerContext";
import { Menu, ChevronUp, Music } from "lucide-react";
import { Play } from "lucide-react";

// Stubbed search results
const stubResults = {
 songs: [] as any[],
 albums: [] as any[],
 playlists: [] as any[],
 artists: [] as any[],
};

export default function Browse() {
 const [searchParams] = useSearchParams();
 const searchQuery = searchParams.get('q') || '';

 const [globalResults, setGlobalResults] = useState<typeof stubResults | null>(null);
 const [searching, setSearching] = useState(false);
 const { current, playing } = usePlayer();

 const [barHidden, setBarHidden] = useState(false);
 const [minimized, setMinimized] = useState(false);
 const [fullScreen, setFullScreen] = useState(false);
 const [sidebarOpen, setSidebarOpen] = useState(false);
 const [queueOpen, setQueueOpen] = useState(false);

 const topBarHeight = barHidden ? 0 : minimized ? 32 : 52;

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
     className="flex-1 overflow-y-auto thin-scroll"
     style={{ height: `calc(100vh - ${topBarHeight}px)` }}
    >
     <div className="p-6 max-w-7xl mx-auto">
      <button
       onClick={() => setSidebarOpen(true)}
       className="md:hidden mb-4 grid place-items-center h-10 w-10 rounded-full bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] transition"
       aria-label="Open menu"
      >
       <Menu className="h-5 w-5" />
      </button>

      {searchQuery && (
       <div className="mb-6">
        <p className="text-white/60 text-sm">
         <span className="animate-pulse">Searching for "{searchQuery}"...</span>
        </p>
       </div>
      )}

      {/* STUBBED - No search functionality */}
      {!searchQuery && (
       <div className="text-center py-12">
        <Music className="h-12 w-12 mx-auto mb-4 text-white/30" />
        <p className="text-white/40 text-lg">Search is stubbed for public showcase</p>
        <p className="text-white/30 text-sm mt-2">API integration removed</p>
       </div>
      )}

      {searchQuery && !searching && globalResults && globalResults.songs.length === 0 && (
       <div className="text-center py-12">
        <p className="text-white/40 text-lg">No results found for "{searchQuery}"</p>
        <p className="text-white/30 text-sm mt-2">Search is stubbed - API integration removed</p>
       </div>
      )}

      <div className="h-8" />
    </div>
   </main>
   </div>

   <NowPlayingFull open={fullScreen} onClose={() => setFullScreen(false)} />
   <QueuePanel open={queueOpen} onClose={() => setQueueOpen(false)} />
  </div>
 );
}