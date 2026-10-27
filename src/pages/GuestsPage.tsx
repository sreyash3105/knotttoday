import { useState, useEffect, type FormEvent } from 'react';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { Modal } from '@/components/Modal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { SearchBar } from '@/components/SearchFilter';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { guestsData } from '@/data/mockData';
import type { Guest } from '@/types';

const emptyGuest: Omit<Guest, 'id'> = {
  name: '',
  phone: '',
  email: '',
  side: 'Bride',
  numberOfGuests: 1,
  rsvp: 'Pending',
  notes: '',
};

export function GuestsPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();

  const userId = user?.id || 'visitor';
  const guestsKey = `wedding_guests_list_${userId}`;

  // Initial load from localStorage or default empty for new accounts
  const [guests, setGuests] = useState<Guest[]>(() => {
    try {
      const saved = localStorage.getItem(guestsKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [search, setSearch] = useState('');
  const [sideFilter, setSideFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Guest | null>(null);
  const [formData, setFormData] = useState<Omit<Guest, 'id'>>(emptyGuest);

  // Helper to persist guests and notify other components (e.g. BillPage)
  const saveGuests = (newGuests: Guest[]) => {
    setGuests(newGuests);
    try {
      localStorage.setItem(guestsKey, JSON.stringify(newGuests));
      window.dispatchEvent(new Event('wedding_data_changed'));
    } catch (e) {
      console.error(e);
    }
  };

  // Sync from other tabs/windows if updated
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem(guestsKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setGuests(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, [guestsKey]);

  // Dynamic calculations
  const totalPeopleCount = guests.reduce((sum, g) => sum + (Number(g.numberOfGuests) || 1), 0);
  const bridePeopleCount = guests
    .filter((g) => g.side === 'Bride')
    .reduce((sum, g) => sum + (Number(g.numberOfGuests) || 1), 0);
  const groomPeopleCount = guests
    .filter((g) => g.side === 'Groom')
    .reduce((sum, g) => sum + (Number(g.numberOfGuests) || 1), 0);
  const confirmedCount = guests
    .filter((g) => g.rsvp === 'Confirmed')
    .reduce((sum, g) => sum + (Number(g.numberOfGuests) || 1), 0);

  const filtered = guests.filter((g) => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase());
    const matchSide = sideFilter === 'all' || g.side === sideFilter;
    return matchSearch && matchSide;
  });

  const openAdd = () => {
    setEditingGuest(null);
    setFormData(emptyGuest);
    setIsFormOpen(true);
  };

  const openEdit = (guest: Guest) => {
    setEditingGuest(guest);
    const { id, ...rest } = guest;
    void id;
    setFormData(rest);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editingGuest) {
      const updated = guests.map((g) =>
        g.id === editingGuest.id ? { ...formData, id: editingGuest.id } : g
      );
      saveGuests(updated);
      showToast('Guest updated successfully!');
    } else {
      const newGuest: Guest = { ...formData, id: `g${Date.now()}` };
      saveGuests([...guests, newGuest]);
      showToast('Guest added successfully!');
    }
    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      const updated = guests.filter((g) => g.id !== deleteTarget.id);
      saveGuests(updated);
      showToast('Guest removed.', 'info');
      setDeleteTarget(null);
    }
  };

  const changeGuestCount = (id: string, count: number) => {
    if (count < 1) return;
    const updated = guests.map((g) => (g.id === id ? { ...g, numberOfGuests: count } : g));
    saveGuests(updated);
  };

  return (
    <Layout
      title={t('guests')}
      subtitle={`${guests.length} entries (${totalPeopleCount} total attendees)`}
    >
      <PageHeader
        title="Guest Management"
        description="Manage your wedding guest list, organize attendees by family side, and track live RSVPs"
        action={
          <button onClick={openAdd} className="btn-primary inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> {t('addGuest')}
          </button>
        }
      />

      {/* ─── GUEST HEADCOUNT & SIDE OVERVIEW CARDS ─── */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="card p-4 border border-burgundy-100 bg-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-charcoal/60">Total Attendees</span>
            <Users className="h-4 w-4 text-burgundy-700" />
          </div>
          <p className="mt-1 text-2xl font-bold font-serif text-burgundy-950">{totalPeopleCount}</p>
          <p className="text-[11px] text-charcoal/50">Across {guests.length} guest parties</p>
        </div>

        <div className="card p-4 border border-rose-100 bg-rose-50/40 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-800">Bride's Side</span>
            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">Bride</span>
          </div>
          <p className="mt-1 text-2xl font-bold font-serif text-rose-950">{bridePeopleCount}</p>
          <p className="text-[11px] text-rose-700/60">{guests.filter((g) => g.side === 'Bride').length} guest entries</p>
        </div>

        <div className="card p-4 border border-champagne-200 bg-champagne-50/40 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-champagne-900">Groom's Side</span>
            <span className="rounded-full bg-champagne-100 px-2 py-0.5 text-[10px] font-bold text-champagne-800">Groom</span>
          </div>
          <p className="mt-1 text-2xl font-bold font-serif text-burgundy-950">{groomPeopleCount}</p>
          <p className="text-[11px] text-charcoal/50">{guests.filter((g) => g.side === 'Groom').length} guest entries</p>
        </div>

        <div className="card p-4 border border-emerald-100 bg-emerald-50/40 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800">Confirmed Attendees</span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Confirmed</span>
          </div>
          <p className="mt-1 text-2xl font-bold font-serif text-emerald-950">{confirmedCount}</p>
          <p className="text-[11px] text-emerald-700/60">
            {guests.filter((g) => g.rsvp === 'Pending').length} pending RSVPs
          </p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <SearchBar value={search} onChange={setSearch} placeholder="Search guests by name..." />
        <div>
          <label className="mb-1.5 block text-xs font-medium text-charcoal/50">Filter by Side</label>
          <select
            value={sideFilter}
            onChange={(e) => setSideFilter(e.target.value)}
            className="rounded-lg border border-burgundy-100 bg-white px-3 py-2 text-sm text-charcoal focus:border-burgundy-300 focus:outline-none focus:ring-2 focus:ring-burgundy-50"
          >
            <option value="all">All Sides ({guests.length})</option>
            <option value="Bride">Bride's Side ({guests.filter((g) => g.side === 'Bride').length})</option>
            <option value="Groom">Groom's Side ({guests.filter((g) => g.side === 'Groom').length})</option>
          </select>
        </div>
      </div>

      {/* Desktop table */}
      <div className="card hidden overflow-hidden lg:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-burgundy-50 bg-burgundy-50/30 text-left text-xs uppercase text-charcoal/50">
              <th className="px-4 py-3 font-semibold">Guest / Family Name</th>
              <th className="px-4 py-3 font-semibold">Side</th>
              <th className="px-4 py-3 font-semibold">Attending Headcount</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((g) => {
              const count = Number(g.numberOfGuests) || 1;
              return (
                <tr key={g.id} className="border-b border-burgundy-50 last:border-0 hover:bg-burgundy-50/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-charcoal">{g.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`badge ${
                        g.side === 'Bride' ? 'bg-rose-50 text-rose-700' : 'bg-champagne-50 text-champagne-700'
                      }`}
                    >
                      {g.side}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => changeGuestCount(g.id, count - 1)}
                        className="flex h-6 w-6 items-center justify-center rounded border border-burgundy-200 bg-white text-xs font-bold text-burgundy-900 hover:bg-burgundy-50"
                        title="Decrease headcount"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={count}
                        onChange={(e) => changeGuestCount(g.id, Number(e.target.value))}
                        className="w-16 rounded-md border border-burgundy-100 bg-white px-2 py-1 text-center text-sm font-semibold text-charcoal focus:border-burgundy-400 focus:outline-none focus:ring-1 focus:ring-burgundy-100"
                      />
                      <button
                        type="button"
                        onClick={() => changeGuestCount(g.id, count + 1)}
                        className="flex h-6 w-6 items-center justify-center rounded border border-burgundy-200 bg-white text-xs font-bold text-burgundy-900 hover:bg-burgundy-50"
                        title="Increase headcount"
                      >
                        +
                      </button>
                      <span className="text-xs text-charcoal/50">people</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(g)}
                      className="rounded-lg p-1.5 text-burgundy-600 hover:bg-burgundy-50"
                      title={t('edit')}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(g)}
                      className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
                      title={t('delete')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 lg:hidden">
        {filtered.map((g) => {
          const count = Number(g.numberOfGuests) || 1;
          return (
            <div key={g.id} className="card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-charcoal">{g.name}</p>
                </div>
                <span
                  className={`badge ${
                    g.side === 'Bride' ? 'bg-rose-50 text-rose-700' : 'bg-champagne-50 text-champagne-700'
                  }`}
                >
                  {g.side}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-charcoal/50">Guests:</span>
                  <button
                    type="button"
                    onClick={() => changeGuestCount(g.id, count - 1)}
                    className="flex h-6 w-6 items-center justify-center rounded border border-burgundy-200 bg-white text-xs font-bold text-burgundy-900"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={count}
                    onChange={(e) => changeGuestCount(g.id, Number(e.target.value))}
                    className="w-14 rounded-md border border-burgundy-100 bg-white px-1.5 py-0.5 text-center text-sm font-semibold text-charcoal focus:border-burgundy-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => changeGuestCount(g.id, count + 1)}
                    className="flex h-6 w-6 items-center justify-center rounded border border-burgundy-200 bg-white text-xs font-bold text-burgundy-900"
                  >
                    +
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(g)}
                    className="rounded-lg border border-burgundy-100 px-3 py-1.5 text-xs font-medium text-burgundy-600 hover:bg-burgundy-50"
                  >
                    {t('edit')}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(g)}
                    className="rounded-lg border border-red-100 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    {t('delete')}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card mt-4 p-12 text-center">
          <Users className="mx-auto h-8 w-8 text-burgundy-300 mb-2" />
          <p className="font-semibold text-charcoal">Your Guest List is Empty</p>
          <p className="text-xs text-charcoal/50 mt-1">
            Click &quot;Add Guest&quot; above to add your family and wedding attendees to track headcount and catering.
          </p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingGuest ? 'Edit Guest' : 'Add New Guest'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="Guest or family name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Side</label>
              <select
                value={formData.side}
                onChange={(e) =>
                  setFormData({ ...formData, side: e.target.value as 'Bride' | 'Groom' })
                }
                className="input-field"
              >
                <option value="Bride">Bride</option>
                <option value="Groom">Groom</option>
              </select>
            </div>
            <div>
              <label className="label-field">Number of Guests (Headcount)</label>
              <input
                type="number"
                min={1}
                value={formData.numberOfGuests}
                onChange={(e) =>
                  setFormData({ ...formData, numberOfGuests: Number(e.target.value) })
                }
                className="input-field"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="btn-secondary flex-1"
            >
              {t('cancel')}
            </button>
            <button type="submit" className="btn-primary flex-1">
              {editingGuest ? t('save') : t('addGuest')}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove Guest"
        message={`Remove "${deleteTarget?.name}" from the guest list? This will also update the dynamic food bill calculation.`}
      />
    </Layout>
  );
}
