/**
 * Returns the keywords that match the given listing title/description.
 */
export function matchKeywords(
  keywords: string[],
  title: string,
  description?: string | null
): string[] {
  const text = [title, description].filter(Boolean).join(' ').toLowerCase()
  return keywords.filter((kw) => text.includes(kw.toLowerCase().trim()))
}
