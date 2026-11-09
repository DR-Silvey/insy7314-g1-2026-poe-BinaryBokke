import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import TaxBracketsPage from '../components/TaxBracketsPage';
import { createTaxBracket, deleteTaxBracket, getTaxBrackets, updateTaxBracket } from '../services/taxApi';

//(Vitest, s.a.)
vi.mock('../services/taxApi');

const expiresAt = Date.now() + 3600000;
const admin = { token: 'token-admin', username: 'admin', role: 'admin', expiresAt };
const freelancer = { token: 'token-123', username: 'djsunset', role: 'freelancer', expiresAt };
const firstBracket = { _id: 'aaaaaaaaaaaaaaaaaaaaaaaa', taxYear: '2027', minimumIncome: 0, maximumIncome: 245100, taxRate: 18, baseTax: 0 };

function bracketsTable() {
  return within(screen.getByRole('region', { name: 'Brackets for 2027' }));
}

function findFirstBracket() {
  return bracketsTable().findByRole('rowheader', { name: /^R\s?0[,.]00/ });
}

//(Testing Library, s.a.)
describe('TaxBracketsPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 10, 9, 12));
    getTaxBrackets.mockResolvedValue([firstBracket]);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('loads the brackets for the current tax year', async () => {
    render(<TaxBracketsPage session={admin} onSessionExpired={vi.fn()} />);

    await findFirstBracket();

    expect(getTaxBrackets).toHaveBeenCalledWith('token-admin', { taxYear: '2027' });
    expect(screen.getByLabelText('Tax year')).toHaveValue('2027');
  });

  it('adds a bracket and prefills the next minimum', async () => {
    const user = userEvent.setup();
    createTaxBracket.mockResolvedValue({ _id: 'bbbbbbbbbbbbbbbbbbbbbbbb', taxYear: '2027', minimumIncome: 245100, maximumIncome: 383100, taxRate: 26, baseTax: 44118 });
    render(<TaxBracketsPage session={admin} onSessionExpired={vi.fn()} />);

    await findFirstBracket();
    await user.type(screen.getByLabelText('Minimum income (R)'), '245100');
    await user.type(screen.getByLabelText('Maximum income (R)'), '383100');
    await user.type(screen.getByLabelText('Tax rate (%)'), '26');
    await user.type(screen.getByLabelText('Base tax (R)'), '44118');
    await user.click(screen.getByRole('button', { name: 'Add bracket to 2027' }));

    expect(createTaxBracket).toHaveBeenCalledWith('token-admin', { taxYear: '2027', minimumIncome: 245100, maximumIncome: 383100, taxRate: 26, baseTax: 44118 });
    expect(await screen.findByText(/Added the .* bracket at 26% for 2027/)).toBeInTheDocument();
    expect(screen.getByLabelText('Minimum income (R)')).toHaveValue(383100);
  });

  it('checks the rate and overlaps before calling the API', async () => {
    const user = userEvent.setup();
    render(<TaxBracketsPage session={admin} onSessionExpired={vi.fn()} />);

    await findFirstBracket();
    await user.type(screen.getByLabelText('Minimum income (R)'), '100000');
    await user.type(screen.getByLabelText('Maximum income (R)'), '300000');
    await user.type(screen.getByLabelText('Tax rate (%)'), '120');
    await user.click(screen.getByRole('button', { name: 'Add bracket to 2027' }));

    expect(screen.getByText('Enter a tax rate between 0 and 100.')).toBeInTheDocument();

    await user.clear(screen.getByLabelText('Tax rate (%)'));
    await user.type(screen.getByLabelText('Tax rate (%)'), '20');
    await user.click(screen.getByRole('button', { name: 'Add bracket to 2027' }));

    expect(screen.getByText('This range overlaps a bracket already set for 2027.')).toBeInTheDocument();
    expect(createTaxBracket).not.toHaveBeenCalled();
  });

  it('fills the form from a SARS reference bracket', async () => {
    const user = userEvent.setup();
    render(<TaxBracketsPage session={admin} onSessionExpired={vi.fn()} />);

    await findFirstBracket();
    await user.click(screen.getByRole('button', { name: /^Use R\s?245/ }));

    expect(screen.getByLabelText('Minimum income (R)')).toHaveValue(245100);
    expect(screen.getByLabelText('Maximum income (R)')).toHaveValue(383100);
    expect(screen.getByLabelText('Tax rate (%)')).toHaveValue(26);
  });

  it('explains that estimates come out as zero when a year has no brackets', async () => {
    getTaxBrackets.mockResolvedValue([]);
    render(<TaxBracketsPage session={admin} onSessionExpired={vi.fn()} />);

    expect(await screen.findByText('No brackets have been set for the 2027 tax year. Tax estimates for this year will come out as R 0 until you add them.')).toBeInTheDocument();
  });

  it('shows the API error when a bracket cannot be added', async () => {
    const user = userEvent.setup();
    createTaxBracket.mockRejectedValue(Object.assign(new Error('Too many Tax Bracket Creation attempts. Please try again later.'), { status: 429 }));
    render(<TaxBracketsPage session={admin} onSessionExpired={vi.fn()} />);

    await findFirstBracket();
    await user.type(screen.getByLabelText('Minimum income (R)'), '245100');
    await user.type(screen.getByLabelText('Tax rate (%)'), '26');
    await user.click(screen.getByRole('button', { name: 'Add bracket to 2027' }));

    expect(await screen.findByText('Too many Tax Bracket Creation attempts. Please try again later.')).toBeInTheDocument();
  });

  it('edits a bracket and saves the change by its id', async () => {
    const user = userEvent.setup();
    updateTaxBracket.mockResolvedValue({ ...firstBracket, taxRate: 19 });
    render(<TaxBracketsPage session={admin} onSessionExpired={vi.fn()} />);

    await findFirstBracket();
    await user.click(bracketsTable().getByRole('button', { name: /^Edit R/ }));
    await user.clear(screen.getByLabelText('Tax rate (%)'));
    await user.type(screen.getByLabelText('Tax rate (%)'), '19');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(updateTaxBracket).toHaveBeenCalledWith('token-admin', firstBracket._id, { minimumIncome: 0, maximumIncome: 245100, taxRate: 19, baseTax: 0 });
    expect(await screen.findByText(/Updated the .* bracket for 2027/)).toBeInTheDocument();
    expect(bracketsTable().getByRole('cell', { name: '19%' })).toBeInTheDocument();
  });

  it('asks for confirmation before deleting a bracket', async () => {
    const user = userEvent.setup();
    deleteTaxBracket.mockResolvedValue(undefined);
    render(<TaxBracketsPage session={admin} onSessionExpired={vi.fn()} />);

    await findFirstBracket();
    await user.click(bracketsTable().getByRole('button', { name: /^Delete R/ }));
    expect(deleteTaxBracket).not.toHaveBeenCalled();
    await user.click(bracketsTable().getByRole('button', { name: /^Confirm delete R/ }));

    expect(deleteTaxBracket).toHaveBeenCalledWith('token-admin', firstBracket._id);
    expect(await screen.findByText(/Deleted the .* bracket for 2027/)).toBeInTheDocument();
  });

  it('loads another tax year when it is chosen', async () => {
    const user = userEvent.setup();
    render(<TaxBracketsPage session={admin} onSessionExpired={vi.fn()} />);

    await findFirstBracket();
    getTaxBrackets.mockResolvedValue([]);
    await user.selectOptions(screen.getByLabelText('Tax year'), '2028');

    expect(getTaxBrackets).toHaveBeenLastCalledWith('token-admin', { taxYear: '2028' });
    expect(await screen.findByRole('heading', { name: 'Brackets for 2028' })).toBeInTheDocument();
  });

  it('does not load brackets for other roles', () => {
    render(<TaxBracketsPage session={freelancer} onSessionExpired={vi.fn()} />);

    expect(screen.getByText('Only administrators can manage tax brackets.')).toBeInTheDocument();
    expect(getTaxBrackets).not.toHaveBeenCalled();
  });
});

/*
Vitest, s.a. Mocking. [online] Available at:
<https://vitest.dev/guide/mocking>
[Accessed 9 November 2026]

Testing Library, s.a. React Testing Library. [online] Available at:
<https://testing-library.com/docs/react-testing-library/intro/>
[Accessed 9 November 2026]
*/
