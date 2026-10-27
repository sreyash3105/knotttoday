import { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Route,
  CalendarDays,
  Heart,
  UserRound,
  Users,
  Briefcase,
  Gem,
  Shirt,
  Music2,
  Camera,
  Flower2,
  UtensilsCrossed,
  Sparkles,
  CheckSquare,
  Receipt,
  Globe,
  LifeBuoy,
  X,
  Heart as HeartIcon,
  LogIn,
  Pencil,
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/context/AuthContext';
import { weddingInfo } from '@/data/mockData';
import { EditWeddingDateModal } from '@/components/EditWeddingDateModal';
import { EditCoupleNamesModal } from '@/components/EditCoupleNamesModal';
import { BrandLogo } from '@/components/BrandLogo';

interface NavItem {
  to: string;
  labelKey: string;
  icon: typeof LayoutDashboard;
}

interface NavGroup {
  titleKey: string;
  items: NavItem[];
}

const loggedInNavGroups: NavGroup[] = [
  {
    titleKey: 'overview',
    items: [
      { to: '/', labelKey: 'dashboard', icon: LayoutDashboard },
      { to: '/journey', labelKey: 'weddingJourney', icon: Route },
    ],
  },
  {
    titleKey: 'couple',
    items: [
      { to: '/bride', labelKey: 'bride', icon: Heart },
      { to: '/groom', labelKey: 'groom', icon: UserRound },
      { to: '/guests', labelKey: 'guests', icon: Users },
    ],
  },
  {
    titleKey: 'weddingServices',
    items: [
      { to: '/services', labelKey: 'services', icon: Briefcase },
      { to: '/jewellery', labelKey: 'jewelleryRental', icon: Gem },
      { to: '/clothes', labelKey: 'clothesRental', icon: Shirt },
      { to: '/music-dj', labelKey: 'musicDj', icon: Music2 },
      { to: '/photography', labelKey: 'photography', icon: Camera },
      { to: '/decoration', labelKey: 'decoration', icon: Flower2 },
      { to: '/catering', labelKey: 'catering', icon: UtensilsCrossed },
      { to: '/makeup', labelKey: 'makeupArtists', icon: Sparkles },
    ],
  },
  {
    titleKey: 'planning',
    items: [
      { to: '/tasks', labelKey: 'tasks', icon: CheckSquare },
      { to: '/bill', labelKey: 'bill', icon: Receipt },
    ],
  },
  {
    titleKey: 'other',
    items: [
      { to: '/language', labelKey: 'language', icon: Globe },
      { to: '/support', labelKey: 'support', icon: LifeBuoy },
    ],
  },
];

const publicNavGroups: NavGroup[] = [
  {
    titleKey: 'overview',
    items: [
      { to: '/services', labelKey: 'services', icon: Briefcase },
    ],
  },
  {
    titleKey: 'couple',
    items: [
      { to: '/bride', labelKey: 'bride', icon: Heart },
      { to: '/groom', labelKey: 'groom', icon: UserRound },
    ],
  },
  {
    titleKey: 'weddingServices',
    items: [
      { to: '/jewellery', labelKey: 'jewelleryRental', icon: Gem },
      { to: '/clothes', labelKey: 'clothesRental', icon: Shirt },
      { to: '/photography', labelKey: 'photography', icon: Camera },
      { to: '/music-dj', labelKey: 'musicDj', icon: Music2 },
      { to: '/decoration', labelKey: 'decoration', icon: Flower2 },
      { to: '/catering', labelKey: 'catering', icon: UtensilsCrossed },
      { to: '/makeup', labelKey: 'makeupArtists', icon: Sparkles },
    ],
  },
  {
    titleKey: 'other',
    items: [
      { to: '/language', labelKey: 'language', icon: Globe },
      { to: '/support', labelKey: 'support', icon: LifeBuoy },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t } = useLanguage();
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isNamesModalOpen, setIsNamesModalOpen] = useState(false);

  const navGroups = isLoggedIn ? loggedInNavGroups : publicNavGroups;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-charcoal/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-burgundy-100/60 bg-ivory transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <NavLink
            to="/"
            onClick={onClose}
            className="group transition-opacity hover:opacity-85"
            title="Go to main page"
          >
            <BrandLogo size="md" />
          </NavLink>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-charcoal/50 hover:bg-burgundy-50 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card */}
        {isLoggedIn && user ? (
          <div className="mx-4 mb-3 rounded-xl border border-champagne-200/50 bg-gradient-to-br from-champagne-50 to-rose-50 px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="font-serif text-base font-semibold text-burgundy-800">
                {user.brideName || 'Bride'} &amp; {user.groomName || 'Groom'}
              </p>
              <button
                type="button"
                onClick={() => setIsNamesModalOpen(true)}
                title="Edit Bride & Groom Names"
                className="rounded-md p-1 text-burgundy-700 hover:bg-champagne-200/60 transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-xs text-charcoal/60">
                Wedding: {user.weddingDate || weddingInfo.weddingDate}
              </p>
              <button
                type="button"
                onClick={() => setIsDateModalOpen(true)}
                className="text-[11px] font-bold text-burgundy-700 hover:underline"
              >
                {user.weddingDate === 'To Be Decided' ? 'Set Date' : 'Edit'}
              </button>
            </div>
          </div>
        ) : (
          <div className="mx-4 mb-3 rounded-xl border border-burgundy-100 bg-burgundy-50/70 p-3 text-center">
            <p className="text-xs font-bold text-burgundy-900">Explore Services & Fashion</p>
            <p className="mt-0.5 text-[11px] text-charcoal/60">Browsing in Public Visitor Mode</p>
            <button
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
                navigate('/login');
              }}
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-burgundy-700 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-burgundy-800"
            >
              <LogIn className="h-3.5 w-3.5" />
              Client Dashboard Login
            </button>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 pb-6">
          {navGroups.map((group) => (
            <div key={group.titleKey} className="mb-4">
              <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-charcoal/40">
                {t(group.titleKey)}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        end={item.to === '/'}
                        onClick={() => {
                          if (window.innerWidth < 1024) onClose();
                        }}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                            isActive
                              ? 'bg-burgundy-50 text-burgundy-700 ring-1 ring-burgundy-100'
                              : 'text-charcoal/70 hover:bg-burgundy-50/50 hover:text-burgundy-700'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <Icon
                              className={`h-[18px] w-[18px] ${isActive ? 'text-burgundy-700' : 'text-charcoal/50'}`}
                            />
                            <span>{t(item.labelKey)}</span>
                            {isActive && (
                              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-burgundy-600" />
                            )}
                          </>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-burgundy-100/60 px-5 py-3">
          <p className="text-xs text-charcoal/40">
            Premium Wedding Platform
          </p>
        </div>
      </aside>

      <EditWeddingDateModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
      />

      <EditCoupleNamesModal
        isOpen={isNamesModalOpen}
        onClose={() => setIsNamesModalOpen(false)}
      />
    </>
  );
}

