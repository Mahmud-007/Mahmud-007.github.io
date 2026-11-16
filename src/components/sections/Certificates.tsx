import React from 'react';
import SectionHead from '../ui/SectionHead';
import CertificateCard from '../ui/CertificateCard';
import certifications from '../../data/certifications.json';
import { useCertificateImages } from '../../hooks/useCertificateImages';
import type { Certification } from '../../types';

interface CertificatesProps {
  /** How many to show. Omit for all of them. */
  limit?: number;
}

const Certificates: React.FC<CertificatesProps> = ({ limit }) => {
  const images = useCertificateImages();
  // Shown in the order of certifications.json, which is curated by hand.
  const all = certifications as Certification[];
  if (all.length === 0) return null;

  const shown = limit ? all.slice(0, limit) : all;
  const imageFor = (cert: Certification) => (cert.image ? images[cert.image] : undefined);
  const framed = shown.filter((c) => imageFor(c));
  const plain = shown.filter((c) => !imageFor(c));

  return (
    <section className="pb-12">
      <SectionHead
        id="certificates"
        title="Certificates"
        more={all.length > shown.length ? { label: 'All certificates', to: '/certificates/' } : undefined}
      />
      {framed.length > 0 && (
        <div className="mt-5 mb-2 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {framed.map((cert) => (
            <CertificateCard key={cert.credentialId || cert.title} cert={cert} image={imageFor(cert)} />
          ))}
        </div>
      )}
      {plain.map((cert) => (
        <CertificateCard key={cert.credentialId || cert.title} cert={cert} />
      ))}
    </section>
  );
};

export default Certificates;
