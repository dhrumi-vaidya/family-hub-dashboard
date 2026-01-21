import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Home } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().trim().min(1, { message: 'Please enter your mobile number or email' }),
  password: z.string().min(1, { message: 'Please enter your password' }),
});

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate input
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setIsLoading(true);

    const loginResult = await login(email, password);

    if (loginResult.success && loginResult.user) {
      // Redirect based on user role
      if (loginResult.user.role === 'super_admin') {
        navigate('/super-admin');
      } else {
        navigate('/select-family');
      }
    } else {
      setError(loginResult.error || 'Unable to connect. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground mb-4 shadow-soft">
            <Home className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">KutumbOS</h1>
          <p className="text-muted-foreground/80 mt-1">Family Life, Organized</p>
        </div>

        {/* Login Card */}
        <Card className="border-border shadow-elevated">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Welcome to KutumbOS</CardTitle>
            <CardDescription>Manage family life, together.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Mobile Number or Email
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter mobile number or email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  className="h-12 text-base"
                  aria-describedby={error ? "login-error" : undefined}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="h-12 pr-12 text-base"
                    aria-describedby={error ? "login-error" : undefined}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {error && (
                <div 
                  id="login-error"
                  className="rounded-lg bg-destructive-light border border-destructive/20 p-3 text-sm text-destructive animate-fade-in"
                  role="alert"
                  aria-live="polite"
                >
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium" 
                disabled={isLoading}
                aria-describedby={isLoading ? "loading-status" : undefined}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span id="loading-status">Logging in...</span>
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground/80 mt-6 leading-relaxed">
              This is a family-only system.
              <br />
              Your data stays private.
            </p>

            {/* Demo credentials hint */}
            <div className="mt-6 p-3 rounded-lg bg-muted/50 text-sm">
              <p className="font-medium text-foreground mb-2">Demo Credentials:</p>
              <p className="text-muted-foreground">
                <strong>Super Admin:</strong> super.admin@kutumb.com / Qwerty@123
              </p>
              <p className="text-muted-foreground">
                <strong>Admin:</strong> rahul@sharma.com / password123
              </p>
              <p className="text-muted-foreground">
                <strong>Member:</strong> sunita@sharma.com / password123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
