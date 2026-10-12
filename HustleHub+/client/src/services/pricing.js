const currency = new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' });

export function formatCurrency(amount) {
  return currency.format(amount);
}

export function bookingTotal(costPerHour, numOfHours) {
  return Math.round(costPerHour * numOfHours * 100) / 100;
}
