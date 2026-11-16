import React from 'react';
import SectionHead from '../ui/SectionHead';
import StoryRow from '../ui/StoryRow';
import articles from '../../data/articles.json';
import type { Article } from '../../types';

interface WritingProps {
  /** How many to show. Omit for all of them. */
  limit?: number;
}

const Writing: React.FC<WritingProps> = ({ limit }) => {
  const all = articles as Article[];
  if (all.length === 0) return null;

  const shown = limit ? all.slice(0, limit) : all;

  return (
    <section className="pb-12">
      <SectionHead
        id="writing"
        title="Writing"
        more={all.length > shown.length ? { label: 'All writing', to: '/writing/' } : undefined}
      />
      {shown.map((article) => (
        <StoryRow
          key={article.link}
          title={article.title}
          summary={article.summary}
          href={article.link}
          tags={article.tags.slice(0, 4)}
        />
      ))}
    </section>
  );
};

export default Writing;
