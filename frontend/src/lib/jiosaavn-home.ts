/**
 * JioSaavn Home Page Data Service - STUBBED FOR PUBLIC SHOWCASE
 */

export interface HomeCardItem {
  src: string;
  tag: string;
  title: string;
  subtitle: string;
  id?: string;
  type?: 'song' | 'album' | 'playlist' | 'artist' | 'channel' | 'show' | 'radio';
  permaUrl?: string;
  channelName?: string;
  channelImage?: string;
  stationQuery?: string;
  stationColor?: string;
}

export async function getTrendingNow(_limit: number = 20): Promise<HomeCardItem[]> {
  return [];
}

export async function getTopCharts(_limit: number = 6): Promise<HomeCardItem[]> {
  return [];
}

export async function getNewReleases(_limit: number = 6): Promise<HomeCardItem[]> {
  return [];
}

export async function getEditorialPicks(_limit: number = 20): Promise<HomeCardItem[]> {
  return [];
}

export async function getTrendingPodcasts(_limit: number = 6): Promise<HomeCardItem[]> {
  return [];
}

export async function getRadioStations(_limit: number = 6): Promise<HomeCardItem[]> {
  return [];
}

export async function getRecommendedArtists(_limit: number = 6): Promise<HomeCardItem[]> {
  return [];
}

export async function getFreshHits(_limit: number = 6): Promise<HomeCardItem[]> {
  return [];
}

export async function getCricketFever(_limit: number = 20): Promise<HomeCardItem[]> {
  return [];
}

export async function getTopGenresAndMoods(_limit: number = 6): Promise<HomeCardItem[]> {
  return [];
}

export async function getBestOf90s(_limit: number = 6): Promise<HomeCardItem[]> {
  return [];
}

export async function getNewReleasesPopHindi(_limit: number = 6): Promise<HomeCardItem[]> {
  return [];
}

export default {
  getTrendingNow,
  getTopCharts,
  getNewReleases,
  getEditorialPicks,
  getTrendingPodcasts,
  getRadioStations,
  getRecommendedArtists,
  getFreshHits,
  getCricketFever,
  getTopGenresAndMoods,
  getBestOf90s,
  getNewReleasesPopHindi,
};