import React, { createContext, useContext, useEffect, useState } from "react";
import { Track } from "@/lib/tracks";
import { JioSaavnAlbum, JioSaavnPlaylist, JioSaavnArtist } from "@/lib/jiosaavn-api";

interface LibraryState {
  songs: Track[];
  albums: any[];
  playlists: any[];
  artists: any[];
}

interface LibraryContextType {
  library: LibraryState;
  toggleSong: (song: Track) => void;
  toggleAlbum: (album: any) => void;
  togglePlaylist: (playlist: any) => void;
  toggleArtist: (artist: any) => void;
  isSongFavorite: (id: string) => boolean;
  isAlbumSaved: (id: string) => boolean;
  isPlaylistSaved: (id: string) => boolean;
  isArtistFollowed: (id: string) => boolean;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [library, setLibrary] = useState<LibraryState>(() => {
    const saved = localStorage.getItem("amdl_library");
    return saved ? JSON.parse(saved) : { songs: [], albums: [], playlists: [], artists: [] };
  });

  useEffect(() => {
    localStorage.setItem("amdl_library", JSON.stringify(library));
  }, [library]);

  const toggleSong = (song: Track) => {
    setLibrary(prev => {
      const exists = prev.songs.find(s => s.id === song.id);
      if (exists) {
        return { ...prev, songs: prev.songs.filter(s => s.id !== song.id) };
      }
      return { ...prev, songs: [song, ...prev.songs] };
    });
  };

  const toggleAlbum = (album: any) => {
    setLibrary(prev => {
      const exists = prev.albums.find(a => a.id === album.id);
      if (exists) {
        return { ...prev, albums: prev.albums.filter(a => a.id !== album.id) };
      }
      return { ...prev, albums: [album, ...prev.albums] };
    });
  };

  const togglePlaylist = (playlist: any) => {
    setLibrary(prev => {
      const id = playlist.listid || playlist.id;
      const exists = prev.playlists.find(p => (p.listid || p.id) === id);
      if (exists) {
        return { ...prev, playlists: prev.playlists.filter(p => (p.listid || p.id) !== id) };
      }
      return { ...prev, playlists: [playlist, ...prev.playlists] };
    });
  };

  const toggleArtist = (artist: any) => {
    setLibrary(prev => {
      const exists = prev.artists.find(a => a.id === artist.id);
      if (exists) {
        return { ...prev, artists: prev.artists.filter(a => a.id !== artist.id) };
      }
      return { ...prev, artists: [artist, ...prev.artists] };
    });
  };

  const isSongFavorite = (id: string) => library.songs.some(s => s.id === id);
  const isAlbumSaved = (id: string) => library.albums.some(a => a.id === id);
  const isPlaylistSaved = (id: string) => library.playlists.some(p => (p.listid || p.id) === id);
  const isArtistFollowed = (id: string) => library.artists.some(a => a.id === id);

  return (
    <LibraryContext.Provider value={{ 
      library, toggleSong, toggleAlbum, togglePlaylist, toggleArtist,
      isSongFavorite, isAlbumSaved, isPlaylistSaved, isArtistFollowed
    }}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error("useLibrary must be used within a LibraryProvider");
  }
  return context;
}
