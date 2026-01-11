import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Clock, Heart, FileText, Wallet, Bell, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

export default function MemberDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, selectedFamily } = useAuth();
  const { mode } = useApp();
  const isSimpleMode = mode === 'simple';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Sample data for member view
  const pendingTasks = [
    { id: '1', title: 'Take morning medicine', dueTime: '8:00 AM', status: 'pending' as const },
    { id: '2', title: 'Pick up groceries', dueTime: '6:00 PM', status: 'pending' as const },
  ];

  const recentHealthRecords = [
    { id: '1', type: 'Blood Report', date: '28 Dec 2025' },
    { id: '2', type: 'Prescription', date: '25 Dec 2025' },
  ];

  const notifications = [
    { id: '1', message: 'New responsibility assigned by Rahul', time: '2 hours ago' },
    { id: '2', message: 'Health record uploaded for you', time: '1 day ago' },
  ];

  const handleConfirmTask = (taskId: string) => {
    // In real app, this would update the task status
    console.log('Confirmed task:', taskId);
  };

  if (!user || !selectedFamily) {
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-heading-lg text-foreground">
          Welcome, {user.name.split(' ')[0]}
        </h1>
        <p className="mt-1 text-body text-muted-foreground">
          Here's what needs your attention today.
        </p>
      </div>

      {/* Main Grid */}
      <div className={cn(
        'grid gap-6',
        isSimpleMode ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      )}>
        {/* Pending Responsibilities Card */}
        <Card className="animate-fade-in md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium text-muted-foreground">
                My Responsibilities
              </CardTitle>
              <div className="rounded-lg bg-warning-light p-2">
                <CheckSquare className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingTasks.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No pending responsibilities.
              </p>
            ) : (
              pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-light">
                      <Clock className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{task.title}</p>
                      <p className="text-sm text-muted-foreground">Due: {task.dueTime}</p>
                    </div>
                  </div>
                  <Button
                    size={isSimpleMode ? 'default' : 'sm'}
                    onClick={() => handleConfirmTask(task.id)}
                    className="gap-2"
                  >
                    <CheckSquare className="h-4 w-4" />
                    {isSimpleMode && 'Confirm done'}
                  </Button>
                </div>
              ))
            )}

            {isSimpleMode && (
              <p className="text-sm text-muted-foreground pt-2">
                Tap "Confirm done" when you complete a task.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Health Records Card */}
        <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium text-muted-foreground">
                Recent Health Records
              </CardTitle>
              <div className="rounded-lg bg-destructive-light p-2">
                <Heart className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentHealthRecords.map((record) => (
              <div
                key={record.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive-light">
                  <FileText className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{record.type}</p>
                  <p className="text-sm text-muted-foreground">{record.date}</p>
                </div>
              </div>
            ))}
            <Button variant="soft" className="w-full mt-2" asChild>
              <a href="/health">View all records</a>
            </Button>
          </CardContent>
        </Card>

        {/* Expense Summary Card (Read-Only) */}
        <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium text-muted-foreground">
                Expense Summary
              </CardTitle>
              <div className="rounded-lg bg-primary-light p-2">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-3">
              <div className="flex items-baseline gap-2">
                <span className="number-display-lg">₹45,000</span>
                <span className="text-sm text-muted-foreground">/ ₹60,000</span>
              </div>
              <Progress value={75} className="mt-2 h-2" />
              <p className="mt-1.5 text-sm text-muted-foreground">75% of family budget used</p>
            </div>
            {isSimpleMode && (
              <p className="text-sm text-muted-foreground">
                This is a summary of family expenses. Contact admin for details.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Notifications Card */}
        <Card className="animate-fade-in md:col-span-2 lg:col-span-3" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium text-muted-foreground">
                Notifications
              </CardTitle>
              <Badge variant="secondary">{notifications.length} new</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className={cn(
              'grid gap-3',
              isSimpleMode ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
            )}>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-3 rounded-lg border border-border bg-card p-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light flex-shrink-0">
                    <Bell className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Access Info for Members */}
      {isSimpleMode && (
        <Card className="mt-6 bg-muted/30">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
              <p className="text-sm text-muted-foreground">
                You are viewing as a family member. Some features like adding members or editing budgets are only available to family admins.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
