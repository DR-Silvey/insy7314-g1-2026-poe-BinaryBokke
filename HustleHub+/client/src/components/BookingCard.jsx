import { useState } from 'react';
import { formatCurrency } from '../services/pricing';

function formatDateTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date not set' : date.toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function BookingCard({ booking, gig, viewerRole, amountDue, canManage, onPay, onCancel }) {
  const [step, setStep] = useState('idle');
  const [isWorking, setIsWorking] = useState(false);
  const isPaid = booking.paymentReceived > 0;
  const otherParty = viewerRole === 'freelancer' ? { label: 'Client', name: booking.usernameClient } : { label: 'Freelancer', name: booking.usernamePerformer };
  const amount = isPaid ? booking.paymentReceived : amountDue;

  async function run(action) {
    setIsWorking(true);
    await action(booking, amountDue);
    setIsWorking(false);
    setStep('idle');
  }

  return (
    <li className="gig-card booking-card">
      <div className="gig-card-top">
        <span className={isPaid ? 'gig-badge paid' : 'gig-badge muted'}>{isPaid ? 'Paid' : 'Awaiting payment'}</span>
        {gig && <span className="gig-badge">{gig.gigType}</span>}
      </div>
      <h3>{booking.eventName}</h3>
      <p className="gig-performer">{gig ? gig.stageName : 'This gig is no longer listed'}</p>

      <dl className="booking-details">
        <div><dt>Date</dt><dd>{formatDateTime(booking.dateTimeToPerform)}</dd></div>
        <div><dt>Venue</dt><dd>{booking.venue}</dd></div>
        <div><dt>Guests</dt><dd>{booking.capacity}</dd></div>
        <div><dt>Hours</dt><dd>{booking.numOfHours}</dd></div>
        <div><dt>{otherParty.label}</dt><dd>{otherParty.name}</dd></div>
        <div><dt>{isPaid ? 'Amount paid' : 'Amount due'}</dt><dd>{amount === null ? 'Price unavailable' : formatCurrency(amount)}</dd></div>
      </dl>

      {canManage && !isPaid && step === 'idle' && (
        <div className="gig-actions">
          {amountDue !== null && <button className="primary-button" type="button" onClick={() => setStep('paying')}>Pay {formatCurrency(amountDue)}</button>}
          <button className="secondary-button" type="button" onClick={() => setStep('cancelling')} aria-label={`Cancel ${booking.eventName}`}>Cancel booking</button>
        </div>
      )}

      {step === 'paying' && (
        <div className="payment-panel" role="group" aria-label="Confirm payment">
          <p><strong>Simulated payment</strong></p>
          <p>You are about to pay {formatCurrency(amountDue)} to {booking.usernamePerformer} for {booking.eventName}. No real money is charged and no card details are needed.</p>
          <div className="gig-actions">
            <button className="primary-button" type="button" onClick={() => run(onPay)} disabled={isWorking}>{isWorking ? 'Processing…' : 'Confirm payment'}</button>
            <button className="secondary-button" type="button" onClick={() => setStep('idle')} disabled={isWorking}>Back</button>
          </div>
        </div>
      )}

      {step === 'cancelling' && (
        <div className="gig-actions">
          <span>Cancel this booking?</span>
          <button className="danger-button" type="button" onClick={() => run(onCancel)} disabled={isWorking}>{isWorking ? 'Cancelling…' : 'Yes, cancel'}</button>
          <button className="secondary-button" type="button" onClick={() => setStep('idle')} disabled={isWorking}>Keep booking</button>
        </div>
      )}
    </li>
  );
}
