import React from 'react';
import { GatsbyImage, type IGatsbyImageData } from 'gatsby-plugin-image';
import StoryRow from './StoryRow';
import type { Certification } from '../../types';

interface CertificateCardProps {
  cert: Certification;
  /** Processed image, when the certificate has one that exists on disk. */
  image?: IGatsbyImageData;
}

/** With an image: a framed certificate. Without: a plain text row, never an empty frame. */
const CertificateCard: React.FC<CertificateCardProps> = ({ cert, image }) => {
  const meta = [cert.issuer, cert.issued].filter(Boolean).join(' · ');

  if (!image) {
    return <StoryRow title={cert.title} summary={cert.issuer} meta={cert.issued} href={cert.link || undefined} tags={cert.skills} />;
  }

  const body = (
    <>
      <div className="border border-ink bg-paper-dark">
        <GatsbyImage image={image} alt={`Certificate: ${cert.title}`} className="block aspect-[4/3]" objectFit="contain" />
      </div>
      <h3 className="mt-2.5 font-display text-lg font-black leading-tight group-hover:text-accent transition-colors">
        {cert.title}
      </h3>
      <p className="m-0 mt-1 font-body text-sm text-ink-soft">{meta}</p>
    </>
  );

  return cert.link ? (
    <a href={cert.link} target="_blank" rel="noopener noreferrer" className="group block">
      {body}
    </a>
  ) : (
    <article className="group">{body}</article>
  );
};

export default CertificateCard;
