/**
 * KutumbOS New Registration Page
 * Supports both new family creation and joining via invite
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, Eye, EyeOff, Home, AlertTriangle, Users, UserPlus, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';

// Define role types for registration
type FamilyRole = 'FAMILY_ADMIN' | 'ADULT' | 'SENIOR' | 'TEEN' | 'CHILD';

const roleLabels: Record<FamilyRole, string> = {
  'FAMILY_ADMIN': 'Family Admin',
  'ADULT': 'Adult Member',
  'SENIOR': 'Senior Member',
  'TEEN': 'Teen Member',
  'CHILD': 'Child Member'
};

const roleColors: Record<FamilyRole, string> = {
  'FAMILY_ADMIN': 'bg-purple-100 text-purple-800',
  'ADULT': 'bg-blue-100 text-blue-800',
  'SENIOR': 'bg-green-100 text-green-800',
  'TEEN': 'bg-yellow-100 text-yellow-800',
  'CHILD': 'bg-pink-100 text-pink-800'
};

export default function NewRegister() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  
  const inviteToken = searchParams.get('invite');
  const [inviteInfo, setInviteInfo] = useState<any>(null);
  const [inviteLoading, setInviteLoading] = useState(!!inviteToken);
  const [inviteError, setInviteError] = useState('');
  
  const [activeTab, setActiveTab] = useState(inviteToken ? 'invite' : 'new-family');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    familyName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/select-mode', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
  // Load invite information
  useEffect(() => {
    if (inviteToken) {
      loadInviteInfo();
    }
  }, [inviteToken]);
  
  const loadInviteInfo = async () => {
    if (!inviteToken) return;
    
    setInviteLoading(true);
    setInviteError('');
    
    try {
      // Call API to get invite info
      const response = await apiClient.request('/auth/invite-info', {
        method: 'POST',
        body: JSON.stringify({ inviteToken })
      });
      
      if (response.success) {
        setInviteInfo(response.inviteInfo);
        setActiveTab('invite');
      } else {
        setInviteError('Invalid or expired invite link');
      }
    } catch (err) {
      setInviteError('Failed to load invite information');
    } finally {
      setInviteLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };
  
  const validateForm = (): boolean => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (activeTab === 'new-family' && !formData.familyName.trim()) {
      setError('Family name is required');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const registerData = {
        email: formData.email,
        password: formData.password,
        ...(activeTab === 'new-family' 
          ? { familyName: formData.familyName.trim() }
          : { inviteToken: inviteToken! }
        )
      };
      
      const result = await register(registerData);
      
      if (result.success) {
        toast.success('Registration successful!');
        // Navigation is handled by the useEffect above
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getTimeRemaining = (expiresAt: string): string => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const remaining = expiry.getTime() - now.getTime();
    
    if (remaining <= 0) return 'Expired';
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else {
      return `${minutes}m remaining`;
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Home className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Join KutumbOS</h1>
          <p className="text-gray-600 mt-2">Create your family account</p>
        </div>
        
        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              {inviteToken ? 'Join an existing family or create a new one' : 'Start your family journey'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="new-family" disabled={isLoading}>
                  <Users className="h-4 w-4 mr-2" />
                  New Family
                </TabsTrigger>
                <TabsTrigger value="invite" disabled={isLoading || !inviteToken}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Join Family
                </TabsTrigger>
              </TabsList>
              
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <TabsContent value="new-family" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label htmlFor="familyName">Family Name</Label>
                    <Input
                      id="familyName"
                      name="familyName"
                      type="text"
                      value={formData.familyName}
                      onChange={handleInputChange}
                      placeholder="Enter your family name"
                      required={activeTab === 'new-family'}
                      disabled={isLoading}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="invite" className="space-y-4 mt-0">
                  {inviteLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      Loading invite information...
                    </div>
                  ) : inviteError ? (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{inviteError}</AlertDescription>
                    </Alert>
                  ) : inviteInfo ? (
                    <div className="p-4 border rounded-lg bg-muted/50">
                      <h4 className="font-medium mb-2">You're invited to join:</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Family:</span>
                          <span className="font-medium">{inviteInfo.familyName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Role:</span>
                          <Badge className={roleColors[inviteInfo.roleToAssign]}>
                            {roleLabels[inviteInfo.roleToAssign]}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Invited by:</span>
                          <span className="text-sm">{inviteInfo.invitedBy}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Expires:</span>
                          <div className="flex items-center text-sm">
                            <Clock className="h-3 w-3 mr-1" />
                            {getTimeRemaining(inviteInfo.expiresAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </TabsContent>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a strong password"
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Must contain uppercase, lowercase, number, and special character
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || (activeTab === 'invite' && (!inviteInfo || inviteError))}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    activeTab === 'new-family' ? 'Create Family Account' : 'Join Family'
                  )}
                </Button>
              </form>
            </Tabs>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>© 2024 KutumbOS. All rights reserved.</p>
          <p className="mt-1">Family Life Operating System</p>
        </div>
      </div>
    </div>
  );
}