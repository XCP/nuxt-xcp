export function formatBetType(type) {
  switch (type) {
    case 0:
      return 'Bullish CFD';
    case 1:
      return 'Bearish CFD';
    case 2:
      return 'Equal';
    case 3:
      return 'Not Equal';
    default:
      return 'Unknown';
  }
}
