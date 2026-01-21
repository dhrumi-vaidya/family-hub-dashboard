import { useState } from 'react';
import { Search, MoreHorizontal, Mail, Shield, Users } from 'lucide-react';
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

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'blocked';
  role: 'admin' | 'member';
  familiesCount: number;
  lastLogin: string;
  createdAt: string;
}

/**
 * Admin User Management
 * 
 * Platform-level user administration for Super Admin.
 * Can block/unblock users and reset credentials.
 * NO access to family-specific personal data.
 */
export default function AdminUserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);
  const [actionType, setActionType] = useState<'block' | 'unblock' | 'reset' | null>(null);

  // Mock user data - in real app, this would come from admin APIs
  const users: PlatformUser[] = [
    {
      id: '1',
      name: 'Rahul Sharma',
      email: 'rahul@sharma.com',
      status: 'active',
      role: 'admin',
      familiesCount: 2,
      lastLogin: '2024-01-13',
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      name: 'Sunita Sharma',
      email: 'sunita@sharma.com',
      status: 'active',
      role: 'member',
      familiesCount: 1,
      lastLogin: '2024-01-12',
      createdAt: '2024-01-01',
    },
    {
      id: '3',
      name: 'Amit Patel',
      email: 'amit@patel.com',
      status: 'blocked',
      role: 'admin',
      familiesCount: 1,
      lastLogin: '2023-12-20',
      createdAt: '2023-11-15',
    },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = (user: PlatformUser, action: 'block' | 'unblock' | 'reset') => {
    setSelectedUser(user);
    setActionType(action);
  };

  const confirmAction = () => {
    if (selectedUser && actionType) {
      // In real app, this would call the admin API
      console.log(`${actionType} user:`, selectedUser.id);
      
      if (actionType === 'block') {
        selectedUser.status = 'blocked';
      } else if (actionType === 'unblock') {
        selectedUser.status = 'active';
      }
      // Reset would trigger email/SMS to user
    }
    setSelectedUser(null);
    setActionType(null);
  };

  const getStatusColor = (status: 'active' | 'blocked') => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getRoleColor = (role: 'admin' | 'member') => {
    return role === 'admin' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <p className="text-slate-600 mt-1">
          Platform-level user administration and account management
        </p>
      </div>

      {/* Search and Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Search Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Active Users
            </CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Blocked Users
            </CardTitle>
            <Shield className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {users.filter(u => u.status === 'blocked').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">
            All Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-900">{user.name}</h3>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                    <Badge className={getRoleColor(user.role)}>
                      {user.role}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {user.familiesCount} families
                    </div>
                    <div>
                      Last login: {user.lastLogin}
                    </div>
                    <div>
                      Joined: {user.createdAt}
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
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction(user, 'reset')}>
                      Reset Credentials
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {user.status === 'active' ? (
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleAction(user, 'block')}
                      >
                        Block User
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem 
                        className="text-green-600"
                        onClick={() => handleAction(user, 'unblock')}
                      >
                        Unblock User
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
      <AlertDialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'block' && 'Block User'}
              {actionType === 'unblock' && 'Unblock User'}
              {actionType === 'reset' && 'Reset User Credentials'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'block' && `Are you sure you want to block "${selectedUser?.name}"? This will prevent them from accessing their account.`}
              {actionType === 'unblock' && `Are you sure you want to unblock "${selectedUser?.name}"? This will restore their account access.`}
              {actionType === 'reset' && `Are you sure you want to reset credentials for "${selectedUser?.name}"? They will receive instructions to set a new password.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className={actionType === 'block' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {actionType === 'block' && 'Block User'}
              {actionType === 'unblock' && 'Unblock User'}
              {actionType === 'reset' && 'Reset Credentials'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}