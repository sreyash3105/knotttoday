import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Vendor, JewelleryItem, ClothesItem } from '@/types';
import {
  type CrmBookingRecord,
  fetchServices,
  createService,
  updateService,
  deleteService,
  fetchJewellery,
  createJewellery,
  updateJewellery,
  deleteJewellery,
  fetchClothes,
  createClothes,
  updateClothes,
  deleteClothes,
  fetchBookings,
  createBooking,
  updateBookingStatus,
  deleteBooking,
  resetDatabaseToDefaults,
  exportFullDatabaseJson,
} from '@/db/servicesDb';
import { isSupabaseConfigured } from '@/lib/supabase';

interface ServicesContextType {
  services: Vendor[];
  jewellery: JewelleryItem[];
  clothes: ClothesItem[];
  bookings: CrmBookingRecord[];
  isLoading: boolean;
  isSupabaseActive: boolean;

  // Services
  addService: (newService: Omit<Vendor, 'id'>) => Promise<Vendor>;
  editService: (id: string, updates: Partial<Vendor>) => Promise<Vendor | null>;
  deleteServiceById: (id: string) => Promise<boolean>;

  // Rentals
  addJewelleryItem: (item: Omit<JewelleryItem, 'id'>) => Promise<JewelleryItem>;
  editJewelleryItem: (id: string, updates: Partial<JewelleryItem>) => Promise<JewelleryItem | null>;
  deleteJewelleryItemById: (id: string) => Promise<boolean>;

  addClothesItem: (item: Omit<ClothesItem, 'id'>) => Promise<ClothesItem>;
  editClothesItem: (id: string, updates: Partial<ClothesItem>) => Promise<ClothesItem | null>;
  deleteClothesItemById: (id: string) => Promise<boolean>;

  // Bookings
  addBookingRecord: (
    booking: Omit<CrmBookingRecord, 'id' | 'createdAt'> & { id?: string }
  ) => Promise<CrmBookingRecord>;
  changeBookingStatus: (
    id: string,
    status: CrmBookingRecord['status'],
    rejectionReason?: string
  ) => Promise<CrmBookingRecord | null>;
  deleteBookingById: (id: string) => Promise<boolean>;

  // Utilities
  refreshAllData: () => Promise<void>;
  resetToDefaults: () => void;
  exportDatabaseJson: () => string;
}

const ServicesContext = createContext<ServicesContextType | null>(null);

export function ServicesProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Vendor[]>([]);
  const [jewellery, setJewellery] = useState<JewelleryItem[]>([]);
  const [clothes, setClothes] = useState<ClothesItem[]>([]);
  const [bookings, setBookings] = useState<CrmBookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadAll = async () => {
    try {
      const [srv, jw, cl, bk] = await Promise.all([
        fetchServices(),
        fetchJewellery(),
        fetchClothes(),
        fetchBookings(),
      ]);
      setServices(srv);
      setJewellery(jw);
      setClothes(cl);
      setBookings(bk);
    } catch (err) {
      console.error('Failed to load database contents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAll();

    // Listen for storage or internal update events
    const handleDbUpdate = () => {
      loadAll();
    };

    window.addEventListener('knot_db_updated', handleDbUpdate);
    window.addEventListener('storage', handleDbUpdate);

    return () => {
      window.removeEventListener('knot_db_updated', handleDbUpdate);
      window.removeEventListener('storage', handleDbUpdate);
    };
  }, []);

  const handleAddService = async (newService: Omit<Vendor, 'id'>) => {
    const created = await createService(newService);
    setServices((prev) => [created, ...prev]);
    return created;
  };

  const handleEditService = async (id: string, updates: Partial<Vendor>) => {
    const updated = await updateService(id, updates);
    if (updated) {
      setServices((prev) => prev.map((item) => (item.id === id ? updated! : item)));
    }
    return updated;
  };

  const handleDeleteService = async (id: string) => {
    const success = await deleteService(id);
    if (success) {
      setServices((prev) => prev.filter((item) => item.id !== id));
    }
    return success;
  };

  const handleAddJewellery = async (item: Omit<JewelleryItem, 'id'>) => {
    const created = await createJewellery(item);
    setJewellery((prev) => [created, ...prev]);
    return created;
  };

  const handleEditJewellery = async (id: string, updates: Partial<JewelleryItem>) => {
    const updated = await updateJewellery(id, updates);
    if (updated) {
      setJewellery((prev) => prev.map((i) => (i.id === id ? updated! : i)));
    }
    return updated;
  };

  const handleDeleteJewellery = async (id: string) => {
    const success = await deleteJewellery(id);
    if (success) {
      setJewellery((prev) => prev.filter((i) => i.id !== id));
    }
    return success;
  };

  const handleAddClothes = async (item: Omit<ClothesItem, 'id'>) => {
    const created = await createClothes(item);
    setClothes((prev) => [created, ...prev]);
    return created;
  };

  const handleEditClothes = async (id: string, updates: Partial<ClothesItem>) => {
    const updated = await updateClothes(id, updates);
    if (updated) {
      setClothes((prev) => prev.map((i) => (i.id === id ? updated! : i)));
    }
    return updated;
  };

  const handleDeleteClothes = async (id: string) => {
    const success = await deleteClothes(id);
    if (success) {
      setClothes((prev) => prev.filter((i) => i.id !== id));
    }
    return success;
  };

  const handleAddBooking = async (
    booking: Omit<CrmBookingRecord, 'id' | 'createdAt'> & { id?: string }
  ) => {
    const created = await createBooking(booking);
    setBookings((prev) => [created, ...prev]);
    return created;
  };

  const handleChangeBookingStatus = async (
    id: string,
    status: CrmBookingRecord['status'],
    rejectionReason?: string
  ) => {
    const updated = await updateBookingStatus(id, status, rejectionReason);
    if (updated) {
      setBookings((prev) => prev.map((b) => (b.id === id ? updated! : b)));
    }
    return updated;
  };

  const handleDeleteBooking = async (id: string) => {
    const success = await deleteBooking(id);
    if (success) {
      setBookings((prev) => prev.filter((b) => b.id !== id));
    }
    return success;
  };

  const handleResetToDefaults = () => {
    resetDatabaseToDefaults();
    loadAll();
  };

  return (
    <ServicesContext.Provider
      value={{
        services,
        jewellery,
        clothes,
        bookings,
        isLoading,
        isSupabaseActive: isSupabaseConfigured,
        addService: handleAddService,
        editService: handleEditService,
        deleteServiceById: handleDeleteService,
        addJewelleryItem: handleAddJewellery,
        editJewelleryItem: handleEditJewellery,
        deleteJewelleryItemById: handleDeleteJewellery,
        addClothesItem: handleAddClothes,
        editClothesItem: handleEditClothes,
        deleteClothesItemById: handleDeleteClothes,
        addBookingRecord: handleAddBooking,
        changeBookingStatus: handleChangeBookingStatus,
        deleteBookingById: handleDeleteBooking,
        refreshAllData: loadAll,
        resetToDefaults: handleResetToDefaults,
        exportDatabaseJson: exportFullDatabaseJson,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
}
