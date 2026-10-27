-- ============================================================
-- KNOT TODAY WEDDING PLATFORM — PRODUCTION MIGRATION
-- ============================================================
-- Automatically executed by Supabase GitHub integration or Supabase CLI
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ────────────────────────────────────────────────────────────
-- 1. TABLE: services (Wedding Services & Experiences Catalog)
-- ────────────────────────────────────────────────────────────
create table if not exists public.services (
  id text primary key,
  name text not null,
  category text not null,
  location text,
  rating numeric default 4.8,
  "priceRange" text,
  description text,
  image text,
  phone text,
  whatsapp text,
  services text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- 2. TABLE: jewellery (Fine Bridal & Groom Jewellery)
-- ────────────────────────────────────────────────────────────
create table if not exists public.jewellery (
  id text primary key,
  name text not null,
  category text not null,
  "forWhom" text default 'Bride',
  "rentalPrice" numeric not null,
  "securityDeposit" numeric not null,
  availability text default 'Available',
  "rentalDuration" text default '3 days',
  description text,
  image text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- 3. TABLE: clothes (Haute Couture Bridal & Groom Attire)
-- ────────────────────────────────────────────────────────────
create table if not exists public.clothes (
  id text primary key,
  name text not null,
  category text not null,
  "forWhom" text default 'Bride',
  size text default 'M',
  color text,
  "rentalPrice" numeric not null,
  "securityDeposit" numeric not null,
  availability text default 'Available',
  "rentalDuration" text default '3 days',
  description text,
  image text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- 4. TABLE: bookings (Customer Inquiries, Bookings & Status)
-- ────────────────────────────────────────────────────────────
create table if not exists public.bookings (
  id text primary key,
  "customerId" text,
  "customerName" text not null,
  "customerEmail" text,
  "customerPhone" text,
  "serviceOrItemName" text not null,
  category text,
  "bookingType" text default 'service',
  "eventDate" text,
  "returnDate" text,
  price text,
  status text default 'Pending' check (status in ('Pending', 'In Review', 'Confirmed', 'Completed', 'Declined', 'Rejected')),
  notes text,
  "rejectionReason" text,
  "createdAt" timestamptz default now(),
  created_at timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- 5. TABLE: users (Registered Couple Accounts & Admin)
-- ────────────────────────────────────────────────────────────
create table if not exists public.users (
  id text primary key,
  email text unique not null,
  "passwordHash" text not null,
  "brideName" text,
  "groomName" text,
  "coupleInitials" text,
  "weddingDate" text,
  location text,
  role text default 'couple',
  status text default 'active',
  "hasBooking" boolean default false,
  "createdAt" timestamptz default now(),
  "updatedAt" timestamptz default now(),
  "lastLoginAt" timestamptz
);

-- ────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ────────────────────────────────────────────────────────────
alter table public.services enable row level security;
alter table public.jewellery enable row level security;
alter table public.clothes enable row level security;
alter table public.bookings enable row level security;
alter table public.users enable row level security;

-- Services RLS
create policy "Allow public read on services" on public.services for select using (true);
create policy "Allow all insert on services" on public.services for insert with check (true);
create policy "Allow all update on services" on public.services for update using (true);
create policy "Allow all delete on services" on public.services for delete using (true);

-- Jewellery RLS
create policy "Allow public read on jewellery" on public.jewellery for select using (true);
create policy "Allow all insert on jewellery" on public.jewellery for insert with check (true);
create policy "Allow all update on jewellery" on public.jewellery for update using (true);
create policy "Allow all delete on jewellery" on public.jewellery for delete using (true);

-- Clothes RLS
create policy "Allow public read on clothes" on public.clothes for select using (true);
create policy "Allow all insert on clothes" on public.clothes for insert with check (true);
create policy "Allow all update on clothes" on public.clothes for update using (true);
create policy "Allow all delete on clothes" on public.clothes for delete using (true);

-- Bookings RLS
create policy "Allow public read on bookings" on public.bookings for select using (true);
create policy "Allow all insert on bookings" on public.bookings for insert with check (true);
create policy "Allow all update on bookings" on public.bookings for update using (true);
create policy "Allow all delete on bookings" on public.bookings for delete using (true);

-- Users RLS
create policy "Allow public read on users" on public.users for select using (true);
create policy "Allow all insert on users" on public.users for insert with check (true);
create policy "Allow all update on users" on public.users for update using (true);

-- ────────────────────────────────────────────────────────────
-- SEED DATA 1: System Admin Account
-- ────────────────────────────────────────────────────────────
insert into public.users (
  id,
  email,
  "passwordHash",
  "brideName",
  "groomName",
  "coupleInitials",
  "weddingDate",
  location,
  role,
  status,
  "hasBooking"
) values (
  'admin_knot_today',
  'admin@knottoday.com',
  'hash_demo_admin123',
  'Knot Today',
  'Admin',
  'KT',
  'Headquarters',
  'Mumbai, India',
  'admin',
  'active',
  false
) on conflict (id) do nothing;

-- ────────────────────────────────────────────────────────────
-- SEED DATA 2: Core Wedding Services
-- ────────────────────────────────────────────────────────────
insert into public.services (id, name, category, location, rating, "priceRange", description, image, phone, whatsapp, services) values
('v1', 'Glow Bridal Studio', 'Makeup Artists', 'Udaipur', 4.9, '₹15,000 – ₹35,000', 'Premium bridal makeup with HD finish and airbrush techniques.', 'https://images.pexels.com/photos/16799888/pexels-photo-16799888.jpeg?auto=compress&cs=tinysrgb&w=1200', '+91 98765 11111', '+91 98765 11111', '{"Bridal Makeup","Reception Makeup","Hairstyling","Mehendi Makeup"}'),
('v2', 'Aura Beauty Lounge', 'Makeup Artists', 'Jaipur', 4.7, '₹10,000 – ₹28,000', 'Expert artists for traditional and contemporary bridal looks.', 'https://images.pexels.com/photos/32588056/pexels-photo-32588056.jpeg?auto=compress&cs=tinysrgb&w=1200', '+91 98765 22222', '+91 98765 22222', '{"Bridal Makeup","Groom Grooming","Hairstyling"}'),
('v5', 'DJ Aakash Beats', 'DJ / Music', 'Udaipur', 4.8, '₹25,000 – ₹60,000', 'High-energy DJ nights with Bollywood and EDM fusion.', 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1200', '+91 98888 11111', '+91 98888 11111', '{"Sangeet DJ","DJ Night","Sound System"}'),
('v9', 'Candid Canvas Studio', 'Photography', 'Udaipur', 4.9, '₹50,000 – ₹1,50,000', 'Award-winning candid and traditional wedding photography with cinematic drone storytelling.', 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1200', '+91 99999 11111', '+91 99999 11111', '{"Candid Photography","Videography","Drone Photography","Pre-Wedding Shoot"}'),
('v13', 'Blossom Decor Studio', 'Decoration', 'Udaipur', 4.8, '₹50,000 – ₹2,00,000', 'Luxury floral and thematic wedding decor.', 'https://images.pexels.com/photos/34079355/pexels-photo-34079355.jpeg?auto=compress&cs=tinysrgb&w=1200', '+91 97777 11111', '+91 97777 11111', '{"Wedding Stage","Mandap","Floral Decoration","Lighting"}'),
('v17', 'Maharaja Feast Caterers', 'Catering', 'Udaipur', 4.8, '₹1,500 – ₹2,400 / plate', 'Royal Rajasthani and multi-cuisine wedding catering with silver thali dining and 56-bhog banquets.', 'https://images.pexels.com/photos/32689476/pexels-photo-32689476.jpeg?auto=compress&cs=tinysrgb&w=1200', '+91 96666 11111', '+91 96666 11111', '{"North Indian","South Indian","Desserts","Beverages","Live Chaat Counter"}')
on conflict (id) do nothing;

-- ────────────────────────────────────────────────────────────
-- SEED DATA 3: Fine Jewellery Pieces
-- ────────────────────────────────────────────────────────────
insert into public.jewellery (id, name, category, "forWhom", "rentalPrice", "securityDeposit", availability, "rentalDuration", description, image) values
('jw1', 'Royal Bridal Necklace Set', 'Bridal Sets', 'Bride', 15000, 50000, 'Available', '3 days', 'Exquisite kundan and pearl bridal necklace with matching earrings.', 'https://images.pexels.com/photos/28941551/pexels-photo-28941551.jpeg?auto=compress&cs=tinysrgb&w=1200'),
('jw2', 'Traditional Choker Set', 'Necklaces', 'Bride', 8000, 30000, 'Available', '2 days', 'Gold-plated choker with intricate meenakari work.', 'https://images.pexels.com/photos/19869152/pexels-photo-19869152.jpeg?auto=compress&cs=tinysrgb&w=1200'),
('jw3', 'Long Temple Necklace', 'Necklaces', 'Bride', 12000, 40000, 'Limited', '3 days', 'South Indian temple jewellery long necklace with Lakshmi motifs.', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200'),
('jw4', 'Pearl Jhumka Earrings', 'Earrings & Jhumkas', 'Bride', 3500, 12000, 'Available', '2 days', 'Elegant pearl and gold jhumka earrings.', 'https://images.pexels.com/photos/20021569/pexels-photo-20021569.jpeg?auto=compress&cs=tinysrgb&w=1200'),
('jw8', 'Matha Patti – Royal', 'Matha Patti', 'Bride', 6000, 20000, 'Available', '2 days', 'Three-tier matha patti with intricate gold work.', 'https://images.pexels.com/photos/37163992/pexels-photo-37163992.jpeg?auto=compress&cs=tinysrgb&w=1200'),
('jw12', 'Groom Pearl Brooch', 'Groom Kilangi & Mala', 'Groom', 1500, 5000, 'Available', '2 days', 'Elegant pearl brooch for sherwani.', 'https://images.pexels.com/photos/28802603/pexels-photo-28802603.jpeg?auto=compress&cs=tinysrgb&w=1200')
on conflict (id) do nothing;

-- ────────────────────────────────────────────────────────────
-- SEED DATA 4: Haute Couture Attire
-- ────────────────────────────────────────────────────────────
insert into public.clothes (id, name, category, "forWhom", size, color, "rentalPrice", "securityDeposit", availability, "rentalDuration", description, image) values
('c1', 'Red Bridal Lehenga – Royal', 'Bridal Lehenga', 'Bride', 'M', 'Red', 25000, 80000, 'Available', '3 days', 'Heavy zardozi embroidered red bridal lehenga with dupatta.', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200'),
('c3', 'Reception Gown – Champagne', 'Reception Gown', 'Bride', 'S', 'Champagne', 15000, 50000, 'Available', '2 days', 'Elegant champagne reception gown with sequin work.', 'https://images.pexels.com/photos/19869152/pexels-photo-19869152.jpeg?auto=compress&cs=tinysrgb&w=1200'),
('c4', 'Mehendi Outfit – Yellow', 'Sangeet Outfit', 'Bride', 'M', 'Yellow', 6000, 20000, 'Available', '2 days', 'Bright yellow lehenga for mehendi ceremony.', 'https://images.pexels.com/photos/28941551/pexels-photo-28941551.jpeg?auto=compress&cs=tinysrgb&w=1200'),
('c8', 'Cream Sherwani – Royal', 'Groom Sherwani', 'Groom', 'L', 'Cream', 18000, 60000, 'Available', '3 days', 'Heavy embroidered cream sherwani with churidar.', 'https://images.pexels.com/photos/28802603/pexels-photo-28802603.jpeg?auto=compress&cs=tinysrgb&w=1200'),
('c9', 'Navy Blue Reception Suit', 'Tuxedo', 'Groom', 'L', 'Navy', 12000, 40000, 'Available', '2 days', 'Tailored navy blue three-piece suit for reception.', 'https://images.pexels.com/photos/37163992/pexels-photo-37163992.jpeg?auto=compress&cs=tinysrgb&w=1200')
on conflict (id) do nothing;
