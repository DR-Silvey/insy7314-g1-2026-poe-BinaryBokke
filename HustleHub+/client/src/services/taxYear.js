const MONTH_NAMES = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];

//(National Treasury, 2026)
export function currentTaxYear(today = new Date()) {
  return String(today.getMonth() >= 2 ? today.getFullYear() + 1 : today.getFullYear());
}

//(MDN Web Docs, s.a.c)
export function taxYearRange(taxYear) {
  const endYear = Number(taxYear);
  return { start: new Date(endYear - 1, 2, 1), end: new Date(endYear, 2, 1) };
}

export function isInTaxYear(value, taxYear) {
  const date = new Date(value);
  const { start, end } = taxYearRange(taxYear);
  return date >= start && date < end;
}

export function taxYearLabel(taxYear) {
  const endYear = Number(taxYear);
  return `1 Mar ${endYear - 1} – ${new Date(endYear, 2, 0).getDate()} Feb ${endYear}`;
}

export function monthlyTotals(items, taxYear, amountOf) {
  const { start } = taxYearRange(taxYear);
  const totals = MONTH_NAMES.map((label, index) => ({ label, year: new Date(start.getFullYear(), start.getMonth() + index, 1).getFullYear(), total: 0 }));

  for (const item of items) {
    const date = new Date(item.createdAt);
    if (!isInTaxYear(date, taxYear)) continue;
    const index = (date.getFullYear() - start.getFullYear()) * 12 + date.getMonth() - start.getMonth();
    totals[index].total += amountOf(item);
  }

  return totals;
}

/*
National Treasury, 2026. Budget 2026 Tax Guide. [online] Available at:
<https://www.treasury.gov.za/documents/national%20budget/2026/sars/Budget%202026%20Tax%20guide.pdf>
[Accessed 9 November 2026]

MDN Web Docs, s.a.c. Date. [online] Available at:
<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date>
[Accessed 9 November 2026]
*/
