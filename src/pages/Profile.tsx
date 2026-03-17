import { useRef, useState, useEffect } from 'react';
import { User, Mail, Phone, Camera, Save, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { Hint } from '@/components/onboarding/Hint';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';

export default function Profile() {
  const { mode } = useApp();
  const { user } = useAuth();
  const { profile: savedProfile, setProfile: saveProfile } = useProfile();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: savedProfile.name || '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    bloodGroup: '',
    emergencyContact: '',
    role: '',
  });

  const [photoUrl, setPhotoUrl] = useState(savedProfile.photoUrl || '');

  // Load profile from API on mount
  useEffect(() => {
    apiClient.getProfile().then((res) => {
      if (res.success && res.profile) {
        const p = res.profile;
        setProfile({
          name: p.name || savedProfile.name || '',
          email: user?.email || '',
          phone: p.phone || '',
          dateOfBirth: p.date_of_birth || '',
          bloodGroup: p.blood_group || '',
          emergencyContact: p.emergency_contact || '',
          role: p.family_role || '',
        });
        if (p.photo_base64) {
          setPhotoUrl(p.photo_base64);
          saveProfile({ name: p.name || '', photoUrl: p.photo_base64 });
        } else if (p.name) {
          saveProfile({ name: p.name });
        }
      }
    }).catch(() => {
      // API unavailable — fall back to localStorage silently
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Photo must be under 2MB');
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPG, PNG or WebP allowed');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setPhotoUrl(url);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await apiClient.updateProfile({
        name: profile.name,
        phone: profile.phone,
        date_of_birth: profile.dateOfBirth,
        blood_group: profile.bloodGroup,
        emergency_contact: profile.emergencyContact,
        family_role: profile.role,
        photo_base64: photoUrl,
      });

      if (res.success) {
        saveProfile({ name: profile.name, photoUrl });
        toast.success('Profile saved successfully');
        console.log('[Profile] Saved via API:', {
          name: profile.name,
          phone: profile.phone,
          dateOfBirth: profile.dateOfBirth,
          bloodGroup: profile.bloodGroup,
          emergencyContact: profile.emergencyContact,
          role: profile.role,
          hasPhoto: !!photoUrl,
          savedAt: new Date().toISOString(),
        });
      } else {
        toast.error(res.error || 'Failed to save profile');
      }
    } catch {
      // Fallback: save to localStorage only
      saveProfile({ name: profile.name, photoUrl });
      toast.success('Profile saved locally');
      console.log('[Profile] Saved locally (API unavailable)');
    } finally {
      setSaving(false);
    }
  };

  const avatarFallback = profile.name
    ? profile.name.split(' ').map((n) => n[0]).join('').toUpperCase()
    : <User className="h-8 w-8" />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-heading-lg text-foreground">Profile Settings</h1>
        <p className="mt-1 text-body text-muted-foreground">
          Manage your personal information and preferences.
        </p>
      </div>

      <Hint id="profile-intro">
        Keep your profile updated so family members can reach you in emergencies.
        Your blood group and emergency contact are important for health records.
      </Hint>

      {/* Profile Photo */}
      <Card className="animate-fade-in opacity-0" style={{ animationDelay: '0.1s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile Photo
          </CardTitle>
          <CardDescription>Your photo will be visible to family members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={photoUrl} alt={profile.name} />
                <AvatarFallback className="text-2xl">{avatarFallback}</AvatarFallback>
              </Avatar>
              {/* Overlay click target */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
                aria-label="Change photo"
              >
                <Camera className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-4 w-4" />
                {photoUrl ? 'Change Photo' : 'Upload Photo'}
              </Button>
              <p className="text-xs text-muted-foreground">JPG, PNG, WebP. Max size 2MB.</p>
              {photoUrl && (
                <button
                  onClick={() => setPhotoUrl('')}
                  className="text-xs text-destructive hover:underline"
                >
                  Remove photo
                </button>
              )}
            </div>
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="animate-fade-in opacity-0" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Personal Information
          </CardTitle>
          <CardDescription>Basic details about you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Family Role</Label>
              <Select
                value={profile.role}
                onValueChange={(value) => setProfile({ ...profile, role: value })}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Head of Family">Head of Family</SelectItem>
                  <SelectItem value="Spouse">Spouse</SelectItem>
                  <SelectItem value="Parent">Parent</SelectItem>
                  <SelectItem value="Child">Child</SelectItem>
                  <SelectItem value="Sibling">Sibling</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="dob"
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Information */}
      <Card className="animate-fade-in opacity-0" style={{ animationDelay: '0.3s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-destructive" />
            Emergency Information
          </CardTitle>
          <CardDescription>Critical info for emergencies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="blood">Blood Group</Label>
              <Select
                value={profile.bloodGroup}
                onValueChange={(value) => setProfile({ ...profile, bloodGroup: value })}
              >
                <SelectTrigger id="blood">
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                    <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency">Emergency Contact</Label>
              <Input
                id="emergency"
                type="tel"
                value={profile.emergencyContact}
                onChange={(e) => setProfile({ ...profile, emergencyContact: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
          </div>

          {mode === 'simple' && (
            <div className="rounded-lg bg-warning-light p-3">
              <p className="text-sm text-warning-foreground">
                <strong>Important:</strong> Your blood group and emergency contact will be shown
                during health emergencies to designated family members.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button size="lg" className="gap-2" onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
