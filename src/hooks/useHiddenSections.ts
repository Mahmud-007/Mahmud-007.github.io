import { graphql, useStaticQuery } from 'gatsby';

/** Section ids that have nothing to show at build time and should drop out of the navigation. */
export function useHiddenSections(): string[] {
  const data = useStaticQuery(graphql`
    query HiddenSections {
      allVideo {
        totalCount
      }
    }
  `);
  return data.allVideo.totalCount === 0 ? ['videos'] : [];
}
