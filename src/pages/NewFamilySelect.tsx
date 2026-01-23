/**
 * KutumbOS New Family Selection Page
 * Allows users to select their active family context
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNewAuth, FamilyWithRole, FamilyRole } from '@/contexts/NewAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Home, Users, ChevronRight, LogOut } from 'lucide-react';
import { toast } from 'sonner';

const roleLabels: Record<FamilyRole, string> = {
  [FamilyRole.FAMILY_ADMIN]: 'Family Admin',
  [FamilyRole.ADULT]: 'Adult Member',
  [FamilyRole.SENIOR]: 'Senior Member',
  [FamilyRole.TEEN]: 'Teen Member',
  [FamilyRole.CHILD]: 'Child Member'
};

const roleColors: Record<FamilyRole, string> = {
  [FamilyRole.FAMILY_ADMIN]: 'bg-purple-100 text-purple-800',
  [FamilyRole.ADULT]: 'bg-blue-100 text-blue-800',
  [FamilyRole.SENIOR]: 'bg-green-100 text-green-800',
  [FamilyRole.TEEN]: 'bg-yellow-100 text-yellow-800',
  [FamilyRole.CHILD]: 'bg-pink-100 text-pink-800'
};

export default function NewFamilySelect() {
  const navigate = useNavigate();
  const { user, families, selectedFamily, setSelectedFamily, logout, isAuthenticated } = useNewAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>('');
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    
    // Redirect Super Admin to admin panel
    if (user?.globalRole === 'SUPER_ADMIN') {
      navigate('/super-admin', { replace: true });
      return;
    }
    
    // Redirect if only one family
    if (families.length === 1) {
      handleFamilySelect(families[0]);
      return;
    }
    
    // Redirect if no families
    if (families.length === 0) {
      toast.error('No families found. Please contact support.');
      return;
    }
  }, [isAuthenticated, user, families, navigate]);
  
  // Set initial selection to current family or first family
  useEffect(() => {
    if (selectedFamily) {
      setSelectedFamilyId(selectedFamily.id);
    } else if (families.length > 0) {
      setSelectedFamilyId(families[0].id);
    }
  }, [selectedFamily, families]);
  
  const handleFamilySelect = async (family: FamilyWithRole) => {
    setIsLoading(true);
    
    try {
      await setSelectedFamily(family);
      toast.success(`Switched to ${family.name}`);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      toast.error('Failed to select family. Please try again.');
      console.error('Family selection error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleContinue = () => {
    const family = families.find(f => f.id === selectedFamilyId);
    if (family) {
      handleFamilySelect(family);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (families.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                <Home className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <CardTitle>No Families Found</CardTitle>
            <CardDescription>
              You don't belong to any families yet. Please contact your family admin for an invite.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLogout} variant="outline" className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Home className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Select Your Family</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user.email}! Choose which family you'd like to access.
          </p>
        </div>
        
        {/* Family Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Your Families
            </CardTitle>
            <CardDescription>
              You belong to {families.length} {families.length === 1 ? 'family' : 'families'}. 
              Select one to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {families.map((family) => (
              <div
                key={family.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedFamilyId === family.id
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedFamilyId(family.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{family.name}</h3>
                        <p className="text-sm text-gray-500">
                          Member since {new Date(family.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={roleColors[family.role]}>
                      {roleLabels[family.role]}
                    </Badge>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleContinue}
                disabled={!selectedFamilyId || isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Switching...
                  </>
                ) : (
                  'Continue'
                )}
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                disabled={isLoading}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Current Selection Info */}
        {selectedFamilyId && (
          <Alert>
            <Users className="h-4 w-4" />
            <AlertDescription>
              You've selected <strong>{families.find(f => f.id === selectedFamilyId)?.name}</strong> 
              {' '}as your active family. You can switch families later from the settings.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>© 2024 KutumbOS. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}