export function formatDescription(description, length) {
  return description.length > length ? description.slice(0, length) + '...' : description;
}
