import { useState, type FormEvent } from 'react';
import { Plus, Calendar, Pencil } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { EventCard } from '@/components/EventCard';
import { Modal } from '@/components/Modal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { SearchBar } from '@/components/SearchFilter';
import { EditWeddingDateModal } from '@/components/EditWeddingDateModal';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/context/AuthContext';
import { eventsData, images, weddingInfo } from '@/data/mockData';
import type { WeddingEvent, EventStatus } from '@/types';

const emptyEvent: Omit<WeddingEvent, 'id'> = {
  name: '',
  date: '',
  time: '',
  location: '',
  description: '',
  dressCode: '',
  responsiblePerson: '',
  notes: '',
  status: 'Upcoming',
  image: images.mandap,
  isCustom: true,
};

export function EventsPage() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [events, setEvents] = useState<WeddingEvent[]>(eventsData);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<WeddingEvent | null>(null);
  const [viewingEvent, setViewingEvent] = useState<WeddingEvent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WeddingEvent | null>(null);
  const [formData, setFormData] = useState<Omit<WeddingEvent, 'id'>>(emptyEvent);

  const filtered = events.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openAdd = () => {
    setEditingEvent(null);
    setFormData(emptyEvent);
    setIsFormOpen(true);
  };

  const openEdit = (event: WeddingEvent) => {
    setEditingEvent(event);
    const { id, ...rest } = event;
    void id;
    setFormData(rest);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      setEvents((prev) =>
        prev.map((ev) => (ev.id === editingEvent.id ? { ...formData, id: editingEvent.id } : ev))
      );
      showToast('Event updated successfully!');
    } else {
      const newEvent: WeddingEvent = {
        ...formData,
        id: `e${Date.now()}`,
        image: formData.image || images.mandap,
      };
      setEvents((prev) => [...prev, newEvent]);
      showToast('Event added successfully!');
    }
    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      setEvents((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      showToast('Event deleted.', 'info');
    }
  };

  return (
    <Layout title={t('eventsFunctions')} subtitle={`${events.length} events scheduled`}>
      <PageHeader
        title="Events & Functions"
        description="Manage all wedding events and ceremonies"
        action={
          <button onClick={openAdd} className="btn-primary">
            <Plus className="h-4 w-4" /> {t('addEvent')}
          </button>
        }
      />

      {/* Primary Wedding Date Banner */}
      <div className="mb-6 flex flex-col justify-between gap-3 rounded-2xl border border-champagne-200 bg-gradient-to-r from-champagne-50 via-rose-50/50 to-white p-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-burgundy-700 text-white shadow-xs">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-burgundy-600">Main Wedding Date</p>
            <p className="text-base font-bold text-burgundy-950">{user?.weddingDate || weddingInfo.weddingDate}</p>
          </div>
        </div>
        <button
          onClick={() => setIsDateModalOpen(true)}
          className="btn-gold inline-flex items-center gap-1.5 py-1.5 px-3.5 text-xs font-bold shadow-xs hover:scale-105"
        >
          <Pencil className="h-3.5 w-3.5" />
          {user?.weddingDate === 'To Be Decided' ? 'Set Wedding Date' : 'Change Wedding Date'}
        </button>
      </div>

      {/* Search + Filter */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <SearchBar value={search} onChange={setSearch} placeholder="Search events..." />
        <div>
          <label className="mb-1.5 block text-xs font-medium text-charcoal/50">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-burgundy-100 bg-white px-3 py-2 text-sm text-charcoal focus:border-burgundy-300 focus:outline-none focus:ring-2 focus:ring-burgundy-50"
          >
            <option value="all">All Status</option>
            <option value="Upcoming">Upcoming</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Events grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onView={() => setViewingEvent(event)}
            onEdit={() => openEdit(event)}
            onDelete={() => setDeleteTarget(event)}
          />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="card p-12 text-center">
          <p className="text-charcoal/50">No events found matching your search.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingEvent ? 'Edit Event' : 'Add New Event'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">Event Name *</label>
              <input
                type="text" required value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field" placeholder="e.g. Mehendi Ceremony"
              />
            </div>
            <div>
              <label className="label-field">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as EventStatus })}
                className="input-field"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="label-field">Date *</label>
              <input
                type="text" required value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="input-field" placeholder="e.g. Dec 15, 2026"
              />
            </div>
            <div>
              <label className="label-field">Time *</label>
              <input
                type="text" required value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="input-field" placeholder="e.g. 4:00 PM"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label-field">Location *</label>
              <input
                type="text" required value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="input-field" placeholder="e.g. Garden Lawn, The Leela Palace"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label-field">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field min-h-[70px] resize-none" placeholder="Event description..."
              />
            </div>
            <div>
              <label className="label-field">Dress Code</label>
              <input
                type="text" value={formData.dressCode}
                onChange={(e) => setFormData({ ...formData, dressCode: e.target.value })}
                className="input-field" placeholder="e.g. Traditional Indian"
              />
            </div>
            <div>
              <label className="label-field">Responsible Person</label>
              <input
                type="text" value={formData.responsiblePerson}
                onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
                className="input-field" placeholder="e.g. Anjali (Coordinator)"
              />
            </div>
            <div>
              <label className="label-field">Image URL</label>
              <input
                type="text" value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="input-field" placeholder="Image URL (optional)"
              />
            </div>
            <div>
              <label className="label-field">Notes</label>
              <input
                type="text" value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="input-field" placeholder="Additional notes..."
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setIsFormOpen(false)} className="btn-secondary flex-1">
              {t('cancel')}
            </button>
            <button type="submit" className="btn-primary flex-1">
              {editingEvent ? t('save') : t('addEvent')}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={!!viewingEvent}
        onClose={() => setViewingEvent(null)}
        title={viewingEvent?.name ?? ''}
        size="lg"
      >
        {viewingEvent && (
          <div>
            <img
              src={viewingEvent.image || images.mandap}
              alt={viewingEvent.name}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200';
              }}
              className="mb-4 h-48 w-full rounded-xl object-cover"
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                ['Date', viewingEvent.date],
                ['Time', viewingEvent.time],
                ['Location', viewingEvent.location],
                ['Dress Code', viewingEvent.dressCode],
                ['Responsible Person', viewingEvent.responsiblePerson],
                ['Status', viewingEvent.status],
              ].map(([label, val]) => (
                <div key={label} className="border-b border-burgundy-50 pb-2">
                  <p className="text-xs text-charcoal/40">{label}</p>
                  <p className="text-sm font-medium text-charcoal">{val}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <p className="text-xs text-charcoal/40">Description</p>
              <p className="text-sm text-charcoal/70">{viewingEvent.description}</p>
            </div>
            <div className="mt-3">
              <p className="text-xs text-charcoal/40">Notes</p>
              <p className="text-sm text-charcoal/70">{viewingEvent.notes}</p>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Event"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
      />

      <EditWeddingDateModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
      />
    </Layout>
  );
}
