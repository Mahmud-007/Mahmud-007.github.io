import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import profile from '../data/profile.json';
import { mapChannelStats, mapPlaylistItems, uploadsPlaylistId } from '../utils/youtube';
import type { ChannelStats, Video } from '../types';

const CACHE_KEY = 'yt-v1';
const API = 'https://www.googleapis.com/youtube/v3';

interface VideosState {
  videos: Video[];
  stats: ChannelStats | null;
}

/** Videos baked in at build time, newest first. */
export function useBuildVideos(): Video[] {
  const data = useStaticQuery(graphql`
    query BuildVideos {
      allVideo(sort: { publishedAt: DESC }) {
        nodes {
          videoId
          title
          publishedAt
          thumbnail
          url
        }
      }
    }
  `);
  return data.allVideo.nodes.map((n: any) => ({
    id: n.videoId,
    title: n.title,
    publishedAt: n.publishedAt,
    thumbnail: n.thumbnail,
    url: n.url,
  }));
}

/**
 * Starts from the build-time list, then asks the YouTube Data API for a fresher one after the page
 * loads. Any failure (no key, quota, network, bad JSON, blocked storage) leaves the build-time list
 * in place and stays silent.
 */
export function useVideos(): VideosState {
  const built = useBuildVideos();
  const [live, setLive] = React.useState<VideosState | null>(null);

  React.useEffect(() => {
    const key = process.env.GATSBY_YOUTUBE_API_KEY;
    const channelId = profile.youtube?.channelId;
    if (!key || !channelId) return;

    let cancelled = false;

    const refresh = async () => {
      try {
        const cached = window.sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as VideosState;
          if (Array.isArray(parsed.videos) && parsed.videos.length > 0) {
            if (!cancelled) setLive(parsed);
            return;
          }
        }
      } catch {
        // Storage blocked or corrupt: fall through to the network.
      }

      try {
        const playlist = uploadsPlaylistId(channelId);
        const [itemsRes, statsRes] = await Promise.all([
          fetch(`${API}/playlistItems?part=snippet&maxResults=12&playlistId=${playlist}&key=${key}`),
          fetch(`${API}/channels?part=statistics&id=${channelId}&key=${key}`),
        ]);
        const videos = mapPlaylistItems(await itemsRes.json());
        const stats = mapChannelStats(await statsRes.json());
        if (cancelled || videos.length === 0) return;
        const next = { videos, stats };
        setLive(next);
        try {
          window.sessionStorage.setItem(CACHE_KEY, JSON.stringify(next));
        } catch {
          // Not being able to cache is fine.
        }
      } catch {
        // Keep the build-time list.
      }
    };

    refresh();
    return () => {
      cancelled = true;
    };
  }, []);

  return live ?? { videos: built, stats: null };
}
