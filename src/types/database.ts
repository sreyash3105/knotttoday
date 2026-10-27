import type { Vendor, JewelleryItem, ClothesItem } from '@/types';
import type { CrmBookingRecord } from '@/db/servicesDb';

export interface Database {
  public: {
    Tables: {
      services: {
        Row: Vendor;
        Insert: Partial<Vendor> & { id: string; name: string; category: string };
        Update: Partial<Vendor>;
      };
      jewellery: {
        Row: JewelleryItem;
        Insert: Partial<JewelleryItem> & { id: string; name: string };
        Update: Partial<JewelleryItem>;
      };
      clothes: {
        Row: ClothesItem;
        Insert: Partial<ClothesItem> & { id: string; name: string };
        Update: Partial<ClothesItem>;
      };
      bookings: {
        Row: CrmBookingRecord;
        Insert: Partial<CrmBookingRecord> & { id: string; customerName: string };
        Update: Partial<CrmBookingRecord>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
