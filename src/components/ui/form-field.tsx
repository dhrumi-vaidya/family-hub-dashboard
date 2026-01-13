import { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Consistent form field wrapper with:
 * - Required/optional field indicators
 * - Error message display
 * - Hint text support
 */
export function FormField({
  label,
  htmlFor,
  required = false,
  optional = false,
  error,
  hint,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={htmlFor} className={cn(error && 'text-destructive')}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
          {optional && <span className="text-muted-foreground ml-1 text-xs">(optional)</span>}
        </Label>
      </div>
      {children}
      {error && (
        <p className="text-sm text-destructive animate-fade-in">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Group related form fields into sections for long forms
 */
export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn('space-y-4 pb-6 border-b border-border last:border-0', className)}>
      <div>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
