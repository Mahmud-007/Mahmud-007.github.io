import React from 'react';
import type { IconType } from 'react-icons';
import {
  SiNodedotjs, SiPython, SiGo, SiTypescript, SiReact, SiNextdotjs,
  SiAmazonwebservices, SiDocker, SiMongodb, SiPostgresql, SiRedis,
  SiElasticsearch, SiOpensearch, SiGraphql, SiTailwindcss, SiExpress,
  SiFastapi, SiMysql, SiFirebase, SiGithubactions,
} from 'react-icons/si';

const ICONS: Record<string, IconType> = {
  'Node.js': SiNodedotjs,
  'Express.js': SiExpress,
  FastAPI: SiFastapi,
  Python: SiPython,
  Go: SiGo,
  TypeScript: SiTypescript,
  React: SiReact,
  'Next.js': SiNextdotjs,
  AWS: SiAmazonwebservices,
  Docker: SiDocker,
  MongoDB: SiMongodb,
  PostgreSQL: SiPostgresql,
  MySQL: SiMysql,
  Redis: SiRedis,
  'ELK Stack': SiElasticsearch,
  OpenSearch: SiOpensearch,
  GraphQL: SiGraphql,
  Tailwind: SiTailwindcss,
  Firebase: SiFirebase,
  'CI/CD (GitHub Actions)': SiGithubactions,
};

const TechMarquee: React.FC<{ items: string[] }> = ({ items }) => {
  const track = [...items, ...items];

  return (
    <div className="relative overflow-hidden py-4 border-y border-rule">
      <div className="marquee-track flex w-max items-center gap-10">
        {track.map((item, i) => {
          const Icon = ICONS[item];
          return (
            <span
              key={`${item}-${i}`}
              className="flex items-center gap-2 text-slate-light/70 hover:text-teal transition-colors shrink-0"
              aria-hidden={i >= items.length}
            >
              {Icon ? <Icon className="h-6 w-6" /> : null}
              <span className="font-mono text-xs whitespace-nowrap">{item}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default TechMarquee;
