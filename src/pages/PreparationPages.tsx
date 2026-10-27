import { useState, useEffect } from 'react';
import {
  Clock,
  User,
  CheckSquare,
  Square,
  Loader2,
  Plus,
  Trash2,
  Heart,
  UserRound,
} from 'lucide-react';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { Modal } from '@/components/Modal';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import type { BridalPrepItem, TaskStatus } from '@/types';
import { images, bridalPrepData, groomPrepData } from '@/data/mockData';

export interface ServiceChecklistItem {
  id: string;
  serviceName: string;
  category: string;
  estimatedPrice: string;
  targetLink: string;
  status: TaskStatus;
  notes?: string;
}

const BRIDE_SERVICES_CHECKLIST: ServiceChecklistItem[] = [
  {
    id: 'bs1',
    serviceName: 'Bridal Makeup & Hairstyling',
    category: 'Makeup Artists',
    estimatedPrice: '₹15,000 – ₹35,000',
    targetLink: '/makeup',
    status: 'Pending',
    notes: 'HD airbrush makeup and low bun with gajra',
  },
  {
    id: 'bs2',
    serviceName: 'Royal Red Bridal Lehenga (Rental)',
    category: 'Clothes Rental',
    estimatedPrice: '₹25,000 / 3 days',
    targetLink: '/clothes',
    status: 'Pending',
    notes: 'Heavy zardozi embroidery with double dupatta',
  },
  {
    id: 'bs3',
    serviceName: 'Royal Kundan & Pearl Necklace Set',
    category: 'Jewellery Rental',
    estimatedPrice: '₹15,000 / 3 days',
    targetLink: '/jewellery',
    status: 'Pending',
    notes: 'Includes choker, long necklace, maang tikka & earrings',
  },
];

const GROOM_SERVICES_CHECKLIST: ServiceChecklistItem[] = [
  {
    id: 'gs1',
    serviceName: 'Grooming & Beard Sculpting',
    category: 'Grooming',
    estimatedPrice: '₹3,000 – ₹8,000',
    targetLink: '/makeup',
    status: 'Pending',
    notes: 'Haircut, beard trim, and pre-wedding facial',
  },
  {
    id: 'gs2',
    serviceName: 'Cream Royal Sherwani (Rental)',
    category: 'Sherwani Rental',
    estimatedPrice: '₹18,000 / 3 days',
    targetLink: '/clothes',
    status: 'Pending',
    notes: 'Heavy embroidered cream sherwani with churidar',
  },
  {
    id: 'gs3',
    serviceName: 'Red & Gold Royal Safa with Kalgi',
    category: 'Safa / Turban',
    estimatedPrice: '₹2,500 / 2 days',
    targetLink: '/clothes',
    status: 'Pending',
    notes: 'Royal safa with kalgi pin and tying artist',
  },
  {
    id: 'gs4',
    serviceName: 'Groom Pearl Brooch & Necklace',
    category: 'Jewellery Rental',
    estimatedPrice: '₹5,000 / 2 days',
    targetLink: '/jewellery',
    status: 'Pending',
    notes: 'Pearl brooch for sherwani and statement chain',
  },
];

const REMOVED_SERVICE_NAMES = new Set([
  'Navy Blue Reception Suit',
  'White Silk Kurta Pyjama',
  'Gold-Finish Cufflinks & Mojris',
  'Baraat Brass Band & Baggi',
  'Mehendi Artist Booking',
  'Pre-Bridal Glow Facial & Spa',
  'Champagne Reception Gown',
  'Matha Patti & Bridal Kaleere',
  'Bridal Juttis & Heels',
]);

const REMOVED_IDS = new Set(['bs4', 'bs5', 'bs6', 'bs7', 'bs8', 'gs5', 'gs6', 'gs7', 'gs8']);

interface PreparationPageProps {
  type: 'bride' | 'groom';
  title: string;
  defaultSubtitle: string;
  pageTitle: string;
  pageDescription: string;
  heroImage: string;
  sections: string[];
  defaultChecklist: ServiceChecklistItem[];
  confirmedPrepData: BridalPrepItem[];
  confirmedSchedule: { time: string; title: string; location: string }[];
  accentColor: 'burgundy' | 'champagne';
}

const statusIcon: Record<string, typeof CheckSquare> = {
  'Completed': CheckSquare,
  'In Progress': CheckSquare,
  'Confirmed': CheckSquare,
  'Booked': CheckSquare,
  'Pending': Square,
  'In Review': Clock,
  'Declined': Square,
  'Rejected': Square,
};

const statusIconColor: Record<string, string> = {
  'Completed': 'text-emerald-600',
  'In Progress': 'text-emerald-600',
  'Confirmed': 'text-emerald-600',
  'Booked': 'text-emerald-600',
  'Pending': 'text-burgundy-400',
  'In Review': 'text-blue-500',
  'Declined': 'text-rose-500',
  'Rejected': 'text-rose-500',
};

const statusLabel: Record<string, string> = {
  'Pending': 'Pending',
  'In Review': 'In Review',
  'Confirmed': 'Confirmed',
  'Completed': 'COMPLETED',
  'Declined': 'Rejected',
  'Rejected': 'Rejected',
};

const statusBadgeStyle: Record<string, string> = {
  'Pending': 'bg-amber-100 text-amber-800 border border-amber-300 font-semibold',
  'In Review': 'bg-blue-100 text-blue-800 border border-blue-300 font-semibold',
  'Confirmed': 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold',
  'Completed': 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold',
  'Declined': 'bg-red-100 text-red-800 border border-red-300 font-semibold',
  'Rejected': 'bg-red-100 text-red-800 border border-red-300 font-semibold',
};

export function PreparationPage({
  type,
  title,
  defaultSubtitle,
  pageTitle,
  pageDescription,
  heroImage,
  sections,
  defaultChecklist,
  confirmedPrepData,
  confirmedSchedule,
  accentColor,
}: PreparationPageProps) {
  const { isLoggedIn, user } = useAuth();
  const { showToast } = useToast();

  const storageKey = `wedding_services_checklist_${type}_${user?.id || 'visitor'}`;

  const [checklist, setChecklist] = useState<ServiceChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(
            (item) => !REMOVED_SERVICE_NAMES.has(item.serviceName) && !REMOVED_IDS.has(item.id)
          );
          localStorage.setItem(storageKey, JSON.stringify(filtered));
          return filtered;
        }
      }
    } catch (e) {
      console.error('Error loading checklist', e);
    }
    return [];
  });

  useEffect(() => {
    const handleDataChanged = () => {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const filtered = parsed.filter(
              (item) => !REMOVED_SERVICE_NAMES.has(item.serviceName) && !REMOVED_IDS.has(item.id)
            );
            setChecklist(filtered);
          }
        }
      } catch (e) {
        console.error('Error reloading checklist', e);
      }
    };

    window.addEventListener('wedding_data_changed', handleDataChanged);
    return () => window.removeEventListener('wedding_data_changed', handleDataChanged);
  }, [storageKey]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    serviceName: '',
    category: '',
    estimatedPrice: '',
    targetLink: '/services',
    notes: '',
  });

  const handleDeleteService = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = checklist.filter((item) => item.id !== id);
    setChecklist(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save checklist', err);
    }
    showToast('Service removed from checklist', 'info');
  };

  const toggleStatus = (id: string) => {
    const updated = checklist.map((item) => {
      if (item.id === id) {
        // Only toggle between Pending and Completed — skip In Progress
        const nextStatus: TaskStatus =
          item.status === 'Completed' ? 'Pending' : 'Completed';
        return { ...item, status: nextStatus };
      }
      return item;
    });

    setChecklist(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save checklist', err);
    }
  };

  const handleAddCustomService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.serviceName) return;

    const added: ServiceChecklistItem = {
      id: `svc_${Date.now()}`,
      serviceName: newItem.serviceName,
      category: newItem.category || 'Custom Service',
      estimatedPrice: newItem.estimatedPrice || 'On Request',
      targetLink: newItem.targetLink || '/services',
      status: 'Pending',
      notes: newItem.notes,
    };

    const updated = [added, ...checklist];
    setChecklist(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save checklist', err);
    }

    showToast(`Added "${newItem.serviceName}" to your ${title} Services Checklist!`, 'success');
    setNewItem({ serviceName: '', category: '', estimatedPrice: '', targetLink: '/services', notes: '' });
    setIsAddModalOpen(false);
  };

  const accent = accentColor === 'burgundy' ? 'bg-burgundy-600' : 'bg-champagne-500';

  // Render Interactive Services Checklist for All Users

  // Render Interactive Services Checklist for Visitors & New Users
  const resolvedSubtitle = user ? `${user.brideName || 'Bride'} & ${user.groomName || 'Groom'}'s ${title} Preparation` : defaultSubtitle;
  const resolvedTitle = user ? `${type === 'bride' ? (user.brideName || 'Bride') : (user.groomName || 'Groom')}'s ${title} Services Checklist` : pageTitle;

  return (
    <Layout title={title} subtitle={resolvedSubtitle}>
      <PageHeader
        title={resolvedTitle}
        description={pageDescription}
        image={heroImage}
        action={
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-gold inline-flex items-center gap-1.5 py-2 px-4 text-xs font-bold shadow-md hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            Add {title} Service
          </button>
        }
      />

      {/* Main Services Checklist Grid */}
      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between border-b border-burgundy-100 pb-3">
          <div>
            <h3 className="text-lg font-bold text-burgundy-950">
              {title} Services Checklist
            </h3>
            <span className="text-xs font-semibold text-charcoal/50">
              Tick to mark as COMPLETED · Untick to mark as Booked
            </span>
          </div>
          {checklist.length > 0 && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-gold inline-flex items-center gap-1.5 py-1.5 px-3 text-xs font-bold shadow-xs hover:scale-105"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Service
            </button>
          )}
        </div>

        {checklist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-burgundy-50 p-5">
              {type === 'bride' ? (
                <Heart className="h-10 w-10 text-burgundy-300" />
              ) : (
                <UserRound className="h-10 w-10 text-champagne-400" />
              )}
            </div>
            <h4 className="mb-1 text-base font-bold text-burgundy-900">Your checklist is empty</h4>
            <p className="mb-5 text-sm text-charcoal/50">
              Add {title.toLowerCase()} services, outfits, or appointments to get started.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-gold inline-flex items-center gap-2 py-2.5 px-5 text-sm font-bold shadow-md hover:scale-105"
            >
              <Plus className="h-4 w-4" />
              Add First Service
            </button>
          </div>
        ) : (
        <div className="space-y-3">
          {checklist.map((item) => {
            const Icon = statusIcon[item.status] || CheckSquare;
            return (
              <div
                key={item.id}
                className={`flex flex-col justify-between gap-4 rounded-2xl border p-4 transition-all sm:flex-row sm:items-center ${
                  item.status === 'Completed'
                    ? 'border-emerald-200 bg-emerald-50/40'
                    : 'border-burgundy-100 bg-white hover:border-burgundy-300 hover:shadow-md'
                }`}
              >
                <div
                  onClick={() => toggleStatus(item.id)}
                  className="flex cursor-pointer items-start gap-3 min-w-0 flex-1"
                >
                  <Icon className={`mt-1 h-5 w-5 flex-shrink-0 ${statusIconColor[item.status] || 'text-burgundy-400'}`} />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4
                        className={`text-sm font-bold ${
                          item.status === 'Completed' ? 'line-through text-charcoal/50' : 'text-burgundy-950'
                        }`}
                      >
                        {item.serviceName}
                      </h4>
                      <span className="rounded-full bg-burgundy-50 px-2.5 py-0.5 text-[10px] font-bold text-burgundy-700">
                        {item.category}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-charcoal/60">{item.notes}</p>
                    <p className="mt-1 text-xs font-semibold text-burgundy-700">
                      Est. Price: {item.estimatedPrice}
                    </p>
                    {(item as any).rejectionReason && ((item as any).status === 'Rejected' || (item as any).status === 'Declined') && (
                      <div className="mt-2 rounded-lg bg-rose-50 border border-rose-200 px-2.5 py-1.5 text-xs text-rose-700">
                        <strong className="font-semibold">Reason:</strong> {(item as any).rejectionReason}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusBadgeStyle[item.status] || 'bg-stone-100 text-stone-700'}`}>
                    {statusLabel[item.status] || item.status}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteService(item.id, e)}
                    className="rounded-lg p-1.5 text-charcoal/40 hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>

      {/* Add Custom Service Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={`Add Custom ${title} Service to Checklist`}
      >
        <form onSubmit={handleAddCustomService} className="space-y-4">
          <div>
            <label className="label-field">Service / Item Name *</label>
            <input
              type="text"
              required
              value={newItem.serviceName}
              onChange={(e) => setNewItem({ ...newItem, serviceName: e.target.value })}
              placeholder={type === 'bride' ? 'e.g. Bridal Floral Jewellery, Solah Shringar' : 'e.g. Custom Sword, Royal Safa Pin'}
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Category</label>
              <input
                type="text"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                placeholder="e.g. Jewellery, Outfits, Beauty"
                className="input-field"
              />
            </div>

            <div>
              <label className="label-field">Estimated Price</label>
              <input
                type="text"
                value={newItem.estimatedPrice}
                onChange={(e) => setNewItem({ ...newItem, estimatedPrice: e.target.value })}
                placeholder="e.g. ₹5,000 – ₹10,000"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="label-field">Category Tab Link</label>
            <select
              value={newItem.targetLink}
              onChange={(e) => setNewItem({ ...newItem, targetLink: e.target.value })}
              className="input-field"
            >
              <option value="/clothes">Clothes / Outfits Rental</option>
              <option value="/jewellery">Jewellery Rental</option>
              <option value="/makeup">Makeup & Beauty</option>
              <option value="/music-dj">Music & DJ</option>
              <option value="/photography">Photography</option>
              <option value="/services">All Services Directory</option>
            </select>
          </div>

          <div>
            <label className="label-field">Notes / Requirements</label>
            <textarea
              value={newItem.notes}
              onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
              placeholder="Any details or notes..."
              className="input-field min-h-[70px] resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Add Service to Checklist
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}

export function BridePage() {
  return (
    <PreparationPage
      type="bride"
      title="Bride"
      defaultSubtitle="Bridal Services & Outfits Checklist"
      pageTitle="Bride's Wedding Services Checklist"
      pageDescription="Interactive checklist for Bridal Makeup, Red Lehengas, Kundan Jewellery & Beauty trials"
      heroImage={images.brideRedLehenga}
      sections={[
        'Bridal Makeup',
        'Hairstyling',
        'Jewellery',
        'Bridal Outfit',
        'Reception Outfit',
        'Mehendi Outfit',
        'Haldi Outfit',
        'Shoes & Accessories',
      ]}
      defaultChecklist={BRIDE_SERVICES_CHECKLIST}
      confirmedPrepData={bridalPrepData}
      confirmedSchedule={[
        { time: '8:00 AM', title: 'Hairstyling', location: 'Bridal Suite' },
        { time: '10:00 AM', title: 'Bridal Makeup', location: 'Bridal Suite' },
        { time: '12:00 PM', title: 'Jewellery & Dressing', location: 'Bridal Suite' },
        { time: '2:00 PM', title: 'Photography Session', location: 'Garden Lawn' },
        { time: '4:00 PM', title: 'Baraat Welcome', location: 'Hotel Entrance' },
        { time: '5:00 PM', title: 'Wedding Ceremony', location: 'Mandap' },
      ]}
      accentColor="burgundy"
    />
  );
}

export function GroomPage() {
  return (
    <PreparationPage
      type="groom"
      title="Groom"
      defaultSubtitle="Groom Services & Outfits Checklist"
      pageTitle="Groom's Wedding Services Checklist"
      pageDescription="Interactive checklist for Royal Sherwanis, Designer Safas, Grooming & Accessories"
      heroImage={images.groomFull}
      sections={[
        'Grooming',
        'Sherwani',
        'Reception Suit',
        'Kurta',
        'Safa / Turban',
        'Brooch & Chains',
        'Cufflinks & Mojris',
        'Baraat Band',
      ]}
      defaultChecklist={GROOM_SERVICES_CHECKLIST}
      confirmedPrepData={groomPrepData}
      confirmedSchedule={[
        { time: '9:00 AM', title: 'Grooming Session', location: 'Groom Suite' },
        { time: '9:30 AM', title: 'Safa Tying', location: 'Groom Suite' },
        { time: '10:30 AM', title: 'Sherwani & Dressing', location: 'Groom Suite' },
        { time: '12:00 PM', title: 'Photography', location: 'Lobby' },
        { time: '3:00 PM', title: 'Baraat Procession', location: 'Hotel Entrance' },
        { time: '5:00 PM', title: 'Wedding Ceremony', location: 'Mandap' },
      ]}
      accentColor="champagne"
    />
  );
}
