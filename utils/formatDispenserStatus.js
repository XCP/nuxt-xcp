export function formatDispenserStatus(status) {
  switch (status) {
    case 0:
      return 'Open'
    case 1:
      return 'Open'
    case 20:
      return 'Open (Oracle Price)'
    case 21:
      return 'Open (Oracle Price)'
    case 10:
      return 'Closed'
    case 11:
      return 'Closing'
    default:
      return 'Unknown'
  }
}
