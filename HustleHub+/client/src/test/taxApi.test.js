import { afterEach, describe, expect, it, vi } from 'vitest';
import { createTaxBracket, estimateTax, getTaxBrackets, getTaxRecords } from '../services/taxApi';

//(Vitest, 2026)
function mockFetch(status, body) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('taxApi', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('asks the finance API to estimate tax for the logged in user', async () => {
    const fetchMock = mockFetch(201, { message: 'Tax estimated', estimatedTax: { taxID: 'tax-1', taxAmount: 1200 } });

    const record = await estimateTax('token-123');

    expect(record).toEqual({ taxID: 'tax-1', taxAmount: 1200 });
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/tax-estimation$/);
    expect(options.method).toBe('POST');
    expect(options.headers.Authorization).toBe('Bearer token-123');
  });

  it('includes the status code and API message when the estimate fails', async () => {
    mockFetch(500, { error: 'Something went wrong (Tax Estimation)' });

    const error = await estimateTax('token-456').catch((caught) => caught);

    expect(error.status).toBe(500);
    expect(error.message).toBe('Something went wrong (Tax Estimation)');
  });

  it('loads tax records and treats "none found" as an empty list', async () => {
    mockFetch(200, { taxRecords: [{ taxID: 'tax-1' }] });
    await expect(getTaxRecords('token-123')).resolves.toEqual([{ taxID: 'tax-1' }]);

    mockFetch(404, { message: 'No tax records found' });
    await expect(getTaxRecords('token-123')).resolves.toEqual([]);
  });

  it('loads the brackets for a tax year', async () => {
    const fetchMock = mockFetch(200, { taxBrackets: [{ _id: 'a1' }] });

    await expect(getTaxBrackets('token-admin', { taxYear: '2027' })).resolves.toEqual([{ _id: 'a1' }]);
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/tax-brackets\?taxYear=2027$/);
  });

  it('sends only the bracket fields the API expects', async () => {
    const fetchMock = mockFetch(201, { taxBracket: { _id: 'a1', taxRate: 18 } });

    await createTaxBracket('token-admin', { taxYear: '2027', minimumIncome: 0, maximumIncome: 245100, taxRate: 18, baseTax: 0, extra: 'ignored' });

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/tax-brackets$/);
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body)).toEqual({ taxYear: '2027', minimumIncome: 0, maximumIncome: 245100, taxRate: 18, baseTax: 0 });
  });
});

/*
Vitest, 2026. Mocking. [online] Available at:
<https://vitest.dev/guide/mocking>
[Accessed 9 November 2026]
*/
