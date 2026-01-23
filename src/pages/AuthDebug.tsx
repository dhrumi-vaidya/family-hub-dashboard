/**
 * Debug page to check authentication state
 */

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AuthDebug() {
  const { user, isAuthenticated, selectedFamily, isInitializing } = useAuth();
  const { isModeSelected } = useApp();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Authentication Debug</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication State</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <strong>Is Initializing:</strong> 
              <Badge variant={isInitializing ? "secondary" : "outline"}>
                {isInitializing ? 'Yes' : 'No'}
              </Badge>
            </div>
            
            <div>
              <strong>Is Authenticated:</strong> 
              <Badge variant={isAuthenticated ? "default" : "destructive"}>
                {isAuthenticated ? 'Yes' : 'No'}
              </Badge>
            </div>
            
            <div>
              <strong>Mode Selected:</strong> 
              <Badge variant={isModeSelected ? "default" : "destructive"}>
                {isModeSelected ? 'Yes' : 'No'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user ? (
              <>
                <div>
                  <strong>ID:</strong> <code>{user.id}</code>
                </div>
                <div>
                  <strong>Email:</strong> {user.email}
                </div>
                <div>
                  <strong>Global Role:</strong> 
                  <Badge variant="outline">{user.globalRole}</Badge>
                </div>
                <div>
                  <strong>Families Count:</strong> {user.families.length}
                </div>
                <div>
                  <strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}
                </div>
                <div>
                  <strong>Last Login:</strong> {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                </div>
              </>
            ) : (
              <p>No user data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Selected Family</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedFamily ? (
              <>
                <div>
                  <strong>ID:</strong> <code>{selectedFamily.id}</code>
                </div>
                <div>
                  <strong>Name:</strong> {selectedFamily.name}
                </div>
                <div>
                  <strong>User Role:</strong> 
                  <Badge variant="outline">{selectedFamily.role}</Badge>
                </div>
                <div>
                  <strong>Created At:</strong> {new Date(selectedFamily.createdAt).toLocaleString()}
                </div>
              </>
            ) : (
              <p>No family selected</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Families</CardTitle>
          </CardHeader>
          <CardContent>
            {user?.families && user.families.length > 0 ? (
              <div className="space-y-2">
                {user.families.map((family, index) => (
                  <div key={family.id} className="p-3 border rounded">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{family.name}</span>
                      <Badge variant="outline">{family.role}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ID: {family.id}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No families available</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Local Storage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <strong>Selected Family:</strong>
              <pre className="text-xs bg-muted p-2 rounded mt-1">
                {localStorage.getItem('kutumbos_selected_family') || 'null'}
              </pre>
            </div>
            <div>
              <strong>Mode Selected:</strong>
              <pre className="text-xs bg-muted p-2 rounded mt-1">
                {localStorage.getItem('kutumbos_mode_selected') || 'null'}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}