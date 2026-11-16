import React from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import { cn } from '../../utils/cn';

interface PressPhotoProps {
  caption?: string;
  className?: string;
}

/**
 * Portrait printed like a newspaper photo: greyscale, dot screen, hairline border, caption.
 * Cropped from the top so the bottom edge of the source image (with its watermark) is cut off.
 * On hover the greyscale and dot screen lift to show the original photo.
 */
const PressPhoto: React.FC<PressPhotoProps> = ({ caption, className }) => (
  <figure className={cn('m-0', className)}>
    <div className="halftone border border-ink bg-paper-dark overflow-hidden">
      <StaticImage
        src="../../images/profile.png"
        alt="Portrait of Mahmudur Rahman"
        placeholder="blurred"
        layout="fullWidth"
        aspectRatio={0.92}
        transformOptions={{ cropFocus: 'north' }}
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
