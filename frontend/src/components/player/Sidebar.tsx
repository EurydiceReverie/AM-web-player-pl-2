import {
  Search, Home, Sparkles, Radio, Pin, Clock, Mic2, Disc3,
  Music2, Video, UserRound, ListMusic, Star, Guitar, X, Heart, ShieldAlert
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";

const navTop = [
  { id: "home", label: "Home", icon: Home, path: "/" },
  { id: "browse", label: "Browse", icon: Sparkles, path: "/browse" },
];
const libraryItems = [
  { id: "artists", label: "Artists", icon: Mic2, path: "/library/artists" },
  { id: "albums", label: "Albums", icon: Disc3, path: "/library/albums" },
  { id: "songs", label: "Songs", icon: Music2, path: "/library/songs" },
];
const playlists = [
  { id: "all", label: "All Playlists", icon: ListMusic, path: "/library/playlists" },
  { id: "liked", label: "Liked Songs", icon: Heart, path: "/library/liked", accent: true, color: "text-red-500" },
  { id: "fav", label: "Favorite Songs", icon: Star, path: "/library/songs", accent: true, color: "text-primary-glow" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || "");

  // Sync searchQuery state when URL parameter changes (e.g. on direct navigation or reload)
  useEffect(() => {
    const q = searchParams.get('q') || "";
    setSearchQuery(q);
  }, [searchParams]);

  // When user types in search, navigate to Browse page with query
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      // Navigate to browse page and pass search query via URL
      navigate(`/browse?q=${encodeURIComponent(query)}`);
    }
  };

  // Lock body scroll when mobile drawer open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50 md:z-auto
          w-[280px] md:w-[240px] lg:w-[260px] shrink-0
          h-[100dvh] md:h-[calc(100vh-52px)]
          flex flex-col border-r border-white/[0.06] bg-black/80 md:bg-black/30 backdrop-blur-xl
          transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        {/* Mobile header with close */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
          <span className="text-lg font-semibold tracking-tight">Music</span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="grid place-items-center h-8 w-8 rounded-full hover:bg-white/10 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 pt-4">
          <div className="flex items-center gap-2 rounded-xl bg-white/[0.06] border border-white/[0.08] px-3 py-2 focus-within:ring-2 focus-within:ring-primary/40 transition">
            <Search className="h-4 w-4 text-white/55" />
            <input
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => {
                if (!location.pathname.includes('/browse')) {
                  navigate('/browse');
                }
              }}
              className="bg-transparent outline-none placeholder:text-white/45 text-sm w-full"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  navigate('/browse');
                }}
                className="p-0.5 rounded-full hover:bg-white/10 transition"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5 text-white/55" />
              </button>
            )}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto thin-scroll px-2 pb-6 space-y-5">
          <div className="space-y-1">
            {navTop.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`nav-item ${isActive ? "active" : ""}`}
                  onClick={onClose}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div>
            <div className="px-3 pb-2 text-[11px] uppercase tracking-wider text-white/45">Library</div>
            <div className="space-y-1">
              {libraryItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link 
                    key={item.id} 
                    to={item.path}
                    className={`nav-item ${isActive ? "active" : ""}`} 
                    onClick={onClose}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <div className="px-3 pb-2 text-[11px] uppercase tracking-wider text-white/45">Playlists</div>
            <div className="space-y-1">
              {playlists.map((p) => {
                const Icon = p.icon;
                const isActive = location.pathname === p.path;
                const iconColor = p.id === "liked" ? "text-red-500" : p.accent ? "text-primary-glow" : "";
                return (
                  <Link 
                    key={p.id} 
                    to={p.path}
                    className={`nav-item ${isActive ? "active" : ""}`} 
                    onClick={onClose}
                  >
                    <Icon className={`h-4 w-4 ${iconColor}`} fill={p.accent ? "currentColor" : "none"} />
                    <span className="truncate">{p.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
