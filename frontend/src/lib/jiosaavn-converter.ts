/**
 * JioSaavn Converter - STUBBED FOR PUBLIC SHOWCASE
 */
import { jiosaavnApi, JioSaavnTrack } from './jiosaavn-api';
import { Track } from './tracks';

export async function convertJioSaavnTrackToTrack(jioTrack: JioSaavnTrack): Promise<Track> {
  const streamInfo = await jiosaavnApi.getStreamUrl(jioTrack.encryptedMediaUrl, '320');
  const proxyUrl = import.meta.env.VITE_PROXY_URL;
  const finalUrl = proxyUrl ? `${proxyUrl}/proxy?url=${encodeURIComponent(streamInfo.url)}` : streamInfo.url;

  return {
    id: jioTrack.id,
    title: jioTrack.title,
    artist: jioTrack.primaryArtists || jioTrack.subtitle,
    album: jioTrack.album,
    cover: jioTrack.image,
    src: finalUrl,
    isrc: jioTrack.isrc,
    hasLyrics: jioTrack.hasLyrics,
    duration: parseInt(jioTrack.duration || '0'),
  };
}

export async function convertJioSaavnTracksToTracks(jioTracks: JioSaavnTrack[]): Promise<Track[]> {
  return Promise.all(jioTracks.map(track => convertJioSaavnTrackToTrack(track)));
}