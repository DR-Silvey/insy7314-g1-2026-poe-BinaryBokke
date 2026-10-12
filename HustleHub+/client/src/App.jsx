import { useEffect, useState } from 'react';
import AuthPage from './components/AuthPage';
import BookingsPage from './components/BookingsPage';
import GigsPage from './components/GigsPage';
import NavBar from './components/NavBar';
import SignedInPage from './components/SignedInPage';
import { clearSession, getSession, saveSession } from './services/session';

const EXPIRED_NOTICE = { type: 'error', text: 'Your session has expired. Please sign in again.' };

export default function App() {
  const [mode, setMode] = useState('login');
  const [page, setPage] = useState('gigs');
  const [session, setSession] = useState(getSession);
  const [sessionNotice, setSessionNotice] = useState(null);

  useEffect(() => {
    if (!session) return undefined;

    const timer = setTimeout(() => signOut(EXPIRED_NOTICE), session.expiresAt - Date.now());
    return () => clearTimeout(timer);
  }, [session]);

  function signIn(token) {
    const nextSession = saveSession(token);
    if (!nextSession) return false;

    setSessionNotice(null);
    setPage('gigs');
    setSession(nextSession);
    return true;
  }

  function signOut(notice) {
    clearSession();
    setSessionNotice(notice);
    setMode('login');
    setSession(null);
  }

  if (session) {
    return (
      <div className="app-shell">
        <NavBar page={page} onPageChange={setPage} session={session} onSignOut={() => signOut({ type: 'success', text: 'You have been signed out.' })} />
        {page === 'gigs' && <GigsPage session={session} onSessionExpired={() => signOut(EXPIRED_NOTICE)} onViewBookings={() => setPage('bookings')} />}
        {page === 'bookings' && <BookingsPage session={session} onSessionExpired={() => signOut(EXPIRED_NOTICE)} />}
        {page === 'account' && <SignedInPage session={session} />}
      </div>
    );
  }

  return <AuthPage mode={mode} onModeChange={setMode} onSignIn={signIn} initialNotice={sessionNotice} />;
}
