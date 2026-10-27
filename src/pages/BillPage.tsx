import { useState, useEffect } from 'react';
import {
  Receipt,
  Heart,
  UserRound,
  Sparkles,
  Printer,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  UtensilsCrossed,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { classifyBookingTarget } from '@/utils/bookingRouter';
import { guestsData } from '@/data/mockData';
import type { ServiceChecklistItem } from '@/pages/PreparationPages';
import type { Task, Guest } from '@/types';
import type { UserBooking } from '@/types/auth';

interface BillItem {
  id: string;
  name: string;
  category: string;
  priceString: string;
  priceNumber: number;
  status: string;
  rejectionReason?: string;
  source: 'bride' | 'groom' | 'others';
}

function parsePrice(priceStr?: string | number): number {
  if (typeof priceStr === 'number') return priceStr;
  if (!priceStr) return 0;
  const matches = priceStr.match(/[\d,]+/g);
  if (!matches || matches.length === 0) return 0;
  const nums = matches.map((m) => parseInt(m.replace(/,/g, ''), 10)).filter((n) => !isNaN(n));
  if (nums.length === 0) return 0;
  return nums[0];
}

function getStatusBadgeStyle(status: string): string {
  if (status === 'COMPLETED' || status === 'Confirmed' || status === 'Completed') {
    return 'bg-emerald-50 text-emerald-800 border border-emerald-300';
  }
  if (status === 'Rejected' || status === 'Declined') {
    return 'bg-rose-50 text-rose-800 border border-rose-300';
  }
  if (status === 'In Review') {
    return 'bg-blue-50 text-blue-800 border border-blue-300';
  }
  return 'bg-amber-50 text-amber-800 border border-amber-300';
}

export function BillPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const userId = user?.id || 'visitor';
  const brideKey = `wedding_services_checklist_bride_${userId}`;
  const groomKey = `wedding_services_checklist_groom_${userId}`;
  const tasksKey = `wedding_tasks_${userId}`;
  const guestsKey = `wedding_guests_list_${userId}`;
  const plateRateKey = `wedding_plate_rate_${userId}`;

  const [brideItems, setBrideItems] = useState<BillItem[]>([]);
  const [groomItems, setGroomItems] = useState<BillItem[]>([]);
  const [otherItems, setOtherItems] = useState<BillItem[]>([]);

  // Guest list & Dynamic Catering state
  const [guests, setGuests] = useState<Guest[]>([]);
  const [plateRate, setPlateRate] = useState<number>(1500);

  const loadBillData = () => {
    // 1. Bride items
    let brideRaw: ServiceChecklistItem[] = [];
    try {
      const saved = localStorage.getItem(brideKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) brideRaw = parsed;
      }
    } catch (e) {
      console.error(e);
    }

    const bItems: BillItem[] = brideRaw.map((item) => ({
      id: item.id,
      name: item.serviceName,
      category: item.category,
      priceString: item.estimatedPrice || 'On Request',
      priceNumber: (item.status as string) === 'Rejected' || (item.status as string) === 'Declined' ? 0 : parsePrice(item.estimatedPrice),
      status: item.status || 'Pending',
      rejectionReason: (item as any).rejectionReason,
      source: 'bride',
    }));

    // 2. Groom items
    let groomRaw: ServiceChecklistItem[] = [];
    try {
      const saved = localStorage.getItem(groomKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) groomRaw = parsed;
      }
    } catch (e) {
      console.error(e);
    }

    const gItems: BillItem[] = groomRaw.map((item) => ({
      id: item.id,
      name: item.serviceName,
      category: item.category,
      priceString: item.estimatedPrice || 'On Request',
      priceNumber: (item.status as string) === 'Rejected' || (item.status as string) === 'Declined' ? 0 : parsePrice(item.estimatedPrice),
      status: item.status || 'Pending',
      rejectionReason: (item as any).rejectionReason,
      source: 'groom',
    }));

    // 3. Others (General wedding services & bookings)
    const oItems: BillItem[] = [];

    if (user?.userBookings) {
      user.userBookings.forEach((b: UserBooking) => {
        const target = classifyBookingTarget(b.category, b.serviceName, b.vendorName);
        if (target === 'tasks') {
          oItems.push({
            id: b.id,
            name: b.vendorName ? `${b.vendorName} (${b.category || b.serviceName})` : b.serviceName || 'Vendor Service',
            category: b.category || 'Wedding Service',
            priceString: String(b.price || (b.status === 'Rejected' ? 'Rejected' : 'Pending')),
            priceNumber: b.status === 'Rejected' || b.status === 'Declined' ? 0 : parsePrice(b.price),
            status: b.status || 'Pending',
            rejectionReason: b.rejectionReason,
            source: 'others',
          });
        }
      });
    }

    try {
      const savedTasks = localStorage.getItem(tasksKey);
      if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        if (Array.isArray(tasks)) {
          tasks.forEach((t: Task) => {
            if (!oItems.some((existing) => existing.name.includes(t.name) || t.name.includes(existing.name))) {
              oItems.push({
                id: t.id,
                name: t.name,
                category: t.category,
                priceString: 'Included in Contract',
                priceNumber: 0,
                status: t.status === 'Completed' ? 'COMPLETED' : t.status || 'Pending',
                source: 'others',
              });
            }
          });
        }
      }
    } catch (e) {
      console.error(e);
    }

    // 4. Load Guest list for Dynamic Food Bill
    try {
      const savedGuests = localStorage.getItem(guestsKey);
      if (savedGuests) {
        const parsed = JSON.parse(savedGuests);
        setGuests(Array.isArray(parsed) ? parsed : []);
      } else {
        setGuests([]);
      }
    } catch (e) {
      console.error(e);
      setGuests([]);
    }

    // 5. Load Plate Rate
    try {
      const savedRate = localStorage.getItem(plateRateKey);
      if (savedRate) {
        setPlateRate(Number(savedRate) || 1500);
      } else {
        setPlateRate(1500);
      }
    } catch (e) {
      console.error(e);
    }

    setBrideItems(bItems);
    setGroomItems(gItems);
    setOtherItems(oItems);
  };

  const updatePlateRate = (newRate: number) => {
    const val = Math.max(0, newRate);
    setPlateRate(val);
    try {
      localStorage.setItem(plateRateKey, String(val));
      window.dispatchEvent(new Event('wedding_data_changed'));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadBillData();

    const handleUpdate = () => loadBillData();
    window.addEventListener('wedding_data_changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('wedding_data_changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [brideKey, groomKey, tasksKey, guestsKey, plateRateKey, user]);

  // Headcount & Dynamic Food Calculations
  const totalGuestPeople = guests.reduce((sum, g) => sum + (Number(g.numberOfGuests) || 1), 0);
  const brideGuestPeople = guests
    .filter((g) => g.side === 'Bride')
    .reduce((sum, g) => sum + (Number(g.numberOfGuests) || 1), 0);
  const groomGuestPeople = guests
    .filter((g) => g.side === 'Groom')
    .reduce((sum, g) => sum + (Number(g.numberOfGuests) || 1), 0);
  const dynamicFoodBill = totalGuestPeople * plateRate;

  // Grand Totals
  const brideTotal = brideItems.reduce((acc, i) => acc + i.priceNumber, 0);
  const groomTotal = groomItems.reduce((acc, i) => acc + i.priceNumber, 0);
  const othersTotal = otherItems.reduce((acc, i) => acc + i.priceNumber, 0);
  const grandTotal = brideTotal + groomTotal + othersTotal + dynamicFoodBill;

  const totalItemsCount = brideItems.length + groomItems.length + otherItems.length + (totalGuestPeople > 0 ? 1 : 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout
      title="Wedding Bill"
      subtitle={`${totalItemsCount} billed items &bull; Grand Total: ₹${grandTotal.toLocaleString('en-IN')}`}
    >
      <PageHeader
        title="Wedding Bill & Expenses"
        description="Comprehensive itemized bill breakdown for Bride, Groom, Catering Food (Dynamic Headcount), and Wedding Services"
        action={
          <button onClick={handlePrint} className="btn-primary inline-flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print / Save Invoice
          </button>
        }
      />

      {/* Summary Cards Overview (5 Columns on Large Screens) */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {/* Grand Total */}
        <div className="card col-span-2 border-2 border-burgundy-300 bg-gradient-to-br from-burgundy-900 to-burgundy-950 p-5 text-white shadow-md sm:col-span-1 lg:col-span-1">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-champagne-400 text-burgundy-950 shadow-xs">
            <Receipt className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-champagne-300">Grand Total Bill</p>
          <p className="mt-1 text-2xl font-bold text-white">₹{grandTotal.toLocaleString('en-IN')}</p>
          <p className="mt-1 text-xs text-white/70">All services &amp; catering included</p>
        </div>

        {/* Dynamic Food & Catering Total */}
        <div className="card border-2 border-amber-200 bg-amber-50/50 p-5 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
            <UtensilsCrossed className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Dynamic Food Bill</p>
          <p className="mt-1 text-2xl font-bold text-burgundy-950">₹{dynamicFoodBill.toLocaleString('en-IN')}</p>
          <p className="mt-1 text-xs text-charcoal/60">{totalGuestPeople} guests &times; ₹{plateRate}</p>
        </div>

        {/* Bride Total */}
        <div className="card border border-rose-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600 text-white shadow-xs">
            <Heart className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-rose-600">
            {user?.brideName ? `${user.brideName}'s Bill` : "Bride's Bill"}
          </p>
          <p className="mt-1 text-2xl font-bold text-burgundy-950">₹{brideTotal.toLocaleString('en-IN')}</p>
          <p className="mt-1 text-xs text-charcoal/60">{brideItems.length} items booked</p>
        </div>

        {/* Groom Total */}
        <div className="card border border-champagne-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-champagne-600 text-white shadow-xs">
            <UserRound className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-champagne-800">
            {user?.groomName ? `${user.groomName}'s Bill` : "Groom's Bill"}
          </p>
          <p className="mt-1 text-2xl font-bold text-burgundy-950">₹{groomTotal.toLocaleString('en-IN')}</p>
          <p className="mt-1 text-xs text-charcoal/60">{groomItems.length} items booked</p>
        </div>

        {/* Others Total */}
        <div className="card border border-charcoal/10 bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-charcoal text-white shadow-xs">
            <Sparkles className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-charcoal/70">Others (Vendors)</p>
          <p className="mt-1 text-2xl font-bold text-burgundy-950">₹{othersTotal.toLocaleString('en-IN')}</p>
          <p className="mt-1 text-xs text-charcoal/60">{otherItems.length} services booked</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* ─── DYNAMIC FOOD & CATERING BILL SECTION ─── */}
        <div className="card overflow-hidden border-2 border-amber-200/80 shadow-md">
          <div className="flex flex-col gap-3 border-b border-amber-200 bg-gradient-to-r from-amber-100/70 via-amber-50 to-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
                <UtensilsCrossed className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-burgundy-950">Dynamic Catering &amp; Food Bill</h3>
                  <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-900">
                    Live Headcount Sync
                  </span>
                </div>
                <p className="text-xs text-charcoal/60">
                  Calculated dynamically from Guest List: {totalGuestPeople} attendees &times; ₹{plateRate.toLocaleString('en-IN')} / plate
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs font-bold uppercase text-amber-800">Dynamic Food Subtotal:</span>
              <p className="text-xl font-bold text-burgundy-950">₹{dynamicFoodBill.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="p-5">
            <div className="grid gap-4 md:grid-cols-3">
              {/* Headcount Stat */}
              <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-charcoal/70">Total Headcount</span>
                  <Users className="h-4 w-4 text-amber-700" />
                </div>
                <p className="mt-1 text-2xl font-bold text-burgundy-950">{totalGuestPeople} people</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-charcoal/60">
                  <span className="text-rose-600 font-medium">Bride: {brideGuestPeople}</span>
                  <span>&bull;</span>
                  <span className="text-champagne-800 font-medium">Groom: {groomGuestPeople}</span>
                </div>
                <Link
                  to="/guests"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-burgundy-700 hover:underline"
                >
                  Manage Guest List <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Rate per plate configuration */}
              <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-2xs">
                <span className="text-xs font-semibold text-charcoal/70">Plate Rate Configuration</span>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm font-bold text-burgundy-950">₹</span>
                  <input
                    type="number"
                    min={100}
                    step={50}
                    value={plateRate}
                    onChange={(e) => updatePlateRate(Number(e.target.value))}
                    className="w-28 rounded-lg border border-burgundy-200 bg-burgundy-50/40 px-2.5 py-1 text-sm font-bold text-burgundy-950 focus:border-burgundy-500 focus:outline-none"
                  />
                  <span className="text-xs text-charcoal/60">/ plate</span>
                </div>
                <p className="mt-2 text-[11px] text-charcoal/50">
                  Adjusting the plate rate recalculates your dynamic catering bill and grand total live.
                </p>
              </div>

              {/* Cost Breakdown */}
              <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4">
                <span className="text-xs font-semibold text-charcoal/70">Side-wise Catering Impact</span>
                <div className="mt-2 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-rose-700">Bride Side ({brideGuestPeople} guests):</span>
                    <span className="font-bold text-burgundy-950">
                      ₹{(brideGuestPeople * plateRate).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-champagne-800">Groom Side ({groomGuestPeople} guests):</span>
                    <span className="font-bold text-burgundy-950">
                      ₹{(groomGuestPeople * plateRate).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 1. BRIDE SECTION */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-rose-100 bg-rose-50/40 p-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600 text-white">
                <Heart className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-burgundy-950">Bride's Expenses &amp; Services</h3>
                <p className="text-xs text-charcoal/60">Outfits, Lehengas, Bridal Makeup &amp; Jewellery</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold uppercase text-rose-600">Subtotal:</span>
              <p className="text-lg font-bold text-burgundy-900">₹{brideTotal.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="p-4">
            {brideItems.length === 0 ? (
              <div className="py-6 text-center text-xs text-charcoal/50">
                No bride services booked yet.{' '}
                <Link to="/bride" className="font-semibold text-burgundy-700 hover:underline">
                  Go to Bride Checklist &rarr;
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-burgundy-50">
                {brideItems.map((item) => (
                  <div key={item.id} className="flex flex-col justify-between gap-2 py-3 sm:flex-row sm:items-center">
                    <div>
                      <h4 className="text-sm font-semibold text-burgundy-950">{item.name}</h4>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-charcoal/50">
                        <span className="rounded-md bg-burgundy-50 px-2 py-0.5 font-medium text-burgundy-700">
                          {item.category}
                        </span>
                        <span>&bull;</span>
                        <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${getStatusBadgeStyle(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      {item.rejectionReason && (item.status === 'Rejected' || item.status === 'Declined') && (
                        <div className="mt-1.5 rounded-md bg-rose-50 border border-rose-200 px-2 py-1 text-[11px] text-rose-700">
                          <strong>Reason:</strong> {item.rejectionReason}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-burgundy-900">{item.priceString}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 2. GROOM SECTION */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-amber-100 bg-amber-50/40 p-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-champagne-600 text-white">
                <UserRound className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-burgundy-950">Groom's Expenses &amp; Services</h3>
                <p className="text-xs text-charcoal/60">Sherwanis, Safas, Accessories &amp; Grooming</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold uppercase text-champagne-700">Subtotal:</span>
              <p className="text-lg font-bold text-burgundy-900">₹{groomTotal.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="p-4">
            {groomItems.length === 0 ? (
              <div className="py-6 text-center text-xs text-charcoal/50">
                No groom services booked yet.{' '}
                <Link to="/groom" className="font-semibold text-burgundy-700 hover:underline">
                  Go to Groom Checklist &rarr;
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-burgundy-50">
                {groomItems.map((item) => (
                  <div key={item.id} className="flex flex-col justify-between gap-2 py-3 sm:flex-row sm:items-center">
                    <div>
                      <h4 className="text-sm font-semibold text-burgundy-950">{item.name}</h4>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-charcoal/50">
                        <span className="rounded-md bg-champagne-50 px-2 py-0.5 font-medium text-champagne-800">
                          {item.category}
                        </span>
                        <span>&bull;</span>
                        <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${getStatusBadgeStyle(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      {item.rejectionReason && (item.status === 'Rejected' || item.status === 'Declined') && (
                        <div className="mt-1.5 rounded-md bg-rose-50 border border-rose-200 px-2 py-1 text-[11px] text-rose-700">
                          <strong>Reason:</strong> {item.rejectionReason}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-burgundy-900">{item.priceString}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 3. OTHERS (GENERAL WEDDING SERVICES) */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-charcoal/10 bg-charcoal/5 p-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-charcoal text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-burgundy-950">Others (Vendors, Venue &amp; Event Tasks)</h3>
                <p className="text-xs text-charcoal/60">Photography, DJ / Music, Decoration &amp; Venue</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold uppercase text-charcoal/70">Subtotal:</span>
              <p className="text-lg font-bold text-burgundy-900">₹{othersTotal.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="p-4">
            {otherItems.length === 0 ? (
              <div className="py-6 text-center text-xs text-charcoal/50">
                No general wedding vendors booked yet.{' '}
                <Link to="/services" className="font-semibold text-burgundy-700 hover:underline">
                  Browse Wedding Services &rarr;
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-burgundy-50">
                {otherItems.map((item) => (
                  <div key={item.id} className="flex flex-col justify-between gap-2 py-3 sm:flex-row sm:items-center">
                    <div>
                      <h4 className="text-sm font-semibold text-charcoal">{item.name}</h4>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-charcoal/50">
                        <span className="rounded-md bg-burgundy-50 px-2 py-0.5 font-medium text-burgundy-700">
                          {item.category}
                        </span>
                        <span>&bull;</span>
                        <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${getStatusBadgeStyle(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      {item.rejectionReason && (item.status === 'Rejected' || item.status === 'Declined') && (
                        <div className="mt-1.5 rounded-md bg-rose-50 border border-rose-200 px-2 py-1 text-[11px] text-rose-700">
                          <strong>Reason:</strong> {item.rejectionReason}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-burgundy-900">{item.priceString}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Final Invoice Summary Box */}
        <div className="card border-2 border-burgundy-200 bg-gradient-to-br from-burgundy-50/40 via-white to-amber-50/30 p-6 shadow-sm">
          <h3 className="mb-4 text-base font-bold text-burgundy-950">Final Bill Summary Breakdown</h3>
          <div className="space-y-2.5 text-sm text-charcoal/75">
            <div className="flex justify-between">
              <span>Bride Subtotal:</span>
              <span className="font-semibold text-charcoal">₹{brideTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Groom Subtotal:</span>
              <span className="font-semibold text-charcoal">₹{groomTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-amber-900 font-medium">
              <span>
                Dynamic Food &amp; Catering ({totalGuestPeople} guests &times; ₹{plateRate.toLocaleString('en-IN')}):
              </span>
              <span className="font-bold text-burgundy-950">₹{dynamicFoodBill.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Others (Vendors &amp; Tasks) Subtotal:</span>
              <span className="font-semibold text-charcoal">₹{othersTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="my-3 border-t-2 border-burgundy-200" />
            <div className="flex items-center justify-between text-base font-bold text-burgundy-950">
              <span>Grand Total Final Bill:</span>
              <span className="text-2xl font-serif text-burgundy-900">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
