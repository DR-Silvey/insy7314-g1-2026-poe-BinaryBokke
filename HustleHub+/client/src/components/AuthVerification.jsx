import { useId, useState } from 'react';
import { classifyDevice, resendEmailCode, resendLoginCode, verifyEmail, verifyLoginOtp } from '../services/authApi';
import FieldError from './FieldError';

const CODE_PATTERN = /^\d{6}$/;

const LOCATION_OPTIONS = [
  { value: 'HOME', label: 'Home', description: 'A browser I use at home. No code needed for 7 days.' },
  { value: 'WORK', label: 'Work', description: 'A browser I use at work. No code needed for 7 days.' },
  { value: 'AWAY', label: 'Away', description: 'Any other browser. A code is needed every time I sign in.' },
];

const STEP_TEXT = {
  email: { eyebrow: 'VERIFY YOUR EMAIL', heading: 'Check your email', intro: 'We sent a 6-digit code to the email address on your account. Enter it to finish creating your account.', button: 'Verify email' },
  login: { eyebrow: 'TWO-STEP SIGN IN', heading: 'Enter your sign-in code', intro: 'We sent a 6-digit code to your email. It expires after 5 minutes.', button: 'Verify code' },
  device: { eyebrow: 'RECOGNISE THIS BROWSER', heading: 'Where are you signing in from?', intro: 'Choose how HustleHub+ should treat this browser next time you sign in.', button: 'Continue' },
};

function mustRestart(error) {
  return error.status === 429 || (error.status === 401 && error.data?.attemptsRemaining === undefined) || /log in again/i.test(error.message);
}

export default function AuthVerification({ step, onResult, onEmailVerified, onRestart }) {
  const formId = useId();
  const [code, setCode] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const text = STEP_TEXT[step.type];
  const isDevice = step.type === 'device';

  async function handleResend() {
    setNotice(null);
    setIsResending(true);

    try {
      const result = step.type === 'email' ? await resendEmailCode({ username: step.username }) : await resendLoginCode({ temporaryToken: step.temporaryToken });
      setNotice({ type: 'success', text: result.message ?? 'A new code has been sent to your email.' });
      setCode('');
    } catch (failure) {
      if (failure.status === 401) {
        onRestart(failure.message);
        return;
      }
      setNotice({ type: 'error', text: failure.message });
    } finally {
      setIsResending(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setNotice(null);

    if (isDevice && !location) return setError('Choose Home, Work or Away.');
    if (!isDevice && !CODE_PATTERN.test(code)) return setError('Enter the 6-digit code from your email.');
    setError('');

    setIsSubmitting(true);
    try {
      if (step.type === 'email') {
        await verifyEmail({ username: step.username, otp: code });
        onEmailVerified();
      } else if (step.type === 'login') {
        onResult(await verifyLoginOtp({ otp: code, temporaryToken: step.temporaryToken }));
      } else {
        onResult(await classifyDevice({ classificationToken: step.classificationToken, location }));
      }
    } catch (failure) {
      if (step.type !== 'email' && mustRestart(failure)) {
        onRestart(failure.message);
        return;
      }
      const attemptsLeft = failure.data?.attemptsRemaining;
      setNotice({ type: 'error', text: failure.data?.slotAlreadyUsed ? `${failure.message} Choose another option, or Away.` : attemptsLeft !== undefined ? `${failure.message.replace(/\.$/, '')}. ${attemptsLeft} ${attemptsLeft === 1 ? 'attempt' : 'attempts'} left.` : failure.message });
      setCode('');
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
        {isDevice ? (
          <fieldset className="role-options" aria-describedby={error ? `${formId}-error` : undefined}>
            <legend>This browser is</legend>
            {LOCATION_OPTIONS.map((option) => (
              <label key={option.value} className={location === option.value ? 'role-option selected' : 'role-option'}>
                <input name="location" type="radio" value={option.value} checked={location === option.value} onChange={(event) => { setLocation(event.target.value); setError(''); }} />
                <span><strong>{option.label}</strong>{option.description}</span>
              </label>
            ))}
          </fieldset>
        ) : (
          <>
            <label htmlFor={`${formId}-code`}>Verification code</label>
            <input id={`${formId}-code`} className="code-input" name="code" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(event) => { setCode(event.target.value.replace(/\D/g, '')); setError(''); }} aria-invalid={Boolean(error)} aria-describedby={error ? `${formId}-error` : undefined} placeholder="123456" />
          </>
        )}
        <div id={`${formId}-error`}><FieldError>{error}</FieldError></div>

        <button className="primary-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Please wait…' : text.button}</button>
      </form>

      {!isDevice && <p className="switch-copy">Did not get the code? <button type="button" onClick={handleResend} disabled={isResending}>{isResending ? 'Sending…' : 'Send a new code'}</button></p>}
      <p className="switch-copy">{step.type === 'email' ? 'Verified already?' : 'Something wrong?'} <button type="button" onClick={() => onRestart(null)}>Back to sign in</button></p>
    </>
  );
}
