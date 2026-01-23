/**
 * KutumbOS Authentication Test Page
 * Test and debug the new authentication system
 */

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  Users, 
  RefreshCw, 
  LogOut, 
  UserPlus, 
  Copy,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';

export default function AuthTest() {
  const {
    user,
    isAuthenticated,
    selectedFamily,
    logout,
    accessToken,
    refreshToken
  } = useAuth();
  
  const [inviteRole, setInviteRole] = useState<string>('ADULT');
  const [inviteHours, setInviteHours] = useState('24');
  const [generatedInvite, setGeneratedInvite] = useState('');
  const [testInviteToken, setTestInviteToken] = useState('');
  const [inviteTestResult, setInviteTestResult] = useState<any>(null);
  
  const handleGenerateInvite = async () => {
    try {
      const result = await generateInvite(inviteRole, parseInt(inviteHours));
      if (result.success && result.inviteToken) {
        setGeneratedInvite(result.inviteToken);
        toast.success('Invite generated successfully!');
      } else {
        toast.error(result.error || 'Failed to generate invite');
      }
    } catch (error) {
      toast.error('Error generating invite');
    }
  };
  
  const handleTestInvite = async () => {
    if (!testInviteToken.trim()) {
      toast.error('Please enter an invite token');
      return;
    }
    
    try {
      const result = await getInviteInfo(testInviteToken.trim());
      setInviteTestResult(result);
      if (result) {
        toast.success('Invite token is valid!');
      } else {
        toast.error('Invalid or expired invite token');
      }
    } catch (error) {
      toast.error('Error testing invite token');
      setInviteTestResult(null);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };
  
  const handleRefreshToken = async () => {
    try {
      const success = await refreshToken();
      if (success) {
        toast.success('Token refreshed successfully!');
      } else {
        toast.error('Failed to refresh token');
      }
    } catch (error) {
      toast.error('Error refreshing token');
    }
  };
  
  const handleSwitchFamily = async (familyId: string) => {
    try {
      const result = await switchFamily(familyId);
      if (result.success) {
        toast.success('Family switched successfully!');
      } else {
        toast.error(result.error || 'Failed to switch family');
      }
    } catch (error) {
      toast.error('Error switching family');
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading authentication state...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You are not authenticated. Please log in to access this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Authentication Test</h1>
          <p className="text-muted-foreground">
            Test and debug the new authentication system
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefreshToken} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Token
          </Button>
          <Button onClick={() => logout()} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
          <Button onClick={() => logoutAll()} variant="destructive">
            <LogOut className="h-4 w-4 mr-2" />
            Logout All
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="user-info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="user-info">User Info</TabsTrigger>
          <TabsTrigger value="families">Families</TabsTrigger>
          <TabsTrigger value="invites">Invites</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
        </TabsList>
        
        <TabsContent value="user-info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>User ID</Label>
                    <div className="flex items-center gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm">{user.id}</code>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(user.id)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm">{user.email}</p>
                  </div>
                  <div>
                    <Label>Global Role</Label>
                    <Badge variant="outline">{user.globalRole}</Badge>
                  </div>
                  <div>
                    <Label>Last Login</Label>
                    <p className="text-sm">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                    </p>
                  </div>
                  <div>
                    <Label>Created At</Label>
                    <p className="text-sm">{new Date(user.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>Authentication Status</Label>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">Authenticated</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="families" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Family Context
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Total Families</Label>
                  <p className="text-2xl font-bold">{families.length}</p>
                </div>
                <div>
                  <Label>Selected Family</Label>
                  <p className="text-sm">{selectedFamily?.name || 'None'}</p>
                </div>
              </div>
              
              {familyContext && (
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">Current Family Context</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <Label>Family ID</Label>
                      <code className="block bg-background px-2 py-1 rounded text-xs">
                        {familyContext.familyId}
                      </code>
                    </div>
                    <div>
                      <Label>User Role</Label>
                      <Badge variant="outline">{familyContext.userRole}</Badge>
                    </div>
                    <div>
                      <Label>Valid</Label>
                      <div className="flex items-center gap-1">
                        {familyContext.isValid ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className={familyContext.isValid ? 'text-green-600' : 'text-red-600'}>
                          {familyContext.isValid ? 'Valid' : 'Invalid'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <Label>All Families</Label>
                <div className="space-y-2 mt-2">
                  {families.map((family) => (
                    <div key={family.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{family.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Role: {family.role} | Joined: {new Date(family.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedFamily?.id === family.id && (
                          <Badge variant="default">Active</Badge>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSwitchFamily(family.id)}
                          disabled={selectedFamily?.id === family.id}
                        >
                          Switch
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invites" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Generate Invite
                </CardTitle>
                <CardDescription>
                  Create invite tokens for new family members
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Role to Assign</Label>
                  <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as FamilyRole)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={FamilyRole.ADULT}>Adult Member</SelectItem>
                      <SelectItem value={FamilyRole.SENIOR}>Senior Member</SelectItem>
                      <SelectItem value={FamilyRole.TEEN}>Teen Member</SelectItem>
                      <SelectItem value={FamilyRole.CHILD}>Child Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Expires In (hours)</Label>
                  <Input
                    type="number"
                    value={inviteHours}
                    onChange={(e) => setInviteHours(e.target.value)}
                    min="1"
                    max="168"
                  />
                </div>
                
                <Button onClick={handleGenerateInvite} className="w-full">
                  Generate Invite
                </Button>
                
                {generatedInvite && (
                  <div className="p-3 border rounded bg-muted/50">
                    <Label>Generated Invite Token</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 bg-background px-2 py-1 rounded text-xs break-all">
                        {generatedInvite}
                      </code>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(generatedInvite)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Invite URL: {window.location.origin}/register?invite={generatedInvite}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Test Invite Token</CardTitle>
                <CardDescription>
                  Validate invite tokens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Invite Token</Label>
                  <Input
                    value={testInviteToken}
                    onChange={(e) => setTestInviteToken(e.target.value)}
                    placeholder="Enter invite token to test"
                  />
                </div>
                
                <Button onClick={handleTestInvite} className="w-full">
                  Test Invite
                </Button>
                
                {inviteTestResult && (
                  <div className="p-3 border rounded bg-muted/50">
                    <Label>Invite Information</Label>
                    <div className="space-y-2 mt-2 text-sm">
                      <div className="flex justify-between">
                        <span>Family:</span>
                        <span className="font-medium">{inviteTestResult.familyName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Role:</span>
                        <Badge variant="outline">{inviteTestResult.roleToAssign}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Invited By:</span>
                        <span>{inviteTestResult.invitedBy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expires:</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(inviteTestResult.expiresAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tokens" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Token Information</CardTitle>
              <CardDescription>
                View and manage authentication tokens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>Access Token</Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-muted px-2 py-1 rounded text-xs break-all">
                      {localStorage.getItem('kutumbos_access_token')?.substring(0, 50)}...
                    </code>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => copyToClipboard(localStorage.getItem('kutumbos_access_token') || '')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label>Refresh Token</Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-muted px-2 py-1 rounded text-xs break-all">
                      {localStorage.getItem('kutumbos_refresh_token')?.substring(0, 50)}...
                    </code>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => copyToClipboard(localStorage.getItem('kutumbos_refresh_token') || '')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label>Selected Family</Label>
                  <code className="block bg-muted px-2 py-1 rounded text-xs">
                    {localStorage.getItem('kutumbos_selected_family') || 'None'}
                  </code>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleRefreshToken} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Access Token
                </Button>
                <Button 
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }} 
                  variant="destructive"
                >
                  Clear All Tokens
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}