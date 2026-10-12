import { afterEach, describe, expect, it, vi } from 'vitest';
import { createGig, deleteGig, getGigs, updateGig } from '../services/gigApi';

function mockFetch(status, body) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

const gigValues = { gigType: 'DJ', stageName: 'DJ Sunset', description: 'House sets', costPerHour: 250, isAvailable: true };

describe('gigApi', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('loads all gigs without needing a token', async () => {
    const fetchMock = mockFetch(200, { message: 'Gigs retrieved successfully', count: 1, gigs: [{ gigID: 'gig-1' }] });

    const gigs = await getGigs();

    expect(gigs).toEqual([{ gigID: 'gig-1' }]);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/gig$/);
    expect(options.method).toBe('GET');
    expect(options.headers.Authorization).toBeUndefined();
  });

  it('filters gigs by performer', async () => {
    const fetchMock = mockFetch(200, { gigs: [] });

    await getGigs({ usernamePerformer: 'djsunset' });

    expect(fetchMock.mock.calls[0][0]).toMatch(/\/gig\?usernamePerformer=djsunset$/);
  });

  it('treats "no gigs found" as an empty list', async () => {
    mockFetch(404, { message: 'No gigs found' });

    await expect(getGigs()).resolves.toEqual([]);
  });

  it('creates a gig with the login token and only the fields the API expects', async () => {
    const fetchMock = mockFetch(201, { message: 'Gig created successfully', gig: { gigID: 'gig-9' } });

    const gig = await createGig('token-123', { ...gigValues, extra: 'ignored' });

    expect(gig).toEqual({ gigID: 'gig-9' });
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/gig$/);
    expect(options.method).toBe('POST');
    expect(options.headers.Authorization).toBe('Bearer token-123');
    expect(JSON.parse(options.body)).toEqual(gigValues);
  });

  it('updates a gig with every field the API requires', async () => {
    const fetchMock = mockFetch(200, { message: 'Gig updated successfully', gig: { gigID: 'gig-1' } });

    await updateGig('token-123', { ...gigValues, gigID: 'gig-1', usernamePerformer: 'djsunset' });

    const [, options] = fetchMock.mock.calls[0];
    expect(options.method).toBe('PUT');
    expect(JSON.parse(options.body)).toEqual({ ...gigValues, gigID: 'gig-1', usernamePerformer: 'djsunset' });
  });

  it('deletes a gig by its ID', async () => {
    const fetchMock = mockFetch(200, { message: 'Gig removed successfully', gigID: 'gig-1' });

    await deleteGig('token-123', 'gig-1');

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/gig\?gigID=gig-1$/);
    expect(options.method).toBe('DELETE');
    expect(options.body).toBeUndefined();
  });

  it('includes the status code and API message when a request fails', async () => {
    mockFetch(401, { error: 'Invalid or expired token' });

    const error = await createGig('bad-token', gigValues).catch((caught) => caught);

    expect(error.message).toBe('Invalid or expired token');
    expect(error.status).toBe(401);
  });

  it('shows a friendly message when the API cannot be reached', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(getGigs()).rejects.toThrow('We could not reach the service. Please try again shortly.');
  });
});
