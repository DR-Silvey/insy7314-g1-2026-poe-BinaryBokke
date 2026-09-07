import { useId, useState } from 'react';
import { loginUser, registerUser } from '../services/authApi';

const initialRegistration = {
  username: '',
  fullname: '',
  email: '',
  age: '',
  password: '',
  confirmPassword: '',
  acceptedTerms: false,
};

const initialLogin = { username: '', password: '' };

function EyeIcon({ visible }) {
  return visible ? 'Hide' : 'Show';
}

function FieldError({ children }) {
  return children ? <p className="field-error" role="alert">{children}</p> : null;
}

export default function AuthPage({ mode, onModeChange }) {
  const registerFormId = useId();
  const loginFormId = useId();
  const [registerValues, setRegisterValues] = useState(initialRegistration);
  const [loginValues, setLoginValues] = useState(initialLogin);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isRegistration = mode === 'register';

  function switchMode(nextMode) {
    setErrors({});
    setNotice('');
    setShowPassword(false);
    onModeChange(nextMode);
  }

  function validateRegistration() {
    const nextErrors = {};
    const { username, fullname, email, age, password, confirmPassword, acceptedTerms } = registerValues;

    if (username.trim().length < 3) nextErrors.username = 'Choose a username with at least 3 characters.';
    if (fullname.trim().length < 2) nextErrors.fullname = 'Enter your full name.';
    if (!email.trim()) nextErrors.email = 'Enter your email address.';
    if (!Number.isInteger(Number(age)) || Number(age) < 1 || Number(age) > 120) nextErrors.age = 'Enter a valid age.';
    if (password.length < 12) nextErrors.password = 'Choose a password with at least 12 characters.';
    if (password !== confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.';
    if (!acceptedTerms) nextErrors.acceptedTerms = 'Please accept the terms to continue.';
    return nextErrors;
  }

  function validateLogin() {
    const nextErrors = {};
    if (!loginValues.username.trim()) nextErrors.username = 'Enter your username.';
    if (!loginValues.password) nextErrors.password = 'Enter your password.';
    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setNotice('');
    const nextErrors = isRegistration ? validateRegistration() : validateLogin();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setIsSubmitting(true);
    try {
      if (isRegistration) {
        await registerUser({
          username: registerValues.username.trim(),
          fullname: registerValues.fullname.trim(),
          email: registerValues.email.trim(),
          age: Number(registerValues.age),
          password: registerValues.password,
        });
        setRegisterValues(initialRegistration);
        setNotice('Your account has been created. You can now sign in.');
        onModeChange('login');
      } else {
        const result = await loginUser({
          username: loginValues.username.trim(),
          password: loginValues.password,
        });

        if (result.token) sessionStorage.setItem('hustlehub_token', result.token);
        setNotice('You are signed in successfully.');
        setLoginValues(initialLogin);
      }
    } catch (error) {
      setNotice(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const values = isRegistration ? registerValues : loginValues;
  const setValues = isRegistration ? setRegisterValues : setLoginValues;

  function updateValue(event) {
    const { name, value, type, checked } = event.target;
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  }

  return (
    <main className="auth-shell">
      <section className="form-panel" id="top">
        <div className="auth-card">
          <a className="simple-brand" href="#top" aria-label="HustleHub+ home">
            <span aria-hidden="true">H+</span> HustleHub<strong>+</strong>
          </a>
          <div className="mode-switch" role="tablist" aria-label="Authentication options">
            <button className={!isRegistration ? 'active' : ''} type="button" role="tab" aria-selected={!isRegistration} onClick={() => switchMode('login')}>Sign in</button>
            <button className={isRegistration ? 'active' : ''} type="button" role="tab" aria-selected={isRegistration} onClick={() => switchMode('register')}>Create account</button>
          </div>

          <header>
            <p className="eyebrow">{isRegistration ? 'GET STARTED' : 'WELCOME BACK'}</p>
            <h2>{isRegistration ? 'Create your account' : 'Sign in to HustleHub+'}</h2>
            <p>{isRegistration ? 'Join the marketplace and start your next chapter.' : 'Enter your details to continue to your workspace.'}</p>
          </header>

          {notice && <div className={notice.startsWith('Your account') || notice.startsWith('You are') ? 'notice success' : 'notice error'} role="status">{notice}</div>}

          <form onSubmit={handleSubmit} noValidate>
            {isRegistration && <>
              <label htmlFor={`${registerFormId}-username`}>Username</label>
              <input id={`${registerFormId}-username`} name="username" type="text" autoComplete="username" value={values.username} onChange={updateValue} aria-invalid={Boolean(errors.username)} aria-describedby={errors.username ? `${registerFormId}-username-error` : undefined} placeholder="e.g. John Doe" />
              <div id={`${registerFormId}-username-error`}><FieldError>{errors.username}</FieldError></div>
              <label htmlFor={`${registerFormId}-fullname`}>Full name</label>
              <input id={`${registerFormId}-fullname`} name="fullname" type="text" autoComplete="name" value={values.fullname} onChange={updateValue} aria-invalid={Boolean(errors.fullname)} aria-describedby={errors.fullname ? `${registerFormId}-fullname-error` : undefined} placeholder="e.g. John Doe" />
              <div id={`${registerFormId}-fullname-error`}><FieldError>{errors.fullname}</FieldError></div>
            </>}

            {isRegistration ? <>
              <label htmlFor={`${registerFormId}-email`}>Email address</label>
              <input id={`${registerFormId}-email`} name="email" type="email" autoComplete="email" value={values.email} onChange={updateValue} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} placeholder="you@example.com" />
              <div id="email-error"><FieldError>{errors.email}</FieldError></div>
              <label htmlFor={`${registerFormId}-age`}>Age</label>
              <input id={`${registerFormId}-age`} name="age" type="number" min="1" max="120" inputMode="numeric" value={values.age} onChange={updateValue} aria-invalid={Boolean(errors.age)} aria-describedby={errors.age ? 'age-error' : undefined} placeholder="18" />
              <div id="age-error"><FieldError>{errors.age}</FieldError></div>
            </> : <>
              <label htmlFor={`${loginFormId}-username`}>Username</label>
              <input id={`${loginFormId}-username`} name="username" type="text" autoComplete="username" value={values.username} onChange={updateValue} aria-invalid={Boolean(errors.username)} aria-describedby={errors.username ? 'username-error' : undefined} placeholder="Enter your username" />
              <div id="username-error"><FieldError>{errors.username}</FieldError></div>
            </>}

            <label htmlFor={`${isRegistration ? registerFormId : loginFormId}-password`}>Password</label>
            <div className="password-control">
              <input id={`${isRegistration ? registerFormId : loginFormId}-password`} name="password" type={showPassword ? 'text' : 'password'} autoComplete={isRegistration ? 'new-password' : 'current-password'} value={values.password} onChange={updateValue} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'password-error' : undefined} placeholder={isRegistration ? 'At least 12 characters' : 'Enter your password'} />
              <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={`${showPassword ? 'Hide' : 'Show'} password`}><EyeIcon visible={showPassword} /></button>
            </div>
            <div id="password-error"><FieldError>{errors.password}</FieldError></div>

            {isRegistration && <>
              <label htmlFor={`${registerFormId}-confirm-password`}>Confirm password</label>
              <input id={`${registerFormId}-confirm-password`} name="confirmPassword" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={values.confirmPassword} onChange={updateValue} aria-invalid={Boolean(errors.confirmPassword)} aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined} placeholder="Re-enter your password" />
              <div id="confirm-password-error"><FieldError>{errors.confirmPassword}</FieldError></div>
              <label className="checkbox-row"><input name="acceptedTerms" type="checkbox" checked={values.acceptedTerms} onChange={updateValue} /> <span>I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.</span></label>
              <FieldError>{errors.acceptedTerms}</FieldError>
            </>}

            {!isRegistration && <div className="forgot-row"><label className="checkbox-row"><input type="checkbox" /> <span>Remember me</span></label><a href="#reset">Forgot password?</a></div>}
            <button className="primary-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Please wait…' : isRegistration ? 'Create account' : 'Sign in'}</button>
          </form>

          <p className="switch-copy">{isRegistration ? 'Already have an account?' : 'New to HustleHub+'} <button type="button" onClick={() => switchMode(isRegistration ? 'login' : 'register')}>{isRegistration ? 'Sign in' : 'Create an account'}</button></p>
        </div>
      </section>
    </main>
  );
}
