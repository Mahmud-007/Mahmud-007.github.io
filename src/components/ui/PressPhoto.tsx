import React from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import { cn } from '../../utils/cn';

interface PressPhotoProps {
  caption?: string;
  className?: string;
}

/** Portrait printed like a newspaper photo: greyscale, dot screen, hairline border, caption. */
const PressPhoto: React.FC<PressPhotoProps> = ({ caption, className }) => (
  <figure className={cn('m-0', className)}>
    <div className="halftone border border-ink bg-paper-dark overflow-hidden">
      <StaticImage
        src="../../images/profile.png"
        alt="Portrait of Mahmudur Rahman"
        placeholder="blurred"
        layout="fullWidth"
        aspectRatio={4 / 5}
        transformOptions={{ cropFocus: 'attention' }}
      />
    </div>
    {caption && (
      <figcaption className="mt-1.5 font-body text-sm text-ink-soft">
        {caption}
      </figcaption>
    )}
  </figure>
);

export default PressPhoto;
