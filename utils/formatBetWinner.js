export function formatBetWinner(winner) {
  return winner.replace(/([A-Z])/g, ' $1').trim()
}
