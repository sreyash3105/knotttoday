import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Route,
  Calendar,
  Pencil,
  Users,
  CheckSquare,
  Briefcase,
  Clock,
  MapPin,
  ArrowRight,
  Camera,
  Sparkles,
  Music2,
  Flower2,
  UtensilsCrossed,
  PlusCircle,
  ShoppingBag,
  type LucideIcon,
} from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Countdown } from '@/components/Countdown';
import { EditWeddingDateModal } from '@/components/EditWeddingDateModal';
import { EditCoupleNamesModal } from '@/components/EditCoupleNamesModal';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/context/AuthContext';
import {
  weddingInfo,
  images,
  journeyStages as defaultJourneyStages,
  tasksData as defaultTasksData,
  guestsData as defaultGuestsData,
  bookedServices,
  notificationsData,
} from '@/data/mockData';
import type { WeddingEvent, Guest, Task } from '@/types';

const iconMap: Record<string, LucideIcon> = {
  Camera,
  Sparkles,
  Music2,
  Flower2,
  UtensilsCrossed,
};

export function DashboardPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isNamesModalOpen, setIsNamesModalOpen] = useState(false);

  const userId = user?.id || 'visitor';
  const isBlankSlate = !user?.hasBooking && (!user?.userBookings || user.userBookings.length === 0);

  // Dynamic state loaded from real user data / localStorage
  const [milestonesCount, setMilestonesCount] = useState<number>(13);
  const [completedMilestones, setCompletedMilestones] = useState<number>(3);
  const [guestsHeadcount, setGuestsHeadcount] = useState<number>(0);
  const [guestsParties, setGuestsParties] = useState<number>(0);
  const [tasksTotal, setTasksTotal] = useState<number>(0);
  const [tasksCompleted, setTasksCompleted] = useState<number>(0);
  const [servicesBookedCount, setServicesBookedCount] = useState<number>(0);
  const [upcomingMilestones, setUpcomingMilestones] = useState<WeddingEvent[]>([]);

  // Load and calculate dynamic stats from live localStorage records
  const loadDynamicDashboardStats = () => {
    // 1. Journey Milestones
    try {
      const journeyKey = `wedding_journey_stages_${userId}`;
      const savedJourney = localStorage.getItem(journeyKey);
      let stages: WeddingEvent[] = defaultJourneyStages.map((s) => ({
        ...s,
        status: (s.status || 'Upcoming') as WeddingEvent['status'],
        bookingStatus: (s.bookingStatus || 'Recommended') as WeddingEvent['bookingStatus'],
      }));
      if (savedJourney) {
        const parsed = JSON.parse(savedJourney);
        if (Array.isArray(parsed) && parsed.length > 0) stages = parsed;
      }
      setMilestonesCount(stages.length);
      setCompletedMilestones(stages.filter((s) => s.status === 'Completed').length);
      setUpcomingMilestones(stages.filter((s) => s.status !== 'Completed').slice(0, 4));
    } catch (e) {
      console.error(e);
      const fallback = defaultJourneyStages.map((s) => ({
        ...s,
        status: 'Upcoming' as const,
        bookingStatus: 'Recommended' as const,
      }));
      setMilestonesCount(fallback.length);
      setUpcomingMilestones(fallback.slice(0, 4));
    }

    // 2. Guests Headcount & Parties
    try {
      const guestsKey = `wedding_guests_list_${userId}`;
      const savedGuests = localStorage.getItem(guestsKey);
      let gList: Guest[] = [];
      if (savedGuests) {
        const parsed = JSON.parse(savedGuests);
        if (Array.isArray(parsed)) gList = parsed;
      }
      const totalPeople = gList.reduce((sum, g) => sum + (Number(g?.numberOfGuests) || 1), 0);
      setGuestsHeadcount(totalPeople);
      setGuestsParties(gList.length);
    } catch (e) {
      console.error(e);
      setGuestsHeadcount(0);
      setGuestsParties(0);
    }

    // 3. Tasks
    try {
      const tasksKey = `wedding_tasks_${userId}`;
      const savedTasks = localStorage.getItem(tasksKey);
      let tList: Task[] = [];
      if (savedTasks) {
        const parsed = JSON.parse(savedTasks);
        if (Array.isArray(parsed)) tList = parsed;
      }
      setTasksTotal(tList.length);
      setTasksCompleted(tList.filter((t) => t.status === 'Completed').length);
    } catch (e) {
      console.error(e);
      setTasksTotal(0);
      setTasksCompleted(0);
    }

    // 4. Booked Services Count
    let bookedCount = 0;
    if (user?.userBookings && Array.isArray(user.userBookings) && user.userBookings.length > 0) {
      bookedCount = user.userBookings.length;
    } else {
      bookedCount = 0;
    }

    // Check checklist items from localStorage
    try {
      const brideSaved = localStorage.getItem(`wedding_services_checklist_bride_${userId}`);
      const groomSaved = localStorage.getItem(`wedding_services_checklist_groom_${userId}`);
      const brideParsed = brideSaved ? JSON.parse(brideSaved) : [];
      const groomParsed = groomSaved ? JSON.parse(groomSaved) : [];
      const brideChecklist = Array.isArray(brideParsed) ? brideParsed : [];
      const groomChecklist = Array.isArray(groomParsed) ? groomParsed : [];
      const checklistBooked =
        brideChecklist.filter((i: { status?: string }) => i.status === 'Booked' || i.status === 'Completed' || i.status === 'Confirmed').length +
        groomChecklist.filter((i: { status?: string }) => i.status === 'Booked' || i.status === 'Completed' || i.status === 'Confirmed').length;
      if (checklistBooked > 0) {
        bookedCount = Math.max(bookedCount, checklistBooked);
      }
    } catch (e) {
      console.error(e);
    }

    setServicesBookedCount(bookedCount);
  };

  useEffect(() => {
    loadDynamicDashboardStats();

    const handleSync = () => loadDynamicDashboardStats();
    window.addEventListener('wedding_data_changed', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('wedding_data_changed', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [userId, isBlankSlate, user]);

  // 4 True Dynamic Stats Cards
  const stats = [
    {
      label: 'Journey Milestones',
      value: milestonesCount,
      subtext: `${completedMilestones} completed • ${milestonesCount - completedMilestones} upcoming`,
      icon: Route,
      color: 'bg-burgundy-700',
      to: '/journey',
    },
    {
      label: 'Guests Attending',
      value: guestsHeadcount,
      subtext: `${guestsParties} family / guest parties`,
      icon: Users,
      color: 'bg-rose-600',
      to: '/guests',
    },
    {
      label: 'Wedding Tasks',
      value: tasksTotal,
      subtext: `${tasksCompleted} done • ${tasksTotal - tasksCompleted} pending`,
      icon: CheckSquare,
      color: 'bg-champagne-600',
      to: '/tasks',
    },
    {
      label: 'Services Booked',
      value: servicesBookedCount,
      subtext: isBlankSlate ? 'No vendor bookings yet' : 'Active wedding vendors',
      icon: Briefcase,
      color: 'bg-emerald-600',
      to: isBlankSlate ? '/services' : '/bill',
    },
  ];

  return (
    <Layout
      title={t('dashboard')}
      subtitle={`${user?.brideName || weddingInfo.brideName} & ${user?.groomName || weddingInfo.groomName}`}
    >
      {/* ─── Hero Banner ─── */}
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-burgundy-950 shadow-xl">
        <div className="absolute inset-0 opacity-25">
          <img src={images.heroBride} alt="Indian wedding" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-burgundy-950/95 via-burgundy-900/70 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col px-6 py-10 sm:px-10 sm:py-14 lg:py-16">
          {(!isBlankSlate || user?.weddingDateISO) && (
            <p className="text-xs font-semibold uppercase tracking-widest text-champagne-300">
              {t('daysToGo')}: <Countdown targetDate={user?.weddingDateISO || weddingInfo.weddingDateISO} />
            </p>
          )}

          <h1 className="mt-2 max-w-xl text-3xl font-bold text-white drop-shadow sm:text-4xl lg:text-5xl font-serif">
            {isBlankSlate ? 'Welcome to Your Wedding Portal' : 'Your Royal Wedding, Beautifully Planned'}
          </h1>

          {/* Couple Names with Edit Trigger */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <p className="text-xl font-serif font-bold text-champagne-200">
              {user?.brideName || weddingInfo.brideName} &amp; {user?.groomName || weddingInfo.groomName}
            </p>
            <button
              onClick={() => setIsNamesModalOpen(true)}
              title="Edit Bride & Groom Names"
              className="inline-flex items-center gap-1 rounded-md bg-white/20 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/30 hover:scale-105"
            >
              <Pencil className="h-3 w-3" />
              Edit Names
            </button>
          </div>

          {/* Date & Location */}
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm text-white/90">
              <Calendar className="h-4 w-4 text-champagne-300" />
              <span>{user?.weddingDate || weddingInfo.weddingDate}</span>
            </div>
            <button
              onClick={() => setIsDateModalOpen(true)}
              className="inline-flex items-center gap-1 rounded-md bg-white/20 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/30 hover:scale-105"
            >
              <Pencil className="h-3 w-3" />
              {user?.weddingDate === 'To Be Decided' ? 'Set Date' : 'Update Date'}
            </button>
          </div>

          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-white/70">
            <MapPin className="h-4 w-4 text-champagne-400" />
            <span>{user?.location || weddingInfo.location}</span>
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => navigate('/journey')} className="btn-gold shadow-md">
              <span>View Wedding Journey (13 Milestones)</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate('/services')}
              className="rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              Explore Services
            </button>
          </div>
        </div>
      </div>

      {/* ─── 4 Dynamic Live Stats Cards ─── */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              onClick={() => navigate(stat.to)}
              className="card p-5 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg hover:border-burgundy-200 group"
              title={`Click to view ${stat.label}`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color} text-white shadow-sm transition-transform group-hover:scale-110`}
                >
                  <Icon className="h-5.5 w-5.5" />
                </div>
                <ArrowRight className="h-4 w-4 text-charcoal/30 group-hover:text-burgundy-700 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="mt-3 text-3xl font-bold font-serif text-burgundy-950">{stat.value}</p>
              <p className="text-sm font-semibold text-charcoal/85">{stat.label}</p>
              <p className="mt-0.5 text-[11px] text-charcoal/55">{stat.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* ─── Blank Slate Callout if User Has 0 Bookings ─── */}
      {isBlankSlate && (
        <div className="mb-8 rounded-3xl border border-dashed border-burgundy-300 bg-burgundy-50/60 p-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-burgundy-700 text-white shadow-md">
            <PlusCircle className="h-7 w-7" />
          </div>
          <h3 className="text-xl font-bold text-burgundy-950 font-serif">Start From a Blank Slate</h3>
          <p className="mx-auto mt-2 max-w-md text-xs text-charcoal/60">
            You currently have 0 active bookings. Explore our curated Marketplace for Bride &amp; Groom fashion, Jewellery, and vendor services to create your first booking!
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <button onClick={() => navigate('/bride')} className="btn-gold text-xs">
              Explore Bride Services
            </button>
            <button onClick={() => navigate('/groom')} className="btn-primary text-xs">
              Explore Groom Services
            </button>
          </div>
        </div>
      )}

      {/* ─── Dynamic Booked Services Section ─── */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold font-serif text-burgundy-950">
              {isBlankSlate ? 'My Requested Services' : t('bookedServices')}
            </h3>
            <p className="text-xs text-charcoal/60">Vendor and service contracts confirmed for your wedding</p>
          </div>
          <button
            onClick={() => navigate('/services')}
            className="text-xs font-bold text-burgundy-700 hover:text-burgundy-900 transition-colors"
          >
            + Add Service
          </button>
        </div>

        {user?.userBookings && user.userBookings.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {user.userBookings.map((b) => (
              <div
                key={b.id}
                onClick={() => navigate('/bill')}
                className={`card flex items-center gap-4 p-4 border-l-4 cursor-pointer hover:shadow-md transition-shadow ${
                  b.status === 'Confirmed' || b.status === 'Completed'
                    ? 'border-l-emerald-500'
                    : b.status === 'Declined' || b.status === 'Rejected'
                    ? 'border-l-rose-500 bg-rose-50/20'
                    : b.status === 'In Review'
                    ? 'border-l-blue-500'
                    : 'border-l-amber-500'
                }`}
              >
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-burgundy-100">
                  <img src={b.image || images.photography} alt={b.serviceName} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        b.status === 'Confirmed' || b.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'Declined' || b.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : b.status === 'In Review'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {b.status}
                    </span>
                    <span className="text-xs font-bold text-burgundy-700">{b.price}</span>
                  </div>
                  <h4 className="mt-1 text-sm font-bold text-burgundy-950">{b.serviceName || b.category}</h4>
                  <p className="text-xs text-charcoal/60">{b.vendorName}</p>
                  {b.rejectionReason && (
                    <div className="mt-1.5 rounded-lg bg-rose-50 border border-rose-200 px-2 py-1 text-[11px] text-rose-700 leading-tight">
                      <strong>Reason:</strong> {b.rejectionReason}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : !isBlankSlate ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {bookedServices.map((service) => {
              const Icon = iconMap[service.icon] ?? Briefcase;
              return (
                <div
                  key={service.name}
                  onClick={() => navigate('/bill')}
                  className="card overflow-hidden cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]"
                >
                  <div className="relative h-24">
                    <img src={service.image} alt={service.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-burgundy-900/30" />
                    <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 shadow-sm">
                      <Icon className="h-4.5 w-4.5 text-burgundy-700" />
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-burgundy-950">{service.name}</p>
                    <p className="text-xs text-charcoal/50">{service.vendor}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-charcoal/50">
            No requested services yet. Click &quot;+ Add Service&quot; to submit your first request!
          </p>
        )}
      </div>

      {!isBlankSlate && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Upcoming Journey Milestones (Dynamic from JourneyPage) */}
          <div className="card p-5 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-serif text-burgundy-950">
                  Upcoming Journey Milestones
                </h3>
                <p className="text-xs text-charcoal/60">Next events in your 13-stage celebration</p>
              </div>
              <button
                onClick={() => navigate('/journey')}
                className="text-xs font-bold text-burgundy-700 hover:text-burgundy-900"
              >
                View Full Timeline ({milestonesCount}) &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {upcomingMilestones.map((stage) => (
                <div
                  key={stage.id}
                  onClick={() => navigate('/journey')}
                  className="flex items-center gap-4 rounded-xl border border-burgundy-50 p-3 transition-colors hover:bg-burgundy-50/40 cursor-pointer"
                >
                  <div className="flex w-24 flex-shrink-0 flex-col items-center border-r border-burgundy-100 pr-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-burgundy-800">
                      {stage.day || 'Milestone'}
                    </span>
                    <span className="text-xs font-semibold text-charcoal">{stage.time || 'TBD'}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-burgundy-950">{stage.name}</p>
                      <span className="rounded bg-burgundy-100 px-1.5 py-0.5 text-[9px] font-semibold text-burgundy-900">
                        {stage.status}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal/60 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-burgundy-500 flex-shrink-0" />
                      <span className="truncate">{stage.location || 'Venue Pending'}</span>
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-charcoal/30 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold font-serif text-burgundy-950">
                {t('recentNotifications')}
              </h3>
              <button
                onClick={() => navigate('/notifications')}
                className="text-xs font-semibold text-burgundy-700 hover:text-burgundy-900"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {notificationsData.slice(0, 4).map((n) => (
                <div key={n.id} className="border-b border-burgundy-50 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start gap-2">
                    {!n.read && <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-burgundy-600" />}
                    <div className={n.read ? 'pl-4' : ''}>
                      <p className="text-sm font-medium text-charcoal">{n.title}</p>
                      <p className="text-xs text-charcoal/60">{n.message}</p>
                      <p className="mt-0.5 text-[10px] text-charcoal/40">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <EditWeddingDateModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
      />

      <EditCoupleNamesModal
        isOpen={isNamesModalOpen}
        onClose={() => setIsNamesModalOpen(false)}
      />
    </Layout>
  );
}
