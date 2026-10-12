export default function SignedInPage({ session, onSignOut }) {
  const expiresAt = new Date(session.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <main className="auth-shell">
      <section className="form-panel">
        <div className="auth-card">
          <div className="simple-brand">
            <span aria-hidden="true">H+</span> HustleHub<strong>+</strong>
          </div>

          <header>
            <p className="eyebrow">SIGNED IN</p>
            <h2>Welcome, {session.username}</h2>
            <p>You are signed in to HustleHub+. For your security, this session ends at {expiresAt}.</p>
          </header>

          <dl className="session-details">
            <div>
              <dt>Username</dt>
              <dd>{session.username}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{session.role}</dd>
            </div>
          </dl>

          <button className="primary-button" type="button" onClick={onSignOut}>Sign out</button>
        </div>
      </section>
    </main>
  );
}
