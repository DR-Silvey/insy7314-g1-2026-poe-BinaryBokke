export const MAX_TEXT_LENGTH = 1000;

export function hasBlockedCharacters(value) {
  return value.includes("'") || value.includes('--');
}

export function validateText(value, label) {
  const trimmed = value.trim();
  const article = /^[aeiou]/i.test(label) ? 'an' : 'a';
  if (!trimmed) return `Enter ${article} ${label}.`;
  if (trimmed.length > MAX_TEXT_LENGTH) return `Keep the ${label} under ${MAX_TEXT_LENGTH} characters.`;
  if (hasBlockedCharacters(trimmed)) return `The ${label} cannot contain apostrophes (') or double dashes (--).`;
  return '';
}
