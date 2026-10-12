import { useId, useState } from 'react';
import FieldError from './FieldError';
import { validateText } from '../services/validation';

const emptyGig = {
  gigType: '',
  stageName: '',
  description: '',
  costPerHour: '',
  isAvailable: true,
};

function toFormValues(gig) {
  if (!gig) return emptyGig;
  return {
    gigType: gig.gigType,
    stageName: gig.stageName,
    description: gig.description,
    costPerHour: String(gig.costPerHour),
    isAvailable: gig.isAvailable,
  };
}

export default function GigForm({ initialGig, submitLabel, onSubmit, onCancel }) {
  const formId = useId();
  const [values, setValues] = useState(() => toFormValues(initialGig));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    const nextErrors = {};
    const costPerHour = Number(values.costPerHour);

    const gigTypeError = validateText(values.gigType, 'gig type');
    if (gigTypeError) nextErrors.gigType = gigTypeError;

    const stageNameError = validateText(values.stageName, 'stage name');
    if (stageNameError) nextErrors.stageName = stageNameError;

    const descriptionError = validateText(values.description, 'description');
    if (descriptionError) nextErrors.description = descriptionError;

    if (values.costPerHour === '' || !Number.isFinite(costPerHour) || costPerHour < 0) nextErrors.costPerHour = 'Enter a cost per hour of 0 or more.';
    return nextErrors;
  }

  function updateValue(event) {
    const { name, value, type, checked } = event.target;
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
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
        gigType: values.gigType.trim(),
        stageName: values.stageName.trim(),
        description: values.description.trim(),
        costPerHour: Number(values.costPerHour),
        isAvailable: values.isAvailable,
      });
    } catch (error) {
      setFormError(error.message);
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {formError && <div className="notice error" role="status">{formError}</div>}

      <label htmlFor={`${formId}-gigType`}>Gig type</label>
      <input id={`${formId}-gigType`} name="gigType" type="text" value={values.gigType} onChange={updateValue} aria-invalid={Boolean(errors.gigType)} aria-describedby={errors.gigType ? `${formId}-gigType-error` : undefined} placeholder="e.g. DJ, Photography, Live band" />
      <div id={`${formId}-gigType-error`}><FieldError>{errors.gigType}</FieldError></div>

      <label htmlFor={`${formId}-stageName`}>Stage name</label>
      <input id={`${formId}-stageName`} name="stageName" type="text" value={values.stageName} onChange={updateValue} aria-invalid={Boolean(errors.stageName)} aria-describedby={errors.stageName ? `${formId}-stageName-error` : undefined} placeholder="e.g. DJ Sunset" />
      <div id={`${formId}-stageName-error`}><FieldError>{errors.stageName}</FieldError></div>

      <label htmlFor={`${formId}-description`}>Description</label>
      <textarea id={`${formId}-description`} name="description" value={values.description} onChange={updateValue} aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? `${formId}-description-error` : undefined} placeholder="Tell clients what you offer" />
      <div id={`${formId}-description-error`}><FieldError>{errors.description}</FieldError></div>

      <label htmlFor={`${formId}-costPerHour`}>Cost per hour (R)</label>
      <input id={`${formId}-costPerHour`} name="costPerHour" type="number" min="0" step="0.01" inputMode="decimal" value={values.costPerHour} onChange={updateValue} aria-invalid={Boolean(errors.costPerHour)} aria-describedby={errors.costPerHour ? `${formId}-costPerHour-error` : undefined} placeholder="e.g. 250" />
      <div id={`${formId}-costPerHour-error`}><FieldError>{errors.costPerHour}</FieldError></div>

      <label className="checkbox-row"><input name="isAvailable" type="checkbox" checked={values.isAvailable} onChange={updateValue} /> <span>Available for bookings</span></label>

      <div className="form-actions">
        <button className="primary-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Please wait…' : submitLabel}</button>
        <button className="secondary-button" type="button" onClick={onCancel} disabled={isSubmitting}>Cancel</button>
      </div>
    </form>
  );
}
