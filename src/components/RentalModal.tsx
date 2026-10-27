import { useState, type FormEvent } from 'react';
import { Modal } from '@/components/Modal';
import { CheckCircle2 } from 'lucide-react';
import type { JewelleryItem, ClothesItem, RentalRequest } from '@/types';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/context/AuthContext';
import { useServices } from '@/context/ServicesContext';
import { triggerWebhook } from '@/lib/webhook';

interface RentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: JewelleryItem | ClothesItem | null;
  type: 'jewellery' | 'clothes';
}

export function RentalModal({ isOpen, onClose, item, type }: RentalModalProps) {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { user, addBookingToCurrentCustomer } = useAuth();
  const { addBookingRecord } = useServices();

  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<RentalRequest>({
    customerName: '',
    selectedItem: '',
    rentalDate: '',
    returnDate: '',
    rentalPrice: 0,
    securityDeposit: 0,
    notes: '',
  });
  const [size, setSize] = useState('');

  if (!item) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const sharedId = `bkg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const initialStatus = 'Pending';

    addBookingToCurrentCustomer({
      id: sharedId,
      vendorName: `${type === 'jewellery' ? 'Jewellery' : 'Clothes'} Rental`,
      serviceName: item.name,
      category: item.category,
      date: form.rentalDate,
      status: initialStatus,
      price: `₹${item.rentalPrice.toLocaleString('en-IN')}`,
      image: item.image,
      details: form.notes,
    }, item.forWhom);

    const resolvedName = user ? `${user.brideName} & ${user.groomName}` : form.customerName || 'Customer';

    // Record in CRM database
    addBookingRecord({
      id: sharedId,
      customerId: user?.id,
      customerName: resolvedName,
      customerEmail: user?.email,
      serviceOrItemName: item.name,
      category: item.category,
      bookingType: type,
      eventDate: form.rentalDate,
      returnDate: form.returnDate,
      price: `₹${item.rentalPrice.toLocaleString('en-IN')}`,
      status: initialStatus,
      notes: `${form.notes ? form.notes + '. ' : ''}${size ? `Size: ${size}` : ''}`,
    });

    const reqType = type === 'jewellery' ? 'jewellery_rental' : 'clothes_rental';
    showToast(
      `${type === 'jewellery' ? 'Jewellery' : 'Clothes'} rental request submitted for ${item.name}!`,
      'success'
    );
    triggerWebhook(reqType, {
      customerName: resolvedName,
      item: item.name,
      rentalDate: form.rentalDate,
      returnDate: form.returnDate,
    });
    setSubmitted(true);
  };


  const handleClose = () => {
    setSubmitted(false);
    setForm({
      customerName: '',
      selectedItem: '',
      rentalDate: '',
      returnDate: '',
      rentalPrice: 0,
      securityDeposit: 0,
      notes: '',
    });
    setSize('');
    onClose();
  };

  if (submitted) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Rental Request Submitted" size="sm">
        <div className="flex flex-col items-center py-6 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="h-9 w-9 text-green-600" />
          </div>
          <h4 className="text-lg font-semibold text-burgundy-900">Request Confirmed!</h4>
          <p className="mt-2 text-sm text-charcoal/60">
            Your rental request for <strong>{item.name}</strong> has been submitted successfully.
            Our team will contact you shortly to confirm the rental details.
          </p>
          <div className="mt-4 w-full rounded-lg bg-burgundy-50 p-4 text-sm">
            <div className="flex justify-between py-1">
              <span className="text-charcoal/60">Rental Price</span>
              <span className="font-semibold text-burgundy-700">
                ₹{item.rentalPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-charcoal/60">Security Deposit</span>
              <span className="font-semibold text-burgundy-700">
                ₹{item.securityDeposit.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-charcoal/60">Duration</span>
              <span className="font-medium text-charcoal">{item.rentalDuration}</span>
            </div>
          </div>
          <button onClick={handleClose} className="btn-primary mt-6 w-full">
            {t('close')}
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={type === 'jewellery' ? 'Jewellery Rental Request' : 'Clothes Rental Request'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-field">
            {type === 'jewellery' ? 'Selected Jewellery' : 'Selected Outfit'}
          </label>
          <div className="flex items-center gap-3 rounded-lg border border-burgundy-100 bg-burgundy-50/30 p-3">
            <img src={item.image} alt={item.name} className="h-14 w-14 rounded-lg object-cover" />
            <div>
              <p className="text-sm font-semibold text-burgundy-900">{item.name}</p>
              <p className="text-xs text-charcoal/50">{item.category}</p>
            </div>
          </div>
        </div>
        {type === 'clothes' && (
          <div>
            <label className="label-field">Size *</label>
            <select
              required
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="input-field"
            >
              <option value="">Select size</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="Free">Free Size</option>
            </select>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">Rental Date *</label>
            <input
              type="date"
              required
              value={form.rentalDate}
              onChange={(e) => setForm({ ...form, rentalDate: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-field">Return Date *</label>
            <input
              type="date"
              required
              value={form.returnDate}
              onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
              className="input-field"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">Rental Price</label>
            <input
              type="text"
              readOnly
              value={`₹${item.rentalPrice.toLocaleString('en-IN')}`}
              className="input-field bg-burgundy-50/30"
            />
          </div>
          <div>
            <label className="label-field">Security Deposit</label>
            <input
              type="text"
              readOnly
              value={`₹${item.securityDeposit.toLocaleString('en-IN')}`}
              className="input-field bg-burgundy-50/30"
            />
          </div>
        </div>
        <div>
          <label className="label-field">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="input-field min-h-[80px] resize-none"
            placeholder="Any special requests..."
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={handleClose} className="btn-secondary flex-1">
            {t('cancel')}
          </button>
          <button type="submit" className="btn-primary flex-1">
            Submit Rental Request
          </button>
        </div>
      </form>
    </Modal>
  );
}
