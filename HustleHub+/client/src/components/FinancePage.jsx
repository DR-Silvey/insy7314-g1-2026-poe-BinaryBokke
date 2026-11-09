import { useEffect, useState } from 'react';
import IncomeChart from './IncomeChart';
import { formatDateTime } from '../services/dates';
import { formatCurrency } from '../services/pricing';
import { estimateTax, getTaxRecords } from '../services/taxApi';
import { currentTaxYear, isInTaxYear, monthlyTotals, taxYearLabel } from '../services/taxYear';
import { getTransactions } from '../services/transactionApi';

const FINANCE_ROLES = ['freelancer', 'client'];

function transactionFilters(session) {
  return session.role === 'freelancer' ? { usernamePerformer: session.username } : { usernameClient: session.username };
}

function newestFirst(field) {
  return (first, second) => new Date(second[field]) - new Date(first[field]);
}

export default function FinancePage({ session, onSessionExpired }) {
  const taxYear = currentTaxYear();
  //(React, 2026a)
  const [transactions, setTransactions] = useState([]);
  const [taxRecords, setTaxRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEstimating, setIsEstimating] = useState(false);
  const [notice, setNotice] = useState(null);
  const canUseFinance = FINANCE_ROLES.includes(session.role);
  const isFreelancer = session.role === 'freelancer';

  //(React, 2026b)
  useEffect(() => {
    if (!canUseFinance) {
      setIsLoading(false);
      return undefined;
    }

    let isCurrent = true;

    Promise.all([getTransactions(session.token, transactionFilters(session)), getTaxRecords(session.token)])
      .then(([transactionResults, taxRecordResults]) => {
        if (!isCurrent) return;
        setTransactions(transactionResults);
        setTaxRecords(taxRecordResults);
      })
      .catch((error) => {
        if (!isCurrent) return;
        if (error.status === 401) {
          onSessionExpired();
          return;
        }
        setNotice({ type: 'error', text: error.message });
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [canUseFinance, session]);

  async function handleEstimate() {
    setNotice(null);
    setIsEstimating(true);

    try {
      const record = await estimateTax(session.token);
      setTaxRecords((current) => [record, ...current]);
      setNotice({ type: 'success', text: `Your estimated tax for the ${record.taxYear} tax year is ${formatCurrency(record.taxAmount)}.` });
    } catch (error) {
      if (error.status === 401) {
        onSessionExpired();
        return;
      }
      setNotice({ type: 'error', text: error.message });
    } finally {
      setIsEstimating(false);
    }
  }

  const sortedRecords = [...taxRecords].sort(newestFirst('calculationDate'));
  const latestRecord = sortedRecords.find((record) => record.taxYear === taxYear) ?? null;
  const yearTransactions = transactions.filter((transaction) => isInTaxYear(transaction.createdAt, taxYear)).sort(newestFirst('createdAt'));
  //(MDN Web Docs, 2026d)
  const yearTotal = yearTransactions.reduce((total, transaction) => total + transaction.amount, 0);
  const months = monthlyTotals(yearTransactions, taxYear, (transaction) => transaction.amount);
  const totalLabel = isFreelancer ? 'Income this tax year' : 'Paid this tax year';
  const chartHeading = isFreelancer ? 'Income by month' : 'Payments by month';

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">FINANCE</p>
          <h1>Finance dashboard</h1>
          <p>Tax year {taxYear} ({taxYearLabel(taxYear)}). {isFreelancer ? 'Your income from paid bookings and your tax estimates.' : 'Your booking payments and your tax estimates.'}</p>
        </div>
        {canUseFinance && (
          <button type="button" className="primary-button" onClick={handleEstimate} disabled={isEstimating || isLoading}>
            {isEstimating ? 'Estimating…' : 'Estimate my tax'}
          </button>
        )}
      </header>

      {notice && <div className={`notice ${notice.type}`} role="status">{notice.text}</div>}

      {!canUseFinance ? (
        <p className="empty-state">The finance dashboard is available to freelancer and client accounts.</p>
      ) : isLoading ? (
        <p className="empty-state" role="status">Loading your finances…</p>
      ) : (
        <>
          <dl className="summary-grid">
            <div><dt>{totalLabel}</dt><dd>{formatCurrency(yearTotal)}</dd></div>
            <div><dt>Payments</dt><dd>{yearTransactions.length}</dd></div>
            <div><dt>Latest tax estimate</dt><dd>{latestRecord ? formatCurrency(latestRecord.taxAmount) : 'Not estimated'}</dd></div>
          </dl>

          <section className="panel" aria-labelledby="chart-heading">
            <h2 id="chart-heading">{chartHeading}</h2>
            {yearTotal === 0 ? (
              <p className="panel-empty">No payments in the {taxYear} tax year yet.</p>
            ) : (
              <IncomeChart months={months} label={`${chartHeading}, tax year ${taxYear}`} />
            )}
          </section>

          <section className="panel" aria-labelledby="estimates-heading">
            <h2 id="estimates-heading">Tax estimates</h2>
            {sortedRecords.length === 0 ? (
              <p className="panel-empty">You have not estimated your tax yet. Use Estimate my tax to work it out from this tax year&apos;s payments.</p>
            ) : (
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr><th scope="col">Calculated</th><th scope="col">Tax year</th><th scope="col">Estimated tax</th></tr>
                  </thead>
                  <tbody>
                    {sortedRecords.map((record) => (
                      <tr key={record.taxID}>
                        <th scope="row">{formatDateTime(record.calculationDate)}</th>
                        <td>{record.taxYear}</td>
                        <td>{formatCurrency(record.taxAmount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="panel-note">Estimates use the tax brackets an administrator has set for the tax year, less the SARS primary rebate. They are a guide, not tax advice.</p>
          </section>

          <section className="panel" aria-labelledby="year-payments-heading">
            <h2 id="year-payments-heading">Payments this tax year</h2>
            {yearTransactions.length === 0 ? (
              <p className="panel-empty">No payments in the {taxYear} tax year yet.</p>
            ) : (
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr><th scope="col">Date</th><th scope="col">{isFreelancer ? 'From' : 'To'}</th><th scope="col">Amount</th></tr>
                  </thead>
                  <tbody>
                    {yearTransactions.map((transaction) => (
                      <tr key={transaction.transactionID}>
                        <th scope="row">{formatDateTime(transaction.createdAt)}</th>
                        <td>{isFreelancer ? transaction.usernameClient : transaction.usernamePerformer}</td>
                        <td>{formatCurrency(transaction.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}

/*
React, 2026a. useState. [online] Available at:
<https://react.dev/reference/react/useState>
[Accessed 9 November 2026]

React, 2026b. useEffect. [online] Available at:
<https://react.dev/reference/react/useEffect>
[Accessed 9 November 2026]

MDN Web Docs, 2026d. Array.prototype.reduce(). [online] Available at:
<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce>
[Accessed 9 November 2026]
*/
