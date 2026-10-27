import { useState, useRef, useEffect } from 'react';
import { Search, Bell, Globe, Menu, LogIn, LogOut, LayoutDashboard, Pencil, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/context/AuthContext';
import { EditCoupleNamesModal } from '@/components/EditCoupleNamesModal';
import type { Language } from '@/types';
import { notificationsData } from '@/data/mockData';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
  onNavigate: (path: string) => void;
}

const languageOptions: { value: Language; label: string; flag: string }[] = [
  { value: 'en', label: 'English', flag: 'EN' },
  { value: 'hi', label: 'हिन्दी', flag: 'हि' },
  { value: 'kn', label: 'ಕನ್ನಡ', flag: 'ಕ' },
];

export function Header({ title, subtitle, onMenuClick, onNavigate }: HeaderProps) {
  const { lang, setLang } = useLanguage();
  const { isLoggedIn, user, logout } = useAuth();

  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isNamesModalOpen, setIsNamesModalOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const unreadCount = notificationsData.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setShowLangDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-burgundy-100/60 bg-ivory/95 px-4 py-3 backdrop-blur-md lg:px-6">
      {/* Mobile menu */}
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-charcoal/60 hover:bg-burgundy-50 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Title */}
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-lg font-semibold text-burgundy-900 lg:text-xl">
          {title}
        </h2>
        {subtitle && (
          <p className="truncate text-xs text-charcoal/50 lg:text-sm">{subtitle}</p>
        )}
      </div>

      {/* Search */}
      <div className="hidden items-center md:flex">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
          <input
            type="text"
            placeholder="Search services..."
            className="w-48 rounded-lg border border-burgundy-100 bg-white py-2 pl-9 pr-3 text-sm placeholder-charcoal/40 focus:border-burgundy-300 focus:outline-none focus:ring-2 focus:ring-burgundy-50 lg:w-56"
          />
        </div>
      </div>

      {/* Notifications */}
      <div ref={notifRef} className="relative">
        <button
          onClick={() => setShowNotifications((v) => !v)}
          className="relative rounded-lg p-2 text-charcoal/60 transition-colors hover:bg-burgundy-50 hover:text-burgundy-700"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-burgundy-600 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>
        {showNotifications && (
          <div className="absolute right-0 mt-2 w-80 rounded-xl border border-burgundy-100 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-burgundy-50 px-4 py-3">
              <span className="text-sm font-semibold text-burgundy-800">Notifications</span>
              <span className="text-xs text-charcoal/50">{unreadCount} new</span>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notificationsData.slice(0, 5).map((n) => (
                <div
                  key={n.id}
                  className="border-b border-burgundy-50 px-4 py-3 last:border-0"
                >
                  <div className="flex items-start gap-2">
                    {!n.read && (
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-burgundy-500" />
                    )}
                    <div className={n.read ? 'pl-4' : ''}>
                      <p className="text-sm font-medium text-charcoal">{n.title}</p>
                      <p className="text-xs text-charcoal/60">{n.message}</p>
                      <p className="mt-0.5 text-[11px] text-charcoal/40">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setShowNotifications(false);
                onNavigate('/notifications');
              }}
              className="block w-full border-t border-burgundy-50 px-4 py-2.5 text-center text-sm font-medium text-burgundy-700 hover:bg-burgundy-50"
            >
              View All
            </button>
          </div>
        )}
      </div>

      {/* Language */}
      <div ref={langRef} className="relative">
        <button
          onClick={() => setShowLangDropdown((v) => !v)}
          className="flex items-center gap-1.5 rounded-lg p-2 text-charcoal/60 transition-colors hover:bg-burgundy-50 hover:text-burgundy-700"
        >
          <Globe className="h-5 w-5" />
          <span className="hidden text-sm font-medium sm:inline">
            {languageOptions.find((o) => o.value === lang)?.flag}
          </span>
        </button>
        {showLangDropdown && (
          <div className="absolute right-0 mt-2 w-36 rounded-xl border border-burgundy-100 bg-white shadow-lg">
            {languageOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setLang(opt.value);
                  setShowLangDropdown(false);
                }}
                className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors first:rounded-t-xl last:rounded-b-xl ${
                  lang === opt.value
                    ? 'bg-burgundy-50 font-medium text-burgundy-700'
                    : 'text-charcoal hover:bg-burgundy-50'
                }`}
              >
                <span className="w-6 text-xs font-semibold text-charcoal/50">{opt.flag}</span>
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* User / Login Status */}
      <div ref={userRef} className="relative">
        {isLoggedIn && user ? (
          <>
            <button
              onClick={() => setShowUserDropdown((v) => !v)}
              className="flex items-center gap-2 rounded-full p-0.5 transition-transform hover:scale-105"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-burgundy-600 to-rose-500 text-sm font-semibold text-white shadow-sm ring-2 ring-white">
                {user.coupleInitials || (user.brideName ? `${user.brideName[0]}&${user.groomName?.[0] || ''}` : 'KT')}
              </div>
            </button>
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-burgundy-100 bg-white p-2 shadow-xl">
                <div className="border-b border-burgundy-50 px-3 py-2">
                  <p className="text-xs font-bold text-burgundy-900">
                    {user.brideName || 'Bride'} &amp; {user.groomName || 'Groom'}
                  </p>
                  <p className="text-xs text-charcoal/60">{user.email}</p>
                </div>

                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    onNavigate('/');
                  }}
                  className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-charcoal hover:bg-burgundy-50"
                >
                  <LayoutDashboard className="h-4 w-4 text-burgundy-600" />
                  Wedding Dashboard
                </button>

                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    setIsNamesModalOpen(true);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-charcoal hover:bg-burgundy-50"
                >
                  <Pencil className="h-4 w-4 text-burgundy-600" />
                  Edit Bride &amp; Groom Names
                </button>

                <button
                  onClick={() => {
                    logout();
                    setShowUserDropdown(false);
                    onNavigate('/');
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </div>
            )}
          </>
        ) : (
          <button
            onClick={() => onNavigate('/login')}
            className="flex items-center gap-1.5 rounded-xl bg-burgundy-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow transition-all hover:bg-burgundy-800"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Client Login</span>
          </button>
        )}
      </div>

      <EditCoupleNamesModal
        isOpen={isNamesModalOpen}
        onClose={() => setIsNamesModalOpen(false)}
      />
    </header>
  );
}



