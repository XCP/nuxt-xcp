export function formatSnakeCase(snakeStr) {
  return snakeStr
    .split('_')
    .map(capitalizeFirstLetter)
    .join(' ')
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
