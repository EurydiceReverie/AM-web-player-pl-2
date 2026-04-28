/**
 * Lyrics Viewer Component - STUBBED FOR PUBLIC SHOWCASE
 * Displays lyrics fetched from Musixmatch in custom format
 */

import React from 'react';

interface LyricsViewerProps {
 track: any;
 className?: string;
}

export const LyricsViewer: React.FC<LyricsViewerProps> = ({ track, className = '' }) => {
 return (
  <div className={`lyrics-viewer ${className}`}>
   <div className="p-6">
    <div className="mb-4 pb-4 border-b border-white/10">
     <h3 className="text-lg font-semibold text-white">Lyrics</h3>
     <p className="text-sm text-white/50 mt-1">
      {track?.name || 'Track'} - {track?.artists?.primary?.[0]?.name || 'Artist'}
     </p>
    <div className="flex gap-2 mt-2">
     <span className="text-xs px-2 py-1 rounded bg-white/10 text-white/50">
      STUBBED
     </span>
    </div>
   </div>
   <div className="p-8 text-center text-white/40">
    Lyrics viewer is stubbed for public showcase
   </div>
  </div>
 );
};

export default LyricsViewer;