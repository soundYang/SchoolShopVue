export const formatPrice = (price) => {
  if (typeof price !== 'number') return '0.00'
  const rounded = Math.round(price * 100) / 100
  return rounded.toFixed(2)
}
