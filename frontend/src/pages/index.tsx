/**
 * Home Page - STUBBED FOR PUBLIC SHOWCASE
 */
import { useState } from "react";
import TopBar from "@/components/player/TopBar";
import Sidebar from "@/components/player/Sidebar";
import CardRow from "@/components/player/CardRow";
import NowPlayingFull from "@/components/player/NowPlayingFull";
import QueuePanel from "@/components/player/QueuePanel";
import { Menu, ChevronUp } from "lucide-react";
import album1 from "@/assets/album-1.jpg";

// Empty placeholder data
const fallbackData = [
 { src: album1, tag: "STUBBED", title: "Track Title", subtitle: "Artist" },
];

const Index = () => {
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
     <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-10 animate-fade-in">
      <div className="flex items-center gap-3">
       <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden grid place-items-center h-10 w-10 rounded-full bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] transition"
        aria-label="Open menu"
       >
        <Menu className="h-5 w-5" />
       </button>
       <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">Home</h1>
      </div>

      {/* STUBBED - All sections return empty/placeholder data */}
      <CardRow title="Trending Now" items={fallbackData} size="lg" />
      <CardRow title="Top Charts" items={fallbackData} size="md" />
      <CardRow title="New Releases" items={fallbackData} size="md" />
      <CardRow title="Editorial Picks" items={fallbackData} size="md" />
      <CardRow title="Trending Podcasts" items={fallbackData} size="md" />
      <CardRow title="Radio Stations" items={fallbackData} size="md" />
      <CardRow title="Recommended Artists" items={fallbackData} size="md" />
      <CardRow title="Fresh Hits" items={fallbackData} size="md" />
      <CardRow title="Cricket Fever" items={fallbackData} size="md" />
      <CardRow title="Top Genres & Moods" items={fallbackData} size="md" />
      <CardRow title="Best Of 90s" items={fallbackData} size="md" />
      <CardRow title="New Releases Pop - Hindi" items={fallbackData} size="md" />

      <div className="h-8" />
     </div>
    </main>
   </div>

   <NowPlayingFull open={fullScreen} onClose={() => setFullScreen(false)} />
   <QueuePanel open={queueOpen} onClose={() => setQueueOpen(false)} />
  </div>
 );
};

export default Index;