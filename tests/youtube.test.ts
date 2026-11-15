import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFeed, uploadsPlaylistId, mapPlaylistItems, mapChannelStats } from '../src/utils/youtube.ts';

const entry = (id: string, title: string | null, published: string, thumb = true) => `
 <entry>
  <id>yt:video:${id}</id>
  <yt:videoId>${id}</yt:videoId>
  <yt:channelId>UCabc</yt:channelId>
  ${title === null ? '' : `<title>${title}</title>`}
  <link rel="alternate" href="https://www.youtube.com/watch?v=${id}"/>
  <published>${published}</published>
  <updated>2026-10-03T10:00:00+00:00</updated>
  <media:group>
   <media:title>${title ?? ''}</media:title>
   ${thumb ? `<media:thumbnail url="https://i.ytimg.com/vi/${id}/hqdefault.jpg" width="480" height="360"/>` : ''}
  </media:group>
 </entry>`;

const feed = (...entries: string[]) => `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
 <title>Mahmudur Rahman</title>
 <published>2015-01-01T00:00:00+00:00</published>
 ${entries.join('\n')}
</feed>`;

test('parseFeed reads id, title, date, thumbnail, url', () => {
  const [v] = parseFeed(feed(entry('abc123', 'RAG &amp; MCP in 10 minutes', '2026-10-02T10:00:00+00:00')));
  assert.deepEqual(v, {
    id: 'abc123',
    title: 'RAG & MCP in 10 minutes',
    publishedAt: '2026-10-02T10:00:00+00:00',
    thumbnail: 'https://i.ytimg.com/vi/abc123/hqdefault.jpg',
    url: 'https://www.youtube.com/watch?v=abc123',
  });
});

test('parseFeed does not mistake the channel title for a video', () => {
  assert.equal(parseFeed(feed()).length, 0);
});

test('parseFeed skips entries missing a title and keeps the rest', () => {
  const videos = parseFeed(
    feed(
      entry('a1', 'First', '2026-10-02T10:00:00+00:00'),
      entry('b2', null, '2026-10-03T10:00:00+00:00'),
      entry('c3', 'Third', '2026-10-04T10:00:00+00:00')
    )
  );
  assert.deepEqual(videos.map((v) => v.id), ['c3', 'a1']);
});

test('parseFeed returns newest first', () => {
  const videos = parseFeed(
    feed(entry('old', 'Old', '2025-01-01T00:00:00+00:00'), entry('new', 'New', '2026-06-01T00:00:00+00:00'))
  );
  assert.deepEqual(videos.map((v) => v.id), ['new', 'old']);
});

test('parseFeed decodes quotes and apostrophes in titles', () => {
  const [v] = parseFeed(feed(entry('q1', 'Why &quot;agents&quot; aren&#39;t magic &lt;3', '2026-01-01T00:00:00+00:00')));
  assert.equal(v.title, 'Why "agents" aren\'t magic <3');
});

test('parseFeed falls back to the standard thumbnail url when media:thumbnail is absent', () => {
  const [v] = parseFeed(feed(entry('nothumb', 'No thumb', '2026-01-01T00:00:00+00:00', false)));
  assert.equal(v.thumbnail, 'https://i.ytimg.com/vi/nothumb/hqdefault.jpg');
});

test('parseFeed returns [] for empty string and for non-feed text', () => {
  assert.deepEqual(parseFeed(''), []);
  assert.deepEqual(parseFeed('<html>error</html>'), []);
  assert.deepEqual(parseFeed(undefined as any), []);
});

test('uploadsPlaylistId swaps the UC prefix for UU', () => {
  assert.equal(uploadsPlaylistId('UCabc'), 'UUabc');
  assert.equal(uploadsPlaylistId(''), '');
});

test('mapPlaylistItems returns [] for error bodies and garbage', () => {
  assert.deepEqual(mapPlaylistItems({ error: { code: 403, message: 'quotaExceeded' } }), []);
  assert.deepEqual(mapPlaylistItems(null), []);
  assert.deepEqual(mapPlaylistItems('x'), []);
  assert.deepEqual(mapPlaylistItems({ items: 'nope' }), []);
});

test('mapPlaylistItems maps the snippet and skips private or broken items', () => {
  const json = {
    items: [
      {
        snippet: {
          title: 'Building an MCP server',
          publishedAt: '2026-09-01T08:00:00Z',
          resourceId: { videoId: 'vid1' },
          thumbnails: { default: { url: 'd.jpg' }, high: { url: 'h.jpg' } },
        },
      },
      { snippet: { title: 'Private video', publishedAt: '2026-09-02T08:00:00Z', resourceId: { videoId: 'vid2' }, thumbnails: {} } },
      { snippet: { title: 'No id', publishedAt: '2026-09-03T08:00:00Z' } },
      null,
    ],
  };
  assert.deepEqual(mapPlaylistItems(json), [
    {
      id: 'vid1',
      title: 'Building an MCP server',
      publishedAt: '2026-09-01T08:00:00Z',
      thumbnail: 'h.jpg',
      url: 'https://www.youtube.com/watch?v=vid1',
    },
  ]);
});

test('mapChannelStats parses string counts', () => {
  assert.deepEqual(
    mapChannelStats({ items: [{ statistics: { subscriberCount: '120', viewCount: '4500', videoCount: '9' } }] }),
    { subscribers: 120, views: 4500, videos: 9 }
  );
});

test('mapChannelStats returns null on a bad shape or hidden counts', () => {
  assert.equal(mapChannelStats({ items: [] }), null);
  assert.equal(mapChannelStats({ error: {} }), null);
  assert.equal(mapChannelStats(null), null);
  assert.equal(mapChannelStats({ items: [{ statistics: { viewCount: 'x' } }] }), null);
});
