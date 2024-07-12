export const formatBalance = (quantity, asset) => {
  let number = asset?.divisible ? (quantity / 100000000) : quantity;
  let parts = number.toFixed(8).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return asset?.divisible ? parts.join(".") : parts.join(".").replace('.00000000', '');
};
