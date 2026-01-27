import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, UserPlus, Copy, CheckCircle, Users } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

type FamilyRole = 'ADULT' | 'SENIOR' | 'TEEN' | 'CHILD';

const roleLabels: Record<FamilyRole, string> = {
  'ADULT': 'Adult Member',
  'SENIOR': 'Senior Member', 
  'TEEN': 'Teen Member',
  'CHILD': 'Child Member'
};

const roleDescriptions: Record<FamilyRole, string> = {
  'ADULT': 'Full access to family features and can manage expenses',
  'SENIOR': 'Full access with priority in family decisions',
  'TEEN': 'Limited access appropriate for teenagers',
  'CHILD': 'Basic access with parental controls'
};

export default function InviteMembers() {
  const { user, selectedFamily } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    role: 'ADULT' as FamilyRole,
    expiresInHours: '72'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generatedInvite, setGeneratedInvite] = useState('');

  // Check if user is family admin
  const isAdmin = selectedFamily?.role === 'FAMILY_ADMIN';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-2xl mx-auto">
          <Alert>
            <AlertDescription>
              Only family administrators can invite new members.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleRoleChange = (role: FamilyRole) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleExpiryChange = (hours: string) => {
    setFormData(prev => ({ ...prev, expiresInHours: hours }));
  };

  const validateForm = (): boolean => {
    if (!formData.email) {
      setError('Email is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await apiClient.generateInvite(
        formData.role,
        parseInt(formData.expiresInHours),
        formData.email
      );
      
      if (response.success) {
        const inviteUrl = response.inviteUrl;
        setGeneratedInvite(inviteUrl);
        
        if (response.emailSent) {
          setSuccess(`✅ Invitation email sent to ${formData.email}! They can also use the link below to join your family.`);
          toast.success(`Invitation email sent to ${formData.email}!`);
        } else {
          setSuccess(`📧 Email service not configured. Share the link below with ${formData.email} to join your family.`);
          toast.success('Invitation link generated! Email service not configured - share the link manually.');
        }
        
        // Reset form
        setFormData({
          email: '',
          role: 'ADULT',
          expiresInHours: '72'
        });
      } else {
        setError(response.error || 'Failed to generate invitation');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const copyInviteLink = async () => {
    if (generatedInvite) {
      try {
        // Try modern clipboard API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(generatedInvite);
          toast.success('Invite link copied to clipboard!');
        } else {
          // Fallback for older browsers or non-HTTPS contexts
          const textArea = document.createElement('textarea');
          textArea.value = generatedInvite;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          
          try {
            document.execCommand('copy');
            toast.success('Invite link copied to clipboard!');
          } catch (err) {
            console.error('Fallback copy failed:', err);
            toast.error('Could not copy to clipboard. Please copy the link manually.');
          } finally {
            document.body.removeChild(textArea);
          }
        }
      } catch (err) {
        console.error('Copy to clipboard failed:', err);
        toast.error('Could not copy to clipboard. Please copy the link manually.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <UserPlus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Invite Family Members</CardTitle>
                <CardDescription>
                  Send invitations to add new members to {selectedFamily?.name}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter family member's email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Family Role</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(roleLabels).map(([role, label]) => (
                      <SelectItem key={role} value={role}>
                        <div className="flex flex-col">
                          <span>{label}</span>
                          <span className="text-xs text-muted-foreground">
                            {roleDescriptions[role as FamilyRole]}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiry">Invitation Expires In</Label>
                <Select value={formData.expiresInHours} onValueChange={handleExpiryChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24">24 hours</SelectItem>
                    <SelectItem value="72">3 days</SelectItem>
                    <SelectItem value="168">1 week</SelectItem>
                    <SelectItem value="336">2 weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Invitation...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Invitation
                  </>
                )}
              </Button>
            </form>
            
            {generatedInvite && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Invitation Link Generated</CardTitle>
                  <CardDescription>
                    Share this link with the family member to join
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg break-all text-sm">
                    {generatedInvite}
                  </div>
                  <Button onClick={copyInviteLink} variant="outline" className="w-full">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Invite Link
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    This link will expire in {formData.expiresInHours} hours.
                    The invited member will be assigned the role: <Badge variant="secondary">{roleLabels[formData.role]}</Badge>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>1. Enter the family member's email address</p>
                <p>2. Choose their role in the family</p>
                <p>3. Set when the invitation expires</p>
                <p>4. An invitation link will be generated</p>
                <p>5. Share the link with them to join your family</p>
                <p>6. They'll create their account and automatically join your family</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>📧 <strong>Email service is not configured</strong> - invitations will generate links that you can share manually.</p>
                <p>To enable automatic email sending, configure SMTP settings in your server environment:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>SMTP_HOST (e.g., smtp.gmail.com)</li>
                  <li>SMTP_USER (your email address)</li>
                  <li>SMTP_PASS (your app password)</li>
                </ul>
                <p className="text-xs mt-2">For Gmail, use an App Password instead of your regular password.</p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}