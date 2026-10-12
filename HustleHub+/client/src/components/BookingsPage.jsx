import { useEffect, useState } from 'react';
import BookingCard from './BookingCard';
import { deleteBooking, getBookings, updateBooking } from '../services/bookingApi';
import { getGigs } from '../services/gigApi';
import { bookingTotal, formatCurrency } from '../services/pricing';

const BOOKING_ROLES = ['client', 'freelancer', 'admin'];

function bookingFilters(session) {
  if (session.role === 'client') return { usernameClient: session.username };
  if (session.role === 'freelancer') return { usernamePerformer: session.username };
  return {};
}

export default function BookingsPage({ session, onSessionExpired }) {
  const [bookings, setBookings] = useState([]);
  const [gigsByID, setGigsByID] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState(null);
  const canUseBookings = BOOKING_ROLES.includes(session.role);
  const isClient = session.role === 'client';

  useEffect(() => {
    if (!canUseBookings) {
      setIsLoading(false);
      return undefined;
    }

    let isCurrent = true;

    Promise.all([getBookings(bookingFilters(session)), getGigs()])
      .then(([bookingResults, gigResults]) => {
        if (!isCurrent) return;
        setBookings([...bookingResults].sort((first, second) => new Date(first.dateTimeToPerform) - new Date(second.dateTimeToPerform)));
        setGigsByID(Object.fromEntries(gigResults.map((gig) => [gig.gigID, gig])));
      })
      .catch((error) => {
        if (isCurrent) setNotice({ type: 'error', text: error.message });
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [canUseBookings, session]);

  function amountDueFor(booking) {
    const gig = gigsByID[booking.gigID];
    return gig ? bookingTotal(gig.costPerHour, booking.numOfHours) : null;
  }

  function handleFailure(error) {
    if (error.status === 401) {
      onSessionExpired();
      return;
    }

    setNotice({ type: 'error', text: error.message });
  }

  async function handlePay(booking, amount) {
    setNotice(null);
    try {
      const updated = await updateBooking(session.token, { ...booking, paymentReceived: amount });
      setBookings((current) => current.map((item) => (item.bookingID === booking.bookingID ? updated : item)));
      setNotice({ type: 'success', text: `Payment of ${formatCurrency(amount)} received. Your booking for ${booking.eventName} is confirmed.` });
    } catch (error) {
      handleFailure(error);
    }
  }

  async function handleCancel(booking) {
    setNotice(null);
    try {
      await deleteBooking(session.token, booking.bookingID);
      setBookings((current) => current.filter((item) => item.bookingID !== booking.bookingID));
      setNotice({ type: 'success', text: `Your booking for ${booking.eventName} has been cancelled.` });
    } catch (error) {
      handleFailure(error);
    }
  }

  const paidBookings = bookings.filter((booking) => booking.paymentReceived > 0);
  const totalPaid = paidBookings.reduce((total, booking) => total + booking.paymentReceived, 0);

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">BOOKINGS</p>
          <h1>{isClient ? 'My bookings' : session.role === 'freelancer' ? 'Bookings for my gigs' : 'Bookings'}</h1>
          <p>{isClient ? 'Pay for your bookings to confirm them with the freelancer.' : 'See who has booked your services and which bookings have been paid.'}</p>
        </div>
      </header>

      {notice && <div className={`notice ${notice.type}`} role="status">{notice.text}</div>}

      {!canUseBookings ? (
        <p className="empty-state">Bookings are available to client and freelancer accounts. Your General account can still browse gigs.</p>
      ) : isLoading ? (
        <p className="empty-state" role="status">Loading bookings…</p>
      ) : (
        <>
          <dl className="summary-grid">
            <div><dt>Bookings</dt><dd>{bookings.length}</dd></div>
            <div><dt>Awaiting payment</dt><dd>{bookings.length - paidBookings.length}</dd></div>
            <div><dt>{isClient ? 'Total paid' : 'Total earned'}</dt><dd>{formatCurrency(totalPaid)}</dd></div>
          </dl>

          {bookings.length === 0 ? (
            <p className="empty-state">{isClient ? 'You have not made any bookings yet. Book a gig from the Gigs page.' : 'No bookings yet.'}</p>
          ) : (
            <ul className="gig-grid">
              {bookings.map((booking) => (
                <BookingCard key={booking.bookingID} booking={booking} gig={gigsByID[booking.gigID]} viewerRole={session.role} amountDue={amountDueFor(booking)} canManage={isClient && booking.usernameClient === session.username} onPay={handlePay} onCancel={handleCancel} />
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}
