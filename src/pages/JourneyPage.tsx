import { useState, useEffect, type FormEvent } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  FileText,
  ArrowUp,
  ArrowDown,
  Pencil,
  Plus,
  Trash2,
  CheckCircle2,
  RotateCcw,
  Tag,
  Gem,
  Shirt,
  Music2,
  Camera,
  Flower2,
  UtensilsCrossed,
  Sparkles,
  ExternalLink,
  BookmarkCheck,
  Check,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { Modal } from '@/components/Modal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { journeyStages as defaultStages, tasksData, images } from '@/data/mockData';
import type { WeddingEvent, EventStatus, Task } from '@/types';

// The 7 official catalogue services
const CATALOGUE_SERVICES = [
  { name: 'Jewellery Rental', path: '/jewellery', icon: Gem, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { name: 'Clothes Rental', path: '/clothes', icon: Shirt, color: 'text-rose-700 bg-rose-50 border-rose-200' },
  { name: 'Music & DJ', path: '/music-dj', icon: Music2, color: 'text-purple-700 bg-purple-50 border-purple-200' },
  { name: 'Photography', path: '/photography', icon: Camera, color: 'text-sky-700 bg-sky-50 border-sky-200' },
  { name: 'Decoration', path: '/decoration', icon: Flower2, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { name: 'Catering', path: '/catering', icon: UtensilsCrossed, color: 'text-orange-700 bg-orange-50 border-orange-200' },
  { name: 'Makeup Artists', path: '/makeup', icon: Sparkles, color: 'text-pink-700 bg-pink-50 border-pink-200' },
] as const;

const statusColor: Record<EventStatus, string> = {
  'Completed': 'bg-emerald-600',
  'In Progress': 'bg-champagne-600',
  'Upcoming': 'bg-burgundy-700',
};

const emptyStage: Omit<WeddingEvent, 'id'> = {
  name: '',
  day: 'Day 1',
  date: '',
  time: '',
  location: '',
  description: '',
  dressCode: '',
  responsiblePerson: '',
  notes: '',
  status: 'Upcoming',
  bookingStatus: 'Recommended',
  image: images.ceremony,
  serviceAddons: [],
};

export function JourneyPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();

  const userId = user?.id || 'visitor';
  const storageKey = `wedding_journey_stages_${userId}`;
  const tasksKey = `wedding_tasks_${userId}`;

  // Load stages from localStorage or fallback to defaults
  const [stages, setStages] = useState<WeddingEvent[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load journey stages', e);
    }
    return defaultStages;
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<WeddingEvent | null>(null);
  const [formData, setFormData] = useState<Omit<WeddingEvent, 'id'>>(emptyStage);
  const [deleteTarget, setDeleteTarget] = useState<WeddingEvent | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Helper to persist stages and sync
  const saveStages = (updated: WeddingEvent[]) => {
    setStages(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
      window.dispatchEvent(new Event('wedding_data_changed'));
    } catch (e) {
      console.error(e);
    }
  };

  // Reordering: Move Up
  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...stages];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    saveStages(updated);
    showToast(`Moved "${temp.name}" up in timeline sequence`, 'info');
  };

  // Reordering: Move Down
  const moveDown = (index: number) => {
    if (index === stages.length - 1) return;
    const updated = [...stages];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    saveStages(updated);
    showToast(`Moved "${temp.name}" down in timeline sequence`, 'info');
  };

  // Quick Status Toggle
  const toggleStatus = (id: string, newStatus: EventStatus) => {
    const updated = stages.map((s) => (s.id === id ? { ...s, status: newStatus } : s));
    saveStages(updated);
    showToast(`Stage status updated to ${newStatus}`);
  };

  // Book a journey milestone & automatically create a corresponding task on TasksPage
  const bookMilestone = (stage: WeddingEvent) => {
    const isCurrentlyBooked = stage.bookingStatus === 'Booked';
    const newBookingStatus: 'Booked' | 'Recommended' = isCurrentlyBooked ? 'Recommended' : 'Booked';

    // 1. Update Journey Stages
    const updatedStages = stages.map((s) =>
      s.id === stage.id ? { ...s, bookingStatus: newBookingStatus } : s
    );
    saveStages(updatedStages);

    // 2. If marking as Booked, add to Tasks page
    if (!isCurrentlyBooked) {
      let currentTasks: Task[] = [];
      try {
        const saved = localStorage.getItem(tasksKey);
        if (saved) currentTasks = JSON.parse(saved);
        else currentTasks = tasksData;
      } catch (e) {
        console.error(e);
        currentTasks = [];
      }

      const newTask: Task = {
        id: `t_journey_${stage.id}_${Date.now()}`,
        name: `Coordinate ${stage.name} (${stage.day || 'Wedding Event'})`,
        category: stage.serviceAddons?.[0] || 'Celebration Milestone',
        dueDate: stage.date || 'Before Wedding',
        priority: 'High',
        status: 'Pending',
        assignedPerson: stage.responsiblePerson || 'Planner / Couple',
      };

      // Avoid duplicate task with exact same milestone
      if (!currentTasks.some((t) => t.name.includes(stage.name))) {
        const updatedTasks = [newTask, ...currentTasks];
        try {
          localStorage.setItem(tasksKey, JSON.stringify(updatedTasks));
        } catch (e) {
          console.error(e);
        }
      }

      window.dispatchEvent(new Event('wedding_data_changed'));
      showToast(
        `"${stage.name}" is now Booked! Added task "${newTask.name}" to your Wedding Checklist.`,
        'success'
      );
    } else {
      window.dispatchEvent(new Event('wedding_data_changed'));
      showToast(`"${stage.name}" status set to "Recommended to Start".`, 'info');
    }
  };

  // Open Edit Modal
  const openEdit = (stage: WeddingEvent) => {
    setEditingStage(stage);
    const { id, ...rest } = stage;
    void id;
    setFormData({
      ...rest,
      day: rest.day || '',
      bookingStatus: rest.bookingStatus || 'Recommended',
      serviceAddons: rest.serviceAddons || [],
    });
    setIsEditModalOpen(true);
  };

  // Open Add Modal
  const openAdd = () => {
    setEditingStage(null);
    setFormData({
      ...emptyStage,
      date: user?.weddingDate || 'Dec 15, 2026',
      location: user?.location || 'The Leela Palace, Udaipur',
    });
    setIsEditModalOpen(true);
  };

  // Submit Modal (Add / Edit)
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editingStage) {
      const wasBooked = editingStage.bookingStatus === 'Booked';
      const isNowBooked = formData.bookingStatus === 'Booked';

      const updated = stages.map((s) =>
        s.id === editingStage.id ? { ...formData, id: editingStage.id } : s
      );
      saveStages(updated);

      // If newly marked as booked inside modal, create task
      if (!wasBooked && isNowBooked) {
        try {
          const saved = localStorage.getItem(tasksKey);
          let currentTasks: Task[] = saved ? JSON.parse(saved) : tasksData;
          const newTask: Task = {
            id: `t_journey_${editingStage.id}_${Date.now()}`,
            name: `Coordinate ${formData.name} (${formData.day || 'Wedding Event'})`,
            category: formData.serviceAddons?.[0] || 'Celebration Milestone',
            dueDate: formData.date || 'Before Wedding',
            priority: 'High',
            status: 'Pending',
            assignedPerson: formData.responsiblePerson || 'Planner / Couple',
          };
          if (!currentTasks.some((t) => t.name.includes(formData.name))) {
            localStorage.setItem(tasksKey, JSON.stringify([newTask, ...currentTasks]));
            window.dispatchEvent(new Event('wedding_data_changed'));
          }
        } catch (err) {
          console.error(err);
        }
      }

      showToast('Milestone details updated successfully!');
    } else {
      const newStage: WeddingEvent = {
        ...formData,
        id: `j_custom_${Date.now()}`,
        isCustom: true,
      };
      saveStages([...stages, newStage]);

      if (formData.bookingStatus === 'Booked') {
        try {
          const saved = localStorage.getItem(tasksKey);
          let currentTasks: Task[] = saved ? JSON.parse(saved) : tasksData;
          const newTask: Task = {
            id: `t_journey_${newStage.id}_${Date.now()}`,
            name: `Coordinate ${newStage.name} (${newStage.day || 'Wedding Event'})`,
            category: newStage.serviceAddons?.[0] || 'Celebration Milestone',
            dueDate: newStage.date || 'Before Wedding',
            priority: 'High',
            status: 'Pending',
            assignedPerson: newStage.responsiblePerson || 'Planner / Couple',
          };
          localStorage.setItem(tasksKey, JSON.stringify([newTask, ...currentTasks]));
          window.dispatchEvent(new Event('wedding_data_changed'));
        } catch (err) {
          console.error(err);
        }
      }

      showToast('New milestone added to journey!');
    }
    setIsEditModalOpen(false);
  };

  // Delete Milestone
  const handleDelete = () => {
    if (deleteTarget) {
      const updated = stages.filter((s) => s.id !== deleteTarget.id);
      saveStages(updated);
      showToast(`Removed "${deleteTarget.name}" from journey.`, 'info');
      setDeleteTarget(null);
    }
  };

  // Reset to default stages
  const handleResetToDefault = () => {
    saveStages(defaultStages);
    setIsResetConfirmOpen(false);
    showToast('Journey schedule reset to 13 standard milestones.', 'info');
  };

  // Toggle service addon selection in form
  const toggleServiceAddon = (serviceName: string) => {
    const current = formData.serviceAddons || [];
    if (current.includes(serviceName)) {
      setFormData({
        ...formData,
        serviceAddons: current.filter((s) => s !== serviceName),
      });
    } else {
      setFormData({
        ...formData,
        serviceAddons: [...current, serviceName],
      });
    }
  };

  const bookedCount = stages.filter((s) => s.bookingStatus === 'Booked').length;

  return (
    <Layout
      title={t('weddingJourney')}
      subtitle={`${stages.length} milestones (${bookedCount} Booked &bull; ${stages.length - bookedCount} Recommended) &bull; Auto-syncs tasks`}
    >
      <PageHeader
        title="Wedding Journey Timeline"
        description="Follow every milestone of your royal celebration. Stages recommended to get started can be booked with one click, automatically creating tasks on your Wedding Checklist."
        image={images.ceremony}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="btn-secondary inline-flex items-center gap-1.5 text-xs"
              title="Reset to standard 13-stage schedule"
            >
              <RotateCcw className="h-3.5 w-3.5 text-charcoal/60" />
              <span>Reset Schedule</span>
            </button>
            <button onClick={openAdd} className="btn-primary inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Milestone</span>
            </button>
          </div>
        }
      />

      {/* ─── Timeline Container ─── */}
      <div className="relative mt-2">
        {/* Continuous Vertical Timeline spine */}
        <div className="absolute left-6 top-6 bottom-6 w-1 bg-gradient-to-b from-burgundy-200 via-champagne-300 to-burgundy-200 sm:left-8" />

        <div className="space-y-6">
          {stages.map((stage, index) => {
            const isBooked = stage.bookingStatus === 'Booked';

            return (
              <div key={stage.id} className="relative flex gap-4 sm:gap-6 group">
                {/* Sequence Number Circle */}
                <div className="relative z-10 flex-shrink-0 flex flex-col items-center">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-base font-bold text-white shadow-lg ring-4 ring-white transition-all sm:h-16 sm:w-16 sm:text-xl ${statusColor[stage.status]}`}
                  >
                    {index + 1}
                  </div>

                  {/* Day Badge under the circle if present */}
                  {stage.day && (
                    <span className="mt-1.5 rounded-full border border-burgundy-200 bg-white px-2 py-0.5 text-[10px] font-bold text-burgundy-900 shadow-2xs whitespace-nowrap">
                      {stage.day}
                    </span>
                  )}
                </div>

                {/* Main Content Card */}
                <div className="card flex-1 overflow-hidden border border-burgundy-100/80 shadow-md hover:shadow-lg transition-all bg-white">
                  <div className="flex flex-col md:flex-row">
                    {/* Image Section */}
                    <div className="relative h-44 md:h-auto md:w-56 flex-shrink-0 bg-stone-100 overflow-hidden">
                      <img
                        src={stage.image || images.ceremony}
                        alt={stage.name}
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200';
                        }}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:hidden" />
                      <div className="absolute top-2.5 right-2.5 z-10">
                        <StatusBadge status={stage.status} type="event" />
                      </div>
                    </div>

                    {/* Details Body */}
                    <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
                      <div>
                        {/* Top Bar: Title, Day & Reorder Controls */}
                        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-burgundy-50 pb-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-serif text-lg font-bold text-burgundy-950 sm:text-xl">
                                {stage.name}
                              </h3>

                              {/* Booking Status Badge (Recommended vs Booked) */}
                              {isBooked ? (
                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 shadow-2xs">
                                  <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" />
                                  <span>Booked</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-900 shadow-2xs">
                                  <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                                  <span>Recommended for Started</span>
                                </span>
                              )}

                              {stage.isCustom && (
                                <span className="rounded bg-champagne-100 px-1.5 py-0.5 text-[10px] font-bold text-champagne-900">
                                  Custom
                                </span>
                              )}
                            </div>

                            {stage.description && (
                              <p className="mt-1 text-xs text-charcoal/70 leading-relaxed max-w-2xl">
                                {stage.description}
                              </p>
                            )}
                          </div>

                          {/* Controls Toolbar: Move Up, Move Down, Edit, Delete */}
                          <div className="flex items-center gap-1 rounded-xl border border-burgundy-100 bg-burgundy-50/50 p-1">
                            <button
                              type="button"
                              onClick={() => moveUp(index)}
                              disabled={index === 0}
                              className="rounded-lg p-1.5 text-charcoal/70 hover:bg-white hover:text-burgundy-900 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                              title="Move milestone earlier (Up)"
                            >
                              <ArrowUp className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveDown(index)}
                              disabled={index === stages.length - 1}
                              className="rounded-lg p-1.5 text-charcoal/70 hover:bg-white hover:text-burgundy-900 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                              title="Move milestone later (Down)"
                            >
                              <ArrowDown className="h-4 w-4" />
                            </button>
                            <div className="h-4 w-px bg-burgundy-200 mx-0.5" />
                            <button
                              type="button"
                              onClick={() => openEdit(stage)}
                              className="rounded-lg p-1.5 text-burgundy-700 hover:bg-white transition-all"
                              title="Edit timing, notes, dress code and service add-ons"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(stage)}
                              className="rounded-lg p-1.5 text-rose-600 hover:bg-white transition-all"
                              title="Delete milestone"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Metadata Grid (Date, Time, Location, Responsible Person) */}
                        <div className="mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-xs text-charcoal/75">
                          <p className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 flex-shrink-0 text-burgundy-600" />
                            <span>
                              <strong className="text-burgundy-950">Date:</strong> {stage.date || 'To be scheduled'}
                            </span>
                          </p>
                          <p className="flex items-center gap-2">
                            <Clock className="h-4 w-4 flex-shrink-0 text-burgundy-600" />
                            <span>
                              <strong className="text-burgundy-950">Time:</strong> {stage.time || 'TBD'}
                            </span>
                          </p>
                          <p className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 flex-shrink-0 text-burgundy-600" />
                            <span className="truncate">
                              <strong className="text-burgundy-950">Location:</strong> {stage.location || 'Venue pending'}
                            </span>
                          </p>
                          <p className="flex items-center gap-2">
                            <User className="h-4 w-4 flex-shrink-0 text-burgundy-600" />
                            <span className="truncate">
                              <strong className="text-burgundy-950">Lead / POC:</strong>{' '}
                              {stage.responsiblePerson || 'Family'}
                            </span>
                          </p>
                        </div>

                        {/* Dress Code & Notes Row */}
                        <div className="mt-3 rounded-xl border border-burgundy-50 bg-stone-50/70 p-3 text-xs text-charcoal/70">
                          <div className="flex flex-col gap-1.5">
                            {stage.dressCode && (
                              <div className="flex items-start gap-2">
                                <span className="font-bold text-burgundy-900 flex-shrink-0">Dress Code:</span>
                                <span className="text-charcoal/80 font-medium">{stage.dressCode}</span>
                              </div>
                            )}
                            {stage.notes && (
                              <div className="flex items-start gap-2">
                                <FileText className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-charcoal/40" />
                                <div>
                                  <span className="font-bold text-burgundy-900">Notes: </span>
                                  <span>{stage.notes}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* ─── Service Add-ons Attached to this Stage ─── */}
                        <div className="mt-3.5 flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50 flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            <span>Services:</span>
                          </span>

                          {stage.serviceAddons && stage.serviceAddons.length > 0 ? (
                            stage.serviceAddons.map((addonName) => {
                              const config = CATALOGUE_SERVICES.find((c) => c.name === addonName);
                              const IconComponent = config?.icon || Tag;
                              return (
                                <Link
                                  key={addonName}
                                  to={config?.path || '/services'}
                                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold shadow-2xs hover:shadow transition-all ${
                                    config?.color || 'text-burgundy-800 bg-burgundy-50 border-burgundy-200'
                                  }`}
                                  title={`Explore ${addonName} vendors & catalog`}
                                >
                                  <IconComponent className="h-3.5 w-3.5" />
                                  <span>{addonName}</span>
                                  <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                                </Link>
                              );
                            })
                          ) : (
                            <button
                              type="button"
                              onClick={() => openEdit(stage)}
                              className="inline-flex items-center gap-1 rounded-lg border border-dashed border-burgundy-200 px-2 py-0.5 text-[11px] text-burgundy-700 hover:bg-burgundy-50 transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Attach Service Add-on</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* ─── Bottom Actions: Book Milestone (Auto Adds Task) & Quick Status Switch ─── */}
                      <div className="mt-5 flex flex-col gap-3 border-t border-burgundy-50/80 pt-3.5 sm:flex-row sm:items-center sm:justify-between">
                        {/* Dynamic Booking Button */}
                        <div>
                          <button
                            type="button"
                            onClick={() => bookMilestone(stage)}
                            className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all shadow-xs ${
                              isBooked
                                ? 'border border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                                : 'bg-gradient-to-r from-burgundy-800 to-burgundy-900 text-white hover:from-burgundy-900 hover:to-burgundy-950 hover:shadow-md'
                            }`}
                          >
                            {isBooked ? (
                              <>
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                <span>Booked &bull; Click to Unmark</span>
                              </>
                            ) : (
                              <>
                                <BookmarkCheck className="h-4 w-4 text-champagne-300" />
                                <span>Book Milestone (+ Adds to Tasks)</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Stage Progress Status */}
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-charcoal/50 text-[11px]">Progress:</span>
                          {(['Upcoming', 'In Progress', 'Completed'] as EventStatus[]).map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => toggleStatus(stage.id, st)}
                              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                                stage.status === st
                                  ? 'bg-burgundy-900 text-white shadow-xs'
                                  : 'bg-burgundy-50/60 text-charcoal/60 hover:bg-burgundy-100 hover:text-burgundy-900'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Status Legend ─── */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-burgundy-100 bg-white p-5 shadow-xs">
        <div className="flex flex-wrap items-center gap-6">
          <p className="text-xs font-bold uppercase tracking-wider text-burgundy-950">Status Legend:</p>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-burgundy-700" />
            <span className="text-xs text-charcoal/70 font-medium">Upcoming Stage</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-champagne-600" />
            <span className="text-xs text-charcoal/70 font-medium">In Progress (Active)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-600" />
            <span className="text-xs text-charcoal/70 font-medium">Completed</span>
          </div>
        </div>

        <div className="text-xs text-charcoal/50">
          Tip: Booking any stage automatically registers an actionable task in your Wedding Checklist.
        </div>
      </div>

      {/* ─── ADD / EDIT MILESTONE MODAL ─── */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={editingStage ? `Edit "${editingStage.name}"` : 'Add New Journey Milestone'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {/* Milestone Title & Day */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="label-field">Milestone Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Fitcheck, Sangeet, Haldi"
                className="input-field font-semibold"
              />
            </div>
            <div>
              <label className="label-field">Day / Tag</label>
              <input
                type="text"
                value={formData.day || ''}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                placeholder="e.g. Day 1, Day -2"
                className="input-field"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field">Date</label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="e.g. Dec 15, 2026"
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field">Time</label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="e.g. 4:00 PM"
                className="input-field"
              />
            </div>
          </div>

          {/* Location & Responsible Person */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field">Location / Venue</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Poolside Terrace, The Leela Palace"
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field">Person in Charge / POC</label>
              <input
                type="text"
                value={formData.responsiblePerson}
                onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
                placeholder="e.g. Priya (Bridal Maid), Coordinator"
                className="input-field"
              />
            </div>
          </div>

          {/* Dress Code & Booking Status */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="label-field">Dress Code</label>
              <input
                type="text"
                value={formData.dressCode}
                onChange={(e) => setFormData({ ...formData, dressCode: e.target.value })}
                placeholder="e.g. Yellow, Festive"
                className="input-field"
              />
            </div>
            <div>
              <label className="label-field">Booking Status</label>
              <select
                value={formData.bookingStatus || 'Recommended'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bookingStatus: e.target.value as 'Recommended' | 'Booked',
                  })
                }
                className="input-field"
              >
                <option value="Recommended">Recommended to Start</option>
                <option value="Booked">Booked & Confirmed</option>
              </select>
            </div>
            <div>
              <label className="label-field">Stage Progress</label>
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
          </div>

          {/* Description */}
          <div>
            <label className="label-field">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of this celebration stage..."
              className="input-field"
            />
          </div>

          {/* Notes (Preserved) */}
          <div>
            <label className="label-field">Checklist &amp; Event Notes</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Specific checklist notes, vendor arrival times, key reminders..."
              className="input-field"
            />
          </div>

          {/* ─── SERVICE ADD-ONS CHECKBOXES ─── */}
          <div className="rounded-2xl border border-burgundy-100 bg-burgundy-50/40 p-4">
            <label className="mb-2 block text-xs font-bold text-burgundy-950 uppercase tracking-wider">
              Attach Catalogue Service Add-ons
            </label>
            <p className="mb-3 text-xs text-charcoal/60">
              Select which catalogue services are required for this milestone:
            </p>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {CATALOGUE_SERVICES.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = (formData.serviceAddons || []).includes(cat.name);
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => toggleServiceAddon(cat.name)}
                    className={`flex items-center gap-2 rounded-xl border p-2 text-left text-xs transition-all ${
                      isSelected
                        ? 'border-burgundy-600 bg-white font-bold text-burgundy-950 shadow-xs'
                        : 'border-burgundy-100/80 bg-white/60 text-charcoal/70 hover:bg-white'
                    }`}
                  >
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-lg ${
                        isSelected ? 'bg-burgundy-700 text-white' : 'bg-burgundy-50 text-burgundy-700'
                      }`}
                    >
                      <IconComponent className="h-3.5 w-3.5" />
                    </div>
                    <span className="truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="btn-secondary flex-1"
            >
              {t('cancel')}
            </button>
            <button type="submit" className="btn-primary flex-1">
              {editingStage ? t('save') : 'Add Milestone'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove Milestone"
        message={`Are you sure you want to remove "${deleteTarget?.name}" from your wedding journey timeline?`}
      />

      {/* Reset Confirmation */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleResetToDefault}
        title="Reset Wedding Journey Schedule"
        message="This will reset your wedding journey timeline back to the standard 13 milestone schedule (Fitcheck through Vidai). Any custom notes or custom stages will be replaced."
      />
    </Layout>
  );
}
