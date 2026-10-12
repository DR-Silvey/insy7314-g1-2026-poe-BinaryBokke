import { roleLabel } from '../services/roles';

export default function SignedInPage({ session }) {
  const expiresAt = new Date(session.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">SIGNED IN</p>
          <h1>Welcome, {session.username}</h1>
          <p>You are signed in to HustleHub+. For your security, this session ends at {expiresAt}.</p>
        </div>
      </header>

      <dl className="session-details">
        <div>
          <dt>Username</dt>
          <dd>{session.username}</dd>
        </div>
        <div>
          <dt>Account type</dt>
          <dd>{roleLabel(session.role)}</dd>
        </div>
      </dl>
    </main>
  );
}
