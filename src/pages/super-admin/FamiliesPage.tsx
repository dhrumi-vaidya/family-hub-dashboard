import { useState } from 'react';
import { Search, MoreHorizontal, Building2, Users, Calendar, AlertCircle, Eye, Ban, CheckCircle } from 'lucide-react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Family {
  id: string;
  name: string;
  adminName: string;
  adminEmail: string;
  memberCount: number;
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
  lastActivity: string;
  storageUsed: string;
  planType: 'free' | 'premium';
}

export default function FamiliesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
  const [actionType, setActionType] = useState<'suspend' | 'activate' | 'view' | null>(null);

  // Mock family data
  const families: Family[] = [
    {
      id: '1',
      name: 'Sharma Family',
      adminName: 'Rahul Sharma',
      adminEmail: 'rahul@sharma.com',
      memberCount: 8,
      status: 'active',
      createdAt: '2024-01-15',
      lastActivity: '2 hours ago',
      storageUsed: '2.3 GB',
      planType: 'premium',
    },
    {
      id: '2',
      name: 'Patel Family',
      adminName: 'Amit Patel',
      adminEmail: 'amit@patel.com',
      memberCount: 12,
      status: 'active',
      createdAt: '2024-02-01',
      lastActivity: '1 day ago',
      storageUsed: '1.8 GB',
      planType: 'free',
    },
    {
      id: '3',
      name: 'Kumar Family',
      adminName: 'Priya Kumar',
      adminEmail: 'priya@kumar.com',
      memberCount: 6,
      status: 'suspended',
      createdAt: '2024-01-20',
      lastActivity: '1 week ago',
      storageUsed: '0.9 GB',
      planType: 'free',
    },
  ];

  const filteredFamilies = families.filter(family =>
    family.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    family.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    family.adminEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: Family['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Suspended</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
    }
  };

  const getPlanBadge = (planType: Family['planType']) => {
    return planType === 'premium' ? (
      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Premium</Badge>
    ) : (
      <Badge variant="outline">Free</Badge>
    );
  };

  const handleAction = (family: Family, action: 'suspend' | 'activate' | 'view') => {
    setSelectedFamily(family);
    setActionType(action);
  };

  const confirmAction = () => {
    if (selectedFamily && actionType) {
      console.log(actionType + ' family:', selectedFamily.name);
      // Here you would make the API call
    }
    setSelectedFamily(null);
    setActionType(null);
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Family Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor all families on the platform
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary">
              {families.length} Total Families
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stats-card">
            <div className="flex items-center gap-4">
              <div className="stats-card-icon green">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div className="stats-card-content">
                <p className="stats-card-label">Active Families</p>
                <p className="stats-card-value">
                  {families.filter(f => f.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center gap-4">
              <div className="stats-card-icon red">
                <Ban className="h-6 w-6" />
              </div>
              <div className="stats-card-content">
                <p className="stats-card-label">Suspended</p>
                <p className="stats-card-value">
                  {families.filter(f => f.status === 'suspended').length}
                </p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center gap-4">
              <div className="stats-card-icon purple">
                <Users className="h-6 w-6" />
              </div>
              <div className="stats-card-content">
                <p className="stats-card-label">Total Members</p>
                <p className="stats-card-value">
                  {families.reduce((sum, f) => sum + f.memberCount, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center gap-4">
              <div className="stats-card-icon amber">
                <Building2 className="h-6 w-6" />
              </div>
              <div className="stats-card-content">
                <p className="stats-card-label">Premium Plans</p>
                <p className="stats-card-value">
                  {families.filter(f => f.planType === 'premium').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search families, admins, or emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-input text-foreground"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">Family</TableHead>
                  <TableHead className="text-muted-foreground">Admin</TableHead>
                  <TableHead className="text-muted-foreground">Members</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Plan</TableHead>
                  <TableHead className="text-muted-foreground">Storage</TableHead>
                  <TableHead className="text-muted-foreground">Last Active</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFamilies.map((family) => (
                  <TableRow key={family.id} className="border-border">
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{family.name}</p>
                        <p className="text-sm text-muted-foreground">Created {family.createdAt}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-foreground">{family.adminName}</p>
                        <p className="text-sm text-muted-foreground">{family.adminEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">{family.memberCount}</TableCell>
                    <TableCell>{getStatusBadge(family.status)}</TableCell>
                    <TableCell>{getPlanBadge(family.planType)}</TableCell>
                    <TableCell className="text-foreground">{family.storageUsed}</TableCell>
                    <TableCell className="text-muted-foreground">{family.lastActivity}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem 
                            onClick={() => handleAction(family, 'view')}
                            className="text-foreground"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {family.status === 'active' ? (
                            <DropdownMenuItem 
                              onClick={() => handleAction(family, 'suspend')}
                              className="text-red-500"
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              Suspend Family
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              onClick={() => handleAction(family, 'activate')}
                              className="text-green-500"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Activate Family
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Action Confirmation Dialog */}
        <AlertDialog open={!!selectedFamily && !!actionType} onOpenChange={() => {
          setSelectedFamily(null);
          setActionType(null);
        }}>
          <AlertDialogContent className="bg-card border-border">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-foreground">
                {actionType === 'suspend' ? 'Suspend Family' : 
                 actionType === 'activate' ? 'Activate Family' : 'View Family Details'}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                {actionType === 'suspend' && 
                  'Are you sure you want to suspend "' + (selectedFamily?.name || '') + '"? This will prevent all family members from accessing the platform.'}
                {actionType === 'activate' && 
                  'Are you sure you want to activate "' + (selectedFamily?.name || '') + '"? This will restore access for all family members.'}
                {actionType === 'view' && 
                  'View detailed information about "' + (selectedFamily?.name || '') + '".'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-secondary border-border text-secondary-foreground hover:bg-secondary/80">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmAction}
                className={
                  actionType === 'suspend' ? 'bg-red-600 hover:bg-red-700' :
                  actionType === 'activate' ? 'bg-green-600 hover:bg-green-700' :
                  'bg-blue-600 hover:bg-blue-700'
                }
              >
                {actionType === 'suspend' ? 'Suspend' : 
                 actionType === 'activate' ? 'Activate' : 'View Details'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    
  );
}