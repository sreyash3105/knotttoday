import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Plus,
  Pencil,
  Trash2,
  Search,
  ExternalLink,
  ShieldCheck,
  ArrowLeft,
  Phone,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  Camera,
  Music2,
  Flower2,
  UtensilsCrossed,
  Heart,
  Gem,
  Shirt,
  Calendar,
  X,
  Star,
  Users,
  LayoutDashboard,
  ClipboardList,
  ChevronRight,
  TrendingUp,
  XCircle,
  Building2,
  SlidersHorizontal,
  LogOut,
  Mail,
  DollarSign,
  Check,
} from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { useServices } from '@/context/ServicesContext';
import { useToast } from '@/hooks/useToast';
import type { Vendor, JewelleryItem, ClothesItem } from '@/types';
import type { CrmBookingRecord, CrmBookingStatus } from '@/db/servicesDb';
import { images } from '@/data/mockData';
import { db } from '@/db';

// Aesthetic preset photos for quick service creation
const PRESET_IMAGES = [
  { label: 'Candid Photography', url: images.photography },
  { label: 'Cinematography & Film', url: images.photography2 },
  { label: 'Floral Mandap Decor', url: images.mandap },
  { label: 'Luxury Stage', url: images.stageFloral },
  { label: 'Celebrity DJ & Sound', url: images.dj },
  { label: 'Live Rhythm Band', url: images.dj2 },
  { label: 'Royal Banquet Feast', url: images.food },
  { label: 'Bridal HD Makeup', url: images.makeup },
];

export function CompanyCrmPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    services,
    jewellery,
    clothes,
    bookings,
    addService,
    editService,
    deleteServiceById,
    addJewelleryItem,
    editJewelleryItem,
    deleteJewelleryItemById,
    addClothesItem,
    editClothesItem,
    deleteClothesItemById,
    changeBookingStatus,
    deleteBookingById,
  } = useServices();

  // Corporate Navigation Tabs: 'overview' | 'leads' | 'customers' | 'services' | 'rentals'
  const [navSection, setNavSection] = useState<'overview' | 'leads' | 'customers' | 'services' | 'rentals'>('overview');

  // Customer Detail Page selection state
  const [selectedCustomerEmail, setSelectedCustomerEmail] = useState<string | null>(null);

  // Filter & Search states
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState<string>('all');
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    category: 'Photography',
    location: 'Udaipur',
    priceRange: '₹50,000 – ₹1,50,000',
    description: '',
    image: images.photography,
    phone: '+91 99999 11111',
    whatsapp: '+91 99999 11111',
    tagsInput: 'Candid Photography, Videography, Drone, Pre-Wedding',
    rating: 4.9,
  });

  // Rental Modal state
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [rentalKind, setRentalKind] = useState<'jewellery' | 'clothes'>('jewellery');
  const [editingRentalId, setEditingRentalId] = useState<string | null>(null);
  const [rentalForm, setRentalForm] = useState({
    name: '',
    category: 'Bridal Necklace',
    forWhom: 'Bride' as 'Bride' | 'Groom',
    rentalPrice: 15000,
    securityDeposit: 50000,
    availability: 'Available' as 'Available' | 'Limited' | 'Booked',
    rentalDuration: '3 days',
    description: '',
    image: images.jewellery1,
    size: 'Free',
    color: 'Red',
  });

  // Delete Confirm modal
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'service' | 'jewellery' | 'clothes' | 'booking';
    id: string;
    title: string;
  } | null>(null);

  // Rejection with Reason modal state
  const [rejectingBooking, setRejectingBooking] = useState<CrmBookingRecord | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('Item or service already reserved for this date');

  const openRejectModal = (b: CrmBookingRecord) => {
    setRejectingBooking(b);
    setRejectionReasonInput('Item or service already reserved for this date');
  };

  const handleConfirmRejection = async () => {
    if (!rejectingBooking) return;
    const finalReason = rejectionReasonInput.trim() || 'Item or service unavailable for this date';
    await changeBookingStatus(rejectingBooking.id, 'Rejected', finalReason);
    showToast(`Request rejected with reason: "${finalReason}". Client portal updated.`, 'info');
    setRejectingBooking(null);
  };

  // ─── CUSTOMERS LIST (Aggregated from real registered couple accounts in DB) ───
  const [customerList, setCustomerList] = useState(() => {
    return db
      .getAllUsers()
      .filter((u) => u.role === 'couple')
      .map((u) => ({
        id: u.id,
        name: `${u.brideName} & ${u.groomName}`,
        brideName: u.brideName,
        groomName: u.groomName,
        email: u.email,
        phone: '+91 Not Provided',
        weddingDate: u.weddingDate || 'Date Pending',
        location: u.location || 'Venue Pending',
        status: u.hasBooking ? 'Active Bookings' : 'New Couple Account',
      }));
  });

  // Re-sync customer list on data change
  useEffect(() => {
    const handleSync = () => {
      setCustomerList(
        db
          .getAllUsers()
          .filter((u) => u.role === 'couple')
          .map((u) => ({
            id: u.id,
            name: `${u.brideName} & ${u.groomName}`,
            brideName: u.brideName,
            groomName: u.groomName,
            email: u.email,
            phone: '+91 Not Provided',
            weddingDate: u.weddingDate || 'Date Pending',
            location: u.location || 'Venue Pending',
            status: u.hasBooking ? 'Active Bookings' : 'New Couple Account',
          }))
      );
    };
    window.addEventListener('wedding_data_changed', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('wedding_data_changed', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Selected customer details
  const currentSelectedCustomer = customerList.find((c) => c.email === selectedCustomerEmail);
  const selectedCustomerBookings = bookings.filter((b) => {
    if (!currentSelectedCustomer) return false;
    if (b.customerId && b.customerId === currentSelectedCustomer.id) return true;
    if (
      b.customerEmail &&
      currentSelectedCustomer.email &&
      b.customerEmail.toLowerCase() === currentSelectedCustomer.email.toLowerCase()
    ) {
      return true;
    }
    if (
      currentSelectedCustomer.brideName &&
      b.customerName &&
      b.customerName.toLowerCase().includes(currentSelectedCustomer.brideName.toLowerCase())
    ) {
      return true;
    }
    return false;
  });

  // ─── Filtered Services ───
  const filteredServices = services.filter((srv) => {
    const srvCat = (srv.category || '').toLowerCase();
    const srvName = (srv.name || '').toLowerCase();
    const srvDesc = (srv.description || '').toLowerCase();
    const srvLoc = (srv.location || '').toLowerCase();
    const srvServices = srv.services || [];
    const searchLow = searchQuery.toLowerCase();

    const matchCategory =
      serviceCategoryFilter === 'all' ||
      srvCat.includes(serviceCategoryFilter.toLowerCase());
    const matchSearch =
      srvName.includes(searchLow) ||
      srvDesc.includes(searchLow) ||
      srvLoc.includes(searchLow) ||
      srvServices.some((s) => (s || '').toLowerCase().includes(searchLow));
    return matchCategory && matchSearch;
  });

  // ─── Filtered Bookings / Leads ───
  const filteredBookings = bookings.filter((b) => {
    const bStatus = (b.status || '').toLowerCase();
    const searchLow = searchQuery.toLowerCase();
    const matchStatus = leadStatusFilter === 'all' || bStatus === leadStatusFilter.toLowerCase();
    const matchSearch =
      (b.customerName || '').toLowerCase().includes(searchLow) ||
      (b.serviceOrItemName || '').toLowerCase().includes(searchLow) ||
      (b.category || '').toLowerCase().includes(searchLow);
    return matchStatus && matchSearch;
  });

  // ─── Service Handlers ───
  const openNewServiceModal = () => {
    setEditingServiceId(null);
    setServiceForm({
      name: '',
      category: 'Photography',
      location: 'Udaipur',
      priceRange: '₹40,000 – ₹1,20,000',
      description: 'Professional royal wedding service team with cinematic coverage and high quality delivery.',
      image: images.photography,
      phone: '+91 99999 11111',
      whatsapp: '+91 99999 11111',
      tagsInput: 'Candid Photography, Cinematic Video, Drone',
      rating: 4.9,
    });
    setIsServiceModalOpen(true);
  };

  const openEditServiceModal = (srv: Vendor) => {
    setEditingServiceId(srv.id);
    setServiceForm({
      name: srv.name,
      category: srv.category,
      location: srv.location,
      priceRange: srv.priceRange,
      description: srv.description,
      image: srv.image,
      phone: srv.phone,
      whatsapp: srv.whatsapp,
      tagsInput: srv.services.join(', '),
      rating: srv.rating || 4.9,
    });
    setIsServiceModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.name.trim()) {
      showToast('Please enter a service name', 'error');
      return;
    }

    const tagsArray = serviceForm.tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingServiceId) {
      await editService(editingServiceId, {
        name: serviceForm.name,
        category: serviceForm.category,
        location: serviceForm.location,
        priceRange: serviceForm.priceRange,
        description: serviceForm.description,
        image: serviceForm.image,
        phone: serviceForm.phone,
        whatsapp: serviceForm.whatsapp,
        services: tagsArray,
        rating: Number(serviceForm.rating),
      });
      showToast(`Updated "${serviceForm.name}" successfully!`, 'success');
    } else {
      await addService({
        name: serviceForm.name,
        category: serviceForm.category,
        location: serviceForm.location,
        priceRange: serviceForm.priceRange,
        description: serviceForm.description,
        image: serviceForm.image,
        phone: serviceForm.phone,
        whatsapp: serviceForm.whatsapp,
        services: tagsArray.length > 0 ? tagsArray : [serviceForm.category],
        rating: Number(serviceForm.rating),
      });
      showToast(`Added "${serviceForm.name}" to catalog!`, 'success');
    }

    setIsServiceModalOpen(false);
  };

  // ─── Rental Handlers (Jewellery & Clothes) ───
  const openNewJewelleryModal = () => {
    setRentalKind('jewellery');
    setEditingRentalId(null);
    setRentalForm({
      name: '',
      category: 'Bridal Sets',
      forWhom: 'Bride',
      rentalPrice: 15000,
      securityDeposit: 40000,
      availability: 'Available',
      rentalDuration: '3 days',
      description: 'Handcrafted heirloom jewellery with uncut stones and 22K gold finish.',
      image: images.jewellery1,
      size: 'Free / Adjustable',
      color: 'Gold / Emerald',
    });
    setIsRentalModalOpen(true);
  };

  const openEditJewelleryModal = (item: JewelleryItem) => {
    setRentalKind('jewellery');
    setEditingRentalId(item.id);
    setRentalForm({
      name: item.name,
      category: item.category,
      forWhom: item.forWhom || 'Bride',
      rentalPrice: item.rentalPrice,
      securityDeposit: item.securityDeposit,
      availability: item.availability || 'Available',
      rentalDuration: item.rentalDuration || '3 days',
      description: item.description,
      image: item.image,
      size: 'Free / Adjustable',
      color: 'Gold',
    });
    setIsRentalModalOpen(true);
  };

  const openNewClothesModal = () => {
    setRentalKind('clothes');
    setEditingRentalId(null);
    setRentalForm({
      name: '',
      category: 'Bridal Lehenga',
      forWhom: 'Bride',
      rentalPrice: 25000,
      securityDeposit: 50000,
      availability: 'Available',
      rentalDuration: '3 days',
      description: 'Royal bridal velvet & silk lehenga with hand-embroidered zardozi and sequins.',
      image: images.brideRedLehenga,
      size: 'M',
      color: 'Crimson Red',
    });
    setIsRentalModalOpen(true);
  };

  const openEditClothesModal = (item: ClothesItem) => {
    setRentalKind('clothes');
    setEditingRentalId(item.id);
    setRentalForm({
      name: item.name,
      category: item.category,
      forWhom: item.forWhom || 'Bride',
      rentalPrice: item.rentalPrice,
      securityDeposit: item.securityDeposit,
      availability: item.availability || 'Available',
      rentalDuration: item.rentalDuration || '3 days',
      description: item.description,
      image: item.image,
      size: item.size || 'M',
      color: item.color || 'Red',
    });
    setIsRentalModalOpen(true);
  };

  const handleSaveRental = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rentalForm.name.trim()) {
      showToast('Please enter an item name', 'error');
      return;
    }

    if (rentalKind === 'jewellery') {
      if (editingRentalId) {
        await editJewelleryItem(editingRentalId, {
          name: rentalForm.name,
          category: rentalForm.category,
          forWhom: rentalForm.forWhom,
          rentalPrice: Number(rentalForm.rentalPrice),
          securityDeposit: Number(rentalForm.securityDeposit),
          availability: rentalForm.availability,
          rentalDuration: rentalForm.rentalDuration,
          description: rentalForm.description,
          image: rentalForm.image,
        });
        showToast(`Updated jewellery "${rentalForm.name}" successfully!`, 'success');
      } else {
        await addJewelleryItem({
          name: rentalForm.name,
          category: rentalForm.category,
          forWhom: rentalForm.forWhom,
          rentalPrice: Number(rentalForm.rentalPrice),
          securityDeposit: Number(rentalForm.securityDeposit),
          availability: rentalForm.availability,
          rentalDuration: rentalForm.rentalDuration,
          description: rentalForm.description,
          image: rentalForm.image,
        });
        showToast(`Added new jewellery piece "${rentalForm.name}"!`, 'success');
      }
    } else {
      if (editingRentalId) {
        await editClothesItem(editingRentalId, {
          name: rentalForm.name,
          category: rentalForm.category,
          forWhom: rentalForm.forWhom,
          size: rentalForm.size,
          color: rentalForm.color,
          rentalPrice: Number(rentalForm.rentalPrice),
          securityDeposit: Number(rentalForm.securityDeposit),
          availability: rentalForm.availability,
          rentalDuration: rentalForm.rentalDuration,
          description: rentalForm.description,
          image: rentalForm.image,
        });
        showToast(`Updated attire "${rentalForm.name}" successfully!`, 'success');
      } else {
        await addClothesItem({
          name: rentalForm.name,
          category: rentalForm.category,
          forWhom: rentalForm.forWhom,
          size: rentalForm.size,
          color: rentalForm.color,
          rentalPrice: Number(rentalForm.rentalPrice),
          securityDeposit: Number(rentalForm.securityDeposit),
          availability: rentalForm.availability,
          rentalDuration: rentalForm.rentalDuration,
          description: rentalForm.description,
          image: rentalForm.image,
        });
        showToast(`Added new attire item "${rentalForm.name}"!`, 'success');
      }
    }

    setIsRentalModalOpen(false);
  };

  // ─── Status change handler with cross-sync toast ───
  const handleUpdateStatus = async (id: string, newStatus: CrmBookingStatus) => {
    await changeBookingStatus(id, newStatus);
    if (newStatus === 'Rejected' || newStatus === 'Declined') {
      showToast(`Request rejected. Status updated to "Rejected" on customer portal.`, 'info');
    } else {
      showToast(`Status updated to "${newStatus}". Synced with customer portal.`, 'success');
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] text-slate-800 font-sans">
      {/* ═════════════════════════════════════════════════════════
          1. CORPORATE STYLE DARK SIDEBAR
      ══════════════════════════════════════════════════════════ */}
      <aside className="w-64 flex-shrink-0 bg-[#0F172A] text-slate-300 flex flex-col border-r border-slate-800 select-none">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <BrandLogo size="md" variant="light" />
          </Link>
          <span className="rounded bg-burgundy-950 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-champagne-300 border border-burgundy-800/60">
            CRM
          </span>
        </div>

        {/* Corporate Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Management
          </div>

          <button
            onClick={() => {
              setNavSection('overview');
              setSelectedCustomerEmail(null);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              navSection === 'overview'
                ? 'bg-burgundy-900 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => {
              setNavSection('customers');
              setSelectedCustomerEmail(null);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              navSection === 'customers'
                ? 'bg-burgundy-900 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4" />
              <span>Customers &amp; Couples</span>
            </div>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">
              {customerList.length}
            </span>
          </button>

          <button
            onClick={() => {
              setNavSection('leads');
              setSelectedCustomerEmail(null);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              navSection === 'leads'
                ? 'bg-burgundy-900 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <ClipboardList className="h-4 w-4" />
              <span>Leads &amp; Bookings</span>
            </div>
            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
              {bookings.length}
            </span>
          </button>

          <div className="pt-4 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Catalog &amp; Inventory
          </div>

          <button
            onClick={() => {
              setNavSection('services');
              setSelectedCustomerEmail(null);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              navSection === 'services'
                ? 'bg-burgundy-900 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Camera className="h-4 w-4" />
              <span>Services Catalog</span>
            </div>
            <span className="text-[11px] text-slate-500">{services.length}</span>
          </button>

          <button
            onClick={() => {
              setNavSection('rentals');
              setSelectedCustomerEmail(null);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              navSection === 'rentals'
                ? 'bg-burgundy-900 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Gem className="h-4 w-4" />
              <span>Wardrobe &amp; Jewellery</span>
            </div>
            <span className="text-[11px] text-slate-500">{jewellery.length + clothes.length}</span>
          </button>
        </nav>

        {/* Corporate Sidebar Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-burgundy-800 flex items-center justify-center text-xs font-bold text-champagne-300 border border-burgundy-600">
                KT
              </div>
              <div>
                <div className="text-xs font-bold text-white leading-tight">Admin Staff</div>
                <div className="text-[10px] text-slate-400">Knot Today HQ</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              navigate('/login?portal=company');
            }}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5 text-rose-400" />
            <span>Staff Log Out</span>
          </button>
        </div>
      </aside>

      {/* ═════════════════════════════════════════════════════════
          2. CRM MAIN CONTENT AREA
      ══════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold text-slate-900 capitalize">
              {selectedCustomerEmail
                ? `Customer File: ${currentSelectedCustomer?.name}`
                : navSection === 'overview'
                ? 'Executive Dashboard'
                : navSection === 'customers'
                ? 'Couples & Client Directory'
                : navSection === 'leads'
                ? 'Booking Requests & Leads Pipeline'
                : navSection === 'services'
                ? 'Wedding Services Directory'
                : 'Rental Wardrobe & Jewellery Inventory'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {navSection === 'services' && (
              <button
                onClick={openNewServiceModal}
                className="inline-flex items-center gap-1.5 rounded-lg bg-burgundy-900 px-3.5 py-1.5 text-xs font-semibold text-champagne-300 hover:bg-burgundy-950 transition-all shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Service</span>
              </button>
            )}

            <button
              onClick={() => {
                navigate('/login?portal=company');
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-rose-600 hover:border-rose-200 transition-colors shadow-2xs"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </header>

        {/* Dynamic Body Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* ══════════════════════════════════════════════════════
              SUB-PAGE: CUSTOMER DETAIL PAGE
          ═══════════════════════════════════════════════════════ */}
          {selectedCustomerEmail && currentSelectedCustomer ? (
            <div className="space-y-6 max-w-5xl">
              {/* Back button */}
              <button
                onClick={() => setSelectedCustomerEmail(null)}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Couples Directory</span>
              </button>

              {/* Customer Profile Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-burgundy-800 to-rose-600 flex items-center justify-center text-xl font-serif font-bold text-white shadow-md">
                      {(currentSelectedCustomer.brideName?.[0] || 'B')}&amp;{(currentSelectedCustomer.groomName?.[0] || 'G')}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {currentSelectedCustomer.brideName || 'Bride'} &amp; {currentSelectedCustomer.groomName || 'Groom'}
                      </h2>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span>✉️ {currentSelectedCustomer.email}</span>
                        <span>•</span>
                        <span>📞 {currentSelectedCustomer.phone}</span>
                      </div>
                    </div>
                  </div>

                  <span className="rounded-full bg-burgundy-50 px-3 py-1 text-xs font-bold text-burgundy-900 border border-burgundy-200">
                    {currentSelectedCustomer.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Wedding Date</span>
                    <span className="text-slate-800 font-bold mt-0.5 block">
                      {currentSelectedCustomer.weddingDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Venue / City</span>
                    <span className="text-slate-800 font-bold mt-0.5 block">
                      {currentSelectedCustomer.location}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Requested Services / Items</span>
                    <span className="text-slate-800 font-bold mt-0.5 block">
                      {selectedCustomerBookings.length} Inquiries
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Bookings / Inquiries Table */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-4">
                  Requested Services &amp; Rental Orders
                </h3>

                {selectedCustomerBookings.length > 0 ? (
                  <div className="space-y-3">
                    {selectedCustomerBookings.map((b) => (
                      <div
                        key={b.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/60"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-900">
                              {b.serviceOrItemName}
                            </h4>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-200/80 px-2 py-0.5 rounded">
                              {b.category} • {b.bookingType}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            Date: <span className="font-semibold text-slate-700">{b.eventDate || 'TBD'}</span> • Price: <span className="font-semibold text-burgundy-900">{b.price}</span>
                          </div>
                          {b.notes && (
                            <p className="text-xs text-slate-600 mt-1 italic">
                              "{b.notes}"
                            </p>
                          )}
                          {b.rejectionReason && (b.status === 'Rejected' || b.status === 'Declined') && (
                            <p className="text-xs text-rose-600 mt-1 font-medium bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-block">
                              Declined Reason: {b.rejectionReason}
                            </p>
                          )}
                        </div>

                        {/* Status Controls */}
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-lg px-2.5 py-1 text-xs font-bold border ${
                              b.status === 'Confirmed'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : b.status === 'Rejected' || b.status === 'Declined'
                                ? 'bg-rose-50 text-rose-800 border-rose-200'
                                : b.status === 'In Review'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            {b.status}
                          </span>

                          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
                            <button
                              onClick={() => handleUpdateStatus(b.id, 'Confirmed')}
                              className="px-2 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-50 rounded"
                              title="Accept & Confirm"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(b.id, 'In Review')}
                              className="px-2 py-1 text-[11px] font-bold text-blue-700 hover:bg-blue-50 rounded"
                              title="Mark In Review"
                            >
                              Review
                            </button>
                            <button
                              onClick={() => openRejectModal(b)}
                              className="px-2 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-50 rounded"
                              title="Reject Request with Reason (reflects on user portal)"
                            >
                              Reject...
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No active inquiries placed by this couple yet.
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* ══════════════════════════════════════════════════════
              SECTION 1: OVERVIEW DASHBOARD
          ═══════════════════════════════════════════════════════ */}
          {!selectedCustomerEmail && navSection === 'overview' && (
            <div className="space-y-6 max-w-6xl">
              {/* Executive Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-xs">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Total Active Services
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-2">{services.length}</div>
                  <div className="text-[11px] text-emerald-600 font-medium mt-1">
                    Across 5 core categories
                  </div>
                </div>

                <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-xs">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Client Inquiries
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-2">{bookings.length}</div>
                  <div className="text-[11px] text-amber-600 font-medium mt-1">
                    {bookings.filter((b) => b.status === 'Pending').length} Pending Review
                  </div>
                </div>

                <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-xs">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Rental Inventory
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-2">
                    {jewellery.length + clothes.length}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-1">
                    Jewellery &amp; Haute Couture
                  </div>
                </div>

                <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-xs">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Registered Couples
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-2">{customerList.length}</div>
                  <div className="text-[11px] text-emerald-600 font-medium mt-1">
                    Active on platform
                  </div>
                </div>
              </div>

              {/* Recent Inquiries Preview */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900">Recent Client Inquiries</h3>
                  <button
                    onClick={() => setNavSection('leads')}
                    className="text-xs font-bold text-burgundy-900 hover:underline"
                  >
                    View All &rarr;
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {bookings.slice(0, 5).map((b) => (
                    <div key={b.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{b.customerName}</span>
                        <span className="text-slate-400 mx-2">•</span>
                        <span className="text-slate-600 font-medium">{b.serviceOrItemName}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500">{b.eventDate || 'TBD'}</span>
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            b.status === 'Confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.status === 'Rejected' || b.status === 'Declined'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════
              SECTION 2: CUSTOMERS & COUPLES DIRECTORY
          ═══════════════════════════════════════════════════════ */}
          {!selectedCustomerEmail && navSection === 'customers' && (
            <div className="space-y-4 max-w-5xl">
              {customerList.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
                  <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                    <Heart className="h-6 w-6 text-rose-500" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">No Registered Couples Yet</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    When couples create accounts on Knot Today, their profiles, celebration dates, and booking requests will automatically appear here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customerList.map((customer) => {
                    const matchedBookings = bookings.filter((b) => {
                      if (b.customerId && b.customerId === customer.id) return true;
                      if (
                        b.customerEmail &&
                        customer.email &&
                        b.customerEmail.toLowerCase() === customer.email.toLowerCase()
                      ) {
                        return true;
                      }
                      if (
                        customer.brideName &&
                        b.customerName &&
                        b.customerName.toLowerCase().includes(customer.brideName.toLowerCase())
                      ) {
                        return true;
                      }
                      return false;
                    });
                    const customerBookingsCount = matchedBookings.length;
                    const dynamicStatus =
                      customerBookingsCount > 0
                        ? `${customerBookingsCount} Active ${customerBookingsCount === 1 ? 'Booking' : 'Bookings'}`
                        : 'New Couple Account';

                    return (
                      <div
                        key={customer.id}
                        onClick={() => setSelectedCustomerEmail(customer.email)}
                        className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-burgundy-300 hover:shadow-md cursor-pointer transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl bg-burgundy-900 text-white font-serif font-bold text-lg flex items-center justify-center">
                              {(customer.brideName?.[0] || customer.name?.[0] || 'C')}&amp;{(customer.groomName?.[0] || '')}
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-900 text-sm">{customer.name}</h3>
                              <p className="text-xs text-slate-500">{customer.email}</p>
                            </div>
                          </div>
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            customerBookingsCount > 0
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {dynamicStatus}
                          </span>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                          <span>📍 {customer.location}</span>
                          <span className="font-bold text-burgundy-900">
                            {customerBookingsCount} Requests &rarr;
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════
              SECTION 3: LEADS & BOOKINGS PIPELINE
          ═══════════════════════════════════════════════════════ */}
          {!selectedCustomerEmail && navSection === 'leads' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Filter Bar */}
              <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  {['all', 'Pending', 'In Review', 'Confirmed', 'Rejected'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setLeadStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                        leadStatusFilter === status
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                <div className="relative w-64">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by client or service..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="py-3 px-4">Client</th>
                      <th className="py-3 px-4">Service / Item</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          No service booking requests in this view. As couples book services or rentals, orders will appear here for company review.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/50">
                          <td className="py-3.5 px-4 font-bold text-slate-900">{b.customerName}</td>
                          <td className="py-3.5 px-4 font-medium text-slate-700">
                            {b.serviceOrItemName}
                            <span className="block text-[10px] text-slate-400">{b.category}</span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">{b.eventDate || 'TBD'}</td>
                          <td className="py-3.5 px-4 font-semibold text-burgundy-900">{b.price}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                b.status === 'Confirmed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : b.status === 'Rejected' || b.status === 'Declined'
                                  ? 'bg-rose-100 text-rose-800'
                                  : b.status === 'In Review'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => handleUpdateStatus(b.id, 'Confirmed')}
                                className="px-2 py-1 text-[10px] font-bold text-emerald-700 hover:bg-emerald-50 rounded border border-emerald-200"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => openRejectModal(b)}
                                className="px-2 py-1 text-[10px] font-bold text-rose-700 hover:bg-rose-50 rounded border border-rose-200"
                              >
                                Reject...
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════
              SECTION 4: WEDDING SERVICES CATALOG
          ═══════════════════════════════════════════════════════ */}
          {!selectedCustomerEmail && navSection === 'services' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredServices.map((srv) => (
                  <div
                    key={srv.id}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-44 bg-slate-100">
                      <img
                        src={srv.image}
                        alt={srv.name}
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200';
                        }}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute top-2 left-2 rounded bg-slate-900/80 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                        {srv.category}
                      </span>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-slate-900 text-sm">{srv.name}</h4>
                        <span className="text-xs font-semibold text-burgundy-900">
                          {srv.priceRange}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{srv.description}</p>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-400">📍 {srv.location}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openEditServiceModal(srv)}
                            className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded border border-slate-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                type: 'service',
                                id: srv.id,
                                title: srv.name,
                              })
                            }
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════
              SECTION 5: RENTALS INVENTORY (JEWELLERY & ATTIRE)
          ═══════════════════════════════════════════════════════ */}
          {!selectedCustomerEmail && navSection === 'rentals' && (
            <div className="space-y-6 max-w-6xl">
              {/* Inventory Control Header */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-serif">
                    Rental Wardrobe &amp; Jewellery Inventory
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage heirloom jewellery sets and designer wedding attire. All additions and edits reflect live in the customer rental hubs.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={openNewJewelleryModal}
                    className="inline-flex items-center gap-2 rounded-xl bg-burgundy-900 px-4 py-2 text-xs font-bold text-champagne-300 shadow-sm hover:bg-burgundy-950 transition-all"
                  >
                    <Gem className="h-4 w-4 text-champagne-400" />
                    <span>+ Add Jewellery Piece</span>
                  </button>
                  <button
                    onClick={openNewClothesModal}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-black transition-all"
                  >
                    <Shirt className="h-4 w-4 text-champagne-300" />
                    <span>+ Add Clothes / Attire Item</span>
                  </button>
                </div>
              </div>

              {/* 1. Fine Jewellery Section */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                      <Gem className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Fine Jewellery Collection</h3>
                      <p className="text-[11px] text-slate-400">{jewellery.length} heirloom pieces in database</p>
                    </div>
                  </div>
                  <button
                    onClick={openNewJewelleryModal}
                    className="text-xs font-bold text-burgundy-900 hover:underline"
                  >
                    + Add Piece
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {jewellery.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:shadow-md transition-all flex flex-col group"
                    >
                      <div className="relative h-36 rounded-lg bg-slate-100 overflow-hidden mb-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200';
                          }}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2 left-2 rounded-md bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-white">
                          {item.forWhom}
                        </span>
                        <span className={`absolute top-2 right-2 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          item.availability === 'Available'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-amber-500 text-white'
                        }`}>
                          {item.availability}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs text-slate-900 truncate" title={item.name}>
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.category}</p>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-burgundy-900">
                            ₹{item.rentalPrice.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Deposit: ₹{item.securityDeposit.toLocaleString('en-IN')}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditJewelleryModal(item)}
                            title="Edit Piece"
                            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                type: 'jewellery',
                                id: item.id,
                                title: item.name,
                              })
                            }
                            title="Delete Piece"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Haute Couture Attire & Clothes Section */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
                      <Shirt className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Haute Couture Attire &amp; Outfits</h3>
                      <p className="text-[11px] text-slate-400">{clothes.length} royal ensembles in database</p>
                    </div>
                  </div>
                  <button
                    onClick={openNewClothesModal}
                    className="text-xs font-bold text-burgundy-900 hover:underline"
                  >
                    + Add Attire
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {clothes.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:shadow-md transition-all flex flex-col group"
                    >
                      <div className="relative h-36 rounded-lg bg-slate-100 overflow-hidden mb-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200';
                          }}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2 left-2 rounded-md bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-white">
                          {item.forWhom} • Size {item.size}
                        </span>
                        <span className={`absolute top-2 right-2 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          item.availability === 'Available'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-amber-500 text-white'
                        }`}>
                          {item.availability}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs text-slate-900 truncate" title={item.name}>
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {item.category} • {item.color}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-burgundy-900">
                            ₹{item.rentalPrice.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Deposit: ₹{item.securityDeposit.toLocaleString('en-IN')}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditClothesModal(item)}
                            title="Edit Attire"
                            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                type: 'clothes',
                                id: item.id,
                                title: item.name,
                              })
                            }
                            title="Delete Attire"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

                  </main>
      </div>

      {/* ═══════════════════════════════════════════════════════
          MODAL: ADD / EDIT SERVICE
      ════════════════════════════════════════════════════════ */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <button
              onClick={() => setIsServiceModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">
              {editingServiceId ? 'Edit Service' : 'Add New Service'}
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Service updates reflect immediately on user marketplace and category pages.
            </p>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  placeholder="e.g. Royal Lens Cinematography"
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:border-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:border-slate-500"
                  >
                    <option value="Photography">Photography &amp; Films</option>
                    <option value="DJ / Music">DJ / Music &amp; Sound</option>
                    <option value="Decoration">Decoration &amp; Themes</option>
                    <option value="Catering">Catering &amp; Banquets</option>
                    <option value="Makeup Artists">Makeup Artists</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sell Price Range</label>
                  <input
                    type="text"
                    value={serviceForm.priceRange}
                    onChange={(e) => setServiceForm({ ...serviceForm, priceRange: e.target.value })}
                    placeholder="e.g. ₹50,000 – ₹1,50,000"
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:border-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City / Location</label>
                <input
                  type="text"
                  value={serviceForm.location}
                  onChange={(e) => setServiceForm({ ...serviceForm, location: e.target.value })}
                  placeholder="e.g. Udaipur, Rajasthan"
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Service Tags (comma-separated)</label>
                <input
                  type="text"
                  value={serviceForm.tagsInput}
                  onChange={(e) => setServiceForm({ ...serviceForm, tagsInput: e.target.value })}
                  placeholder="Candid Photography, Drone, Pre-Wedding"
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={serviceForm.image}
                  onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:border-slate-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-burgundy-900 px-5 py-2 text-xs font-bold text-champagne-300 hover:bg-burgundy-950"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          MODAL: ADD / EDIT RENTAL ITEM (JEWELLERY & CLOTHES)
      ════════════════════════════════════════════════════════ */}
      {isRentalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <button
              onClick={() => setIsRentalModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              {rentalKind === 'jewellery' ? (
                <div className="h-7 w-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <Gem className="h-3.5 w-3.5" />
                </div>
              ) : (
                <div className="h-7 w-7 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
                  <Shirt className="h-3.5 w-3.5" />
                </div>
              )}
              <h3 className="text-xl font-bold text-slate-900 font-serif">
                {editingRentalId
                  ? `Edit ${rentalKind === 'jewellery' ? 'Jewellery Piece' : 'Attire Item'}`
                  : `Add New ${rentalKind === 'jewellery' ? 'Fine Jewellery Piece' : 'Couture Attire / Clothes'}`}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-5">
              Saved instantly to the database. Appears immediately on the live rental catalog and customer booking dialogs.
            </p>

            <form onSubmit={handleSaveRental} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  value={rentalForm.name}
                  onChange={(e) => setRentalForm({ ...rentalForm, name: e.target.value })}
                  placeholder={
                    rentalKind === 'jewellery'
                      ? 'e.g. Royal Polki & Emerald Bridal Choker Set'
                      : 'e.g. Sabyasachi Crimson Velvet Bridal Lehenga'
                  }
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:border-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  {rentalKind === 'jewellery' ? (
                    <select
                      value={rentalForm.category}
                      onChange={(e) => setRentalForm({ ...rentalForm, category: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:border-slate-500"
                    >
                      <option value="Bridal Sets">Bridal Sets</option>
                      <option value="Necklaces">Necklaces &amp; Chokers</option>
                      <option value="Earrings & Jhumkas">Earrings &amp; Jhumkas</option>
                      <option value="Matha Patti">Matha Patti &amp; Maang Tikka</option>
                      <option value="Bangles & Kadas">Bangles &amp; Kadas</option>
                      <option value="Groom Kilangi & Mala">Groom Kilangi &amp; Royal Mala</option>
                    </select>
                  ) : (
                    <select
                      value={rentalForm.category}
                      onChange={(e) => setRentalForm({ ...rentalForm, category: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:border-slate-500"
                    >
                      <option value="Bridal Lehenga">Bridal Lehenga</option>
                      <option value="Reception Gown">Reception Gown</option>
                      <option value="Sangeet Outfit">Sangeet Outfit</option>
                      <option value="Groom Sherwani">Groom Sherwani</option>
                      <option value="Jodhpuri Bandhgala">Jodhpuri Bandhgala</option>
                      <option value="Tuxedo">Tuxedo / Western Suit</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">For Whom</label>
                  <select
                    value={rentalForm.forWhom}
                    onChange={(e) =>
                      setRentalForm({ ...rentalForm, forWhom: e.target.value as 'Bride' | 'Groom' })
                    }
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:border-slate-500"
                  >
                    <option value="Bride">Bride</option>
                    <option value="Groom">Groom</option>
                  </select>
                </div>
              </div>

              {rentalKind === 'clothes' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Size</label>
                    <input
                      type="text"
                      value={rentalForm.size}
                      onChange={(e) => setRentalForm({ ...rentalForm, size: e.target.value })}
                      placeholder="e.g. S, M, L, XL, or Custom"
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:border-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Color / Tone</label>
                    <input
                      type="text"
                      value={rentalForm.color}
                      onChange={(e) => setRentalForm({ ...rentalForm, color: e.target.value })}
                      placeholder="e.g. Royal Red, Champagne Ivory, Navy Blue"
                      className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:border-slate-500"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rental Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={rentalForm.rentalPrice}
                    onChange={(e) => setRentalForm({ ...rentalForm, rentalPrice: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Security Deposit (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={rentalForm.securityDeposit}
                    onChange={(e) => setRentalForm({ ...rentalForm, securityDeposit: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Availability</label>
                  <select
                    value={rentalForm.availability}
                    onChange={(e) =>
                      setRentalForm({
                        ...rentalForm,
                        availability: e.target.value as 'Available' | 'Limited' | 'Booked',
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:border-slate-500"
                  >
                    <option value="Available">Available</option>
                    <option value="Limited">Limited</option>
                    <option value="Booked">Booked</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={rentalForm.image}
                  onChange={(e) => setRentalForm({ ...rentalForm, image: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:border-slate-500"
                />
                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span>Quick Presets:</span>
                  {rentalKind === 'jewellery' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setRentalForm({ ...rentalForm, image: images.jewellery1 })}
                        className="underline hover:text-burgundy-900"
                      >
                        Polki Set
                      </button>
                      <button
                        type="button"
                        onClick={() => setRentalForm({ ...rentalForm, image: images.jewellery2 })}
                        className="underline hover:text-burgundy-900"
                      >
                        Kundan Set
                      </button>
                      <button
                        type="button"
                        onClick={() => setRentalForm({ ...rentalForm, image: images.jewellery3 })}
                        className="underline hover:text-burgundy-900"
                      >
                        Temple Set
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setRentalForm({ ...rentalForm, image: images.brideRedLehenga })}
                        className="underline hover:text-burgundy-900"
                      >
                        Red Lehenga
                      </button>
                      <button
                        type="button"
                        onClick={() => setRentalForm({ ...rentalForm, image: images.groomSherwani })}
                        className="underline hover:text-burgundy-900"
                      >
                        Sherwani
                      </button>
                      <button
                        type="button"
                        onClick={() => setRentalForm({ ...rentalForm, image: images.groomFull })}
                        className="underline hover:text-burgundy-900"
                      >
                        Groom Full
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={rentalForm.description}
                  onChange={(e) => setRentalForm({ ...rentalForm, description: e.target.value })}
                  placeholder="Detailed description of craftsmanship, fabrics, purity, or accessories..."
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:border-slate-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRentalModalOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-burgundy-900 px-5 py-2 text-xs font-bold text-champagne-300 hover:bg-burgundy-950"
                >
                  Save to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          MODAL: DELETE CONFIRMATION
      ════════════════════════════════════════════════════════ */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl border border-slate-200 text-center">
            <h3 className="font-bold text-slate-900 text-base">
              Delete {deleteConfirm.type === 'service' ? 'Service' : deleteConfirm.type === 'jewellery' ? 'Jewellery Piece' : 'Attire Item'}?
            </h3>
            <p className="mt-2 text-xs text-slate-500">
              Are you sure you want to remove "{deleteConfirm.title}" from the database?
            </p>
            <div className="mt-5 flex justify-center gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="rounded-lg border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (deleteConfirm.type === 'service') {
                    await deleteServiceById(deleteConfirm.id);
                    showToast('Service deleted from database', 'info');
                  } else if (deleteConfirm.type === 'jewellery') {
                    await deleteJewelleryItemById(deleteConfirm.id);
                    showToast('Jewellery piece removed from database', 'info');
                  } else if (deleteConfirm.type === 'clothes') {
                    await deleteClothesItemById(deleteConfirm.id);
                    showToast('Attire item removed from database', 'info');
                  }
                  setDeleteConfirm(null);
                }}
                className="rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          MODAL: REJECTION REASON MODAL
      ════════════════════════════════════════════════════════ */}
      {rejectingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <button
              onClick={() => setRejectingBooking(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 text-rose-600 mb-2">
              <XCircle className="h-5 w-5" />
              <h3 className="font-bold text-slate-900 text-base">Decline Request</h3>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Specify why you cannot fulfill this request for <strong className="text-slate-900">{rejectingBooking.customerName}</strong> ({rejectingBooking.serviceOrItemName}). This reason will be displayed directly on the customer's portal.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Common Presets:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Item or service already reserved for this date',
                    'Service team fully booked for this time slot',
                    'Location outside service delivery radius',
                    'Minimum guest count criteria not met',
                    'Discontinued or under maintenance',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setRejectionReasonInput(preset)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all text-left ${
                        rejectionReasonInput === preset
                          ? 'border-rose-300 bg-rose-50 text-rose-800 font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason for Rejection *
                </label>
                <textarea
                  rows={2}
                  required
                  value={rejectionReasonInput}
                  onChange={(e) => setRejectionReasonInput(e.target.value)}
                  placeholder="Enter specific reason for declining..."
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectingBooking(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRejection}
                  className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-sm"
                >
                  Decline &amp; Notify Couple
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
