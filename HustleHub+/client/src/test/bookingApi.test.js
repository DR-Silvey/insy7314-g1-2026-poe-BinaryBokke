import { afterEach, describe, expect, it, vi } from 'vitest';
import { createBooking, deleteBooking, getBookings, updateBooking } from '../services/bookingApi';

function mockFetch(status, body) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

const bookingValues = {
  gigID: 'gig-1',
  usernamePerformer: 'djsunset',
  eventName: 'Summer party',
  capacity: 80,
  numOfHours: 3,
  dateTimeToPerform: '2030-06-01T16:00:00.000Z',
  venue: 'Beach club',
};

describe('bookingApi', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('loads bookings filtered by client', async () => {
    const fetchMock = mockFetch(200, { message: 'Bookings retrieved successfully', count: 1, bookings: [{ bookingID: 'b-1' }] });

    const bookings = await getBookings({ usernameClient: 'eventco' });

    expect(bookings).toEqual([{ bookingID: 'b-1' }]);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/booking\?usernameClient=eventco$/);
    expect(options.method).toBe('GET');
  });

  it('treats "no bookings found" as an empty list', async () => {
    mockFetch(404, { message: 'No bookings found' });

    await expect(getBookings({ usernamePerformer: 'djsunset' })).resolves.toEqual([]);
  });

  it('creates an unpaid booking with the login token', async () => {
    const fetchMock = mockFetch(201, { message: 'Booking created successfully', booking: { bookingID: 'b-9' } });

    const booking = await createBooking('token-456', { ...bookingValues, paymentReceived: 999, extra: 'ignored' });

    expect(booking).toEqual({ bookingID: 'b-9' });
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/booking$/);
    expect(options.method).toBe('POST');
    expect(options.headers.Authorization).toBe('Bearer token-456');
    expect(JSON.parse(options.body)).toEqual({ ...bookingValues, paymentReceived: 0 });
  });

  it('updates a booking with every field the API requires', async () => {
    const fetchMock = mockFetch(200, { message: 'Booking updated successfully', booking: { bookingID: 'b-1' } });
    const fullBooking = { ...bookingValues, bookingID: 'b-1', usernameClient: 'eventco', paymentReceived: 750 };

    await updateBooking('token-456', { ...fullBooking, _id: 'mongo-id', createdAt: 'x' });

    const [, options] = fetchMock.mock.calls[0];
    expect(options.method).toBe('PUT');
    expect(JSON.parse(options.body)).toEqual(fullBooking);
  });

  it('deletes a booking by its ID', async () => {
    const fetchMock = mockFetch(200, { message: 'Booking removed successfully', bookingID: 'b-1' });

    await deleteBooking('token-456', 'b-1');

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toMatch(/\/booking\?bookingID=b-1$/);
    expect(options.method).toBe('DELETE');
  });

  it('includes the status code and API message when a request fails', async () => {
    mockFetch(403, { error: 'Access Denied' });

    const error = await createBooking('token-123', bookingValues).catch((caught) => caught);

    expect(error.message).toBe('Access Denied');
    expect(error.status).toBe(403);
  });
});
