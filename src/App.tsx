import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Layout } from "@/components/layout/Layout";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Index from "./pages/Index";
import Expenses from "./pages/Expenses";
import Health from "./pages/Health";
import Responsibilities from "./pages/Responsibilities";
import Members from "./pages/Members";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import AuditLogs from "./pages/AuditLogs";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import SelectFamily from "./pages/SelectFamily";
import SelectMode from "./pages/SelectMode";
import MemberDashboard from "./pages/MemberDashboard";
import MainAdminDashboard from "./pages/admin/MainAdminDashboard";
import AdminFamilyManagement from "./pages/admin/AdminFamilyManagement";
import AdminUserManagement from "./pages/admin/AdminUserManagement";
import AdminConfiguration from "./pages/admin/AdminConfiguration";
import AdminAuditLogs from "./pages/admin/AdminAuditLogs";

const queryClient = new QueryClient();

// Protected Route wrapper
function ProtectedRoute({ children, adminOnly = false, superAdminOnly = false }: { 
  children: React.ReactNode; 
  adminOnly?: boolean;
  superAdminOnly?: boolean;
}) {
  const { isAuthenticated, user, selectedFamily } = useAuth();
  const { isModeSelected } = useApp();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Super Admin bypass: Skip family selection and mode selection
  if (user?.role === 'super_admin') {
    if (superAdminOnly) {
      return <>{children}</>;
    }
    // Super admin trying to access family features - redirect to admin panel
    return <Navigate to="/admin" replace />;
  }

  // Regular users (admin/member) need family and mode selection
  if (!selectedFamily && user && user.families.length > 1) {
    return <Navigate to="/select-family" replace />;
  }

  if (!isModeSelected) {
    return <Navigate to="/select-mode" replace />;
  }

  if (superAdminOnly) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/member-dashboard" replace />;
  }

  return <>{children}</>;
}

// Public Route wrapper (redirects if already logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const { isModeSelected } = useApp();

  if (isAuthenticated) {
    // Super Admin goes directly to admin panel
    if (user?.role === 'super_admin') {
      return <Navigate to="/admin" replace />;
    }
    
    // Regular users go to their respective dashboards
    if (isModeSelected) {
      return <Navigate to={user?.role === 'admin' ? '/' : '/member-dashboard'} replace />;
    }
  }

  return <>{children}</>;
}

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();
  const { isModeSelected } = useApp();
  const showLayout = isAuthenticated && isModeSelected;
  const showAdminLayout = isAuthenticated && user?.role === 'super_admin';

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/select-family" element={<SelectFamily />} />
      <Route path="/select-mode" element={<SelectMode />} />

      {/* Main Admin Panel Routes - Separate from family dashboard */}
      <Route
        path="/admin/*"
        element={
          showAdminLayout ? (
            <AdminLayout>
              <Routes>
                <Route path="/" element={<ProtectedRoute superAdminOnly><MainAdminDashboard /></ProtectedRoute>} />
                <Route path="/families" element={<ProtectedRoute superAdminOnly><AdminFamilyManagement /></ProtectedRoute>} />
                <Route path="/users" element={<ProtectedRoute superAdminOnly><AdminUserManagement /></ProtectedRoute>} />
                <Route path="/config" element={<ProtectedRoute superAdminOnly><AdminConfiguration /></ProtectedRoute>} />
                <Route path="/logs" element={<ProtectedRoute superAdminOnly><AdminAuditLogs /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AdminLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Protected Routes with Family Layout */}
      <Route
        path="/*"
        element={
          showLayout ? (
            <Layout>
              <Routes>
                <Route path="/" element={<ProtectedRoute adminOnly><Index /></ProtectedRoute>} />
                <Route path="/member-dashboard" element={<ProtectedRoute><MemberDashboard /></ProtectedRoute>} />
                <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
                <Route path="/health" element={<ProtectedRoute><Health /></ProtectedRoute>} />
                <Route path="/responsibilities" element={<ProtectedRoute><Responsibilities /></ProtectedRoute>} />
                <Route path="/members" element={<ProtectedRoute adminOnly><Members /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/audit-logs" element={<ProtectedRoute adminOnly><AuditLogs /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <AuthProvider>
          <AppProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AppProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
