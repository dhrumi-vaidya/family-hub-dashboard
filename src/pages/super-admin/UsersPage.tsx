import { useState, useEffect } from 'react';
import { Search, MoreHorizontal, Users, Shield, UserX, UserCheck, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Family {
  id: string;
  name: string;
  role: string;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  globalRole: 'SUPER_ADMIN' | 'USER';
  createdAt: string;
  lastLogin: string | null;
  failedLoginAttempts: number;
  isLocked: boolean;
  isEmergencyUser: boolean;
  emergencyExpiresAt: string | null;
  families: Family[];
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<'block' | 'unblock' | 'reset' | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/admin/users');

        if (response.success && response.data) {
          setUsers(response.data);
        } else {
          throw new Error(response.error || 'Failed to fetch users');
        }
      } catch (err: any) {
        console.error('Error fetching users:', err);
        setError(err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getStatus = (user: User): 'active' | 'blocked' | 'pending' => {
    if (user.isLocked) return 'blocked';
    if (user.isEmergencyUser) return 'pending';
    return 'active';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const status = getStatus(user);
    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    
    const role = user.globalRole === 'SUPER_ADMIN' ? 'super_admin' : 
                 user.families.some(f => f.role === 'FAMILY_ADMIN') ? 'admin' : 'member';
    const matchesRole = roleFilter === 'all' || role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusBadge = (user: User) => {
    const status = getStatus(user);
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'blocked':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Blocked</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Emergency</Badge>;
    }
  };

  const getRoleBadge = (user: User) => {
    if (user.globalRole === 'SUPER_ADMIN') {
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Super Admin</Badge>;
    }
    const hasAdminRole = user.families.some(f => f.role === 'FAMILY_ADMIN');
    if (hasAdminRole) {
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Family Admin</Badge>;
    }
    return <Badge variant="outline">Member</Badge>;
  };

  const handleAction = (user: User, action: 'block' | 'unblock' | 'reset') => {
    setSelectedUser(user);
    setActionType(action);
  };

  const confirmAction = () => {
    if (selectedUser && actionType) {
      console.log(actionType + ' user:', selectedUser.name);
      // Here you would make the API call
    }
    setSelectedUser(null);
    setActionType(null);
  };

  const stats = {
    total: users.length,
    active: users.filter(u => getStatus(u) === 'active').length,
    blocked: users.filter(u => u.isLocked).length,
    admins: users.filter(u => u.globalRole === 'SUPER_ADMIN' || u.families.some(f => f.role === 'FAMILY_ADMIN')).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor all platform users
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary">
              {stats.total} Total Users
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stats-card">
            <div className="flex items-center gap-4">
              <div className="stats-card-icon green">
                <UserCheck className="h-6 w-6" />
              </div>
              <div className="stats-card-content">
                <p className="stats-card-label">Active Users</p>
                <p className="stats-card-value">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center gap-4">
              <div className="stats-card-icon red">
                <UserX className="h-6 w-6" />
              </div>
              <div className="stats-card-content">
                <p className="stats-card-label">Blocked Users</p>
                <p className="stats-card-value">{stats.blocked}</p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center gap-4">
              <div className="stats-card-icon blue">
                <Shield className="h-6 w-6" />
              </div>
              <div className="stats-card-content">
                <p className="stats-card-label">Family Admins</p>
                <p className="stats-card-value">{stats.admins}</p>
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center gap-4">
              <div className="stats-card-icon amber">
                <Users className="h-6 w-6" />
              </div>
              <div className="stats-card-content">
                <p className="stats-card-label">Total Users</p>
                <p className="stats-card-value">{stats.total}</p>
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
                  placeholder="Search users by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background border-input text-foreground"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 bg-background border-input text-foreground">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-32 bg-background border-input text-foreground">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">User</TableHead>
                  <TableHead className="text-muted-foreground">Email</TableHead>
                  <TableHead className="text-muted-foreground">Role</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Families</TableHead>
                  <TableHead className="text-muted-foreground">Last Login</TableHead>
                  <TableHead className="text-muted-foreground">Login Attempts</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-border">
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{user.email.split('@')[0]}</p>
                        <p className="text-sm text-muted-foreground">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-foreground">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user)}</TableCell>
                    <TableCell>{getStatusBadge(user)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-foreground font-medium">{user.families.length} {user.families.length === 1 ? 'family' : 'families'}</p>
                        {user.families.length > 0 && (
                          <div className="text-xs text-muted-foreground space-y-0.5">
                            {user.families.map(family => (
                              <div key={family.id} className="flex items-center gap-1">
                                <span className="font-medium">{family.name}</span>
                                <span className="text-xs">({family.role})</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(user.lastLogin)}</TableCell>
                    <TableCell>
                      <span className={'text-sm ' + (user.failedLoginAttempts > 3 ? 'text-red-500 font-medium' : 'text-muted-foreground')}>
                        {user.failedLoginAttempts}
                      </span>
                    </TableCell>
                    <TableCell>
                      {user.globalRole !== 'SUPER_ADMIN' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem 
                              onClick={() => handleAction(user, 'reset')}
                              className="text-foreground"
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {!user.isLocked ? (
                              <DropdownMenuItem 
                                onClick={() => handleAction(user, 'block')}
                                className="text-red-500"
                              >
                                <UserX className="h-4 w-4 mr-2" />
                                Block User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem 
                                onClick={() => handleAction(user, 'unblock')}
                                className="text-green-500"
                              >
                                <UserCheck className="h-4 w-4 mr-2" />
                                Unblock User
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Action Confirmation Dialog */}
        <AlertDialog open={!!selectedUser && !!actionType} onOpenChange={() => {
          setSelectedUser(null);
          setActionType(null);
        }}>
          <AlertDialogContent className="bg-card border-border">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-foreground">
                {actionType === 'block' ? 'Block User' : 
                 actionType === 'unblock' ? 'Unblock User' : 'Reset Password'}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                {actionType === 'block' && 
                  'Are you sure you want to block "' + (selectedUser?.email || '') + '"? This will prevent them from accessing the platform.'}
                {actionType === 'unblock' && 
                  'Are you sure you want to unblock "' + (selectedUser?.email || '') + '"? This will restore their access to the platform.'}
                {actionType === 'reset' && 
                  'Send a password reset email to ' + (selectedUser?.email || '') + '?'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-secondary border-border text-secondary-foreground hover:bg-secondary/80">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmAction}
                className={
                  actionType === 'block' ? 'bg-red-600 hover:bg-red-700' :
                  actionType === 'unblock' ? 'bg-green-600 hover:bg-green-700' :
                  'bg-blue-600 hover:bg-blue-700'
                }
              >
                {actionType === 'block' ? 'Block User' : 
                 actionType === 'unblock' ? 'Unblock User' : 'Send Reset Email'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
   
  );
}