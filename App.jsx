import { useState } from 'react';
import AuthPage from './components/AuthPage';

export default function App() {
  const [mode, setMode] = useState('login');

  return <AuthPage mode={mode} onModeChange={setMode} />;
}
