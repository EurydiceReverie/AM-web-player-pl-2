import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BrowseCard } from "@/lib/jiosaavn-browse";
import { cn } from "@/lib/utils";

interface BrowseSectionProps {
  title: string;
  items: BrowseCard[];
  onItemClick?: (item: BrowseCard) => void;
}

export function BrowseSection({ title, items, onItemClick }: BrowseSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-4 mb-8 relative group">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="hidden group-hover:flex items-center justify-center h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 transition icon-btn"
            aria-label="Previous Page"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="hidden group-hover:flex items-center justify-center h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 transition icon-btn"
            aria-label="Next Page"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex space-x-4 pb-4 overflow-x-auto no-scrollbar scroll-smooth">
        {items.map((item) => (
          <Card
            key={item.id}
            className="w-[200px] flex-shrink-0 cursor-pointer transition-all hover:bg-white/[0.04] border-transparent hover:border-white/10"
            onClick={() => onItemClick?.(item)}
          >
            <CardContent className="p-0">
              <div className="relative aspect-square overflow-hidden rounded-t-lg">
                <img
                  src={item.image}
                  alt={item.title}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default BrowseSection;
