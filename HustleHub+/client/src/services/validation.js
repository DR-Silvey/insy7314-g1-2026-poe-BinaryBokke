export const MAX_TEXT_LENGTH = 1000;
export const MIN_PASSWORD_LENGTH = 13;
export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]+$/;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

export function validatePassword(password) {
  if (password.length < MIN_PASSWORD_LENGTH) return `Choose a password with at least ${MIN_PASSWORD_LENGTH} characters.`;
  if (!PASSWORD_PATTERN.test(password)) return 'Use an uppercase letter, a lowercase letter, a number and a symbol. Only letters, numbers and # @ $ ! % * ? & are allowed.';
  return '';
}
