import { useId, useState } from 'react';
import FieldError from './FieldError';
import { bookingTotal, formatCurrency } from '../services/pricing';
import { validateText } from '../services/validation';

const emptyBooking = {
  eventName: '',
  venue: '',
  dateTimeToPerform: '',
  numOfHours: '',
  capacity: '',
};

const MIN_HOURS = 0.5;
const MAX_HOURS = 24;

export default function BookingForm({ gig, onSubmit, onCancel }) {
  const formId = useId();
  const [values, setValues] = useState(emptyBooking);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hours = Number(values.numOfHours);
  const hasValidHours = values.numOfHours !== '' && Number.isFinite(hours) && hours >= MIN_HOURS && hours <= MAX_HOURS;

  function validate() {
    const nextErrors = {};
    const capacity = Number(values.capacity);
    const performanceDate = new Date(values.dateTimeToPerform);

    const eventNameError = validateText(values.eventName, 'event name');
    if (eventNameError) nextErrors.eventName = eventNameError;

    const venueError = validateText(values.venue, 'venue');
    if (venueError) nextErrors.venue = venueError;

    if (!values.dateTimeToPerform || Number.isNaN(performanceDate.getTime())) nextErrors.dateTimeToPerform = 'Choose the date and time of the event.';
    else if (performanceDate <= new Date()) nextErrors.dateTimeToPerform = 'Choose a date and time in the future.';

    if (!hasValidHours) nextErrors.numOfHours = `Enter between ${MIN_HOURS} and ${MAX_HOURS} hours.`;
    if (values.capacity === '' || !Number.isInteger(capacity) || capacity < 1) nextErrors.capacity = 'Enter the number of guests (at least 1).';
    return nextErrors;
  }

  function updateValue(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError('');
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        eventName: values.eventName.trim(),
        venue: values.venue.trim(),
        dateTimeToPerform: new Date(values.dateTimeToPerform).toISOString(),
        numOfHours: hours,
        capacity: Number(values.capacity),
      });
    } catch (error) {
      setFormError(error.message);
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {formError && <div className="notice error" role="status">{formError}</div>}

      <label htmlFor={`${formId}-eventName`}>Event name</label>
      <input id={`${formId}-eventName`} name="eventName" type="text" value={values.eventName} onChange={updateValue} aria-invalid={Boolean(errors.eventName)} aria-describedby={errors.eventName ? `${formId}-eventName-error` : undefined} placeholder="e.g. Sarah and Tom wedding" />
      <div id={`${formId}-eventName-error`}><FieldError>{errors.eventName}</FieldError></div>

      <label htmlFor={`${formId}-venue`}>Venue</label>
      <input id={`${formId}-venue`} name="venue" type="text" value={values.venue} onChange={updateValue} aria-invalid={Boolean(errors.venue)} aria-describedby={errors.venue ? `${formId}-venue-error` : undefined} placeholder="e.g. Lourensford Wine Estate" />
      <div id={`${formId}-venue-error`}><FieldError>{errors.venue}</FieldError></div>

      <label htmlFor={`${formId}-dateTimeToPerform`}>Date and time</label>
      <input id={`${formId}-dateTimeToPerform`} name="dateTimeToPerform" type="datetime-local" value={values.dateTimeToPerform} onChange={updateValue} aria-invalid={Boolean(errors.dateTimeToPerform)} aria-describedby={errors.dateTimeToPerform ? `${formId}-dateTimeToPerform-error` : undefined} />
      <div id={`${formId}-dateTimeToPerform-error`}><FieldError>{errors.dateTimeToPerform}</FieldError></div>

      <label htmlFor={`${formId}-numOfHours`}>Number of hours</label>
      <input id={`${formId}-numOfHours`} name="numOfHours" type="number" min={MIN_HOURS} max={MAX_HOURS} step="0.5" inputMode="decimal" value={values.numOfHours} onChange={updateValue} aria-invalid={Boolean(errors.numOfHours)} aria-describedby={errors.numOfHours ? `${formId}-numOfHours-error` : undefined} placeholder="e.g. 3" />
      <div id={`${formId}-numOfHours-error`}><FieldError>{errors.numOfHours}</FieldError></div>

      <label htmlFor={`${formId}-capacity`}>Number of guests</label>
      <input id={`${formId}-capacity`} name="capacity" type="number" min="1" step="1" inputMode="numeric" value={values.capacity} onChange={updateValue} aria-invalid={Boolean(errors.capacity)} aria-describedby={errors.capacity ? `${formId}-capacity-error` : undefined} placeholder="e.g. 80" />
      <div id={`${formId}-capacity-error`}><FieldError>{errors.capacity}</FieldError></div>

      <p className="booking-total" aria-live="polite">
        {hasValidHours
          ? <>Total: <strong>{formatCurrency(bookingTotal(gig.costPerHour, hours))}</strong> ({formatCurrency(gig.costPerHour)} × {hours} {hours === 1 ? 'hour' : 'hours'})</>
          : <>Total: {formatCurrency(gig.costPerHour)} per hour</>}
      </p>

      <div className="form-actions">
        <button className="primary-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Please wait…' : 'Create booking'}</button>
        <button className="secondary-button" type="button" onClick={onCancel} disabled={isSubmitting}>Cancel</button>
      </div>
    </form>
  );
}
