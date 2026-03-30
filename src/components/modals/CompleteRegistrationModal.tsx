import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, UserPlus, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';

const registrationSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number, and special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface CompleteRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  prefillData: {
    familyName: string;
    adminEmail: string;
    inviteEmails: string[];
    fromOnboarding: boolean;
  };
}

export function CompleteRegistrationModal({
  isOpen,
  onClose,
  onComplete,
  prefillData
}: CompleteRegistrationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [invitesSent, setInvitesSent] = useState(false);

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: prefillData.adminEmail || '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true);
    setError('');

    try {
      // Register the user and create family
      const response = await apiClient.register(
        data.email,
        data.password,
        prefillData.familyName
      );

      if (response.success) {
        // Automatically log in the user
        const loginResponse = await apiClient.login(data.email, data.password);
        if (!loginResponse.success) {
          setError('Account created but login failed. Please try logging in manually.');
          return;
        }

        toast.success('Account created successfully!');

        // Send invites if any
        if (prefillData.inviteEmails.length > 0) {
          try {
            for (const email of prefillData.inviteEmails) {
              await apiClient.generateInvite('ADULT', 24, email);
            }
            setInvitesSent(true);
            toast.success(`Invites sent to ${prefillData.inviteEmails.length} family member${prefillData.inviteEmails.length > 1 ? 's' : ''}!`);
          } catch (inviteError) {
            console.error('Error sending invites:', inviteError);
            toast.error('Account created but some invites may have failed to send.');
          }
        }

        onComplete();
      } else {
        setError(response.error || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center">Complete Your Account</DialogTitle>
          <p className="text-center text-sm text-muted-foreground">
            Set up your account to access {prefillData.familyName}
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        autoComplete="new-password"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                  <div className="text-xs text-muted-foreground">
                    Must contain 8+ chars with uppercase, lowercase, number, and special character
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {prefillData.inviteEmails.length > 0 && (
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Invites Ready</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {prefillData.inviteEmails.length} family member{prefillData.inviteEmails.length > 1 ? 's' : ''} will receive invites after registration
                </p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account & Send Invites'
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}