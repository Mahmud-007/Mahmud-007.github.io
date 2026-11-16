import React from 'react';
import { Link } from 'gatsby';
import Tag from './Tag';
import TodoBadge from './TodoBadge';
import { field, isTodo, listField } from '../../utils/todo';

interface StoryRowProps {
  title: string;
  summary?: string;
  meta?: string;
  href?: string;
  internal?: boolean;
  tags?: string[];
}

/** One story in a section: headline, a line of text, a fact on the right, a hairline beneath. */
const StoryRow: React.FC<StoryRowProps> = ({ title, summary, meta, href, internal, tags }) => {
  const summaryField = field(summary);
  const metaField = field(meta);
  const shownTags = listField(tags);

  const body = (
    <>
      <div className="flex items-baseline justify-between gap-6">
        <h3 className="font-display text-2xl sm:text-[30px] font-extrabold leading-[1.02] group-hover:text-accent transition-colors">
          {title}
          {href && !internal && <span className="font-mono text-sm font-normal"> ↗</span>}
        </h3>
        {metaField &&
          (metaField.todo ? (
            <TodoBadge label="meta TODO" />
          ) : (
            <span className="font-mono text-xs text-ink shrink-0 text-right">{metaField.value}</span>
          ))}
      </div>
      {summaryField &&
        (summaryField.todo ? (
          <TodoBadge label="summary TODO" />
        ) : (
          <p className="mt-1.5 text-[17px] leading-snug text-ink-soft max-w-[62ch]">{summaryField.value}</p>
        ))}
      {shownTags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-y-0.5">
          {shownTags.map((tag) =>
            isTodo(tag) ? <TodoBadge key={tag} label="tags TODO" /> : <Tag key={tag}>{tag}</Tag>
          )}
        </div>
      )}
    </>
  );

  const cls = 'group block py-5 border-b border-ink/25';
  if (!href) return <article className={cls}>{body}</article>;
  return (
    <article>
      {internal ? (
        <Link to={href} className={cls}>{body}</Link>
      ) : (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{body}</a>
      )}
    </article>
  );
};

export default StoryRow;
