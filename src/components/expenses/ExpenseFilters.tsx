import { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ExpenseFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  members?: { id: string; name: string }[];
  compact?: boolean;
  hideTypeFilter?: boolean;
}

export interface FilterState {
  category: string;
  member: string;
  type: 'all' | 'family' | 'personal';
}

const categories = ['All', 'Food', 'Travel', 'Medical', 'Utilities', 'Other'];

export function ExpenseFilters({ onFilterChange, members = [], compact = false, hideTypeFilter = false }: ExpenseFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    member: 'All',
    type: 'all',
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: FilterState = { category: 'All', member: 'All', type: 'all' };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters = filters.category !== 'All' || filters.member !== 'All' || filters.type !== 'all';

  return (
    <div className={cn('rounded-xl border border-border bg-card', compact ? 'p-3' : 'p-4')}>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Filter className={cn('text-muted-foreground', compact ? 'h-4 w-4' : 'h-5 w-5')} />
          <span className={cn('font-medium text-foreground', compact ? 'text-sm' : 'text-base')}>
            Filters
          </span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              Active
            </Badge>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className={cn('mt-4 grid gap-3', compact ? 'sm:grid-cols-4' : 'sm:grid-cols-3 lg:grid-cols-4')}>
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">Category</label>
            <Select value={filters.category} onValueChange={(v) => handleFilterChange('category', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {members.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Member</label>
              <Select value={filters.member} onValueChange={(v) => handleFilterChange('member', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Members</SelectItem>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {!hideTypeFilter && (
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Type</label>
              <Select value={filters.type} onValueChange={(v) => handleFilterChange('type', v as FilterState['type'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {hasActiveFilters && (
            <div className="flex items-end">
              <Button variant="outline" size="sm" onClick={clearFilters} className="gap-1.5">
                <X className="h-4 w-4" />
                Clear
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
