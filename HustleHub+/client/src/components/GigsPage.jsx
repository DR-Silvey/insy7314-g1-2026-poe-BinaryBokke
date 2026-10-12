import { useEffect, useState } from 'react';
import GigCard from './GigCard';
import GigForm from './GigForm';
import { createGig, deleteGig, getGigs, updateGig } from '../services/gigApi';

const MANAGER_ROLES = ['freelancer', 'admin'];

export default function GigsPage({ session, onSessionExpired }) {
  const [gigs, setGigs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingGigID, setEditingGigID] = useState(null);
  const [showOnlyMine, setShowOnlyMine] = useState(false);
  const canCreate = MANAGER_ROLES.includes(session.role);
  const isAdmin = session.role === 'admin';

  useEffect(() => {
    let isCurrent = true;

    getGigs()
      .then((result) => {
        if (isCurrent) setGigs(result);
      })
      .catch((error) => {
        if (isCurrent) setNotice({ type: 'error', text: error.message });
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  function isOwnGig(gig) {
    return gig.usernamePerformer === session.username;
  }

  function canManage(gig) {
    return canCreate && (isAdmin || isOwnGig(gig));
  }

  function handleFailure(error) {
    if (error.status === 401) {
      onSessionExpired();
      return;
    }

    throw error;
  }

  function openCreateForm() {
    setNotice(null);
    setEditingGigID(null);
    setIsCreating(true);
  }

  function openEditForm(gig) {
    setNotice(null);
    setIsCreating(false);
    setEditingGigID(gig.gigID);
  }

  async function handleCreate(values) {
    try {
      const created = await createGig(session.token, values);
      setGigs((current) => [created, ...current]);
      setIsCreating(false);
      setNotice({ type: 'success', text: 'Your gig has been created.' });
    } catch (error) {
      handleFailure(error);
    }
  }

  async function handleUpdate(gig, values) {
    try {
      const updated = await updateGig(session.token, { ...values, gigID: gig.gigID, usernamePerformer: gig.usernamePerformer });
      setGigs((current) => current.map((item) => (item.gigID === gig.gigID ? updated : item)));
      setEditingGigID(null);
      setNotice({ type: 'success', text: 'Your gig has been updated.' });
    } catch (error) {
      handleFailure(error);
    }
  }

  async function handleDelete(gig) {
    try {
      await deleteGig(session.token, gig.gigID);
      setGigs((current) => current.filter((item) => item.gigID !== gig.gigID));
      setNotice({ type: 'success', text: 'Your gig has been deleted.' });
    } catch (error) {
      if (error.status === 401) {
        onSessionExpired();
        return;
      }

      setNotice({ type: 'error', text: error.message });
    }
  }

  const visibleGigs = gigs.filter((gig) => (showOnlyMine ? isOwnGig(gig) : gig.isAvailable || canManage(gig)));

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">MARKETPLACE</p>
          <h1>Gigs</h1>
          <p>Browse the services offered by freelancers on HustleHub+.</p>
        </div>
        {canCreate && !isCreating && <button className="primary-button" type="button" onClick={openCreateForm}>Create a gig</button>}
      </header>

      {notice && <div className={`notice ${notice.type}`} role="status">{notice.text}</div>}

      {isCreating && (
        <section className="panel" aria-label="Create a gig">
          <h2>Create a gig</h2>
          <GigForm submitLabel="Create gig" onSubmit={handleCreate} onCancel={() => setIsCreating(false)} />
        </section>
      )}

      {canCreate && (
        <div className="page-tools">
          <label className="checkbox-row"><input type="checkbox" checked={showOnlyMine} onChange={(event) => setShowOnlyMine(event.target.checked)} /> <span>Show only my gigs</span></label>
        </div>
      )}

      {isLoading ? (
        <p className="empty-state" role="status">Loading gigs…</p>
      ) : visibleGigs.length === 0 ? (
        <p className="empty-state">{showOnlyMine ? 'You have not created any gigs yet.' : 'No gigs are available yet.'}</p>
      ) : (
        <ul className="gig-grid">
          {visibleGigs.map((gig) => (editingGigID === gig.gigID ? (
            <li className="gig-card" key={gig.gigID} aria-label={`Edit ${gig.stageName}`}>
              <h3>Edit gig</h3>
              <GigForm initialGig={gig} submitLabel="Save changes" onSubmit={(values) => handleUpdate(gig, values)} onCancel={() => setEditingGigID(null)} />
            </li>
          ) : (
            <GigCard key={gig.gigID} gig={gig} canManage={canManage(gig)} onEdit={openEditForm} onDelete={handleDelete} />
          )))}
        </ul>
      )}
    </main>
  );
}
