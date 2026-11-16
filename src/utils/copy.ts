/** Phrases that must never appear in rendered copy or data files (see design doc, section 3). */
export const BANNED: string[] = ['AI engineer', 'AI-Native', 'years of experience', 'years owning'];

/** Returns each banned phrase found in `text` (case-insensitive), in BANNED order. */
export function findBanned(text: string): string[] {
  const haystack = text.toLowerCase();
  return BANNED.filter((phrase) => haystack.includes(phrase.toLowerCase()));
}
