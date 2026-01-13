import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AdminOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Renders children only if the current user is an Admin.
 * For Members, it renders nothing (or optional fallback).
 * This follows the rule: "Hide Admin-only actions from Members (do not disable — hide)"
 */
export function AdminOnly({ children, fallback = null }: AdminOnlyProps) {
  const { user } = useAuth();
  
  if (user?.role !== 'admin') {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

interface MemberOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Renders children only if the current user is a Member.
 */
export function MemberOnly({ children, fallback = null }: MemberOnlyProps) {
  const { user } = useAuth();
  
  if (user?.role !== 'member') {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

interface CanPerformProps {
  action: 'read' | 'write' | 'confirm' | 'delete' | 'manage_members';
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Conditional rendering based on user permissions.
 * Admins can perform all actions.
 * Members can only 'read' and 'confirm'.
 */
export function CanPerform({ action, children, fallback = null }: CanPerformProps) {
  const { user } = useAuth();
  
  const memberAllowedActions = ['read', 'confirm'];
  
  if (user?.role === 'admin') {
    return <>{children}</>;
  }
  
  if (user?.role === 'member' && memberAllowedActions.includes(action)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
}

/**
 * Hook to check if current user can perform an action
 */
export function useCanPerform() {
  const { user } = useAuth();
  
  return (action: 'read' | 'write' | 'confirm' | 'delete' | 'manage_members') => {
    if (user?.role === 'admin') return true;
    if (user?.role === 'member') {
      return ['read', 'confirm'].includes(action);
    }
    return false;
  };
}

/**
 * Hook to check if current user is an admin
 */
export function useIsAdmin() {
  const { user } = useAuth();
  return user?.role === 'admin';
}
