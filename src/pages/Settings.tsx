import { Save, Bell, Shield, Eye, Smartphone, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { Hint } from '@/components/onboarding/Hint';
import { cn } from '@/lib/utils';

export default function Settings() {
  const { mode, setMode, resetHints, setShowOnboarding, setHasCompletedOnboarding } = useApp();

  const handleRestartTour = () => {
    resetHints();
    setHasCompletedOnboarding(false);
    setShowOnboarding(true);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-heading-lg text-foreground">Settings</h1>
        <p className="mt-1 text-body text-muted-foreground">
          Configure your preferences and family settings.
        </p>
      </div>
      
      <Hint id="settings-intro">
        Customize your experience here. Simple Mode shows more guidance, 
        while Fast Mode gives you a compact view for quicker navigation.
      </Hint>

      {/* Default UX Mode */}
      <Card className="animate-fade-in opacity-0" style={{ animationDelay: '0.1s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Display Mode
          </CardTitle>
          <CardDescription>
            Choose your preferred interface mode
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Default UX Mode</Label>
              <p className="text-sm text-muted-foreground">
                Simple mode shows more guidance, Fast mode is compact
              </p>
            </div>
            <Select value={mode} onValueChange={(value) => setMode(value as 'simple' | 'fast')}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">Simple</SelectItem>
                <SelectItem value="fast">Fast</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {mode === 'simple' && (
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div>
                <Label className="text-base">Reset Onboarding</Label>
                <p className="text-sm text-muted-foreground">
                  Restart the guided tour and show all hints again
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleRestartTour} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Restart Tour
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="animate-fade-in opacity-0" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>
            Manage how you receive updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">In-app Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Show notifications in the dashboard
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label className="text-base">WhatsApp Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send reminders via WhatsApp
                </p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Emergency Access */}
      <Card className="animate-fade-in opacity-0" style={{ animationDelay: '0.3s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-destructive" />
            Emergency Access
          </CardTitle>
          <CardDescription>
            Configure emergency access to health records
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Enable Emergency Access</Label>
              <p className="text-sm text-muted-foreground">
                Allow designated contacts to access health records in emergencies
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="rounded-lg bg-destructive-light p-4">
            <p className="text-sm text-destructive">
              <strong>Important:</strong> Emergency access allows selected contacts to view
              health records marked as "Emergency Access" without your explicit permission
              during verified emergencies.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Controls */}
      <Card className="animate-fade-in opacity-0" style={{ animationDelay: '0.4s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-accent" />
            Privacy Controls
          </CardTitle>
          <CardDescription>
            Manage data visibility and sharing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Show expense totals to members</Label>
              <p className="text-sm text-muted-foreground">
                Allow family members to see overall expense totals
              </p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Share health updates</Label>
              <p className="text-sm text-muted-foreground">
                Notify members when new health records are uploaded
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      {mode === 'simple' && (
        <div className="flex justify-end pt-4">
          <Button size="lg" className="gap-2">
            <Save className="h-4 w-4" />
            Save All Changes
          </Button>
        </div>
      )}
    </div>
  );
}
