export function cleanUsername(name) {
  if (!name || typeof name !== 'string') return '';
  return name.trim();
}

