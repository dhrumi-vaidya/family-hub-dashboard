import { useState } from 'react';
import { Search, MoreHorizontal, Users, Calendar, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Family {
  id: string;
  name: string;
  memberCount: number;
  status: 'active' | 'suspended';
  createdAt: string;
  lastActivity: string;
  adminEmail: string;
}

/**
 * Admin Family Management
 * 
 * Read-only family management for Super Admin.
 * Can view metadata and suspend/activate families.
 * NO access to personal data, expenses, health records, or tasks.
 */
export default function AdminFamilyManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
  const [actionType, setActionType] = useState<'suspend' | 'activate' | null>(null);

  // Mock family data - in real app, this would come from admin APIs
  const families: Family[] = [
    {
      id: '1',
      name: 'Sharma Family',
      memberCount: 8,
      status: 'active',
      createdAt: '2024-01-15',
      lastActivity: '2024-01-13',
      adminEmail: 'rahul@sharma.com',
    },
    {
      id: '2',
      name: 'Patel Family',
      memberCount: 12,
      status: 'active',
      createdAt: '2024-02-03',
      lastActivity: '2024-01-12',
      adminEmail: 'admin@patel.com',
    },
    {
      id: '3',
      name: 'Kumar Family',
      memberCount: 5,
      status: 'suspended',
      createdAt: '2023-11-20',
      lastActivity: '2023-12-15',
      adminEmail: 'kumar.family@email.com',
    },
  ];

  const filteredFamilies = families.filter(family =>
    family.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    family.adminEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = (family: Family, action: 'suspend' | 'activate') => {
    setSelectedFamily(family);
    setActionType(action);
  };

  const confirmAction = () => {
    if (selectedFamily && actionType) {
      // In real app, this would call the admin API
      console.log(`${actionType} family:`, selectedFamily.id);
      // Update family status locally for demo
      selectedFamily.status = actionType === 'suspend' ? 'suspended' : 'active';
    }
    setSelectedFamily(null);
    setActionType(null);
  };

  const getStatusColor = (status: 'active' | 'suspended') => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Family Management</h1>
        <p className="text-slate-600 mt-1">
          Monitor and manage family accounts across the platform
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">
            Search Families
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by family name or admin email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Families List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">
            All Families ({filteredFamilies.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredFamilies.map((family) => (
              <div
                key={family.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-900">{family.name}</h3>
                    <Badge className={getStatusColor(family.status)}>
                      {family.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {family.memberCount} members
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Created {family.createdAt}
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      Last active {family.lastActivity}
                    </div>
                    <div>
                      Admin: {family.adminEmail}
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      View Metadata
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {family.status === 'active' ? (
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleAction(family, 'suspend')}
                      >
                        Suspend Family
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem 
                        className="text-green-600"
                        onClick={() => handleAction(family, 'activate')}
                      >
                        Activate Family
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!selectedFamily} onOpenChange={() => setSelectedFamily(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'suspend' ? 'Suspend' : 'Activate'} Family
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {actionType} "{selectedFamily?.name}"? 
              {actionType === 'suspend' && ' This will prevent all family members from accessing their account.'}
              {actionType === 'activate' && ' This will restore access for all family members.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className={actionType === 'suspend' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {actionType === 'suspend' ? 'Suspend' : 'Activate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}