import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { RefreshCw, Trash2, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthStatus() {
  const { user, selectedFamily, setSelectedFamily, logout } = useAuth();
  const { isModeSelected } = useApp();

  const clearLocalStorage = () => {
    localStorage.removeItem('kutumbos_selected_family');
    localStorage.removeItem('kutumbos_access_token');
    localStorage.removeItem('kutumbos_refresh_token');
    setSelectedFamily(null);
    toast.success('Local storage cleared! Please refresh the page.');
  };

  const selectCorrectFamily = () => {
    if (user?.families && user.families.length > 0) {
      // Find the DV family or the first family
      const dvFamily = user.families.find(f => f.name === 'DV');
      const familyToSelect = dvFamily || user.families[0];
      
      setSelectedFamily(familyToSelect);
      localStorage.setItem('kutumbos_selected_family', JSON.stringify(familyToSelect));
      toast.success(`Selected family: ${familyToSelect.name}`);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🔍 Authentication Status Debug</CardTitle>
            <CardDescription>
              Check your current authentication state and fix any issues
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* User Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">👤 User Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {user ? (
                    <>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>ID:</strong> {user.id}</p>
                      <p><strong>Global Role:</strong> <Badge>{user.globalRole}</Badge></p>
                      <p><strong>Families Count:</strong> {user.families?.length || 0}</p>
                    </>
                  ) : (
                    <p className="text-muted-foreground">Not logged in</p>
                  )}
                </CardContent>
              </Card>

              {/* Selected Family */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">👨‍👩‍👧‍👦 Selected Family</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {selectedFamily ? (
                    <>
                      <p><strong>Name:</strong> {selectedFamily.name}</p>
                      <p><strong>ID:</strong> {selectedFamily.id}</p>
                      <p><strong>Your Role:</strong> <Badge variant={selectedFamily.role === 'FAMILY_ADMIN' ? 'default' : 'secondary'}>{selectedFamily.role}</Badge></p>
                      <p><strong>Created:</strong> {new Date(selectedFamily.createdAt).toLocaleDateString()}</p>
                    </>
                  ) : (
                    <p className="text-muted-foreground">No family selected</p>
                  )}
                </CardContent>
              </Card>

              {/* All Families */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🏠 All Your Families</CardTitle>
                </CardHeader>
                <CardContent>
                  {user?.families && user.families.length > 0 ? (
                    <div className="space-y-2">
                      {user.families.map((family, index) => (
                        <div key={family.id} className="p-2 border rounded">
                          <p><strong>{family.name}</strong></p>
                          <p>Role: <Badge variant={family.role === 'FAMILY_ADMIN' ? 'default' : 'secondary'}>{family.role}</Badge></p>
                          <p className="text-xs text-muted-foreground">ID: {family.id}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No families found</p>
                  )}
                </CardContent>
              </Card>

              {/* App State */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">⚙️ App State</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Mode Selected:</strong> <Badge variant={isModeSelected ? 'default' : 'destructive'}>{isModeSelected ? 'Yes' : 'No'}</Badge></p>
                  <p><strong>Is Admin:</strong> <Badge variant={selectedFamily?.role === 'FAMILY_ADMIN' ? 'default' : 'secondary'}>{selectedFamily?.role === 'FAMILY_ADMIN' ? 'Yes' : 'No'}</Badge></p>
                </CardContent>
              </Card>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t">
              <Button onClick={selectCorrectFamily} variant="default">
                <RefreshCw className="mr-2 h-4 w-4" />
                Select Correct Family
              </Button>
              
              <Button onClick={clearLocalStorage} variant="outline">
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Local Storage
              </Button>
              
              <Button onClick={logout} variant="destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout & Start Fresh
              </Button>
            </div>

            {/* Local Storage Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💾 Local Storage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Selected Family:</strong> {localStorage.getItem('kutumbos_selected_family') || 'None'}</p>
                  <p><strong>Access Token:</strong> {localStorage.getItem('kutumbos_access_token') ? 'Present' : 'None'}</p>
                  <p><strong>Refresh Token:</strong> {localStorage.getItem('kutumbos_refresh_token') ? 'Present' : 'None'}</p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}