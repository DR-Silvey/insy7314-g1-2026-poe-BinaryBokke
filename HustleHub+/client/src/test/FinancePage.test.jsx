import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import FinancePage from '../components/FinancePage';
import { estimateTax, getTaxRecords } from '../services/taxApi';
import { getTransactions } from '../services/transactionApi';

//(Vitest, 2026)
vi.mock('../services/taxApi');
vi.mock('../services/transactionApi');

const expiresAt = Date.now() + 3600000;
const freelancer = { token: 'token-123', username: 'djsunset', role: 'freelancer', expiresAt };
const client = { token: 'token-456', username: 'eventco', role: 'client', expiresAt };
const admin = { token: 'token-admin', username: 'admin', role: 'admin', expiresAt };

const thisYearPayment = { transactionID: 't-1', usernameClient: 'eventco', usernamePerformer: 'djsunset', amount: 40000, createdAt: new Date(2026, 9, 12, 18).toISOString() };
const lastYearPayment = { transactionID: 't-0', usernameClient: 'eventco', usernamePerformer: 'djsunset', amount: 9000, createdAt: new Date(2026, 0, 12, 18).toISOString() };
const estimate = { taxID: 'tax-1', taxYear: '2027', taxAmount: 0, calculationDate: new Date(2026, 10, 9, 10).toISOString() };

function summaryValue(label) {
  return within(screen.getByText(label, { selector: 'dt' }).parentElement).getByRole('definition').textContent;
}

//(Testing Library, 2026)
describe('FinancePage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 10, 9, 12));
    getTransactions.mockResolvedValue([thisYearPayment, lastYearPayment]);
    getTaxRecords.mockResolvedValue([]);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("loads the freelancer's own payments and tax records with the login token", async () => {
    render(<FinancePage session={freelancer} onSessionExpired={vi.fn()} />);

    await screen.findByText('Income this tax year');

    expect(getTransactions).toHaveBeenCalledWith('token-123', { usernamePerformer: 'djsunset' });
    expect(getTaxRecords).toHaveBeenCalledWith('token-123');
  });

  it('only counts payments from the current tax year', async () => {
    render(<FinancePage session={freelancer} onSessionExpired={vi.fn()} />);

    await screen.findByText('Income this tax year');

    expect(summaryValue('Income this tax year')).toMatch(/40[\s,]000/);
    expect(summaryValue('Payments')).toBe('1');
    expect(summaryValue('Latest tax estimate')).toBe('Not estimated');
    expect(screen.getByRole('figure', { name: 'Income by month, tax year 2027' })).toBeInTheDocument();
  });

  it('shows client totals as payments made', async () => {
    render(<FinancePage session={client} onSessionExpired={vi.fn()} />);

    await screen.findByText('Paid this tax year');

    expect(getTransactions).toHaveBeenCalledWith('token-456', { usernameClient: 'eventco' });
    expect(screen.getByRole('heading', { name: 'Payments by month' })).toBeInTheDocument();
  });

  it('estimates tax and adds the new record to the history', async () => {
    const user = userEvent.setup();
    estimateTax.mockResolvedValue(estimate);
    render(<FinancePage session={freelancer} onSessionExpired={vi.fn()} />);

    await screen.findByText('Income this tax year');
    await user.click(screen.getByRole('button', { name: 'Estimate my tax' }));

    expect(estimateTax).toHaveBeenCalledWith('token-123');
    expect(await screen.findByRole('status')).toHaveTextContent(/2027 tax year/);
    const history = within(screen.getByRole('region', { name: 'Tax estimates' }));
    expect(history.getByRole('cell', { name: '2027' })).toBeInTheDocument();
    expect(summaryValue('Latest tax estimate')).toMatch(/R\s?0[,.]00/);
  });

  it('shows the API error when the estimate fails', async () => {
    const user = userEvent.setup();
    estimateTax.mockRejectedValue(Object.assign(new Error('Something went wrong (Tax Estimation)'), { status: 500 }));
    render(<FinancePage session={client} onSessionExpired={vi.fn()} />);

    await screen.findByText('Paid this tax year');
    await user.click(screen.getByRole('button', { name: 'Estimate my tax' }));

    expect(await screen.findByText('Something went wrong (Tax Estimation)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Estimate my tax' })).toBeEnabled();
  });

  it('signs out when the session has expired', async () => {
    const onSessionExpired = vi.fn();
    getTransactions.mockRejectedValue(Object.assign(new Error('Not authorised'), { status: 401 }));
    render(<FinancePage session={freelancer} onSessionExpired={onSessionExpired} />);

    await vi.waitFor(() => expect(onSessionExpired).toHaveBeenCalled());
  });

  it('does not load finances for other roles', () => {
    render(<FinancePage session={admin} onSessionExpired={vi.fn()} />);

    expect(screen.getByText('The finance dashboard is available to freelancer and client accounts.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Estimate my tax' })).not.toBeInTheDocument();
    expect(getTransactions).not.toHaveBeenCalled();
  });
});

/*
Vitest, 2026. Mocking. [online] Available at:
<https://vitest.dev/guide/mocking>
[Accessed 9 November 2026]

Testing Library, 2026. React Testing Library. [online] Available at:
<https://testing-library.com/docs/react-testing-library/intro/>
[Accessed 9 November 2026]
*/
