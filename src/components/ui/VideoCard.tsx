import React from 'react';
import type { Video } from '../../types';

const formatDate = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
};

const VideoCard: React.FC<{ video: Video }> = ({ video }) => {
  const date = formatDate(video.publishedAt);
  return (
    <a href={video.url} target="_blank" rel="noopener noreferrer" className="group block">
      <div className="aspect-video border border-ink bg-paper-dark overflow-hidden">
        <img
          src={video.thumbnail}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-[filter] duration-300"
        />
      </div>
      <h3 className="mt-2.5 font-display text-lg font-black leading-tight group-hover:text-accent transition-colors">
        {video.title}
      </h3>
      {date && (
        <p className="m-0 mt-1 font-body text-sm text-ink-soft">{date}</p>
      )}
    </a>
  );
};

export default VideoCard;
