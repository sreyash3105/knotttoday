import type { UserBooking } from '@/types/auth';
import type { Task } from '@/types';

export type BookingTarget = 'bride' | 'groom' | 'tasks';

export function classifyBookingTarget(
  category?: string,
  serviceName?: string,
  vendorName?: string,
  forWhom?: string
): BookingTarget {
  if (forWhom === 'Groom') return 'groom';
  if (forWhom === 'Bride') return 'bride';

  const text = `${category || ''} ${serviceName || ''} ${vendorName || ''}`.toLowerCase();

  // Groom items / services
  if (
    text.includes('groom') ||
    text.includes('sherwani') ||
    text.includes('safa') ||
    text.includes('turban') ||
    text.includes('kurta') ||
    text.includes('mojri') ||
    text.includes('kalgi') ||
    text.includes('cufflink') ||
    text.includes('baraat')
  ) {
    return 'groom';
  }

  // Bride items / services
  if (
    text.includes('bride') ||
    text.includes('bridal') ||
    text.includes('lehenga') ||
    text.includes('gown') ||
    text.includes('saree') ||
    text.includes('anarkali') ||
    text.includes('makeup') ||
    text.includes('hairstyling') ||
    text.includes('mehendi') ||
    text.includes('nath') ||
    text.includes('kamarbandh') ||
    text.includes('maang tikka') ||
    text.includes('matha patti') ||
    text.includes('jewellery') ||
    text.includes('choker') ||
    text.includes('jhumka')
  ) {
    return 'bride';
  }

  // All remaining services go to Tasks (Photography, DJ / Music, Catering, Decoration, etc.)
  return 'tasks';
}

export function routeBookingToStorage(
  booking: Omit<UserBooking, 'id'> & { id?: string },
  userId: string,
  forWhomHint?: string
): BookingTarget {
  const target = classifyBookingTarget(
    booking.category,
    booking.serviceName,
    booking.vendorName,
    forWhomHint
  );

  const bookingId = booking.id || `svc_${Date.now()}`;
  const bookingStatus = booking.status || 'Pending';

  if (target === 'bride') {
    const brideStorageKey = `wedding_services_checklist_bride_${userId}`;
    let list: any[] = [];
    try {
      const existing = localStorage.getItem(brideStorageKey);
      if (existing) list = JSON.parse(existing);
    } catch (e) {
      console.error('Error reading bride storage', e);
    }

    const newItem = {
      id: bookingId,
      serviceName: booking.serviceName || booking.vendorName || 'Bridal Service',
      category: booking.category || 'Bridal Service',
      estimatedPrice: String(booking.price || 'Pending'),
      targetLink: '/services',
      status: bookingStatus,
      notes: booking.details || `Requested from ${booking.vendorName || ''}`,
    };

    localStorage.setItem(brideStorageKey, JSON.stringify([newItem, ...list]));
  } else if (target === 'groom') {
    const groomStorageKey = `wedding_services_checklist_groom_${userId}`;
    let list: any[] = [];
    try {
      const existing = localStorage.getItem(groomStorageKey);
      if (existing) list = JSON.parse(existing);
    } catch (e) {
      console.error('Error reading groom storage', e);
    }

    const newItem = {
      id: bookingId,
      serviceName: booking.serviceName || booking.vendorName || 'Groom Service',
      category: booking.category || 'Groom Service',
      estimatedPrice: String(booking.price || 'Pending'),
      targetLink: '/services',
      status: bookingStatus,
      notes: booking.details || `Requested from ${booking.vendorName || ''}`,
    };

    localStorage.setItem(groomStorageKey, JSON.stringify([newItem, ...list]));
  } else {
    // Tasks destination
    const tasksStorageKey = `wedding_tasks_${userId}`;
    let list: Task[] = [];
    try {
      const existing = localStorage.getItem(tasksStorageKey);
      if (existing) list = JSON.parse(existing);
    } catch (e) {
      console.error('Error reading tasks storage', e);
    }

    const newTask: Task = {
      id: bookingId,
      name: `${booking.vendorName || booking.serviceName} (${booking.category || 'Vendor'})`,
      category: booking.category || 'Vendor Booking',
      dueDate: booking.date || 'Before Wedding',
      priority: 'High',
      status: (bookingStatus === 'Confirmed' || bookingStatus === 'Completed' ? 'Completed' : 'Pending') as any,
      assignedPerson: 'Planner / Couple',
    };

    localStorage.setItem(tasksStorageKey, JSON.stringify([newTask, ...list]));
  }

  // Notify active components to re-render immediately
  window.dispatchEvent(new CustomEvent('wedding_data_changed'));

  return target;
}
