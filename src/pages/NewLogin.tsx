/**
 * KutumbOS New Login Page
 * Integrates with the new JWT-based authentication system
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, Home, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function NewLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated, user } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.globalRole === 'SUPER_ADMIN') {
        navigate('/super-admin', { replace: true });
      } else if (user.families.length > 1) {
        navigate('/select-family', { replace: true });
      } else if (user.families.length === 1) {
        navigate('/select-mode', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);
  
  // Check for redirect parameter
  const redirectTo = searchParams.get('redirect');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await login(formData);
      
      if (result.success) {
        toast.success('Login successful!');
        
        // Handle redirect after successful login
        if (redirectTo) {
          navigate(redirectTo, { replace: true });
        }
        // Navigation is handled by the useEffect above
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const demoCredentials = [
    { label: 'Super Admin', email: 'super.admin@kutumb.com', password: 'Qwerty@123' },
    { label: 'Family Admin', email: 'rahul@sharma.com', password: 'password123' },
    { label: 'Family Member', email: 'sunita@sharma.com', password: 'password123' },
    { label: 'Phone Login', email: '9876543210', password: 'password123' }
  ];
  
  const fillDemoCredentials = (email: string, password: string) => {
    setFormData({ email, password });
    setError('');
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
          <h1 className="text-2xl font-bold text-gray-900">Welcome to KutumbOS</h1>
          <p className="text-gray-600 mt-2">Sign in to your family account</p>
        </div>
        
        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email or Phone</Label>
                <Input
                  id="email"
                  name="email"
                  type="text"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email or phone number"
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
                    placeholder="Enter your password"
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
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Demo Credentials */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Demo Accounts</CardTitle>
            <CardDescription className="text-xs">
              Click to fill credentials for testing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {demoCredentials.map((cred, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials(cred.email, cred.password)}
                  disabled={isLoading}
                  className="text-xs"
                >
                  {cred.label}
                </Button>
              ))}
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