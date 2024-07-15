export const formatSupply = (quantity, asset) => {
  // Convert quantity based on divisibility
  let number = asset?.divisible ? (quantity / 100000000) : quantity

  // Determine the scale of the number and format accordingly
  if (number >= 1e18) {
    return (number / 1e18).toFixed(2) + 'Qn' // Quintillion
  }
  else if (number >= 1e15) {
    return (number / 1e15).toFixed(2) + 'Q' // Quadrillions
  }
  else if (number >= 1e12) {
    return (number / 1e12).toFixed(2) + 'T' // Trillions
  }
  else if (number >= 1e9) {
    return (number / 1e9).toFixed(2) + 'B' // Billions
  }
  else if (number >= 1e6) {
    return (number / 1e6).toFixed(2) + 'M' // Millions
  }
  else {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
}
