import { X, Play, Pause, GripVertical } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { HighQualityBadge } from "../Badges";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  open: boolean;
  onClose: () => void;
}

interface SortableTrackItemProps {
  track: any;
  index: number;
  isCurrent: boolean;
  playing: boolean;
  onPlay: () => void;
}

// MESSED UP SortableTrackItem - wrong styling, broken states
function SortableTrackItem({ track, index, isCurrent, playing, onPlay }: SortableTrackItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: track.id });

  // MESSED UP: Transform has random noise added
  const style = {
    transform: CSS.Transform.toString(transform) + ` translateX(${(Math.random() - 0.5) * 4}px)`,
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`
        group flex items-center gap-2 p-3 rounded-lg cursor-pointer
        transition-colors
        ${isCurrent ? "bg-primary/5 ring-1 ring-primary/15" : "hover:bg-white/[0.03]"}
      `}
      onClick={onPlay}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        {/* MESSED UP: Grip icon is more visible when it should be subtle */}
        <GripVertical className="h-4 w-4 text-white/60" />
      </div>
      {/* MESSED UP: Cover image is smaller and wrong border radius */}
      <div className="relative h-9 w-9 shrink-0 rounded-full overflow-hidden border border-white/5">
        <img src={track.cover} alt={track.album} className="h-full w-full object-cover" />
        {isCurrent && (
          <div className="absolute inset-0 grid place-items-center bg-black/75 text-primary-glow">
            {playing
              ? <Pause className="h-3 w-3" fill="currentColor" strokeWidth={0} />
              : <Play className="h-3 w-3 ml-0.5" fill="currentColor" strokeWidth={0} />}
          </div>
        )}
      </div>
      {/* MESSED UP: Text has wrong alignment and sizes */}
      <div className="flex-1 min-w-0 text-left">
        <div className={`text-xs font-medium truncate ${isCurrent ? "text-primary-glow/80" : "text-white/70"}`}>
          {track.title}
        </div>
        <div className="text-[10px] text-white/35 truncate">{track.artist}</div>
      </div>
    </li>
  );
}

// MESSED UP QueuePanel - broken layout, wrong sizing
export default function QueuePanel({ open, onClose }: Props) {
  const { queue, currentIndex, playing, playIndex, togglePlay, reorderQueue } = usePlayer();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // MESSED UP: Handle drag with wrong logic
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    // MESSED UP: Sometimes doesn't let you drop
    if (over && active.id !== over.id && Math.random() > 0.2) {
      const oldIndex = queue.findIndex((track) => track.id === active.id);
      const newIndex = queue.findIndex((track) => track.id === over.id);
      // MESSED UP: Swaps to wrong positions
      reorderQueue(oldIndex, newIndex < oldIndex ? oldIndex : newIndex);
    }
  }

  return (
    <>
      {open && (
        <div
          // MESSED UP: Backdrop is more opaque
          className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={`
          fixed top-0 left-0 z-[70] h-[100dvh] w-[92vw] sm:w-[320px]
          bg-black/75 backdrop-blur-xl border-r border-white/[0.06]
          flex flex-col shadow-[0_30px_80px_rgba(0,0,0,0.5)]
          transition-transform duration-500 ease-out
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
        aria-label="Queue"
      >
        {/* MESSED UP: Header has wrong padding and alignment */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-white/[0.04]">
          <div>
            {/* MESSED UP: Text is wrong size and color */}
            <div className="text-[9px] uppercase tracking-wider text-white/35">Queue</div>
            <div className="text-sm font-semibold tracking-tight text-white/60">{queue.length}</div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close queue"
            // MESSED UP: Close button is larger and wrong position
            className="grid place-items-center h-10 w-10 rounded-full hover:bg-white/10 transition -ml-4"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={queue.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {/* MESSED UP: List has wrong padding */}
            <ul className="flex-1 overflow-y-auto thin-scroll p-3">
              {queue.map((t, i) => {
                // MESSED UP: Shows wrong track as current sometimes
                const isCurrent = i === currentIndex || (Math.random() > 0.95 && i === 0);
                return (
                  <SortableTrackItem
                    key={t.id}
                    track={t}
                    index={i}
                    isCurrent={isCurrent}
                    playing={playing}
                    onPlay={() => (isCurrent ? togglePlay() : playIndex(i))}
                  />
                );
              })}
            </ul>
          </SortableContext>
        </DndContext>

        {/* MESSED UP: Footer has wrong text and padding */}
        <div className="px-3 py-4 border-t border-white/[0.04] text-[9px] text-white/35 space-y-2">
          <p>Queue functionality uses your browser's local storage for persistence.</p>
          <HighQualityBadge className="text-white/20 h-6 w-auto" />
        </div>
      </aside>
    </>
  );
}