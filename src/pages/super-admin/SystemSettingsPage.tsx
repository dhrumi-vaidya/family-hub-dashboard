import { useState } from 'react';
import { Save, RefreshCw, AlertTriangle, Shield, Database, Mail, Globe, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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

interface SystemSettings {
  // General Settings
  platformName: string;
  maintenanceMode: boolean;
  maxFamiliesPerUser: number;
  maxMembersPerFamily: number;
  
  // Security Settings
  passwordMinLength: number;
  requireTwoFactor: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  
  // Storage Settings
  maxStoragePerFamily: string;
  allowFileUploads: boolean;
  maxFileSize: string;
  allowedFileTypes: string;
  
  // Email Settings
  smtpEnabled: boolean;
  smtpHost: string;
  smtpPort: string;
  smtpUsername: string;
  smtpPassword: string;
  fromEmail: string;
  
  // API Settings
  rateLimitEnabled: boolean;
  rateLimitRequests: number;
  rateLimitWindow: number;
  apiLoggingEnabled: boolean;
}

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    // General Settings
    platformName: 'KutumbOS',
    maintenanceMode: false,
    maxFamiliesPerUser: 5,
    maxMembersPerFamily: 50,
    
    // Security Settings
    passwordMinLength: 8,
    requireTwoFactor: false,
    sessionTimeout: 24,
    maxLoginAttempts: 5,
    
    // Storage Settings
    maxStoragePerFamily: '10',
    allowFileUploads: true,
    maxFileSize: '50',
    allowedFileTypes: 'jpg,jpeg,png,pdf,doc,docx',
    
    // Email Settings
    smtpEnabled: true,
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: 'noreply@kutumbos.com',
    
    // API Settings
    rateLimitEnabled: true,
    rateLimitRequests: 100,
    rateLimitWindow: 15,
    apiLoggingEnabled: true,
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(false);

  const updateSetting = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setPendingChanges(true);
  };

  const saveSettings = () => {
    console.log('Saving system settings:', settings);
    setPendingChanges(false);
    // Here you would make the API call to save settings
  };

  const resetToDefaults = () => {
    setShowConfirmDialog(true);
  };

  const confirmReset = () => {
    // Reset to default values
    setSettings({
      platformName: 'KutumbOS',
      maintenanceMode: false,
      maxFamiliesPerUser: 5,
      maxMembersPerFamily: 50,
      passwordMinLength: 8,
      requireTwoFactor: false,
      sessionTimeout: 24,
      maxLoginAttempts: 5,
      maxStoragePerFamily: '10',
      allowFileUploads: true,
      maxFileSize: '50',
      allowedFileTypes: 'jpg,jpeg,png,pdf,doc,docx',
      smtpEnabled: true,
      smtpHost: 'smtp.gmail.com',
      smtpPort: '587',
      smtpUsername: '',
      smtpPassword: '',
      fromEmail: 'noreply@kutumbos.com',
      rateLimitEnabled: true,
      rateLimitRequests: 100,
      rateLimitWindow: 15,
      apiLoggingEnabled: true,
    });
    setPendingChanges(true);
    setShowConfirmDialog(false);
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
            <p className="text-muted-foreground mt-1">
              Configure platform-wide settings and preferences
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={resetToDefaults}
              variant="outline"
              className="bg-secondary border-border text-secondary-foreground hover:bg-secondary/80"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button 
              onClick={saveSettings}
              disabled={!pendingChanges}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Pending Changes Alert */}
        {pendingChanges && (
          <div className="alert-card warning">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <div>
                <p className="text-yellow-800 dark:text-yellow-200 font-medium">Unsaved Changes</p>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm">You have unsaved changes. Don't forget to save them.</p>
              </div>
            </div>
          </div>
        )}

        {/* General Settings */}
        <div className="form-card">
          <div className="form-card-header">
            <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="form-card-title">General Settings</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="platformName" className="text-foreground">Platform Name</Label>
              <Input
                id="platformName"
                value={settings.platformName}
                onChange={(e) => updateSetting('platformName', e.target.value)}
                className="bg-background border-input text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxFamilies" className="text-foreground">Max Families per User</Label>
              <Input
                id="maxFamilies"
                type="number"
                value={settings.maxFamiliesPerUser}
                onChange={(e) => updateSetting('maxFamiliesPerUser', parseInt(e.target.value))}
                className="bg-background border-input text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxMembers" className="text-foreground">Max Members per Family</Label>
              <Input
                id="maxMembers"
                type="number"
                value={settings.maxMembersPerFamily}
                onChange={(e) => updateSetting('maxMembersPerFamily', parseInt(e.target.value))}
                className="bg-background border-input text-foreground"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="maintenance"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
              />
              <Label htmlFor="maintenance" className="text-foreground">Maintenance Mode</Label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="form-card">
          <div className="form-card-header">
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="form-card-title">Security Settings</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passwordLength" className="text-foreground">Minimum Password Length</Label>
              <Input
                id="passwordLength"
                type="number"
                value={settings.passwordMinLength}
                onChange={(e) => updateSetting('passwordMinLength', parseInt(e.target.value))}
                className="bg-background border-input text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout" className="text-foreground">Session Timeout (hours)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
                className="bg-background border-input text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxAttempts" className="text-foreground">Max Login Attempts</Label>
              <Input
                id="maxAttempts"
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => updateSetting('maxLoginAttempts', parseInt(e.target.value))}
                className="bg-background border-input text-foreground"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="twoFactor"
                checked={settings.requireTwoFactor}
                onCheckedChange={(checked) => updateSetting('requireTwoFactor', checked)}
              />
              <Label htmlFor="twoFactor" className="text-foreground">Require Two-Factor Authentication</Label>
            </div>
          </div>
        </div>

        {/* Storage Settings */}
        <div className="form-card">
          <div className="form-card-header">
            <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="form-card-title">Storage Settings</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxStorage" className="text-foreground">Max Storage per Family (GB)</Label>
              <Input
                id="maxStorage"
                value={settings.maxStoragePerFamily}
                onChange={(e) => updateSetting('maxStoragePerFamily', e.target.value)}
                className="bg-background border-input text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxFileSize" className="text-foreground">Max File Size (MB)</Label>
              <Input
                id="maxFileSize"
                value={settings.maxFileSize}
                onChange={(e) => updateSetting('maxFileSize', e.target.value)}
                className="bg-background border-input text-foreground"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="fileTypes" className="text-foreground">Allowed File Types</Label>
              <Input
                id="fileTypes"
                value={settings.allowedFileTypes}
                onChange={(e) => updateSetting('allowedFileTypes', e.target.value)}
                placeholder="jpg,jpeg,png,pdf,doc,docx"
                className="bg-background border-input text-foreground"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="fileUploads"
                checked={settings.allowFileUploads}
                onCheckedChange={(checked) => updateSetting('allowFileUploads', checked)}
              />
              <Label htmlFor="fileUploads" className="text-foreground">Allow File Uploads</Label>
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="form-card">
          <div className="form-card-header">
            <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="form-card-title">Email Settings</h3>
          </div>
          <div className="flex items-center space-x-2 mb-4">
            <Switch
              id="smtpEnabled"
              checked={settings.smtpEnabled}
              onCheckedChange={(checked) => updateSetting('smtpEnabled', checked)}
            />
            <Label htmlFor="smtpEnabled" className="text-foreground">Enable SMTP</Label>
          </div>
          
          {settings.smtpEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtpHost" className="text-foreground">SMTP Host</Label>
                <Input
                  id="smtpHost"
                  value={settings.smtpHost}
                  onChange={(e) => updateSetting('smtpHost', e.target.value)}
                  className="bg-background border-input text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPort" className="text-foreground">SMTP Port</Label>
                <Input
                  id="smtpPort"
                  value={settings.smtpPort}
                  onChange={(e) => updateSetting('smtpPort', e.target.value)}
                  className="bg-background border-input text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpUsername" className="text-foreground">SMTP Username</Label>
                <Input
                  id="smtpUsername"
                  value={settings.smtpUsername}
                  onChange={(e) => updateSetting('smtpUsername', e.target.value)}
                  className="bg-background border-input text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPassword" className="text-foreground">SMTP Password</Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  value={settings.smtpPassword}
                  onChange={(e) => updateSetting('smtpPassword', e.target.value)}
                  className="bg-background border-input text-foreground"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="fromEmail" className="text-foreground">From Email Address</Label>
                <Input
                  id="fromEmail"
                  type="email"
                  value={settings.fromEmail}
                  onChange={(e) => updateSetting('fromEmail', e.target.value)}
                  className="bg-background border-input text-foreground"
                />
              </div>
            </div>
          )}
        </div>

        {/* API Settings */}
        <div className="form-card">
          <div className="form-card-header">
            <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="form-card-title">API Settings</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="rateLimit"
                checked={settings.rateLimitEnabled}
                onCheckedChange={(checked) => updateSetting('rateLimitEnabled', checked)}
              />
              <Label htmlFor="rateLimit" className="text-foreground">Enable Rate Limiting</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="apiLogging"
                checked={settings.apiLoggingEnabled}
                onCheckedChange={(checked) => updateSetting('apiLoggingEnabled', checked)}
              />
              <Label htmlFor="apiLogging" className="text-foreground">Enable API Logging</Label>
            </div>
            
            {settings.rateLimitEnabled && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="rateLimitRequests" className="text-foreground">Max Requests</Label>
                  <Input
                    id="rateLimitRequests"
                    type="number"
                    value={settings.rateLimitRequests}
                    onChange={(e) => updateSetting('rateLimitRequests', parseInt(e.target.value))}
                    className="bg-background border-input text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rateLimitWindow" className="text-foreground">Time Window (minutes)</Label>
                  <Input
                    id="rateLimitWindow"
                    type="number"
                    value={settings.rateLimitWindow}
                    onChange={(e) => updateSetting('rateLimitWindow', parseInt(e.target.value))}
                    className="bg-background border-input text-foreground"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Reset Confirmation Dialog */}
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent className="bg-card border-border">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-foreground">Reset to Default Settings</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                Are you sure you want to reset all settings to their default values? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-secondary border-border text-secondary-foreground hover:bg-secondary/80">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmReset}
                className="bg-red-600 hover:bg-red-700"
              >
                Reset Settings
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
 
  );
}