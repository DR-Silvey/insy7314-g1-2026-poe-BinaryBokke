import { describe, expect, it } from 'vitest';
import { currentTaxYear, isInTaxYear, monthlyTotals, taxYearLabel } from '../services/taxYear';

describe('taxYear', () => {
  it('names the tax year after the year it ends in', () => {
    expect(currentTaxYear(new Date(2026, 10, 9))).toBe('2027');
    expect(currentTaxYear(new Date(2027, 1, 28))).toBe('2027');
    expect(currentTaxYear(new Date(2027, 2, 1))).toBe('2028');
  });

  it('labels the tax year from 1 March to the end of February', () => {
    expect(taxYearLabel('2027')).toBe('1 Mar 2026 – 28 Feb 2027');
    expect(taxYearLabel('2028')).toBe('1 Mar 2027 – 29 Feb 2028');
  });

  it('checks whether a date falls in the tax year', () => {
    expect(isInTaxYear(new Date(2026, 2, 1), '2027')).toBe(true);
    expect(isInTaxYear(new Date(2027, 1, 28, 23, 59), '2027')).toBe(true);
    expect(isInTaxYear(new Date(2026, 1, 28), '2027')).toBe(false);
    expect(isInTaxYear(new Date(2027, 2, 1), '2027')).toBe(false);
  });

  it('adds up the amounts for each month from March to February', () => {
    const items = [
      { createdAt: new Date(2026, 2, 5).toISOString(), amount: 100 },
      { createdAt: new Date(2026, 2, 20).toISOString(), amount: 50 },
      { createdAt: new Date(2027, 1, 10).toISOString(), amount: 300 },
      { createdAt: new Date(2025, 11, 1).toISOString(), amount: 999 },
    ];

    const months = monthlyTotals(items, '2027', (item) => item.amount);

    expect(months).toHaveLength(12);
    expect(months[0]).toEqual({ label: 'Mar', year: 2026, total: 150 });
    expect(months[11]).toEqual({ label: 'Feb', year: 2027, total: 300 });
    expect(months.reduce((total, month) => total + month.total, 0)).toBe(450);
  });
});
