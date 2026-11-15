import React from 'react';
import SectionHead from '../ui/SectionHead';
import VideoCard from '../ui/VideoCard';
import { useVideos } from '../../hooks/useVideos';

interface VideosProps {
  /** How many to show. Omit for all of them. */
  limit?: number;
  /** Set on the /videos page, which is already the full list. */
  full?: boolean;
}

const count = (n: number) => new Intl.NumberFormat('en').format(n);

/** Renders nothing at all when the channel has no videos, so the page never shows an empty section. */
const Videos: React.FC<VideosProps> = ({ limit, full = false }) => {
  const { videos, stats } = useVideos();
  if (videos.length === 0) return null;

  const shown = limit ? videos.slice(0, limit) : videos;

  return (
    <section className="pb-12">
      <SectionHead
        id="videos"
        title="Videos"
        more={full || videos.length <= shown.length ? undefined : { label: 'All videos', to: '/videos/' }}
      />
      {stats && (
        <p className="m-0 mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">
          {count(stats.subscribers)} subscribers · {count(stats.videos)} videos
        </p>
      )}
      <div className="mt-5 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </section>
  );
};

export default Videos;
