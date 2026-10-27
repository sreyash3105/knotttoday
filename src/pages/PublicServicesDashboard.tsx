import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  UserRound,
  Sparkles,
  Gem,
  Shirt,
  Camera,
  Music2,
  Flower2,
  UtensilsCrossed,
  ArrowRight,
  Star,
  LogIn,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Award,
  Compass,
} from 'lucide-react';
import {
  JewelleryIcon,
  SuitDressIcon,
  BandIcon,
  PhotographyIcon,
  DecorationIcon,
  CateringIcon,
  BeautyIcon,
} from '@/components/EdenServiceIcons';
import { BookingModal } from '@/components/BookingModal';
import { RentalModal } from '@/components/RentalModal';
import { BrandLogo } from '@/components/BrandLogo';
import { images } from '@/data/mockData';
import type { Vendor, JewelleryItem, ClothesItem } from '@/types';

export function PublicServicesDashboard() {
  const navigate = useNavigate();

  const [bookingVendor, setBookingVendor] = useState<Vendor | null>(null);
  const [selectedRental, setSelectedRental] = useState<{
    item: JewelleryItem | ClothesItem;
    type: 'jewellery' | 'clothes';
  } | null>(null);

  const planningSteps = [
    {
      num: '01',
      title: 'Vision & Creative Concept',
      desc: 'We listen to your love story, define aesthetic mood boards, and create a comprehensive framework with complete transparency.',
    },
    {
      num: '02',
      title: 'Artisan & Vendor Curation',
      desc: 'Hand-selecting boutique fashion designers, Michelin-grade caterers, renowned photographers, and live orchestras.',
    },
    {
      num: '03',
      title: 'Tastings, Trials & Production',
      desc: 'Haute couture fittings, menu tastings, spatial 3D floral layouts, and meticulously timed production schedules.',
    },
    {
      num: '04',
      title: 'Your Unforgettable Celebration',
      desc: 'Our full team manages every breath of the wedding day. You simply immerse yourselves in joy and celebrate.',
    },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F4EBDD] text-stone-900 font-sans selection:bg-champagne-300 selection:text-burgundy-950">
      {/* ─── 1. LUXURY STICKY NAVBAR ─── */}
      <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/85 backdrop-blur-md transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo / Brand */}
          <Link to="/" className="group flex items-center gap-3">
            <BrandLogo size="lg" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-stone-600">
            <button
              onClick={() => scrollToSection('about')}
              className="hover:text-burgundy-800 transition-colors"
            >
              About Us
            </button>
            <button
              onClick={() => navigate('/services')}
              className="hover:text-burgundy-800 transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('process')}
              className="hover:text-burgundy-800 transition-colors"
            >
              Planning Process
            </button>
          </nav>

          {/* Client Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 rounded-full border border-burgundy-900/30 bg-burgundy-950 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-champagne-300 shadow-sm transition-all hover:bg-burgundy-900 hover:shadow"
            >
              <LogIn className="h-3.5 w-3.5 text-champagne-400" />
              <span>Client Portal</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── 2. GRAND HERO OPENING SECTION (EDITORIAL LUXURY STYLE) ─── */}
      <section className="relative overflow-hidden bg-burgundy-950 text-white">
        <div className="absolute inset-0">
          <img
            src={images.heroBride}
            alt="Luxury Wedding Celebration"
            className="h-full w-full object-cover object-center opacity-35 filter brightness-90 scale-105 animate-pulse duration-[10000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950 via-burgundy-950/60 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,transparent_0%,rgba(26,6,12,0.7)_100%)]" />
        </div>

        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 py-28 text-center sm:py-36 lg:py-44">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-champagne-400/30 bg-white/10 px-4 py-1.5 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-champagne-300" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne-200">
              Luxury Wedding Planning & Event Design
            </span>
          </div>

          <h1 className="font-serif text-4xl font-normal leading-tight tracking-tight text-white drop-shadow-md sm:text-6xl lg:text-7xl">
            We Plan, <span className="italic font-serif text-champagne-300">You Celebrate.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base font-light leading-relaxed text-stone-200 sm:text-xl">
            From fairytale spatial decoration and curated couture rentals to world-class entertainment and seamless day-of coordination—we craft bespoke, stress-free weddings tailored to your love story.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/services')}
              className="btn-gold inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-xs font-bold uppercase tracking-widest shadow-xl transition-transform hover:scale-105"
            >
              <span>Explore Curated Services</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-white"
            >
              <LogIn className="h-4 w-4 text-champagne-300" />
              <span>Client Dashboard Login</span>
            </button>
          </div>

          {/* Luxury Pillars Badges */}
          <div className="mt-16 grid grid-cols-2 gap-4 border-t border-white/15 pt-8 sm:grid-cols-4 sm:gap-8">
            <div className="text-center">
              <p className="font-serif text-2xl font-bold text-champagne-300">100+</p>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-stone-300">Bespoke Weddings</p>
            </div>
            <div className="text-center">
              <p className="font-serif text-2xl font-bold text-champagne-300">Full Service</p>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-stone-300">Concept to Execution</p>
            </div>
            <div className="text-center">
              <p className="font-serif text-2xl font-bold text-champagne-300">Curated</p>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-stone-300">Exclusive Artisans</p>
            </div>
            <div className="text-center">
              <p className="font-serif text-2xl font-bold text-champagne-300">Transparent</p>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-stone-300">Budget Framework</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. ABOUT OUR PHILOSOPHY (THE STORY) ─── */}
      <section id="about" className="py-24 bg-white border-b border-stone-200">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Visual Portrait */}
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-stone-100">
                <img
                  src={images.brideRedLehenga}
                  alt="Bridal Haute Couture"
                  className="h-[520px] w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 hidden sm:block rounded-2xl border border-champagne-200 bg-white p-5 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-champagne-100 text-champagne-800">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-burgundy-900">Bespoke Excellence</p>
                    <p className="text-xs text-charcoal/60">Dedicated On-The-Day Team</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Editorial Story */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-burgundy-100 bg-burgundy-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-burgundy-800">
                <span>Our Philosophy</span>
              </div>

              <h2 className="mt-4 font-serif text-3xl font-normal tracking-tight text-burgundy-950 sm:text-4xl lg:text-5xl">
                Born Out of Love & <span className="italic">Personal Experience</span>
              </h2>

              <p className="mt-6 text-base leading-relaxed text-stone-600 font-light">
                Our wedding event agency was founded out of a shared passion for crafting celebrations that feel deeply personal, radiant, and true to your story. We believe wedding planning shouldn't feel like endless checklists or overwhelming stress.
              </p>

              <blockquote className="mt-6 border-l-2 border-champagne-400 pl-4 italic font-serif text-lg text-burgundy-900">
                “A resounding ‘YES’ to every vision. We stay by your side from the first mood board to the final dance—ensuring you feel supported at every step.”
              </blockquote>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-stone-200 bg-[#F4EBDD] p-5">
                  <ShieldCheck className="h-6 w-6 text-champagne-700 mb-2" />
                  <h4 className="font-bold text-stone-900 text-sm">Full Transparency</h4>
                  <p className="mt-1 text-xs text-stone-500">
                    Clear budget frameworks, honest advice, and direct vendor coordination with zero hidden surprises.
                  </p>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-[#F4EBDD] p-5">
                  <Compass className="h-6 w-6 text-champagne-700 mb-2" />
                  <h4 className="font-bold text-stone-900 text-sm">Every Single Detail</h4>
                  <p className="mt-1 text-xs text-stone-500">
                    From couture fittings and menu tastings to stage lighting and airport transfers for your guests.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. SIGNATURE WEDDING SERVICES (7 CORE TOPICS) ─── */}
      <section id="services" className="py-24 bg-white border-b border-stone-200">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-champagne-800">
              Curated Offerings
            </span>
            <h2 className="mt-3 font-serif text-3xl font-normal text-burgundy-950 sm:text-4xl">
              Signature Wedding Services
            </h2>
            <div className="mt-4 mx-auto w-16 h-0.5 bg-champagne-400" />
          </div>

          {/* Row 1: 4 topics -> Jewellery Rental, Clothes Rental, Music & DJ, Photography */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-12">
            {/* 1. JEWELLERY RENTAL */}
            <div
              onClick={() => navigate('/jewellery')}
              className="group cursor-pointer flex flex-col items-center text-center transition-all duration-300"
            >
              <div className="flex h-20 w-20 items-center justify-center">
                <JewelleryIcon className="w-16 h-16 text-[#78716c] transition-all duration-300 group-hover:scale-105 group-hover:text-burgundy-900" />
              </div>
              <h3 className="mt-5 font-serif text-[13px] md:text-[14px] font-medium uppercase tracking-[0.25em] text-[#292524] group-hover:text-burgundy-950 transition-colors">
                JEWELLERY RENTAL
              </h3>
              <p className="mt-5 text-[12.5px] leading-[1.8] text-[#57534e] font-light text-left">
                Adorn your celebrations with timeless royalty. Browse our curated collection of heritage Kundan chokers, layered Polki necklaces, antique bridal sets, and regal maang tikkas.
              </p>
            </div>

            {/* 2. CLOTHES RENTAL */}
            <div
              onClick={() => navigate('/clothes')}
              className="group cursor-pointer flex flex-col items-center text-center transition-all duration-300"
            >
              <div className="flex h-20 w-20 items-center justify-center">
                <SuitDressIcon className="w-16 h-16 text-[#78716c] transition-all duration-300 group-hover:scale-105 group-hover:text-burgundy-900" />
              </div>
              <h3 className="mt-5 font-serif text-[13px] md:text-[14px] font-medium uppercase tracking-[0.25em] text-[#292524] group-hover:text-burgundy-950 transition-colors">
                CLOTHES RENTAL
              </h3>
              <p className="mt-5 text-[12.5px] leading-[1.8] text-[#57534e] font-light text-left">
                Find the dream wardrobe tailored to your elegance, from hand-embroidered zardozi bridal lehengas and reception gowns to bespoke royal velvet sherwanis, bandhgalas, and silk safas.
              </p>
            </div>

            {/* 3. MUSIC & DJ */}
            <div
              onClick={() => navigate('/music-dj')}
              className="group cursor-pointer flex flex-col items-center text-center transition-all duration-300"
            >
              <div className="flex h-20 w-20 items-center justify-center">
                <BandIcon className="w-16 h-16 text-[#78716c] transition-all duration-300 group-hover:scale-105 group-hover:text-burgundy-900" />
              </div>
              <h3 className="mt-5 font-serif text-[13px] md:text-[14px] font-medium uppercase tracking-[0.25em] text-[#292524] group-hover:text-burgundy-950 transition-colors">
                MUSIC &amp; DJ
              </h3>
              <p className="mt-5 text-[12.5px] leading-[1.8] text-[#57534e] font-light text-left">
                For many guests, the vibrant heartbeat of the wedding. We connect you with top live bands, Sufi ensembles, headline DJs, brass bands, and acoustic orchestras to elevate every celebration.
              </p>
            </div>

            {/* 4. PHOTOGRAPHY */}
            <div
              onClick={() => navigate('/photography')}
              className="group cursor-pointer flex flex-col items-center text-center transition-all duration-300"
            >
              <div className="flex h-20 w-20 items-center justify-center">
                <PhotographyIcon className="w-16 h-16 text-[#78716c] transition-all duration-300 group-hover:scale-105 group-hover:text-burgundy-900" />
              </div>
              <h3 className="mt-5 font-serif text-[13px] md:text-[14px] font-medium uppercase tracking-[0.25em] text-[#292524] group-hover:text-burgundy-950 transition-colors">
                PHOTOGRAPHY
              </h3>
              <p className="mt-5 text-[12.5px] leading-[1.8] text-[#57534e] font-light text-left">
                Capture your unforgettable love story in a breathtaking way. Award-winning candid photographers, 4K cinematic film trailers, pre-wedding sessions, and curated scenic location shoots.
              </p>
            </div>
          </div>

          {/* Thin Horizontal Divider Between Rows */}
          <div className="my-14 border-t border-stone-200" />

          {/* Row 2: 3 topics centered -> Decoration, Catering, Makeup Artists */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-12 max-w-5xl mx-auto">
            {/* 5. DECORATION */}
            <div
              onClick={() => navigate('/decoration')}
              className="group cursor-pointer flex flex-col items-center text-center transition-all duration-300"
            >
              <div className="flex h-20 w-20 items-center justify-center">
                <DecorationIcon className="w-16 h-16 text-[#78716c] transition-all duration-300 group-hover:scale-105 group-hover:text-burgundy-900" />
              </div>
              <h3 className="mt-5 font-serif text-[13px] md:text-[14px] font-medium uppercase tracking-[0.25em] text-[#292524] group-hover:text-burgundy-950 transition-colors">
                DECORATION
              </h3>
              <p className="mt-5 text-[12.5px] leading-[1.8] text-[#57534e] font-light text-left">
                Enrich your celebration space with fairytale floral architecture. Bespoke mandap styling, fresh floral arches, ambient starlight chandeliers, and luxury stage sets tailored to your vision.
              </p>
            </div>

            {/* 6. CATERING */}
            <div
              onClick={() => navigate('/catering')}
              className="group cursor-pointer flex flex-col items-center text-center transition-all duration-300"
            >
              <div className="flex h-20 w-20 items-center justify-center">
                <CateringIcon className="w-16 h-16 text-[#78716c] transition-all duration-300 group-hover:scale-105 group-hover:text-burgundy-900" />
              </div>
              <h3 className="mt-5 font-serif text-[13px] md:text-[14px] font-medium uppercase tracking-[0.25em] text-[#292524] group-hover:text-burgundy-950 transition-colors">
                CATERING
              </h3>
              <p className="mt-5 text-[12.5px] leading-[1.8] text-[#57534e] font-light text-left">
                Indulge your guests with exquisite culinary experiences. Michelin-inspired multi-cuisine buffets, authentic traditional feasts, live gourmet counters, signature mocktails, and artisanal desserts.
              </p>
            </div>

            {/* 7. MAKEUP ARTISTS */}
            <div
              onClick={() => navigate('/makeup')}
              className="group cursor-pointer flex flex-col items-center text-center transition-all duration-300"
            >
              <div className="flex h-20 w-20 items-center justify-center">
                <BeautyIcon className="w-16 h-16 text-[#78716c] transition-all duration-300 group-hover:scale-105 group-hover:text-burgundy-900" />
              </div>
              <h3 className="mt-5 font-serif text-[13px] md:text-[14px] font-medium uppercase tracking-[0.25em] text-[#292524] group-hover:text-burgundy-950 transition-colors">
                MAKEUP ARTISTS
              </h3>
              <p className="mt-5 text-[12.5px] leading-[1.8] text-[#57534e] font-light text-left">
                Radiate effortless beauty on your special day with premier bridal makeup and hairstyling. Personalized looks that complement your attire, featuring complete pre-wedding trials and luxury pampering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. THE 4-STEP PLANNING PROCESS ─── */}
      <section id="process" className="py-24 bg-[#F4EBDD]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-champagne-800">
              How We Work
            </span>
            <h2 className="mt-3 font-serif text-3xl font-normal text-burgundy-950 sm:text-5xl">
              The Planning Journey
            </h2>
            <p className="mt-4 text-stone-600 font-light text-base">
              A structured, stress-free road to your wedding day, keeping you excited at every milestone.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {planningSteps.map((step) => (
              <div
                key={step.num}
                className="relative rounded-3xl bg-white border border-stone-200 p-8 shadow-sm transition-all hover:shadow-md"
              >
                <span className="font-serif text-4xl font-bold text-champagne-400">
                  {step.num}
                </span>
                <h3 className="mt-4 font-serif text-lg font-bold text-burgundy-950">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-stone-600 font-light">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. CLOSING INVITATION BANNER & FOOTER ─── */}
      <footer className="bg-burgundy-950 text-white pt-20 pb-12 border-t border-champagne-500/20">
        <div className="mx-auto max-w-7xl px-6">
          {/* Main Consultation Banner */}
          <div className="rounded-3xl border border-champagne-400/20 bg-gradient-to-r from-burgundy-900/80 to-burgundy-950 p-10 sm:p-16 text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-champagne-300">
              Start Your Journey
            </span>
            <h2 className="mt-3 font-serif text-3xl sm:text-5xl font-normal text-white">
              Ready to Craft Your Fairytale?
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-sm text-stone-300 font-light">
              Schedule a personalized consultation with our senior planners or access your booked portal to review schedules and contracts.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="btn-gold rounded-full px-8 py-3.5 text-xs font-bold uppercase tracking-widest shadow-lg hover:scale-105"
              >
                Access Client Portal
              </button>
              <button
                onClick={() => navigate('/services')}
                className="rounded-full border border-white/40 bg-white/10 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm hover:bg-white/20"
              >
                Browse Full Catalog
              </button>
            </div>
          </div>

          {/* Footer Grid */}
          <div className="grid gap-8 pb-12 border-b border-white/10 sm:grid-cols-2 lg:grid-cols-4 text-xs font-light text-stone-400">
            <div>
              <Link to="/" className="inline-block mb-4 hover:opacity-85 transition-opacity" title="Back to main page">
                <BrandLogo variant="light" size="lg" />
              </Link>
              <p className="leading-relaxed">
                Knot Today crafts bespoke, high-luxury wedding experiences and bespoke celebration design with transparent planning.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-champagne-300">About Us</button></li>
                <li><button onClick={() => navigate('/services')} className="hover:text-champagne-300">Signature Services</button></li>
                <li><button onClick={() => scrollToSection('process')} className="hover:text-champagne-300">Planning Process</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">
                Curated Services
              </h4>
              <ul className="space-y-2">
                <li><Link to="/jewellery" className="hover:text-champagne-300">Jewellery Rental</Link></li>
                <li><Link to="/clothes" className="hover:text-champagne-300">Clothes Rental</Link></li>
                <li><Link to="/music-dj" className="hover:text-champagne-300">Music &amp; DJ</Link></li>
                <li><Link to="/photography" className="hover:text-champagne-300">Photography</Link></li>
                <li><Link to="/decoration" className="hover:text-champagne-300">Decoration</Link></li>
                <li><Link to="/catering" className="hover:text-champagne-300">Catering</Link></li>
                <li><Link to="/makeup" className="hover:text-champagne-300">Makeup Artists</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-3 text-[11px]">
                Contact &amp; Consultations
              </h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-champagne-400" /> Destination &amp; Royal Palace Weddings</li>
                <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-champagne-400" /> +91 (0) 98765 43210</li>
                <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-champagne-400" /> concierge@weddingeventmanager.com</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 text-center text-[11px] text-stone-500 font-light flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} Wedding Event Manager. All rights reserved.</p>
            <p>Designed with elegance for couples worldwide.</p>
          </div>
        </div>
      </footer>

      {/* ─── MODALS ─── */}
      {bookingVendor && (
        <BookingModal
          isOpen={!!bookingVendor}
          onClose={() => setBookingVendor(null)}
          vendor={bookingVendor}
        />
      )}

      {selectedRental && (
        <RentalModal
          isOpen={!!selectedRental}
          onClose={() => setSelectedRental(null)}
          item={selectedRental.item}
          type={selectedRental.type}
        />
      )}
    </div>
  );
}
