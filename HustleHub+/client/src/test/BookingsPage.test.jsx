import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import BookingsPage from '../components/BookingsPage';
import { deleteBooking, getBookings, updateBooking } from '../services/bookingApi';
import { getGigs } from '../services/gigApi';
import { createTransaction } from '../services/transactionApi';

vi.mock('../services/bookingApi');
vi.mock('../services/gigApi');
vi.mock('../services/transactionApi');

const client = { token: 'token-456', username: 'eventco', role: 'client', expiresAt: Date.now() + 3600000 };
const freelancer = { token: 'token-123', username: 'djsunset', role: 'freelancer', expiresAt: Date.now() + 3600000 };
const general = { token: 'token-789', username: 'browser', role: 'GENERIC', expiresAt: Date.now() + 3600000 };

const gig = { gigID: 'gig-1', usernamePerformer: 'djsunset', gigType: 'DJ', stageName: 'DJ Sunset', description: 'House sets', costPerHour: 250, isAvailable: true };
const unpaidBooking = { bookingID: 'b-1', gigID: 'gig-1', usernameClient: 'eventco', usernamePerformer: 'djsunset', eventName: 'Summer party', capacity: 80, numOfHours: 3, dateTimeToPerform: '2030-06-01T16:00:00.000Z', venue: 'Beach club', paymentReceived: 0 };
const paidBooking = { ...unpaidBooking, bookingID: 'b-2', eventName: 'Year end function', paymentReceived: 500 };

function renderPage(session = client) {
  const onSessionExpired = vi.fn();
  render(<BookingsPage session={session} onSessionExpired={onSessionExpired} />);
  return { onSessionExpired };
}

describe('BookingsPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    getBookings.mockResolvedValue([]);
    getGigs.mockResolvedValue([gig]);
    createTransaction.mockResolvedValue({ transactionID: 't-1' });
  });

  it('only loads the bookings made by the signed-in client', async () => {
    getBookings.mockResolvedValue([unpaidBooking]);
    renderPage(client);

    expect(await screen.findByText('Summer party')).toBeInTheDocument();
    expect(getBookings).toHaveBeenCalledWith({ usernameClient: 'eventco' });
    expect(screen.getByRole('heading', { name: 'My bookings' })).toBeInTheDocument();
    expect(screen.getByText('Awaiting payment', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText('DJ Sunset')).toBeInTheDocument();
  });

  it('only loads the bookings for the signed-in freelancer, without payment buttons', async () => {
    getBookings.mockResolvedValue([unpaidBooking]);
    renderPage(freelancer);

    expect(await screen.findByText('Summer party')).toBeInTheDocument();
    expect(getBookings).toHaveBeenCalledWith({ usernamePerformer: 'djsunset' });
    expect(screen.getByText('eventco')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Pay / })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cancel Summer party' })).not.toBeInTheDocument();
  });

  it('explains that general accounts cannot use bookings', async () => {
    renderPage(general);

    expect(await screen.findByText(/Bookings are available to client and freelancer accounts/)).toBeInTheDocument();
    expect(getBookings).not.toHaveBeenCalled();
  });

  it('shows a message when the client has no bookings', async () => {
    renderPage(client);

    expect(await screen.findByText('You have not made any bookings yet. Book a gig from the Gigs page.')).toBeInTheDocument();
  });

  it('shows an error when the bookings cannot be loaded', async () => {
    getBookings.mockRejectedValue(new Error('We could not reach the service. Please try again shortly.'));
    renderPage(client);

    expect(await screen.findByText('We could not reach the service. Please try again shortly.')).toBeInTheDocument();
  });

  it('pays for a booking using the gig price times the number of hours', async () => {
    getBookings.mockResolvedValue([unpaidBooking]);
    updateBooking.mockImplementation(async (token, booking) => booking);
    const user = userEvent.setup();
    renderPage(client);

    await user.click(await screen.findByRole('button', { name: /^Pay / }));
    expect(screen.getByText(/No real money is charged/)).toBeInTheDocument();
    expect(updateBooking).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Confirm payment' }));

    expect(createTransaction).toHaveBeenCalledWith('token-456', { bookingID: 'b-1', gigID: 'gig-1', usernamePerformer: 'djsunset', amount: 750 });
    expect(updateBooking).toHaveBeenCalledWith('token-456', { ...unpaidBooking, paymentReceived: 750 });
    expect(await screen.findByText(/Your booking for Summer party is confirmed/)).toBeInTheDocument();
    expect(screen.getByText('Paid', { selector: 'span' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Pay / })).not.toBeInTheDocument();
  });

  it('still marks the booking as paid when its transaction already exists', async () => {
    getBookings.mockResolvedValue([unpaidBooking]);
    createTransaction.mockRejectedValue(Object.assign(new Error('A transaction with this unique identifier already exists'), { status: 409 }));
    updateBooking.mockImplementation(async (token, booking) => booking);
    const user = userEvent.setup();
    renderPage(client);

    await user.click(await screen.findByRole('button', { name: /^Pay / }));
    await user.click(screen.getByRole('button', { name: 'Confirm payment' }));

    expect(await screen.findByText(/Your booking for Summer party is confirmed/)).toBeInTheDocument();
    expect(updateBooking).toHaveBeenCalled();
  });

  it('does not mark the booking as paid when the transaction fails', async () => {
    getBookings.mockResolvedValue([unpaidBooking]);
    createTransaction.mockRejectedValue(Object.assign(new Error('Transaction validation failed'), { status: 400 }));
    const user = userEvent.setup();
    renderPage(client);

    await user.click(await screen.findByRole('button', { name: /^Pay / }));
    await user.click(screen.getByRole('button', { name: 'Confirm payment' }));

    expect(await screen.findByText('Transaction validation failed')).toBeInTheDocument();
    expect(updateBooking).not.toHaveBeenCalled();
  });

  it('lets the client go back without paying', async () => {
    getBookings.mockResolvedValue([unpaidBooking]);
    const user = userEvent.setup();
    renderPage(client);

    await user.click(await screen.findByRole('button', { name: /^Pay / }));
    await user.click(screen.getByRole('button', { name: 'Back' }));

    expect(createTransaction).not.toHaveBeenCalled();
    expect(updateBooking).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /^Pay / })).toBeInTheDocument();
  });

  it('does not offer payment or cancelling for a paid booking', async () => {
    getBookings.mockResolvedValue([paidBooking]);
    renderPage(client);

    expect(await screen.findByText('Year end function')).toBeInTheDocument();
    expect(screen.getByText('Paid', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText('Amount paid')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Pay / })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cancel Year end function' })).not.toBeInTheDocument();
  });

  it('cancels an unpaid booking after the client confirms', async () => {
    getBookings.mockResolvedValue([unpaidBooking]);
    deleteBooking.mockResolvedValue();
    const user = userEvent.setup();
    renderPage(client);

    await user.click(await screen.findByRole('button', { name: 'Cancel Summer party' }));
    expect(deleteBooking).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Yes, cancel' }));

    expect(deleteBooking).toHaveBeenCalledWith('token-456', 'b-1');
    expect(await screen.findByText('Your booking for Summer party has been cancelled.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Summer party' })).not.toBeInTheDocument();
  });

  it('signs the user out when their session has expired', async () => {
    getBookings.mockResolvedValue([unpaidBooking]);
    updateBooking.mockRejectedValue(Object.assign(new Error('Invalid or expired token'), { status: 401 }));
    const user = userEvent.setup();
    const { onSessionExpired } = renderPage(client);

    await user.click(await screen.findByRole('button', { name: /^Pay / }));
    await user.click(screen.getByRole('button', { name: 'Confirm payment' }));

    await waitFor(() => expect(onSessionExpired).toHaveBeenCalled());
  });
});
