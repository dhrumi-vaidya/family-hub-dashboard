import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Home } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { loginSchema, type LoginFormData } from '@/lib/validations';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = async (data: LoginFormData) => {
    setError('');
    setIsLoading(true);

    const loginResult = await login(data.email, data.password);

    if (loginResult.success && loginResult.user) {
      // Redirect based on user role
      if (loginResult.user.globalRole === 'SUPER_ADMIN') {
        navigate('/super-admin');
      } else {
        // Regular users go through family selection flow
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Mobile Number or Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter mobile number or email"
                          autoComplete="username"
                          className="h-12 text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter password"
                            autoComplete="current-password"
                            className="h-12 pr-12 text-base"
                            {...field}
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <div 
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
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              </form>
            </Form>

            {/* Registration Link */}
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto text-primary hover:underline"
                  onClick={() => navigate('/simple-register')}
                >
                  Create Family Account
                </Button>
              </p>
            </div>

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
