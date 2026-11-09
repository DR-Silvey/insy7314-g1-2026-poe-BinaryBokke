import { useId, useState } from 'react';
import { forgotPassword, resetPassword } from '../services/authApi';
import { EMAIL_PATTERN, MIN_PASSWORD_LENGTH, validatePassword } from '../services/validation';
import FieldError from './FieldError';

const STEP_TEXT = {
  forgot: { eyebrow: 'FORGOT PASSWORD', heading: 'Reset your password', intro: 'Enter the email address on your account and we will send you a link to choose a new password.', button: 'Send reset link' },
  reset: { eyebrow: 'NEW PASSWORD', heading: 'Choose a new password', intro: 'Your reset link works for 15 minutes. Choose a password you have not used before.', button: 'Save new password' },
};

export default function PasswordReset({ step, onDone, onBack, onRequestNewLink }) {
  const formId = useId();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [linkFailed, setLinkFailed] = useState(false);
  const text = STEP_TEXT[step.type];
  const isForgot = step.type === 'forgot';

  function validate() {
    const nextErrors = {};
    if (isForgot) {
      if (!EMAIL_PATTERN.test(email.trim())) nextErrors.email = 'Enter a valid email address, e.g. you@example.com.';
      return nextErrors;
    }
    const passwordError = validatePassword(newPassword);
    if (passwordError) nextErrors.newPassword = passwordError;
    if (newPassword !== confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.';
    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setNotice(null);
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setIsSubmitting(true);
    try {
      if (isForgot) {
        const result = await forgotPassword({ email: email.trim() });
        setNotice({ type: 'success', text: result.message ?? 'If an account exists with that email, a password reset link will be sent.' });
        setEmail('');
      } else {
        const result = await resetPassword({ token: step.token, newPassword, confirmPassword });
        onDone(result.message ?? 'Password successfully reset. You can now log in.');
      }
    } catch (error) {
      if (!isForgot && /invalid|expired/i.test(error.message)) setLinkFailed(true);
      setNotice({ type: 'error', text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <header>
        <p className="eyebrow">{text.eyebrow}</p>
        <h2>{text.heading}</h2>
        <p>{text.intro}</p>
      </header>

      {notice && <div className={`notice ${notice.type}`} role="status">{notice.text}</div>}

      <form onSubmit={handleSubmit} noValidate>
        {isForgot ? (
          <>
            <label htmlFor={`${formId}-email`}>Email address</label>
            <input id={`${formId}-email`} name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? `${formId}-email-error` : undefined} placeholder="you@example.com" />
            <div id={`${formId}-email-error`}><FieldError>{errors.email}</FieldError></div>
          </>
        ) : (
          <>
            <label htmlFor={`${formId}-new-password`}>New password</label>
            <div className="password-control">
              <input id={`${formId}-new-password`} name="newPassword" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} aria-invalid={Boolean(errors.newPassword)} aria-describedby={errors.newPassword ? `${formId}-new-password-error` : undefined} placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`} />
              <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={`${showPassword ? 'Hide' : 'Show'} password`}>{showPassword ? 'Hide' : 'Show'}</button>
            </div>
            <div id={`${formId}-new-password-error`}><FieldError>{errors.newPassword}</FieldError></div>
            <label htmlFor={`${formId}-confirm-password`}>Confirm new password</label>
            <input id={`${formId}-confirm-password`} name="confirmPassword" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} aria-invalid={Boolean(errors.confirmPassword)} aria-describedby={errors.confirmPassword ? `${formId}-confirm-password-error` : undefined} placeholder="Re-enter your new password" />
            <div id={`${formId}-confirm-password-error`}><FieldError>{errors.confirmPassword}</FieldError></div>
          </>
        )}

        <button className="primary-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Please wait…' : text.button}</button>
      </form>

      {linkFailed ? (
        <p className="switch-copy">Link not working? <button type="button" onClick={onRequestNewLink}>Request a new link</button></p>
      ) : (
        <p className="switch-copy">Remembered it? <button type="button" onClick={onBack}>Back to sign in</button></p>
      )}
    </>
  );
}
