import { useState } from 'react';
import { Search, MoreHorizontal, Users, Shield, UserX, UserCheck, Mail, Phone } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'member' | 'super_admin';
  status: 'active' | 'blocked' | 'pending';
  familiesCount: number;
  lastLogin: string;
  createdAt: string;
  loginAttempts: number;
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<'block' | 'unblock' | 'reset' | null>(null);

  // Mock user data
  const users: User[] = [
    {
      id: '1',
      name: 'Rahul Sharma',
      email: 'rahul@sharma.com',
      phone: '+91 9876543210',
      role: 'admin',
      status: 'active',
      familiesCount: 2,
      lastLogin: '2 hours ago',
      createdAt: '2024-01-15',
      loginAttempts: 0,
    },
    {
      id: '2',
      name: 'Sunita Sharma',
      email: 'sunita@sharma.com',
      phone: '+91 9876543211',
      role: 'member',
      status: 'active',
      familiesCount: 1,
      lastLogin: '1 day ago',
      createdAt: '2024-01-15',
      loginAttempts: 0,
    },
    {
      id: '3',
      name: 'Amit Patel',
      email: 'amit@patel.com',
      phone: '+91 9876543212',
      role: 'admin',
      status: 'blocked',
      familiesCount: 1,
      lastLogin: '1 week ago',
      createdAt: '2024-02-01',
      loginAttempts: 5,
    },
    {
      id: '4',
      name: 'System Administrator',
      email: 'super.admin@kutumb.com',
      role: 'super_admin',
      status: 'active',
      familiesCount: 0,
      lastLogin: '30 minutes ago',
      createdAt: '2024-01-01',
      loginAttempts: 0,
    },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.phone && user.phone.includes(searchTerm));
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'blocked':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Blocked</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
    }
  };

  const getRoleBadge = (role: User['role']) => {
    switch (role) {
      case 'super_admin':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Super Admin</Badge>;
      case 'admin':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Admin</Badge>;
      case 'member':
        return <Badge variant="outline">Member</Badge>;
    }
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
    active: users.filter(u => u.status === 'active').length,
    blocked: users.filter(u => u.status === 'blocked').length,
    admins: users.filter(u => u.role === 'admin').length,
  };

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
                  <TableHead className="text-muted-foreground">Contact</TableHead>
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
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">Joined {user.createdAt}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-foreground">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-foreground">{user.familiesCount}</TableCell>
                    <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                    <TableCell>
                      <span className={'text-sm ' + (user.loginAttempts > 3 ? 'text-red-500' : 'text-muted-foreground')}>
                        {user.loginAttempts}
                      </span>
                    </TableCell>
                    <TableCell>
                      {user.role !== 'super_admin' && (
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
                            {user.status === 'active' ? (
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
                  'Are you sure you want to block "' + (selectedUser?.name || '') + '"? This will prevent them from accessing the platform.'}
                {actionType === 'unblock' && 
                  'Are you sure you want to unblock "' + (selectedUser?.name || '') + '"? This will restore their access to the platform.'}
                {actionType === 'reset' && 
                  'Send a password reset email to "' + (selectedUser?.name || '') + '" at ' + (selectedUser?.email || '') + '?'}
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