/**
 * JioSaavn API - STUBBED FOR PUBLIC SHOWCASE
 * Replace with real implementation for production use
 */

export interface JioSaavnTrack {
  id: string;
  title: string;
  subtitle: string;
  artists: string[];
  album: string;
  albumId: string;
  year: string;
  duration: string;
  image: string;
  language: string;
  primaryArtists: string;
  primaryArtistsId: string;
  encryptedMediaUrl: string;
  releaseDate: string;
  explicitContent: boolean;
  hasLyrics: boolean;
  copyright: string;
  permaUrl: string;
  isrc?: string;
  artist?: string;
}

export interface JioSaavnAlbum {
  id: string;
  name: string;
  year: string;
  primaryArtists: string;
  primaryArtistsId: string;
  image: string;
  songs: JioSaavnTrack[];
  songCount: number;
  releaseDate: string;
  permaUrl: string;
}

export interface JioSaavnPlaylist {
  listid: string;
  listname: string;
  image: string;
  songs: JioSaavnTrack[];
  songCount: number;
  permaUrl: string;
}

export interface JioSaavnArtist {
  id: string;
  name: string;
  image: string;
  followerCount?: string;
  isVerified?: boolean;
  dominantLanguage?: string;
  dominantType?: string;
  bio?: string;
  songs: JioSaavnTrack[];
  albums: JioSaavnAlbum[];
  permaUrl: string;
}

export interface JioSaavnShow {
  id: string;
  name: string;
  image: string;
  subtitle: string;
  songs: JioSaavnTrack[];
  songCount: number;
  permaUrl: string;
}

export interface JioSaavnChannel {
  id: string;
  name: string;
  image: string;
  subtitle: string;
  songs: JioSaavnTrack[];
  songCount: number;
  permaUrl: string;
}

export interface JioSaavnRadioStation {
  stationId: string;
  name: string;
  image: string;
  language: string;
  songs: JioSaavnTrack[];
  permaUrl: string;
}

export interface JioSaavnSearchResult {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  permaUrl: string;
  year?: string;
  explicitContent?: string;
  type: 'song' | 'album' | 'playlist' | 'artist';
}

export interface StreamInfo {
  url: string;
  headers: Record<string, string>;
  bitrate: string;
}

export type QualityTier = '96' | '160' | '320';

class JioSaavnAPI {
  private baseUrl = 'https://www.jiosaavn.com/api.php';
  private corsProxy = import.meta.env.VITE_PROXY_URL || '';

  extractId(_url: string): string | null {
    return null; // STUBBED
  }

  async getStreamUrl(_encryptedMediaUrl: string, _bitrate: QualityTier = '320'): Promise<StreamInfo> {
    return { url: '', headers: {}, bitrate: '320' }; // STUBBED
  }

  async getTrack(_trackId: string): Promise<JioSaavnTrack> {
    return this.getMockTrack(); // STUBBED
  }

  async getAlbum(_albumId: string): Promise<JioSaavnAlbum> {
    return this.getMockAlbum(); // STUBBED
  }

  async getPlaylist(_playlistId: string): Promise<JioSaavnPlaylist> {
    return this.getMockPlaylist(); // STUBBED
  }

  async getArtist(_artistId: string): Promise<JioSaavnArtist> {
    return this.getMockArtist(); // STUBBED
  }

  async getShow(_showId: string): Promise<JioSaavnShow> {
    return { id: '', name: '', image: '', subtitle: '', songs: [], songCount: 0, permaUrl: '' };
  }

  async getChannel(_channelId: string, _channelName?: string): Promise<JioSaavnChannel> {
    return { id: '', name: '', image: '', subtitle: '', songs: [], songCount: 0, permaUrl: '' };
  }

  async createStation(_songId: string): Promise<string> {
    return 'stub-station-id';
  }

  async getStationSongs(_stationId: string, _limit: number = 20): Promise<JioSaavnTrack[]> {
    return [];
  }

  async getRadioStation(_songId: string, _stationName?: string, _stationImage?: string, _limit: number = 20): Promise<JioSaavnRadioStation> {
    return { stationId: '', name: '', image: '', language: '', songs: [], permaUrl: '' };
  }

  async createFeaturedStation(_stationName: string, _language: string = 'hindi'): Promise<string> {
    return 'stub-featured-station';
  }

  async globalSearch(_query: string, _limit: number = 5) {
    return { songs: [], albums: [], playlists: [], artists: [] };
  }

  async search(_query: string, _type: 'song' | 'album' | 'playlist' | 'artist' = 'song', _limit: number = 10): Promise<JioSaavnSearchResult[]> {
    return this.getMockSearchResults(); // STUBBED
  }

  async getBrowseModules(): Promise<any> {
    return {}; // STUBBED
  }

  async getTrending(_limit: number = 20): Promise<JioSaavnSearchResult[]> {
    return [];
  }

  async getTopCharts(_limit: number = 20): Promise<JioSaavnPlaylist[]> {
    return [];
  }

  async getNewReleases(_limit: number = 20): Promise<JioSaavnAlbum[]> {
    return [];
  }

  async getLyrics(_trackId: string): Promise<string | null> {
    return null;
  }

  async getServerStatus(): Promise<{ status: string; uptime?: number; version?: string } | null> {
    return { status: 'offline', version: 'stub' };
  }

  // Mock data generators for showcase
  private getMockTrack(): JioSaavnTrack {
    return {
      id: 'stub-track-id',
      title: 'Demo Song',
      subtitle: 'Demo Artist',
      artists: ['Demo Artist'],
      album: 'Demo Album',
      albumId: 'stub-album-id',
      year: '2024',
      duration: '240',
      image: 'https://placehold.co/500x500/1a1a1a/white?text=Demo',
      language: 'hindi',
      primaryArtists: 'Demo Artist',
      primaryArtistsId: 'stub-artist-id',
      encryptedMediaUrl: '',
      releaseDate: '2024-01-01',
      explicitContent: false,
      hasLyrics: false,
      copyright: '',
      permaUrl: '',
    };
  }

  private getMockAlbum(): JioSaavnAlbum {
    return {
      id: 'stub-album-id',
      name: 'Demo Album',
      year: '2024',
      primaryArtists: 'Demo Artist',
      primaryArtistsId: 'stub-artist-id',
      image: 'https://placehold.co/500x500/1a1a1a/white?text=Demo',
      songs: [],
      songCount: 0,
      releaseDate: '2024-01-01',
      permaUrl: '',
    };
  }

  private getMockPlaylist(): JioSaavnPlaylist {
    return {
      listid: 'stub-playlist-id',
      listname: 'Demo Playlist',
      image: 'https://placehold.co/500x500/1a1a1a/white?text=Demo',
      songs: [],
      songCount: 0,
      permaUrl: '',
    };
  }

  private getMockArtist(): JioSaavnArtist {
    return {
      id: 'stub-artist-id',
      name: 'Demo Artist',
      image: 'https://placehold.co/500x500/1a1a1a/white?text=Artist',
      songs: [],
      albums: [],
      permaUrl: '',
    };
  }

  private getMockSearchResults(): JioSaavnSearchResult[] {
    return [];
  }
}

export const jiosaavnApi = new JioSaavnAPI();
export default jiosaavnApi;