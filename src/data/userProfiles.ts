import type { UserProfile } from '@/types/auth';

export const DEFAULT_EMPTY_PROFILE: UserProfile = {
  id: '',
  email: '',
  brideName: '',
  groomName: '',
  coupleInitials: '',
  weddingDate: 'To Be Decided',
  location: 'Not Specified Yet',
  hasBooking: false,
  userBookings: [],
};

// Aliases maintained for backwards compatibility during migration
export const CUSTOMER_1: UserProfile = { ...DEFAULT_EMPTY_PROFILE };
export const CUSTOMER_2: UserProfile = { ...DEFAULT_EMPTY_PROFILE };
