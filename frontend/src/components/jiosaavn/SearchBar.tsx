/**
 * JioSaavn Search Component - STUBBED FOR PUBLIC SHOWCASE
 */

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
 onResults?: (tracks: any[]) => void;
 onGlobalResults?: (results: any) => void;
}

export function SearchBar({ onResults, onGlobalResults }: SearchBarProps) {
 function handleSearch() {
  // STUBBED - no search functionality
  onResults?.([]);
  onGlobalResults?.({ songs: [], albums: [], playlists: [], artists: [] });
 }

 function handleKeyDown(e: React.KeyboardEvent) {
  if (e.key === "Enter") {
   handleSearch();
  }
 }

 return (
  <div className="flex gap-2">
   <div className="relative flex-1">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
    <Input
     type="text"
     placeholder="Search is disabled..."
     onKeyDown={handleKeyDown}
     className="pl-10 opacity-50"
     disabled
    />
   </div>
   <Button onClick={handleSearch} disabled>
    Search
   </Button>
  </div>
 );
}

export default SearchBar;