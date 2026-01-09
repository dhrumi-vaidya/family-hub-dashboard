import { ClipboardList, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

interface EmptyResponsibilitiesProps {
  onCreateClick: () => void;
}

export function EmptyResponsibilities({ onCreateClick }: EmptyResponsibilitiesProps) {
  const { mode } = useApp();
  
  return (
    <div className={cn(
      "flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 text-center",
      mode === 'simple' ? 'p-12' : 'p-8'
    )}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <ClipboardList className="h-8 w-8 text-muted-foreground" />
      </div>
      
      <h3 className={cn(
        "font-semibold text-foreground",
        mode === 'simple' ? 'text-xl' : 'text-lg'
      )}>
        No responsibilities created yet
      </h3>
      
      <p className={cn(
        "mt-2 max-w-md text-muted-foreground",
        mode === 'simple' ? 'text-base' : 'text-sm'
      )}>
        Create one to keep things organized.
      </p>
      
      <Button 
        onClick={onCreateClick} 
        className={cn(
          "mt-6 gap-2",
          mode === 'simple' ? 'h-12 px-6 text-base' : ''
        )}
      >
        <Plus className="h-4 w-4" />
        Create Responsibility
      </Button>
    </div>
  );
}
