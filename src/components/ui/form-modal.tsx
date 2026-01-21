import { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getModeClasses } from '@/lib/design-tokens';
import { useApp } from '@/contexts/AppContext';

interface FormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit?: () => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  submitDisabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export function FormModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  onCancel,
  submitLabel = 'Confirm',
  cancelLabel = 'Cancel',
  submitDisabled = false,
  isLoading = false,
  className,
}: FormModalProps) {
  const { mode } = useApp();
  const classes = getModeClasses(mode);

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onOpenChange(false);
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn('sm:max-w-[425px]', className)}>
        <DialogHeader>
          <DialogTitle className={classes.h3}>{title}</DialogTitle>
          {description && (
            <DialogDescription className={classes.body}>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="space-y-4">
          {children}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            size={classes.buttonSecondary as any}
          >
            {cancelLabel}
          </Button>
          {onSubmit && (
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={submitDisabled || isLoading}
              size={classes.buttonPrimary as any}
            >
              {isLoading ? 'Loading...' : submitLabel}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}