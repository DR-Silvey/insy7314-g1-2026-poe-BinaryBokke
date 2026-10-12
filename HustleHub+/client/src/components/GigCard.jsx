import { useState } from 'react';

const currency = new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' });

export default function GigCard({ gig, canManage, onEdit, onDelete }) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function confirmDelete() {
    setIsDeleting(true);
    await onDelete(gig);
    setIsDeleting(false);
    setIsConfirmingDelete(false);
  }

  return (
    <li className="gig-card">
      <div className="gig-card-top">
        <span className="gig-badge">{gig.gigType}</span>
        {!gig.isAvailable && <span className="gig-badge muted">Not available</span>}
      </div>
      <h3>{gig.stageName}</h3>
      <p className="gig-performer">by {gig.usernamePerformer}</p>
      <p className="gig-description">{gig.description}</p>
      <p className="gig-price"><strong>{currency.format(gig.costPerHour)}</strong> per hour</p>

      {canManage && (isConfirmingDelete ? (
        <div className="gig-actions">
          <span>Delete this gig?</span>
          <button className="danger-button" type="button" onClick={confirmDelete} disabled={isDeleting}>{isDeleting ? 'Deleting…' : 'Yes, delete'}</button>
          <button className="secondary-button" type="button" onClick={() => setIsConfirmingDelete(false)} disabled={isDeleting}>Cancel</button>
        </div>
      ) : (
        <div className="gig-actions">
          <button className="secondary-button" type="button" onClick={() => onEdit(gig)} aria-label={`Edit ${gig.stageName}`}>Edit</button>
          <button className="secondary-button" type="button" onClick={() => setIsConfirmingDelete(true)} aria-label={`Delete ${gig.stageName}`}>Delete</button>
        </div>
      ))}
    </li>
  );
}
