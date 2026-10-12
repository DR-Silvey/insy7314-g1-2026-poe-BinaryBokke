import { afterEach, describe, expect, it, vi } from 'vitest';
import { createTransaction, getTransactions } from '../services/transactionApi';

function mockFetch(status, body) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('transactionApi', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('loads the transactions for a freelancer', async () => {
    const fetchMock = mockFetch(200, { message: 'Transactions retrieved successfully', count: 1, transactions: [{ transactionID: 't-1' }] });

    const transactions = await getTransactions({ usernamePerformer: 'djsunset' });

    expect(transactions).toEqual([{ transactionID: 't-1' }]);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/transaction\?usernamePerformer=djsunset$/);
    expect(options.method).toBe('GET');
  });

  it('treats "no transactions found" as an empty list', async () => {
    mockFetch(404, { message: 'No Transactions found' });

    await expect(getTransactions({ usernameClient: 'eventco' })).resolves.toEqual([]);
  });

  it('records a payment with the login token and only the fields the API expects', async () => {
    const fetchMock = mockFetch(201, { message: 'Transaction created successfully', transaction: { transactionID: 't-9' } });

    const transaction = await createTransaction('token-456', { bookingID: 'b-1', gigID: 'gig-1', usernamePerformer: 'djsunset', amount: 750, usernameClient: 'ignored' });

    expect(transaction).toEqual({ transactionID: 't-9' });
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/transaction$/);
    expect(options.method).toBe('POST');
    expect(options.headers.Authorization).toBe('Bearer token-456');
    expect(JSON.parse(options.body)).toEqual({ bookingID: 'b-1', gigID: 'gig-1', usernamePerformer: 'djsunset', amount: 750 });
  });

  it('includes the status code when a payment has already been recorded', async () => {
    mockFetch(409, { error: 'A transaction with this unique identifier already exists' });

    const error = await createTransaction('token-456', { bookingID: 'b-1', gigID: 'gig-1', usernamePerformer: 'djsunset', amount: 750 }).catch((caught) => caught);

    expect(error.status).toBe(409);
    expect(error.message).toBe('A transaction with this unique identifier already exists');
  });
});
