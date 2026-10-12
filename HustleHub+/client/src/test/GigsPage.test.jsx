import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import GigsPage from '../components/GigsPage';
import { createGig, deleteGig, getGigs, updateGig } from '../services/gigApi';

vi.mock('../services/gigApi');

const freelancer = { token: 'token-123', username: 'djsunset', role: 'freelancer', expiresAt: Date.now() + 3600000 };
const client = { token: 'token-456', username: 'eventco', role: 'client', expiresAt: Date.now() + 3600000 };

const ownGig = { gigID: 'gig-1', usernamePerformer: 'djsunset', gigType: 'DJ', stageName: 'DJ Sunset', description: 'House and amapiano sets', costPerHour: 250, isAvailable: true };
const otherGig = { gigID: 'gig-2', usernamePerformer: 'snapshot', gigType: 'Photography', stageName: 'Snapshot Studio', description: 'Event photography', costPerHour: 400, isAvailable: true };
const unavailableGig = { gigID: 'gig-3', usernamePerformer: 'snapshot', gigType: 'Videography', stageName: 'Hidden Films', description: 'Not taking bookings', costPerHour: 500, isAvailable: false };

const validGig = { gigType: 'DJ', stageName: 'DJ Moonrise', description: 'Deep house sets', costPerHour: '300.50' };

function renderPage(session = freelancer) {
  const onSessionExpired = vi.fn();
  render(<GigsPage session={session} onSessionExpired={onSessionExpired} />);
  return { onSessionExpired };
}

async function fillGigForm(user, values) {
  const fields = { gigType: 'Gig type', stageName: 'Stage name', description: 'Description', costPerHour: 'Cost per hour (R)' };

  for (const [name, label] of Object.entries(fields)) {
    if (values[name] === undefined) continue;
    await user.clear(screen.getByLabelText(label));
    if (values[name]) await user.type(screen.getByLabelText(label), values[name]);
  }
}

async function openCreateForm(user) {
  await user.click(await screen.findByRole('button', { name: 'Create a gig' }));
}

describe('GigsPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    getGigs.mockResolvedValue([]);
  });

  it('shows the available gigs from the API', async () => {
    getGigs.mockResolvedValue([ownGig, otherGig, unavailableGig]);
    renderPage(client);

    expect(await screen.findByText('DJ Sunset')).toBeInTheDocument();
    expect(screen.getByText('Snapshot Studio')).toBeInTheDocument();
    expect(screen.getByText('by snapshot')).toBeInTheDocument();
    expect(screen.queryByText('Hidden Films')).not.toBeInTheDocument();
  });

  it('does not let clients create or manage gigs', async () => {
    getGigs.mockResolvedValue([ownGig]);
    renderPage(client);

    await screen.findByText('DJ Sunset');

    expect(screen.queryByRole('button', { name: 'Create a gig' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Edit DJ Sunset' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Delete DJ Sunset' })).not.toBeInTheDocument();
  });

  it('shows a message when there are no gigs', async () => {
    renderPage(client);

    expect(await screen.findByText('No gigs are available yet.')).toBeInTheDocument();
  });

  it('shows an error when the gigs cannot be loaded', async () => {
    getGigs.mockRejectedValue(new Error('We could not reach the service. Please try again shortly.'));
    renderPage(client);

    expect(await screen.findByText('We could not reach the service. Please try again shortly.')).toBeInTheDocument();
  });

  it('only lets freelancers manage their own gigs', async () => {
    getGigs.mockResolvedValue([ownGig, otherGig]);
    renderPage(freelancer);

    expect(await screen.findByRole('button', { name: 'Edit DJ Sunset' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete DJ Sunset' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Edit Snapshot Studio' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Delete Snapshot Studio' })).not.toBeInTheDocument();
  });

  it('filters the list to only the gigs of the freelancer', async () => {
    getGigs.mockResolvedValue([ownGig, otherGig]);
    const user = userEvent.setup();
    renderPage(freelancer);
    await screen.findByText('Snapshot Studio');

    await user.click(screen.getByLabelText('Show only my gigs'));

    expect(screen.getByText('DJ Sunset')).toBeInTheDocument();
    expect(screen.queryByText('Snapshot Studio')).not.toBeInTheDocument();
  });

  it('blocks gig details the API would reject', async () => {
    const user = userEvent.setup();
    renderPage(freelancer);
    await openCreateForm(user);

    await fillGigForm(user, { stageName: 'DJ--Night' });
    await user.click(screen.getByRole('button', { name: 'Create gig' }));

    expect(screen.getByText('Enter a gig type.')).toBeInTheDocument();
    expect(screen.getByText("The stage name cannot contain apostrophes (') or double dashes (--).")).toBeInTheDocument();
    expect(screen.getByText('Enter a description.')).toBeInTheDocument();
    expect(screen.getByText('Enter a cost per hour of 0 or more.')).toBeInTheDocument();
    expect(createGig).not.toHaveBeenCalled();
  });

  it('creates a gig and adds it to the list', async () => {
    createGig.mockImplementation(async (token, values) => ({ ...values, gigID: 'gig-9', usernamePerformer: 'djsunset' }));
    const user = userEvent.setup();
    renderPage(freelancer);
    await openCreateForm(user);

    await fillGigForm(user, validGig);
    await user.click(screen.getByLabelText('Available for bookings'));
    await user.click(screen.getByRole('button', { name: 'Create gig' }));

    expect(createGig).toHaveBeenCalledWith('token-123', { gigType: 'DJ', stageName: 'DJ Moonrise', description: 'Deep house sets', costPerHour: 300.5, isAvailable: false });
    expect(await screen.findByText('Your gig has been created.')).toBeInTheDocument();
    expect(screen.getByText('DJ Moonrise')).toBeInTheDocument();
    expect(screen.getByText('Not available')).toBeInTheDocument();
  });

  it('shows the API error when creating a gig fails', async () => {
    createGig.mockRejectedValue(new Error('Gig validation failed'));
    const user = userEvent.setup();
    renderPage(freelancer);
    await openCreateForm(user);

    await fillGigForm(user, validGig);
    await user.click(screen.getByRole('button', { name: 'Create gig' }));

    expect(await screen.findByText('Gig validation failed')).toBeInTheDocument();
  });

  it('signs the user out when their session has expired', async () => {
    createGig.mockRejectedValue(Object.assign(new Error('Invalid or expired token'), { status: 401 }));
    const user = userEvent.setup();
    const { onSessionExpired } = renderPage(freelancer);
    await openCreateForm(user);

    await fillGigForm(user, validGig);
    await user.click(screen.getByRole('button', { name: 'Create gig' }));

    await waitFor(() => expect(onSessionExpired).toHaveBeenCalled());
  });

  it('edits a gig with every field the API requires', async () => {
    getGigs.mockResolvedValue([ownGig]);
    updateGig.mockImplementation(async (token, gig) => gig);
    const user = userEvent.setup();
    renderPage(freelancer);

    await user.click(await screen.findByRole('button', { name: 'Edit DJ Sunset' }));
    expect(screen.getByLabelText('Stage name')).toHaveValue('DJ Sunset');

    await fillGigForm(user, { stageName: 'DJ Sunrise' });
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(updateGig).toHaveBeenCalledWith('token-123', { gigType: 'DJ', stageName: 'DJ Sunrise', description: 'House and amapiano sets', costPerHour: 250, isAvailable: true, gigID: 'gig-1', usernamePerformer: 'djsunset' });
    expect(await screen.findByText('Your gig has been updated.')).toBeInTheDocument();
    expect(screen.getByText('DJ Sunrise')).toBeInTheDocument();
  });

  it('deletes a gig after the freelancer confirms', async () => {
    getGigs.mockResolvedValue([ownGig]);
    deleteGig.mockResolvedValue();
    const user = userEvent.setup();
    renderPage(freelancer);

    await user.click(await screen.findByRole('button', { name: 'Delete DJ Sunset' }));
    expect(deleteGig).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Yes, delete' }));

    expect(deleteGig).toHaveBeenCalledWith('token-123', 'gig-1');
    expect(await screen.findByText('Your gig has been deleted.')).toBeInTheDocument();
    expect(screen.queryByText('DJ Sunset')).not.toBeInTheDocument();
  });

  it('keeps the gig when the freelancer cancels deleting', async () => {
    getGigs.mockResolvedValue([ownGig]);
    const user = userEvent.setup();
    renderPage(freelancer);

    await user.click(await screen.findByRole('button', { name: 'Delete DJ Sunset' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(deleteGig).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Edit DJ Sunset' })).toBeInTheDocument();
  });
});
