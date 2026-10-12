import { useEffect, useState } from 'react';
import AuthPage from './components/AuthPage';
import SignedInPage from './components/SignedInPage';
import { clearSession, getSession, saveSession } from './services/session';

export default function App() {
  const [mode, setMode] = useState('login');
  const [session, setSession] = useState(getSession);
  const [sessionNotice, setSessionNotice] = useState(null);

  useEffect(() => {
    if (!session) return undefined;

    const timer = setTimeout(() => signOut({ type: 'error', text: 'Your session has expired. Please sign in again.' }), session.expiresAt - Date.now());
    return () => clearTimeout(timer);
  }, [session]);

  function signIn(token) {
    const nextSession = saveSession(token);
    if (!nextSession) return false;

    setSessionNotice(null);
    setSession(nextSession);
    return true;
  }

  function signOut(notice) {
    clearSession();
    setSessionNotice(notice);
    setMode('login');
    setSession(null);
  }

  if (session) return <SignedInPage session={session} onSignOut={() => signOut({ type: 'success', text: 'You have been signed out.' })} />;

  return <AuthPage mode={mode} onModeChange={setMode} onSignIn={signIn} initialNotice={sessionNotice} />;
}
