export type EventStatus = 'Upcoming' | 'In Progress' | 'Completed';
export type RsvpStatus = 'Confirmed' | 'Pending' | 'Declined';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';
export type PerformanceStatus = 'Planned' | 'Practicing' | 'Ready' | 'Completed';
export type Availability = 'Available' | 'Limited' | 'Booked';

export interface WeddingEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  day?: string;
  location: string;
  description: string;
  dressCode: string;
  responsiblePerson: string;
  notes: string;
  status: EventStatus;
  bookingStatus?: 'Recommended' | 'Booked';
  image: string;
  isCustom?: boolean;
  serviceAddons?: string[];
}

export interface JourneyStage extends WeddingEvent {
  stageNumber: number;
}

export interface Guest {
  id: string;
  name: string;
  phone: string;
  email: string;
  side: 'Bride' | 'Groom';
  numberOfGuests: number;
  rsvp: RsvpStatus;
  notes: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  priceRange: string;
  description: string;
  image: string;
  phone: string;
  whatsapp: string;
  services: string[];
  contactPerson?: string;
  email?: string;
  cuisines?: string[];
  menuDetails?: string;
  equipment?: string[];
  acceptingBookings?: boolean;
}

export type WeddingService = Vendor;

export interface JewelleryItem {
  id: string;
  name: string;
  category: string;
  forWhom: 'Bride' | 'Groom';
  rentalPrice: number;
  securityDeposit: number;
  availability: Availability;
  rentalDuration: string;
  description: string;
  image: string;
}

export interface ClothesItem {
  id: string;
  name: string;
  category: string;
  forWhom: 'Bride' | 'Groom';
  size: string;
  color: string;
  rentalPrice: number;
  securityDeposit: number;
  availability: Availability;
  rentalDuration: string;
  description: string;
  image: string;
}

export interface RentalRequest {
  customerName: string;
  selectedItem: string;
  rentalDate: string;
  returnDate: string;
  rentalPrice: number;
  securityDeposit: number;
  notes: string;
}

export interface Task {
  id: string;
  name: string;
  category: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedPerson: string;
}

export interface BudgetItem {
  id: string;
  category: string;
  description: string;
  planned: number;
  spent: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'reminder';
  time: string;
  read: boolean;
}

export interface SangeetPerformance {
  id: string;
  name: string;
  song: string;
  side: 'Bride' | 'Groom';
  participants: string;
  practiceDate: string;
  practiceTime: string;
  duration: string;
  status: PerformanceStatus;
  notes: string;
}

export interface BridalPrepItem {
  id: string;
  appointment: string;
  time: string;
  vendor: string;
  status: TaskStatus;
  notes: string;
}

export interface SupportRequest {
  name: string;
  phone: string;
  issue: string;
  description: string;
  preferredContact: 'Call' | 'WhatsApp' | 'Email';
}

export type Language = 'en' | 'hi' | 'kn';
