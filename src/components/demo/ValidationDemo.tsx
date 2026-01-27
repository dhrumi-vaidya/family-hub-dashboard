import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { loginSchema, registerSchema, type LoginFormData } from '@/lib/validations';
import { toast } from 'sonner';

export function ValidationDemo() {
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLoginSubmit = (data: LoginFormData) => {
    toast.success(`Login form valid! Email: ${data.email}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Field-Level Validation Demo</CardTitle>
          <CardDescription>
            Try entering invalid data to see field-specific error messages appear below each field.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Try: invalid-email or 123456789"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Leave empty to see error"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Test Validation
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Validation Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm">Email/Phone Field:</h4>
            <ul className="text-sm text-muted-foreground mt-1 space-y-1">
              <li>• Must be a valid email (user@domain.com) OR</li>
              <li>• Must be a valid 10-digit Indian mobile number (starting with 6-9)</li>
              <li>• Cannot be empty</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm">Password Field:</h4>
            <ul className="text-sm text-muted-foreground mt-1 space-y-1">
              <li>• Cannot be empty</li>
              <li>• For registration: Must be 8+ chars with uppercase, lowercase, number, and special character</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm">Amount Fields:</h4>
            <ul className="text-sm text-muted-foreground mt-1 space-y-1">
              <li>• Must be a valid number greater than 0</li>
              <li>• Cannot exceed ₹9,99,999</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm">Name Fields:</h4>
            <ul className="text-sm text-muted-foreground mt-1 space-y-1">
              <li>• Must be 2-50 characters</li>
              <li>• Only letters and spaces allowed</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm">Age Fields:</h4>
            <ul className="text-sm text-muted-foreground mt-1 space-y-1">
              <li>• Must be between 0 and 150</li>
              <li>• Must be a valid number</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}