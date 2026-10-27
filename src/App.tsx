import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider, ToastProvider } from '@/components/providers';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ServicesProvider } from '@/context/ServicesContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PublicServicesDashboard } from '@/pages/PublicServicesDashboard';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { JourneyPage } from '@/pages/JourneyPage';
import { BridePage, GroomPage } from '@/pages/PreparationPages';
import { GuestsPage } from '@/pages/GuestsPage';
import {
  ServicesPage,
  MakeupPage,
  MusicDjPage,
  PhotographyPage,
  DecorationPage,
  CateringPage,
} from '@/pages/VendorPages';
import { JewelleryPage, ClothesPage } from '@/pages/RentalPages';
import { TasksPage } from '@/pages/TasksPage';
import { BillPage } from '@/pages/BillPage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { LanguagePage } from '@/pages/LanguagePage';
import { SupportPage } from '@/pages/SupportPage';
import { SangeetPage } from '@/pages/SangeetPage';
import { CompanyCrmPage } from '@/pages/CompanyCrmPage';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function AppRoutes() {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      {/* Home Route: Public Services Marketplace when Logged Out, Customer Dashboard when Logged In */}
      <Route path="/" element={isLoggedIn ? <DashboardPage /> : <PublicServicesDashboard />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Company CRM & Service Management Portal */}
      <Route path="/crm" element={<CompanyCrmPage />} />
      <Route path="/admin" element={<CompanyCrmPage />} />

      {/* Publicly Accessible Marketplace & Catalog Pages */}
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/bride" element={<BridePage />} />
      <Route path="/groom" element={<GroomPage />} />
      <Route path="/jewellery" element={<JewelleryPage />} />
      <Route path="/clothes" element={<ClothesPage />} />
      <Route path="/music-dj" element={<MusicDjPage />} />
      <Route path="/photography" element={<PhotographyPage />} />
      <Route path="/decoration" element={<DecorationPage />} />
      <Route path="/catering" element={<CateringPage />} />
      <Route path="/makeup" element={<MakeupPage />} />
      <Route path="/language" element={<LanguagePage />} />
      <Route path="/support" element={<SupportPage />} />

      {/* Private Customer Pages (Protected) */}
      <Route
        path="/journey"
        element={
          <ProtectedRoute>
            <JourneyPage />
          </ProtectedRoute>
        }
      />
      <Route path="/events" element={<Navigate to="/" replace />} />
      <Route
        path="/guests"
        element={
          <ProtectedRoute>
            <GuestsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sangeet"
        element={
          <ProtectedRoute>
            <SangeetPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <TasksPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bill"
        element={
          <ProtectedRoute>
            <BillPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/budget"
        element={
          <ProtectedRoute>
            <BillPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />

      {/* Aliases for alternate or commonly typed URLs */}
      <Route path="/dashboard" element={<Navigate to="/" replace />} />
      <Route path="/vendors" element={<Navigate to="/services" replace />} />
      <Route path="/venues" element={<Navigate to="/services" replace />} />
      <Route path="/packages" element={<Navigate to="/services" replace />} />
      <Route path="/vendor-register" element={<Navigate to="/services" replace />} />
      <Route path="/vendor-dashboard" element={<Navigate to="/crm" replace />} />
      <Route path="/vendor-portal" element={<Navigate to="/crm" replace />} />
      <Route path="/partner" element={<Navigate to="/crm" replace />} />
      <Route path="/partners" element={<Navigate to="/crm" replace />} />

      {/* Catch-All Fallback: Redirect all unmatched routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ServicesProvider>
          <LanguageProvider>
            <ToastProvider>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </ToastProvider>
          </LanguageProvider>
        </ServicesProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
