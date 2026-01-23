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
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import MainAdminDashboard from "./pages/admin/MainAdminDashboard";
import AdminFamilyManagement from "./pages/admin/AdminFamilyManagement";
import AdminUserManagement from "./pages/admin/AdminUserManagement";
import AdminConfiguration from "./pages/admin/AdminConfiguration";
import AdminAuditLogs from "./pages/admin/AdminAuditLogs";
import PermissionsDemo from "./pages/PermissionsDemo";
import AuthDebug from "./pages/AuthDebug";
import AuthTest from "./pages/AuthTest";
import NewLogin from "./pages/NewLogin";
import NewRegister from "./pages/NewRegister";
import NewFamilySelect from "./pages/NewFamilySelect";
import TestPage from "./pages/TestPage";
import SimpleRegister from "./pages/SimpleRegister";
import InviteMembers from "./pages/InviteMembers";
import AuthStatus from "./pages/AuthStatus";

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
  if (user?.globalRole === 'SUPER_ADMIN') {
    if (superAdminOnly) {
      return <>{children}</>;
    }
    // Super admin trying to access family features - redirect to admin panel
    return <Navigate to="/super-admin" replace />;
  }

  // Regular users (family members) need family and mode selection
  if (!selectedFamily && user && user.families.length > 1) {
    return <Navigate to="/select-family" replace />;
  }

  // Auto-select family if user has only one family
  if (!selectedFamily && user && user.families.length === 1) {
    // This should be handled by AuthContext, but as fallback
    return <Navigate to="/select-mode" replace />;
  }

  if (!isModeSelected) {
    return <Navigate to="/select-mode" replace />;
  }

  if (superAdminOnly) {
    return <Navigate to="/" replace />;
  }

  // Check family admin permissions
  if (adminOnly) {
    const userFamilyRole = selectedFamily?.role;
    if (userFamilyRole !== 'FAMILY_ADMIN') {
      return <Navigate to="/member-dashboard" replace />;
    }
  }

  return <>{children}</>;
}

// Super Admin Route wrapper
function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.globalRole !== 'SUPER_ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// Public Route wrapper (redirects if already logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const { isModeSelected } = useApp();

  if (isAuthenticated) {
    // Super Admin goes directly to super admin dashboard
    if (user?.globalRole === 'SUPER_ADMIN') {
      return <Navigate to="/super-admin" replace />;
    }
    
    // Regular users go to their respective dashboards
    if (isModeSelected) {
      const userFamilyRole = user?.families[0]?.role;
      return <Navigate to={userFamilyRole === 'FAMILY_ADMIN' ? '/' : '/member-dashboard'} replace />;
    }
  }

  return <>{children}</>;
}

const AppRoutes = () => {
  const { isAuthenticated, user, isInitializing } = useAuth();
  const { isModeSelected } = useApp();
  const showLayout = isAuthenticated && isModeSelected && user?.globalRole !== 'SUPER_ADMIN';
  const showSuperAdminLayout = isAuthenticated && user?.globalRole === 'SUPER_ADMIN';

  // Show loading state while initializing authentication
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/new-login" element={<PublicRoute><NewLogin /></PublicRoute>} />
      <Route path="/new-register" element={<PublicRoute><NewRegister /></PublicRoute>} />
      <Route path="/simple-register" element={<PublicRoute><SimpleRegister /></PublicRoute>} />
      <Route path="/new-family-select" element={<NewFamilySelect />} />
      <Route path="/select-family" element={<SelectFamily />} />
      <Route path="/select-mode" element={<SelectMode />} />
      <Route path="/auth-debug" element={<AuthDebug />} />
      <Route path="/auth-test" element={<AuthTest />} />
      <Route path="/permissions-demo" element={<PermissionsDemo />} />
      <Route path="/auth-status" element={<AuthStatus />} />
      <Route path="/test" element={<TestPage />} />

      {/* Super Admin Routes */}
      <Route path="/super-admin/*" element={<SuperAdminRoute><SuperAdminDashboard /></SuperAdminRoute>} />

      {/* Protected Routes with Layout */}
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
                <Route path="/invite-members" element={<ProtectedRoute adminOnly><InviteMembers /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/audit-logs" element={<ProtectedRoute adminOnly><AuditLogs /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          ) : showSuperAdminLayout ? (
            <Navigate to="/super-admin" replace />
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
