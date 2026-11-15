/**
 * Pure helpers for YouTube data. Imports nothing so it can be unit-tested with `node --test`
 * and shared by gatsby-node (build time) and the browser hook (page load).
 */

export interface VideoLike {
  id: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
  url: string;
}

export interface ChannelStatsLike {
  subscribers: number;
  views: number;
  videos: number;
}

const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
};

const decode = (text: string) => text.replace(/&(?:amp|lt|gt|quot|apos|#39);/g, (m) => ENTITIES[m] ?? m);

const watchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
const defaultThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

const tag = (xml: string, name: string): string | null => {
  const match = new RegExp(`<${name}>([\\s\\S]*?)</${name}>`).exec(xml);
  return match ? match[1].trim() : null;
};

const newestFirst = (a: VideoLike, b: VideoLike) => (a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : 0);

/** Parses a channel's Atom feed. Entries without an id or a title are skipped. Never throws. */
export function parseFeed(xml: string): VideoLike[] {
  if (typeof xml !== 'string' || !xml.includes('<entry>')) return [];
  const videos: VideoLike[] = [];
  for (const match of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const entry = match[1];
    const id = tag(entry, 'yt:videoId');
    const title = tag(entry, 'title');
    if (!id || !title) continue;
    const thumb = /<media:thumbnail[^>]*\burl="([^"]+)"/.exec(entry);
    videos.push({
      id,
      title: decode(title),
      publishedAt: tag(entry, 'published') ?? '',
      thumbnail: thumb ? decode(thumb[1]) : defaultThumb(id),
      url: watchUrl(id),
    });
  }
  return videos.sort(newestFirst);
}

/** Every channel has an "uploads" playlist whose id is the channel id with UC swapped for UU. */
export function uploadsPlaylistId(channelId: string): string {
  return channelId.startsWith('UC') ? `UU${channelId.slice(2)}` : channelId;
}

const isObject = (value: unknown): value is Record<string, any> => typeof value === 'object' && value !== null;

/** Maps a Data API `playlistItems` (part=snippet) response. Returns [] for errors or unexpected shapes. */
export function mapPlaylistItems(json: unknown): VideoLike[] {
  if (!isObject(json) || !Array.isArray(json.items)) return [];
  const videos: VideoLike[] = [];
  for (const item of json.items) {
    const snippet = isObject(item) && isObject(item.snippet) ? item.snippet : null;
    if (!snippet) continue;
    const id = isObject(snippet.resourceId) ? snippet.resourceId.videoId : null;
    const thumbs = isObject(snippet.thumbnails) ? snippet.thumbnails : {};
    const thumbnail = thumbs.high?.url ?? thumbs.medium?.url ?? thumbs.default?.url;
    // Private and deleted videos come back without thumbnails; leave them out.
    if (typeof id !== 'string' || !id || typeof snippet.title !== 'string' || !snippet.title || !thumbnail) continue;
    videos.push({
      id,
      title: snippet.title,
      publishedAt: typeof snippet.publishedAt === 'string' ? snippet.publishedAt : '',
      thumbnail,
      url: watchUrl(id),
    });
  }
  return videos.sort(newestFirst);
}

/** Maps a Data API `channels` (part=statistics) response. Null when counts are missing or not numbers. */
export function mapChannelStats(json: unknown): ChannelStatsLike | null {
  if (!isObject(json) || !Array.isArray(json.items)) return null;
  const stats = isObject(json.items[0]) ? json.items[0].statistics : null;
  if (!isObject(stats)) return null;
  const subscribers = Number(stats.subscriberCount);
  const views = Number(stats.viewCount);
  const videos = Number(stats.videoCount);
  if (![subscribers, views, videos].every(Number.isFinite)) return null;
  return { subscribers, views, videos };
}
