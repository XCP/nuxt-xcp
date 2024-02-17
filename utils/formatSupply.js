export const formatSupply = (quantity, asset) => {
  // Convert quantity based on divisibility
  let number = asset?.divisible ? (quantity / 100000000) : quantity;
  
  // Determine the scale of the number and format accordingly
  if (number >= 1e15) {
    return (number / 1e15).toFixed(2) + 'Q'; // Quadrillions
  } else if (number >= 1e12) {
    return (number / 1e12).toFixed(2) + 'T'; // Trillions
  } else if (number >= 1e9) {
    return (number / 1e9).toFixed(2) + 'B'; // Billions
  } else if (number >= 1e6) {
    return (number / 1e6).toFixed(2) + 'M'; // Millions
  } else if (number >= 1e3) {
    return (number / 1e3).toFixed(2) + 'K'; // Thousands
  } else {
    // For numbers less than 1000, format to remove decimal places without rounding
    return number.toString().replace(/(\.\d+)?$/, ''); // Removes decimal part, if any
  }
};
