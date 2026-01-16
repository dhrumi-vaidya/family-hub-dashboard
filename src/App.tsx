import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Layout } from "@/components/layout/Layout";
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

const queryClient = new QueryClient();

// Protected Route wrapper
function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { isAuthenticated, user, selectedFamily } = useAuth();
  const { isModeSelected } = useApp();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Super admin bypasses family/mode selection
  if (user?.role === 'super_admin') {
    return <Navigate to="/super-admin" replace />;
  }

  if (!selectedFamily && user && user.families.length > 1) {
    return <Navigate to="/select-family" replace />;
  }

  if (!isModeSelected) {
    return <Navigate to="/select-mode" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/member-dashboard" replace />;
  }

  return <>{children}</>;
}

// Super Admin Route wrapper
function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'super_admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// Public Route wrapper (redirects if already logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const { isModeSelected } = useApp();

  if (isAuthenticated) {
    if (user?.role === 'super_admin') {
      return <Navigate to="/super-admin" replace />;
    }
    if (isModeSelected) {
      return <Navigate to={user?.role === 'admin' ? '/' : '/member-dashboard'} replace />;
    }
  }

  return <>{children}</>;
}

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();
  const { isModeSelected } = useApp();
  const showLayout = isAuthenticated && isModeSelected && user?.role !== 'super_admin';

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/select-family" element={<SelectFamily />} />
      <Route path="/select-mode" element={<SelectMode />} />

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
