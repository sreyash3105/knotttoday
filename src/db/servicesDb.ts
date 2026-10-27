import type { Vendor, JewelleryItem, ClothesItem } from '@/types';
import { vendorsData, jewelleryData, clothesData } from '@/data/mockData';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { db } from './database';

export type CrmBookingStatus =
  | 'Pending'
  | 'In Review'
  | 'Confirmed'
  | 'Completed'
  | 'Declined'
  | 'Rejected';

export interface CrmBookingRecord {
  id: string;
  customerId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  serviceOrItemName: string;
  category: string;
  bookingType: 'service' | 'jewellery' | 'clothes';
  eventDate?: string;
  returnDate?: string;
  price?: string | number;
  status: CrmBookingStatus;
  notes?: string;
  rejectionReason?: string;
  createdAt: string;
}

const STORAGE_KEYS = {
  SERVICES: 'knot_today_services_db_v1',
  JEWELLERY: 'knot_today_jewellery_db_v1',
  CLOTHES: 'knot_today_clothes_db_v1',
  BOOKINGS: 'knot_today_bookings_db_v1',
  INITIALIZED: 'knot_today_db_initialized_v1',
};

// Initial bookings start empty; all bookings are dynamically populated when real couples book services
const SEED_BOOKINGS: CrmBookingRecord[] = [];

// Helper to safely read from localStorage
function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

// Helper to write to localStorage and dispatch event
function writeStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('knot_db_updated', { detail: { key } }));
  } catch (err) {
    console.error(`Error writing ${key} to storage:`, err);
  }
}

// Initialize tables if first time
export function initializeDatabase(): void {
  if (typeof window === 'undefined') return;
  const isInit = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (!isInit) {
    writeStorage(STORAGE_KEYS.SERVICES, vendorsData);
    writeStorage(STORAGE_KEYS.JEWELLERY, jewelleryData);
    writeStorage(STORAGE_KEYS.CLOTHES, clothesData);
    writeStorage(STORAGE_KEYS.BOOKINGS, SEED_BOOKINGS);
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  } else {
    // Purge any legacy demo bookings so newly registered users start with a clean slate
    const existing = readStorage<CrmBookingRecord[]>(STORAGE_KEYS.BOOKINGS, []);
    const filtered = existing.filter(
      (b) => b.id !== 'bkg-101' && b.id !== 'bkg-102' && b.id !== 'bkg-103'
    );
    if (filtered.length !== existing.length) {
      writeStorage(STORAGE_KEYS.BOOKINGS, filtered);
    }
  }
}

// ─── SERVICES CRUD ───

export async function fetchServices(): Promise<Vendor[]> {
  initializeDatabase();

  // Try Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await (supabase as any)
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        // Cache to local storage
        writeStorage(STORAGE_KEYS.SERVICES, data);
        return data as Vendor[];
      }
    } catch (err) {
      console.warn('Supabase fetchServices fallback to local DB:', err);
    }
  }

  return readStorage<Vendor[]>(STORAGE_KEYS.SERVICES, vendorsData);
}

export async function createService(newService: Omit<Vendor, 'id'>): Promise<Vendor> {
  const current = await fetchServices();
  const id = `srv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const service: Vendor = {
    ...newService,
    id,
    rating: newService.rating || 5.0,
    services: newService.services && newService.services.length > 0 ? newService.services : [newService.category],
  };

  const updated = [service, ...current];
  writeStorage(STORAGE_KEYS.SERVICES, updated);

  // Sync to Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      await (supabase as any).from('services').insert([service]);
    } catch (err) {
      console.warn('Failed to sync created service to Supabase:', err);
    }
  }

  return service;
}

export async function updateService(id: string, updates: Partial<Vendor>): Promise<Vendor | null> {
  const current = await fetchServices();
  let updatedItem: Vendor | null = null;

  const next = current.map((item) => {
    if (item.id === id) {
      updatedItem = { ...item, ...updates };
      return updatedItem;
    }
    return item;
  });

  if (updatedItem) {
    writeStorage(STORAGE_KEYS.SERVICES, next);

    // Sync to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        await (supabase as any).from('services').update(updates).eq('id', id);
      } catch (err) {
        console.warn('Failed to sync updated service to Supabase:', err);
      }
    }
  }

  return updatedItem;
}

export async function deleteService(id: string): Promise<boolean> {
  const current = await fetchServices();
  const next = current.filter((item) => item.id !== id);
  writeStorage(STORAGE_KEYS.SERVICES, next);

  if (isSupabaseConfigured && supabase) {
    try {
      await (supabase as any).from('services').delete().eq('id', id);
    } catch (err) {
      console.warn('Failed to sync deleted service to Supabase:', err);
    }
  }

  return true;
}

// ─── RENTALS CRUD ───

export async function fetchJewellery(): Promise<JewelleryItem[]> {
  initializeDatabase();
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await (supabase as any).from('jewellery').select('*');
      if (!error && data && data.length > 0) {
        writeStorage(STORAGE_KEYS.JEWELLERY, data);
        return data as JewelleryItem[];
      }
    } catch (err) {
      console.warn('Supabase fetchJewellery fallback to local:', err);
    }
  }
  return readStorage<JewelleryItem[]>(STORAGE_KEYS.JEWELLERY, jewelleryData);
}

export async function createJewellery(item: Omit<JewelleryItem, 'id'>): Promise<JewelleryItem> {
  const current = await fetchJewellery();
  const id = `jw_${Date.now()}`;
  const newItem: JewelleryItem = { ...item, id };
  const next = [newItem, ...current];
  writeStorage(STORAGE_KEYS.JEWELLERY, next);

  if (isSupabaseConfigured && supabase) {
    try {
      await (supabase as any).from('jewellery').insert([newItem]);
    } catch (err) {
      console.warn('Supabase createJewellery error:', err);
    }
  }
  return newItem;
}

export async function updateJewellery(id: string, updates: Partial<JewelleryItem>): Promise<JewelleryItem | null> {
  const current = await fetchJewellery();
  let updated: JewelleryItem | null = null;
  const next = current.map((i) => {
    if (i.id === id) {
      updated = { ...i, ...updates };
      return updated;
    }
    return i;
  });
  if (updated) {
    writeStorage(STORAGE_KEYS.JEWELLERY, next);
    if (isSupabaseConfigured && supabase) {
      try {
        await (supabase as any).from('jewellery').update(updates).eq('id', id);
      } catch (err) {
        console.warn('Supabase updateJewellery error:', err);
      }
    }
  }
  return updated;
}

export async function deleteJewellery(id: string): Promise<boolean> {
  const current = await fetchJewellery();
  writeStorage(STORAGE_KEYS.JEWELLERY, current.filter((i) => i.id !== id));
  if (isSupabaseConfigured && supabase) {
    try {
      await (supabase as any).from('jewellery').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase deleteJewellery error:', err);
    }
  }
  return true;
}

export async function fetchClothes(): Promise<ClothesItem[]> {
  initializeDatabase();
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await (supabase as any).from('clothes').select('*');
      if (!error && data && data.length > 0) {
        writeStorage(STORAGE_KEYS.CLOTHES, data);
        return data as ClothesItem[];
      }
    } catch (err) {
      console.warn('Supabase fetchClothes fallback to local:', err);
    }
  }
  return readStorage<ClothesItem[]>(STORAGE_KEYS.CLOTHES, clothesData);
}

export async function createClothes(item: Omit<ClothesItem, 'id'>): Promise<ClothesItem> {
  const current = await fetchClothes();
  const id = `cl_${Date.now()}`;
  const newItem: ClothesItem = { ...item, id };
  const next = [newItem, ...current];
  writeStorage(STORAGE_KEYS.CLOTHES, next);

  if (isSupabaseConfigured && supabase) {
    try {
      await (supabase as any).from('clothes').insert([newItem]);
    } catch (err) {
      console.warn('Supabase createClothes error:', err);
    }
  }
  return newItem;
}

export async function updateClothes(id: string, updates: Partial<ClothesItem>): Promise<ClothesItem | null> {
  const current = await fetchClothes();
  let updated: ClothesItem | null = null;
  const next = current.map((i) => {
    if (i.id === id) {
      updated = { ...i, ...updates };
      return updated;
    }
    return i;
  });
  if (updated) {
    writeStorage(STORAGE_KEYS.CLOTHES, next);
    if (isSupabaseConfigured && supabase) {
      try {
        await (supabase as any).from('clothes').update(updates).eq('id', id);
      } catch (err) {
        console.warn('Supabase updateClothes error:', err);
      }
    }
  }
  return updated;
}

export async function deleteClothes(id: string): Promise<boolean> {
  const current = await fetchClothes();
  writeStorage(STORAGE_KEYS.CLOTHES, current.filter((i) => i.id !== id));
  if (isSupabaseConfigured && supabase) {
    try {
      await (supabase as any).from('clothes').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase deleteClothes error:', err);
    }
  }
  return true;
}

// ─── CRM BOOKINGS & LEADS CRUD ───

export async function fetchBookings(): Promise<CrmBookingRecord[]> {
  initializeDatabase();
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await (supabase as any).from('bookings').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        writeStorage(STORAGE_KEYS.BOOKINGS, data);
        return data as CrmBookingRecord[];
      }
    } catch (err) {
      console.warn('Supabase fetchBookings fallback to local:', err);
    }
  }
  return readStorage<CrmBookingRecord[]>(STORAGE_KEYS.BOOKINGS, SEED_BOOKINGS);
}

// Helper to sync status update to user session and checklists in localStorage
function syncBookingStatusToUserStorage(
  targetBooking: CrmBookingRecord,
  status: CrmBookingStatus,
  rejectionReason?: string
) {
  if (typeof window === 'undefined') return;

  // 1. Resolve specific target customer ID
  let targetCustomerId = targetBooking.customerId;
  if (!targetCustomerId && targetBooking.customerEmail) {
    const foundUser = db.findUserByEmail(targetBooking.customerEmail);
    if (foundUser) {
      targetCustomerId = foundUser.id;
    }
  }

  // 2. Sync active Auth Session ONLY if the currently logged-in user is the target customer
  const sessionKey = 'wedding_app_auth_session_v2';
  try {
    const raw = localStorage.getItem(sessionKey);
    if (raw) {
      const session = JSON.parse(raw);
      const isTargetUser =
        (targetCustomerId && session.user?.id === targetCustomerId) ||
        (targetBooking.customerEmail &&
          session.user?.email &&
          session.user.email.toLowerCase() === targetBooking.customerEmail.toLowerCase());

      if (isTargetUser && session.user?.userBookings) {
        let changed = false;
        session.user.userBookings = session.user.userBookings.map((b: any) => {
          const match =
            b.id === targetBooking.id ||
            b.serviceName === targetBooking.serviceOrItemName ||
            b.vendorName === targetBooking.serviceOrItemName ||
            (b.serviceName && targetBooking.serviceOrItemName && (
              b.serviceName.toLowerCase().includes(targetBooking.serviceOrItemName.toLowerCase()) ||
              targetBooking.serviceOrItemName.toLowerCase().includes(b.serviceName.toLowerCase())
            )) ||
            (b.vendorName && targetBooking.serviceOrItemName && (
              b.vendorName.toLowerCase().includes(targetBooking.serviceOrItemName.toLowerCase()) ||
              targetBooking.serviceOrItemName.toLowerCase().includes(b.vendorName.toLowerCase())
            ));

          if (match) {
            changed = true;
            return {
              ...b,
              id: targetBooking.id || b.id,
              status,
              rejectionReason: rejectionReason !== undefined ? rejectionReason : b.rejectionReason,
            };
          }
          return b;
        });
        if (changed) {
          localStorage.setItem(sessionKey, JSON.stringify(session));
        }
      }
    }
  } catch (err) {
    console.error('Error syncing booking to auth session:', err);
  }

  // 3. Sync bride, groom, and tasks checklists ONLY for this target customer's keys
  try {
    const targetKeys: string[] = [];
    if (targetCustomerId) {
      // Strictly target ONLY this user's checklists
      targetKeys.push(
        `wedding_services_checklist_bride_${targetCustomerId}`,
        `wedding_services_checklist_groom_${targetCustomerId}`,
        `wedding_tasks_${targetCustomerId}`
      );
    } else {
      // Fallback: If no customer ID could be resolved, iterate keys but match ONLY on exact booking ID
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key &&
          (key.startsWith('wedding_services_checklist_bride_') ||
            key.startsWith('wedding_services_checklist_groom_') ||
            key.startsWith('wedding_tasks_'))
        ) {
          targetKeys.push(key);
        }
      }
    }

    for (const key of targetKeys) {
      const raw = localStorage.getItem(key);
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          let changed = false;
          const updated = list.map((item: any) => {
            const isIdMatch = item.id && targetBooking.id && item.id === targetBooking.id;
            const isNameMatch =
              targetCustomerId &&
              (item.serviceName === targetBooking.serviceOrItemName ||
                item.name === targetBooking.serviceOrItemName ||
                (item.serviceName && targetBooking.serviceOrItemName && (
                  item.serviceName.toLowerCase().includes(targetBooking.serviceOrItemName.toLowerCase()) ||
                  targetBooking.serviceOrItemName.toLowerCase().includes(item.serviceName.toLowerCase())
                )));

            if (isIdMatch || isNameMatch) {
              changed = true;
              return {
                ...item,
                id: targetBooking.id || item.id,
                status,
                rejectionReason: rejectionReason !== undefined ? rejectionReason : item.rejectionReason,
              };
            }
            return item;
          });
          if (changed) {
            localStorage.setItem(key, JSON.stringify(updated));
          }
        }
      }
    }
  } catch (err) {
    console.error('Error syncing checklists:', err);
  }

  // 4. Dispatch events to trigger immediate React state updates
  window.dispatchEvent(
    new CustomEvent('knot_booking_status_synced', {
      detail: {
        id: targetBooking.id,
        customerId: targetCustomerId,
        serviceOrItemName: targetBooking.serviceOrItemName,
        category: targetBooking.category,
        customerEmail: targetBooking.customerEmail,
        status,
        rejectionReason,
      },
    })
  );
  window.dispatchEvent(new CustomEvent('wedding_data_changed'));
}

export async function createBooking(
  data: Omit<CrmBookingRecord, 'id' | 'createdAt'> & { id?: string }
): Promise<CrmBookingRecord> {
  const current = await fetchBookings();
  const id = data.id || `bkg_${Date.now()}`;
  const newBooking: CrmBookingRecord = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
  };

  const next = [newBooking, ...current];
  writeStorage(STORAGE_KEYS.BOOKINGS, next);

  if (isSupabaseConfigured && supabase) {
    try {
      await (supabase as any).from('bookings').insert([newBooking]);
    } catch (err) {
      console.warn('Supabase createBooking error:', err);
    }
  }

  return newBooking;
}

export async function updateBookingStatus(
  id: string,
  status: CrmBookingRecord['status'],
  rejectionReason?: string
): Promise<CrmBookingRecord | null> {
  const current = await fetchBookings();
  let updated: CrmBookingRecord | null = null;
  const next = current.map((b) => {
    if (b.id === id) {
      updated = {
        ...b,
        status,
        rejectionReason: rejectionReason !== undefined ? rejectionReason : b.rejectionReason,
      };
      return updated;
    }
    return b;
  });

  if (updated) {
    writeStorage(STORAGE_KEYS.BOOKINGS, next);
    syncBookingStatusToUserStorage(updated, status, rejectionReason);

    if (isSupabaseConfigured && supabase) {
      try {
        await (supabase as any)
          .from('bookings')
          .update({ status, rejection_reason: rejectionReason })
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase updateBookingStatus error:', err);
      }
    }
  }

  return updated;
}

export async function deleteBooking(id: string): Promise<boolean> {
  const current = await fetchBookings();
  writeStorage(STORAGE_KEYS.BOOKINGS, current.filter((b) => b.id !== id));
  if (isSupabaseConfigured && supabase) {
    try {
      await (supabase as any).from('bookings').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase deleteBooking error:', err);
    }
  }
  return true;
}

// ─── SYSTEM UTILITIES ───

export function resetDatabaseToDefaults(): void {
  writeStorage(STORAGE_KEYS.SERVICES, vendorsData);
  writeStorage(STORAGE_KEYS.JEWELLERY, jewelleryData);
  writeStorage(STORAGE_KEYS.CLOTHES, clothesData);
  writeStorage(STORAGE_KEYS.BOOKINGS, SEED_BOOKINGS);
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
}

export function exportFullDatabaseJson(): string {
  const data = {
    exportedAt: new Date().toISOString(),
    services: readStorage(STORAGE_KEYS.SERVICES, vendorsData),
    jewellery: readStorage(STORAGE_KEYS.JEWELLERY, jewelleryData),
    clothes: readStorage(STORAGE_KEYS.CLOTHES, clothesData),
    bookings: readStorage(STORAGE_KEYS.BOOKINGS, SEED_BOOKINGS),
  };
  return JSON.stringify(data, null, 2);
}
