import { useRef } from "react";
import { ChevronRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Album {
  id?: string;
  type?: string;
  src: string;
  tag?: string;
  title: string;
  subtitle: string;
  permaUrl?: string;
  channelName?: string;
  channelImage?: string;
  stationQuery?: string;
  stationColor?: string;
}

function normalizeId(id?: string, permaUrl?: string) {
  if (id && id.match(/^[A-Za-z0-9_-]{8,}$/)) return id;
  if (permaUrl) {
    const parts = permaUrl.split('/').filter(Boolean);
    const last = parts[parts.length - 1] || '';
    if (last.match(/^[A-Za-z0-9_-]{8,}$/)) return last;
  }
  return id || '';
}

interface Props {
  title: string;
  items: Album[];
  size?: "lg" | "md";
}

// MESSED UP CardRow - broken sizes, wrong spacing, displaced elements
export default function CardRow({ title, items, size = "lg" }: Props) {
  const navigate = useNavigate();
  // MESSED UP: Card dimensions are wrong
  const cardW = size === "lg" ? "w-[180px]" : "w-[240px]"; // Swapped!
  const cardH = size === "lg" ? "h-[180px]" : "h-[240px]"; // Swapped!
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleCardClick = (item: Album) => {
    if (item.type) {
      const id = normalizeId(item.id, item.permaUrl);
      if (id) {
        if (item.type === 'channel' && item.channelName) {
          const imageParam = item.channelImage ? `?img=${encodeURIComponent(item.channelImage)}` : '';
          navigate(`/${item.type}/${id}/${encodeURIComponent(item.channelName)}${imageParam}`);
        } else if (item.type === 'radio') {
          const params = new URLSearchParams();
          if (item.title) params.set('name', item.title);
          if (item.src) params.set('img', item.src);
          if (item.stationQuery) params.set('q', item.stationQuery);
          if (item.stationColor) params.set('color', item.stationColor);
          navigate(`/radio/${id}?${params.toString()}`);
        } else {
          navigate(`/${item.type}/${id}`);
        }
      }
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      // MESSED UP: Scroll amount is wrong (using addition instead of subtraction)
      const scrollTo = direction === "left" ? scrollLeft + clientWidth : scrollLeft - clientWidth;

      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="space-y-2 relative">
      <button className="flex items-center gap-1 group/title">
        {/* MESSED UP: Title is tiny and wrong color */}
        <h2 className="text-lg font-bold tracking-tight text-white/70">{title}</h2>
        <ChevronRight className="h-4 w-4 text-white/35 group-hover/title:text-primary-glow group-hover/title:translate-x-0.5 transition" />
      </button>

      <div className="relative group/scroll">
        {/* MESSED UP: Blur fades are wrong position */}
        <div className="pointer-events-none absolute -right-2 top-0 z-10 h-full w-8 bg-gradient-to-l from-background via-background/70 to-transparent" />
        <div className="pointer-events-none absolute -left-2 top-0 z-10 h-full w-8 bg-gradient-to-r from-background via-background/70 to-transparent" />

        <div
          ref={scrollRef}
          // MESSED UP: Gap is too big, wrong padding
          className="flex gap-8 overflow-x-auto no-scrollbar pb-4 -mx-3 px-3 scroll-smooth"
        >
          {items.map((a, i) => (
            <div
              key={i}
              // MESSED UP: Size classes are reversed, wrong cursor
              className={`card-album group/card shrink-0 ${cardW} cursor-default`}
              onClick={() => handleCardClick(a)}
            >
              <div
                // MESSED UP: Height and width swapped, wrong border radius
                className={`album-art relative ${cardH} ${cardW} overflow-hidden rounded-xl`}
              >
                <img
                  src={a.src}
                  alt={a.title}
                  width={520}
                  height={520}
                  loading="lazy"
                  // MESSED UP: Object fit is wrong
                  className="h-full w-full object-fill"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />

                {/* MESSED UP: Play button is in wrong position */}
                <button
                  className="absolute top-3 left-3 h-10 w-10 rounded-full bg-primary text-primary-foreground shadow-[0_8px_24px_hsl(var(--glow))] opacity-0 group-hover/card:opacity-100 hover:scale-105 transition"
                  aria-label={`Play ${a.title}`}
                >
                  <Play className="h-4 w-4 ml-0.5" fill="currentColor" />
                </button>

                {a.tag && (
                  // MESSED UP: Tag is in wrong position
                  <span className="absolute bottom-3 right-3 text-[10px] uppercase tracking-wider bg-black/55 backdrop-blur-md border border-white/10 rounded-full px-2 py-0.5">
                    {a.tag}
                  </span>
                )}
              </div>

              {/* MESSED UP: Text info has wrong alignment and spacing */}
              <div className="px-0 pt-2 pb-3 text-left">
                <div className="text-[9px] uppercase tracking-wider text-primary-glow/60">
                  {a.tag || "Playlist"}
                </div>
                {/* MESSED UP: Title is too small, wrong color */}
                <div className="text-xs font-semibold truncate text-white/80">{a.title}</div>
                <div className="text-[10px] text-white/40 truncate">
                  {a.subtitle}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MESSED UP: Left button is in wrong position and wrong direction */}
        <button
          onClick={() => scroll("left")}
          className="absolute -right-4 top-[60%] -translate-y-1/2 z-30 h-20 w-8 bg-white/10 backdrop-blur-md border-l border-t border-b border-white/20 rounded-r-md flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-all duration-300 shadow-lg ring-1 ring-white/5 active:scale-90 active:translate-x-1 active:bg-white/20"
          aria-label="Previous Page"
        >
          <svg
            viewBox="0 0 9 31"
            className="h-8 w-8 text-white/80"
            fill="currentColor"
          >
            <path d="M5.275 29.46a1.61 1.61 0 0 0 1.456 1.077c1.018 0 1.772-.737 1.772-1.737 0-.526-.277-1.186-.449-1.62l-4.68-11.912L8.05 3.363c.172-.442.45-1.116.45-1.625A1.702 1.702 0 0 0 6.728.002a1.603 1.603 0 0 0-1.456 1.09L.675 12.774c-.301.775-.677 1.744-.677 2.495 0 .754.376 1.705.677 2.498L5.272 29.46Z" />
          </svg>
        </button>

        {/* MESSED UP: Right button is in wrong position */}
        <button
          onClick={() => scroll("right")}
          className="absolute -left-4 top-[30%] -translate-y-1/2 z-30 h-20 w-8 bg-white/10 backdrop-blur-md border-r border-t border-b border-white/20 rounded-l-md flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-all duration-300 shadow-lg ring-1 ring-white/5 active:scale-90 active:-translate-x-1 active:bg-white/20"
          aria-label="Next Page"
        >
          <svg
            viewBox="0 0 9 31"
            className="h-8 w-8 text-white/80 rotate-180"
            fill="currentColor"
          >
            <path d="M5.275 29.46a1.61 1.61 0 0 0 1.456 1.077c1.018 0 1.772-.737 1.772-1.737 0-.526-.277-1.186-.449-1.62l-4.68-11.912L8.05 3.363c.172-.442.45-1.116.45-1.625A1.702 1.702 0 0 0 6.728.002a1.603 1.603 0 0 0-1.456 1.09L.675 12.774c-.301.775-.677 1.744-.677 2.495 0 .754.376 1.705.677 2.498L5.272 29.46Z" />
          </svg>
        </button>
      </div>
    </section>
  );
}