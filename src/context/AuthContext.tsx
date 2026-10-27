import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { UserProfile, UserBooking } from '@/types/auth';
import { routeBookingToStorage } from '@/utils/bookingRouter';
import { db, type UserRecord } from '@/db';

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: UserProfile;
}

export interface RegisterCoupleData {
  brideName: string;
  groomName: string;
  email: string;
  password: string;
  weddingDate?: string;
  location?: string;
}

export interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  login: () => void;
  loginAs: (userProfile: UserProfile) => void;
  loginWithCredentials: (email: string, password?: string) => Promise<AuthResponse>;
  registerNewCouple: (data: RegisterCoupleData) => Promise<AuthResponse>;
  resetPassword: (email: string, newPassword: string) => Promise<AuthResponse>;
  logout: () => void;
  addBookingToCurrentCustomer: (
    newBooking: Omit<UserBooking, 'id'> & { id?: string },
    forWhomHint?: string
  ) => void;
  updateWeddingDetails: (weddingDate: string, location?: string, weddingDateISO?: string) => void;
  updateCoupleNames: (brideName: string, groomName: string) => void;
}

const STORAGE_KEY = 'wedding_app_auth_session_v2';

function recordToProfile(rec: UserRecord): UserProfile {
  return {
    id: rec.id,
    email: rec.email,
    brideName: rec.brideName,
    groomName: rec.groomName,
    coupleInitials: rec.coupleInitials,
    weddingDate: rec.weddingDate,
    weddingDateISO: rec.weddingDateISO,
    location: rec.location,
    hasBooking: rec.hasBooking,
    userBookings: [],
  };
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  login: () => {},
  loginAs: () => {},
  loginWithCredentials: async () => ({ success: false }),
  registerNewCouple: async () => ({ success: false }),
  resetPassword: async () => ({ success: false }),
  logout: () => {},
  addBookingToCurrentCustomer: () => {},
  updateWeddingDetails: () => {},
  updateCoupleNames: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed.user &&
          (parsed.user.id === 'customer_1' ||
            parsed.user.id === 'customer_2' ||
            parsed.user.email === 'aishwarya@wedding.com' ||
            parsed.user.email === 'newuser@wedding.com')
        ) {
          localStorage.removeItem(STORAGE_KEY);
          return false;
        }
        return Boolean(parsed.isLoggedIn);
      }
    } catch (e) {
      console.error('Failed to parse auth session from localStorage', e);
    }
    return false;
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed.user &&
          (parsed.user.id === 'customer_1' ||
            parsed.user.id === 'customer_2' ||
            parsed.user.email === 'aishwarya@wedding.com' ||
            parsed.user.email === 'newuser@wedding.com')
        ) {
          localStorage.removeItem(STORAGE_KEY);
          return null;
        }
        return parsed.user || null;
      }
    } catch (e) {
      console.error('Failed to parse user from localStorage', e);
    }
    return null;
  });

  // Keep localStorage session and active DB session in sync
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          isLoggedIn,
          user,
        })
      );
    } catch (e) {
      console.error('Failed to write auth session to localStorage', e);
    }
  }, [isLoggedIn, user]);

  // Synchronize booking status changes made by company CRM in real time
  useEffect(() => {
    const handleStatusSync = (e: any) => {
      const { id, serviceOrItemName, status, rejectionReason } = e.detail || {};
      if (!status) return;

      setUser((prevUser) => {
        if (!prevUser) return prevUser;
        let modified = false;
        const updatedBookings = (prevUser.userBookings || []).map((b) => {
          const isMatch =
            (id && b.id === id) ||
            (serviceOrItemName && (
              b.serviceName === serviceOrItemName ||
              b.vendorName === serviceOrItemName ||
              (b.serviceName && serviceOrItemName.toLowerCase().includes(b.serviceName.toLowerCase())) ||
              (b.vendorName && serviceOrItemName.toLowerCase().includes(b.vendorName.toLowerCase())) ||
              (b.serviceName && serviceOrItemName.toLowerCase() === b.serviceName.toLowerCase())
            ));

          if (isMatch) {
            modified = true;
            return {
              ...b,
              id: id || b.id,
              status,
              rejectionReason: rejectionReason !== undefined ? rejectionReason : b.rejectionReason,
            };
          }
          return b;
        });
        if (!modified) return prevUser;
        return {
          ...prevUser,
          userBookings: updatedBookings,
        };
      });
    };

    const handleStorageReload = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.user) {
            setUser(parsed.user);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    window.addEventListener('knot_booking_status_synced', handleStatusSync);
    window.addEventListener('wedding_data_changed', handleStorageReload);
    window.addEventListener('storage', handleStorageReload);
    return () => {
      window.removeEventListener('knot_booking_status_synced', handleStatusSync);
      window.removeEventListener('wedding_data_changed', handleStorageReload);
      window.removeEventListener('storage', handleStorageReload);
    };
  }, []);

  const login = () => {
    // No-op or prompt user to login
  };

  const loginAs = (userProfile: UserProfile) => {
    setUser(userProfile);
    setIsLoggedIn(true);

    // Register active session in DB
    const rec = db.findUserById(userProfile.id);
    if (rec) {
      db.createSession(rec);
    }

    window.dispatchEvent(new Event('wedding_data_changed'));
  };

  const loginWithCredentials = async (
    email: string,
    password?: string
  ): Promise<AuthResponse> => {
    const res = await db.verifyCredentials(email, password);
    if (res.success && res.user) {
      const profile = recordToProfile(res.user);
      loginAs(profile);
      return { success: true, user: profile };
    }
    return { success: false, message: res.error || 'Authentication failed.' };
  };

  const registerNewCouple = async (data: RegisterCoupleData): Promise<AuthResponse> => {
    const res = await db.createUser(data);
    if (res.success && res.user) {
      const profile = recordToProfile(res.user);
      loginAs(profile);
      return { success: true, user: profile };
    }
    return { success: false, message: res.error || 'Registration failed.' };
  };

  const resetPassword = async (
    email: string,
    newPassword: string
  ): Promise<AuthResponse> => {
    const res = await db.resetPassword(email, newPassword);
    if (res.success) {
      return {
        success: true,
        message: 'Password reset successfully in database! You may now sign in with your new password.',
      };
    }
    return { success: false, message: res.error || 'Password reset failed.' };
  };

  const logout = () => {
    if (user?.id) {
      db.terminateSession(user.id);
    } else {
      db.terminateSession();
    }
    setIsLoggedIn(false);
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event('wedding_data_changed'));
    } catch (e) {
      console.error(e);
    }
  };

  const addBookingToCurrentCustomer = (
    newBookingData: Omit<UserBooking, 'id'> & { id?: string },
    forWhomHint?: string
  ) => {
    const targetUser = user || {
      id: `guest_${Date.now()}`,
      email: 'guest@wedding.com',
      brideName: 'Bride',
      groomName: 'Groom',
      coupleInitials: 'B&G',
      weddingDate: 'To Be Decided',
      location: 'Not Specified Yet',
      hasBooking: true,
      userBookings: [],
    };

    const bookingId = newBookingData.id || `booking_${Date.now()}`;
    const newBooking: UserBooking = {
      ...newBookingData,
      id: bookingId,
      status: newBookingData.status || 'Pending',
    };

    const updatedUser: UserProfile = {
      ...targetUser,
      hasBooking: true,
      userBookings: [newBooking, ...targetUser.userBookings],
    };

    setUser(updatedUser);
    setIsLoggedIn(true);

    // Route booking directly to /bride, /groom, or /tasks
    routeBookingToStorage(newBooking, updatedUser.id, forWhomHint);
  };

  const updateWeddingDetails = (
    weddingDate: string,
    location?: string,
    weddingDateISO?: string
  ) => {
    if (!user) return;
    const updatedUser: UserProfile = {
      ...user,
      weddingDate,
      location: location ?? user.location,
      weddingDateISO: weddingDateISO ?? user.weddingDateISO,
    };
    setUser(updatedUser);

    // Sync to database
    db.updateUser(user.id, { weddingDate, location });
  };

  const updateCoupleNames = (brideName: string, groomName: string) => {
    if (!user) return;
    const cleanBride = brideName.trim() || user.brideName;
    const cleanGroom = groomName.trim() || user.groomName;
    const initials = `${cleanBride.charAt(0).toUpperCase()}&${cleanGroom.charAt(0).toUpperCase()}`;

    const updatedUser: UserProfile = {
      ...user,
      brideName: cleanBride,
      groomName: cleanGroom,
      coupleInitials: initials,
    };
    setUser(updatedUser);

    // Sync to database
    db.updateUser(user.id, { brideName: cleanBride, groomName: cleanGroom });
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        loginAs,
        loginWithCredentials,
        registerNewCouple,
        resetPassword,
        logout,
        addBookingToCurrentCustomer,
        updateWeddingDetails,
        updateCoupleNames,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
