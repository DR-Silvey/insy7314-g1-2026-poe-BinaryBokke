import { useEffect, useState } from 'react';
import { getBookings } from '../services/bookingApi';
import { formatDateTime, formatTime } from '../services/dates';
import { getGigs } from '../services/gigApi';
import { bookingTotal, formatCurrency } from '../services/pricing';
import { roleLabel } from '../services/roles';
import { getTransactions } from '../services/transactionApi';

const emptyAccount = { gigs: [], bookings: [], transactions: [] };

async function loadAccount(session) {
  if (session.role === 'freelancer') {
    const filter = { usernamePerformer: session.username };
    const [gigs, bookings, transactions] = await Promise.all([getGigs(filter), getBookings(filter), getTransactions(filter)]);
    return { gigs, bookings, transactions };
  }

  if (session.role === 'client') {
    const filter = { usernameClient: session.username };
    const [gigs, bookings, transactions] = await Promise.all([getGigs(), getBookings(filter), getTransactions(filter)]);
    return { gigs, bookings, transactions };
  }

  return emptyAccount;
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

export default function AccountPage({ session }) {
  const [account, setAccount] = useState(emptyAccount);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const isFreelancer = session.role === 'freelancer';
  const isClient = session.role === 'client';

  useEffect(() => {
    let isCurrent = true;

    loadAccount(session)
      .then((result) => {
        if (isCurrent) setAccount(result);
      })
      .catch((loadError) => {
        if (isCurrent) setError(loadError.message);
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [session]);

  const gigsByID = Object.fromEntries(account.gigs.map((gig) => [gig.gigID, gig]));
  const paidBookingIDs = new Set(account.transactions.map((transaction) => transaction.bookingID));
  const isPaid = (booking) => paidBookingIDs.has(booking.bookingID) || booking.paymentReceived > 0;
  const bookingValue = (booking) => (gigsByID[booking.gigID] ? bookingTotal(gigsByID[booking.gigID].costPerHour, booking.numOfHours) : 0);
  const paidWithoutTransaction = account.bookings.filter((booking) => !paidBookingIDs.has(booking.bookingID) && booking.paymentReceived > 0);
  const receivedFor = (transactions, bookings) => sum(transactions.map((transaction) => transaction.amount)) + sum(bookings.map((booking) => booking.paymentReceived));
  const received = receivedFor(account.transactions, paidWithoutTransaction);
  const unpaidBookings = account.bookings.filter((booking) => !isPaid(booking));
  const pending = sum(unpaidBookings.map(bookingValue));
  const sortedTransactions = [...account.transactions].sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt));

  const incomeByGig = account.gigs.map((gig) => {
    const gigBookings = account.bookings.filter((booking) => booking.gigID === gig.gigID);
    const gigTransactions = account.transactions.filter((transaction) => transaction.gigID === gig.gigID);
    return {
      gig,
      bookings: gigBookings.length,
      hours: sum(gigBookings.map((booking) => booking.numOfHours)),
      received: receivedFor(gigTransactions, paidWithoutTransaction.filter((booking) => booking.gigID === gig.gigID)),
    };
  });

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">ACCOUNT</p>
          <h1>My account</h1>
          <p>{isFreelancer ? 'Your profile, your gigs and the income they have earned.' : isClient ? 'Your profile, your bookings and your payments.' : 'Your HustleHub+ profile.'}</p>
        </div>
      </header>

      <section className="panel" aria-labelledby="profile-heading">
        <h2 id="profile-heading">Profile</h2>
        <dl className="session-details">
          <div><dt>Username</dt><dd>{session.username}</dd></div>
          <div><dt>Account type</dt><dd>{roleLabel(session.role)}</dd></div>
          <div><dt>Session ends</dt><dd>{formatTime(session.expiresAt)}</dd></div>
        </dl>
      </section>

      {error && <div className="notice error" role="status">{error}</div>}

      {(isFreelancer || isClient) && (isLoading ? (
        <p className="empty-state" role="status">Loading your account…</p>
      ) : (
        <>
          <dl className="summary-grid">
            {isFreelancer ? (
              <>
                <div><dt>Income received</dt><dd>{formatCurrency(received)}</dd></div>
                <div><dt>Pending income</dt><dd>{formatCurrency(pending)}</dd></div>
                <div><dt>Bookings</dt><dd>{account.bookings.length}</dd></div>
                <div><dt>Gigs listed</dt><dd>{account.gigs.length}</dd></div>
              </>
            ) : (
              <>
                <div><dt>Total paid</dt><dd>{formatCurrency(received)}</dd></div>
                <div><dt>Outstanding</dt><dd>{formatCurrency(pending)}</dd></div>
                <div><dt>Bookings</dt><dd>{account.bookings.length}</dd></div>
              </>
            )}
          </dl>

          {isFreelancer && (
            <section className="panel" aria-labelledby="income-heading">
              <h2 id="income-heading">Income by gig</h2>
              {incomeByGig.length === 0 ? (
                <p className="panel-empty">You have not created any gigs yet.</p>
              ) : (
                <div className="table-scroll">
                  <table className="data-table">
                    <thead>
                      <tr><th scope="col">Gig</th><th scope="col">Rate</th><th scope="col">Bookings</th><th scope="col">Hours</th><th scope="col">Received</th></tr>
                    </thead>
                    <tbody>
                      {incomeByGig.map((row) => (
                        <tr key={row.gig.gigID}>
                          <th scope="row">{row.gig.stageName}{!row.gig.isAvailable && <span className="gig-badge muted">Not available</span>}</th>
                          <td>{formatCurrency(row.gig.costPerHour)} / hour</td>
                          <td>{row.bookings}</td>
                          <td>{row.hours}</td>
                          <td>{formatCurrency(row.received)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          <section className="panel" aria-labelledby="bookings-heading">
            <h2 id="bookings-heading">{isFreelancer ? 'Bookings for my gigs' : 'My bookings'}</h2>
            {account.bookings.length === 0 ? (
              <p className="panel-empty">No bookings yet.</p>
            ) : (
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr><th scope="col">Event</th><th scope="col">Date</th><th scope="col">{isFreelancer ? 'Client' : 'Gig'}</th><th scope="col">Amount</th><th scope="col">Status</th></tr>
                  </thead>
                  <tbody>
                    {account.bookings.map((booking) => (
                      <tr key={booking.bookingID}>
                        <th scope="row">{booking.eventName}</th>
                        <td>{formatDateTime(booking.dateTimeToPerform)}</td>
                        <td>{isFreelancer ? booking.usernameClient : gigsByID[booking.gigID]?.stageName ?? 'No longer listed'}</td>
                        <td>{formatCurrency(isPaid(booking) && booking.paymentReceived > 0 ? booking.paymentReceived : bookingValue(booking))}</td>
                        <td><span className={isPaid(booking) ? 'gig-badge paid' : 'gig-badge muted'}>{isPaid(booking) ? 'Paid' : 'Awaiting payment'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="panel" aria-labelledby="payments-heading">
            <h2 id="payments-heading">Payment history</h2>
            {sortedTransactions.length === 0 ? (
              <p className="panel-empty">No payments yet.</p>
            ) : (
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr><th scope="col">Date</th><th scope="col">{isFreelancer ? 'From' : 'To'}</th><th scope="col">Gig</th><th scope="col">Amount</th></tr>
                  </thead>
                  <tbody>
                    {sortedTransactions.map((transaction) => (
                      <tr key={transaction.transactionID}>
                        <td>{formatDateTime(transaction.createdAt)}</td>
                        <td>{isFreelancer ? transaction.usernameClient : transaction.usernamePerformer}</td>
                        <td>{gigsByID[transaction.gigID]?.stageName ?? 'No longer listed'}</td>
                        <td>{formatCurrency(transaction.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      ))}
    </main>
  );
}
