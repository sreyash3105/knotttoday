import { useState, type FormEvent } from 'react';
import { Modal } from '@/components/Modal';
import { CheckCircle2 } from 'lucide-react';
import type { Vendor } from '@/types';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/context/AuthContext';
import { useServices } from '@/context/ServicesContext';
import { triggerWebhook } from '@/lib/webhook';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor | null;
}

export function BookingModal({ isOpen, onClose, vendor }: BookingModalProps) {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { user, addBookingToCurrentCustomer } = useAuth();
  const { addBookingRecord } = useServices();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    eventDate: '',
    eventType: '',
    notes: '',
  });

  if (!vendor) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const sharedId = `bkg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const initialStatus = 'Pending';

    addBookingToCurrentCustomer({
      id: sharedId,
      vendorName: vendor.name,
      serviceName: vendor.name,
      category: vendor.category,
      date: form.eventDate,
      status: initialStatus,
      price: vendor.priceRange,
      image: vendor.image,
      details: form.notes,
    });

    const resolvedName = user ? `${user.brideName} & ${user.groomName}` : 'Customer';

    // Store in company CRM database
    addBookingRecord({
      id: sharedId,
      customerId: user?.id,
      customerName: resolvedName,
      customerEmail: user?.email,
      customerPhone: user?.location,
      serviceOrItemName: vendor.name,
      category: vendor.category,
      bookingType: 'service',
      eventDate: form.eventDate,
      price: vendor.priceRange,
      status: initialStatus,
      notes: form.notes,
    });

    showToast(`Booking request sent to ${vendor.name}!`, 'success');
    triggerWebhook('service_booking', {
      vendor: vendor.name,
      customerName: resolvedName,
      eventDate: form.eventDate,
    });
    setSubmitted(true);
  };


  const handleClose = () => {
    setSubmitted(false);
    setForm({ eventDate: '', eventType: '', notes: '' });
    onClose();
  };

  if (submitted) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Booking Request Sent" size="sm">
        <div className="flex flex-col items-center py-6 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="h-9 w-9 text-green-600" />
          </div>
          <h4 className="text-lg font-semibold text-burgundy-900">Request Confirmed!</h4>
          <p className="mt-2 text-sm text-charcoal/60">
            Your booking request for <strong>{vendor.name}</strong> has been submitted.
            Our wedding planning team will get back to you shortly to confirm arrangements.
          </p>
          <button onClick={handleClose} className="btn-primary mt-6 w-full">
            {t('close')}
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Book ${vendor.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3 rounded-lg border border-burgundy-100 bg-burgundy-50/30 p-3">
          <img src={vendor.image} alt={vendor.name} className="h-14 w-14 rounded-lg object-cover" />
          <div>
            <p className="text-sm font-semibold text-burgundy-900">{vendor.name}</p>
            <p className="text-xs text-charcoal/50">{vendor.category} · {vendor.location}</p>
            <p className="text-xs font-medium text-burgundy-700">{vendor.priceRange}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">Event Date *</label>
            <input
              type="date"
              required
              value={form.eventDate}
              onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field">Event Type *</label>
            <select
              required
              value={form.eventType}
              onChange={(e) => setForm({ ...form, eventType: e.target.value })}
              className="input-field"
            >
              <option value="">Select event</option>
              <option value="Mehendi">Mehendi</option>
              <option value="Haldi">Haldi</option>
              <option value="Sangeet">Sangeet</option>
              <option value="Wedding Ceremony">Wedding Ceremony</option>
              <option value="Reception">Reception</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div>
          <label className="label-field">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="input-field min-h-[80px] resize-none"
            placeholder="Any special requirements..."
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={handleClose} className="btn-secondary flex-1">
            {t('cancel')}
          </button>
          <button type="submit" className="btn-primary flex-1">
            {t('requestBooking')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
