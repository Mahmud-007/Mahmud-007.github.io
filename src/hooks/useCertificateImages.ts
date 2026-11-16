import { graphql, useStaticQuery } from 'gatsby';
import type { IGatsbyImageData } from 'gatsby-plugin-image';

/** Processed certificate images from src/images/certificates/, keyed by file name. */
export function useCertificateImages(): Record<string, IGatsbyImageData> {
  const data = useStaticQuery(graphql`
    query CertificateImages {
      allFile(filter: { sourceInstanceName: { eq: "images" }, relativeDirectory: { eq: "certificates" } }) {
        nodes {
          base
          childImageSharp {
            gatsbyImageData(width: 640, placeholder: BLURRED)
          }
        }
      }
    }
  `);

  const images: Record<string, IGatsbyImageData> = {};
  for (const node of data.allFile.nodes) {
    if (node.childImageSharp?.gatsbyImageData) images[node.base] = node.childImageSharp.gatsbyImageData;
  }
  return images;
}
