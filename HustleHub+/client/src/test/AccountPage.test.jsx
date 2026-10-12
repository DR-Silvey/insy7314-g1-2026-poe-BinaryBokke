import { render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AccountPage from '../components/AccountPage';
import { getBookings } from '../services/bookingApi';
import { getGigs } from '../services/gigApi';
import { getTransactions } from '../services/transactionApi';

vi.mock('../services/bookingApi');
vi.mock('../services/gigApi');
vi.mock('../services/transactionApi');

const expiresAt = Date.now() + 3600000;
const freelancer = { token: 'token-123', username: 'djsunset', role: 'freelancer', expiresAt };
const client = { token: 'token-456', username: 'eventco', role: 'client', expiresAt };
const general = { token: 'token-789', username: 'browser', role: 'GENERIC', expiresAt };

const djGig = { gigID: 'gig-1', usernamePerformer: 'djsunset', gigType: 'DJ', stageName: 'DJ Sunset', description: 'House sets', costPerHour: 250, isAvailable: true };
const mcGig = { gigID: 'gig-2', usernamePerformer: 'djsunset', gigType: 'MC', stageName: 'MC Thunder', description: 'Hosting', costPerHour: 100, isAvailable: false };

const paidBooking = { bookingID: 'b-1', gigID: 'gig-1', usernameClient: 'eventco', usernamePerformer: 'djsunset', eventName: 'Summer party', capacity: 80, numOfHours: 3, dateTimeToPerform: '2030-06-01T16:00:00.000Z', venue: 'Beach club', paymentReceived: 750 };
const unpaidBooking = { bookingID: 'b-2', gigID: 'gig-2', usernameClient: 'eventco', usernamePerformer: 'djsunset', eventName: 'Year end function', capacity: 40, numOfHours: 4, dateTimeToPerform: '2030-11-20T17:00:00.000Z', venue: 'Office', paymentReceived: 0 };
const transaction = { transactionID: 't-1', bookingID: 'b-1', gigID: 'gig-1', usernameClient: 'eventco', usernamePerformer: 'djsunset', amount: 750, createdAt: '2026-10-12T18:00:00.000Z' };

function summaryValue(label) {
  return within(screen.getByText(label, { selector: 'dt' }).parentElement).getByText(/R/, { selector: 'dd' }).textContent;
}

describe('AccountPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    getGigs.mockResolvedValue([djGig, mcGig]);
    getBookings.mockResolvedValue([paidBooking, unpaidBooking]);
    getTransactions.mockResolvedValue([transaction]);
  });

  it('shows the profile details from the login', async () => {
    render(<AccountPage session={freelancer} />);

    expect(screen.getByRole('heading', { name: 'My account' })).toBeInTheDocument();
    expect(screen.getByText('djsunset', { selector: 'dd' })).toBeInTheDocument();
    expect(screen.getByText('Freelancer', { selector: 'dd' })).toBeInTheDocument();
    await screen.findByText('Income received');
  });

  it("only loads the freelancer's own gigs, bookings and transactions", async () => {
    render(<AccountPage session={freelancer} />);

    await screen.findByText('Income received');

    expect(getGigs).toHaveBeenCalledWith({ usernamePerformer: 'djsunset' });
    expect(getBookings).toHaveBeenCalledWith({ usernamePerformer: 'djsunset' });
    expect(getTransactions).toHaveBeenCalledWith({ usernamePerformer: 'djsunset' });
  });

  it('shows income received from transactions and pending income from unpaid bookings', async () => {
    render(<AccountPage session={freelancer} />);

    await screen.findByText('Income received');

    expect(summaryValue('Income received')).toMatch(/750/);
    expect(summaryValue('Pending income')).toMatch(/400/);
  });

  it('breaks the income down per gig', async () => {
    render(<AccountPage session={freelancer} />);

    const table = within(await screen.findByRole('region', { name: 'Income by gig' }));
    const djRow = within(table.getByRole('row', { name: /DJ Sunset/ }));
    const mcRow = within(table.getByRole('row', { name: /MC Thunder/ }));

    expect(djRow.getAllByRole('cell').map((cell) => cell.textContent)).toEqual([expect.stringMatching(/250/), '1', '3', expect.stringMatching(/750/)]);
    expect(mcRow.getAllByRole('cell').map((cell) => cell.textContent)).toEqual([expect.stringMatching(/100/), '1', '4', expect.stringMatching(/0,00|0\.00/)]);
    expect(mcRow.getByText('Not available')).toBeInTheDocument();
  });

  it('lists the bookings with their payment status and the payment history', async () => {
    render(<AccountPage session={freelancer} />);

    const bookings = within(await screen.findByRole('region', { name: 'Bookings for my gigs' }));
    expect(within(bookings.getByRole('row', { name: /Summer party/ })).getByText('Paid')).toBeInTheDocument();
    expect(within(bookings.getByRole('row', { name: /Year end function/ })).getByText('Awaiting payment')).toBeInTheDocument();

    const payments = within(screen.getByRole('region', { name: 'Payment history' }));
    expect(payments.getByText('eventco')).toBeInTheDocument();
    expect(payments.getByText('DJ Sunset')).toBeInTheDocument();
  });

  it('counts bookings that were paid without a transaction record', async () => {
    getTransactions.mockResolvedValue([]);
    render(<AccountPage session={freelancer} />);

    await screen.findByText('Income received');

    expect(summaryValue('Income received')).toMatch(/750/);
    const table = within(screen.getByRole('region', { name: 'Income by gig' }));
    expect(within(table.getByRole('row', { name: /DJ Sunset/ })).getAllByRole('cell')[3].textContent).toMatch(/750/);
    expect(within(screen.getByRole('region', { name: 'Payment history' })).getByText('No payments yet.')).toBeInTheDocument();
  });

  it("shows a client's totals, bookings and payments", async () => {
    getGigs.mockResolvedValue([djGig, mcGig]);
    render(<AccountPage session={client} />);

    await screen.findByText('Total paid');

    expect(getBookings).toHaveBeenCalledWith({ usernameClient: 'eventco' });
    expect(getTransactions).toHaveBeenCalledWith({ usernameClient: 'eventco' });
    expect(summaryValue('Total paid')).toMatch(/750/);
    expect(summaryValue('Outstanding')).toMatch(/400/);
    expect(screen.queryByRole('region', { name: 'Income by gig' })).not.toBeInTheDocument();
    expect(within(screen.getByRole('region', { name: 'Payment history' })).getByText('djsunset')).toBeInTheDocument();
  });

  it('only shows the profile for a general account', () => {
    render(<AccountPage session={general} />);

    expect(screen.getByText('General', { selector: 'dd' })).toBeInTheDocument();
    expect(getBookings).not.toHaveBeenCalled();
    expect(getTransactions).not.toHaveBeenCalled();
    expect(screen.queryByText('Payment history')).not.toBeInTheDocument();
  });

  it('shows an error when the account details cannot be loaded', async () => {
    getTransactions.mockRejectedValue(new Error('We could not reach the service. Please try again shortly.'));
    render(<AccountPage session={freelancer} />);

    expect(await screen.findByText('We could not reach the service. Please try again shortly.')).toBeInTheDocument();
  });
});
