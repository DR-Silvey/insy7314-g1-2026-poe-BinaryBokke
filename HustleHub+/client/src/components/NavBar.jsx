import { roleLabel } from '../services/roles';

const PAGES = [
  { id: 'gigs', label: 'Gigs' },
  { id: 'account', label: 'My account' },
];

export default function NavBar({ page, onPageChange, session, onSignOut }) {
  return (
    <header className="top-nav">
      <div className="simple-brand">
        <span aria-hidden="true">H+</span> HustleHub<strong>+</strong>
      </div>

      <nav aria-label="Main navigation">
        {PAGES.map((item) => (
          <button key={item.id} type="button" className={page === item.id ? 'active' : ''} aria-current={page === item.id ? 'page' : undefined} onClick={() => onPageChange(item.id)}>{item.label}</button>
        ))}
      </nav>

      <div className="nav-user">
        <span>{session.username}<small>{roleLabel(session.role)}</small></span>
        <button type="button" onClick={onSignOut}>Sign out</button>
      </div>
    </header>
  );
}
