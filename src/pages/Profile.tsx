import { useRef, useState, useEffect } from 'react';
import { User, Mail, Phone, Camera, Save, Calendar, Lock } from 'lucide-react';
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

// ── Validation helpers ────────────────────────────────────────────────────────

/** Strip optional +91 / 0 prefix then check 10-digit Indian mobile (starts 6-9) */
function validateIndianPhone(raw: string): string | null {
  if (!raw) return null; // optional field
  const stripped = raw.trim().replace(/^(\+91|0)/, '').replace(/\s+/g, '');
  if (!/^[6-9]\d{9}$/.test(stripped)) {
    return 'Enter a valid 10-digit Indian mobile number (starts with 6–9)';
  }
  return null;
}

function validateName(raw: string): string | null {
  if (!raw || raw.trim().length === 0) return 'Name is required';
  if (raw.trim().length < 2) return 'Name must be at least 2 characters';
  if (raw.trim().length > 100) return 'Name must be under 100 characters';
  return null;
}

interface Errors {
  name?: string;
  phone?: string;
  emergencyContact?: string;
}

function validate(profile: { name: string; phone: string; emergencyContact: string }): Errors {
  const errors: Errors = {};
  const nameErr = validateName(profile.name);
  if (nameErr) errors.name = nameErr;
  const phoneErr = validateIndianPhone(profile.phone);
  if (phoneErr) errors.phone = phoneErr;
  const ecErr = validateIndianPhone(profile.emergencyContact);
  if (ecErr) errors.emergencyContact = ecErr;
  return errors;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Profile() {
  const { mode } = useApp();
  const { user, selectedFamily } = useAuth();
  const { profile: savedProfile, setProfile: saveProfile } = useProfile();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Derive display role — FAMILY_ADMIN always shows "Head of Family"
  const isFamilyAdmin = selectedFamily?.role === 'FAMILY_ADMIN';
  const displayRole = isFamilyAdmin ? 'Head of Family' : (selectedFamily?.role ?? '');

  const [profile, setProfile] = useState({
    name: savedProfile.name || '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    bloodGroup: '',
    emergencyContact: '',
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
        });
        if (p.photo_base64) {
          setPhotoUrl(p.photo_base64);
          saveProfile({ name: p.name || '', photoUrl: p.photo_base64 });
        } else if (p.name) {
          saveProfile({ name: p.name });
        }
      }
    }).catch(() => { /* API unavailable — localStorage fallback */ });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live-validate touched fields
  useEffect(() => {
    if (Object.keys(touched).length === 0) return;
    const errs = validate(profile);
    const visibleErrs: Errors = {};
    if (touched.name && errs.name) visibleErrs.name = errs.name;
    if (touched.phone && errs.phone) visibleErrs.phone = errs.phone;
    if (touched.emergencyContact && errs.emergencyContact) visibleErrs.emergencyContact = errs.emergencyContact;
    setErrors(visibleErrs);
  }, [profile, touched]);

  const handleBlur = (field: string) => setTouched((t) => ({ ...t, [field]: true }));

  // ── Photo change → immediate API call ──────────────────────────────────────
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { toast.error('Photo must be under 2MB'); return; }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPG, PNG or WebP allowed'); return;
    }

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      setPhotoUrl(base64);
      setUploadingPhoto(true);
      try {
        const res = await apiClient.updateProfile({ photo_base64: base64 });
        if (res.success) {
          saveProfile({ photoUrl: base64 });
          toast.success('Photo updated');
        } else {
          toast.error(res.error || 'Failed to upload photo');
        }
      } catch {
        // API down — keep photo locally
        saveProfile({ photoUrl: base64 });
        toast.success('Photo saved locally');
      } finally {
        setUploadingPhoto(false);
        // Reset input so same file can be re-selected
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    // Mark all validatable fields as touched
    setTouched({ name: true, phone: true, emergencyContact: true });
    const errs = validate(profile);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error('Please fix the errors before saving');
      return;
    }

    setSaving(true);
    try {
      const res = await apiClient.updateProfile({
        name: profile.name.trim(),
        phone: profile.phone.trim(),
        date_of_birth: profile.dateOfBirth,
        blood_group: profile.bloodGroup,
        emergency_contact: profile.emergencyContact.trim(),
        family_role: displayRole,
        photo_base64: photoUrl,
      });

      if (res.success) {
        saveProfile({ name: profile.name.trim(), photoUrl });
        toast.success('Profile saved successfully');
        console.log('[Profile] Saved via API:', {
          name: profile.name.trim(),
          phone: profile.phone.trim(),
          dateOfBirth: profile.dateOfBirth,
          bloodGroup: profile.bloodGroup,
          emergencyContact: profile.emergencyContact.trim(),
          role: displayRole,
          hasPhoto: !!photoUrl,
          savedAt: new Date().toISOString(),
        });
      } else {
        toast.error(res.error || 'Failed to save profile');
      }
    } catch {
      saveProfile({ name: profile.name.trim(), photoUrl });
      toast.success('Profile saved locally');
    } finally {
      setSaving(false);
    }
  };

  const avatarFallback = profile.name
    ? profile.name.trim().split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : <User className="h-8 w-8" />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
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
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
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
                disabled={uploadingPhoto}
              >
                <Camera className="h-4 w-4" />
                {uploadingPhoto ? 'Uploading...' : photoUrl ? 'Change Photo' : 'Upload Photo'}
              </Button>
              <p className="text-xs text-muted-foreground">JPG, PNG, WebP. Max size 2MB.</p>
              {photoUrl && !uploadingPhoto && (
                <button
                  onClick={() => setPhotoUrl('')}
                  className="text-xs text-destructive hover:underline"
                >
                  Remove photo
                </button>
              )}
            </div>
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
            {/* Name */}
            <div className="space-y-1">
              <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                value={profile.name}
                maxLength={100}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                onBlur={() => handleBlur('name')}
                placeholder="Your full name"
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            {/* Family Role — read-only */}
            <div className="space-y-1">
              <Label htmlFor="role" className="flex items-center gap-1">
                Family Role
                <Lock className="h-3 w-3 text-muted-foreground" />
              </Label>
              <div className="flex h-10 items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground select-none">
                {displayRole || '—'}
              </div>
              <p className="text-xs text-muted-foreground">Assigned by your family admin</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Email — read-only (from auth) */}
            <div className="space-y-1">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                readOnly
                className="bg-muted text-muted-foreground cursor-not-allowed"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                maxLength={13} // +91XXXXXXXXXX
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                onBlur={() => handleBlur('phone')}
                placeholder="9XXXXXXXXX"
                aria-invalid={!!errors.phone}
              />
              {errors.phone
                ? <p className="text-xs text-destructive">{errors.phone}</p>
                : <p className="text-xs text-muted-foreground">10-digit Indian mobile number</p>
              }
            </div>
          </div>

          <div className="space-y-1">
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
            <div className="space-y-1">
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

            <div className="space-y-1">
              <Label htmlFor="emergency">Emergency Contact</Label>
              <Input
                id="emergency"
                type="tel"
                value={profile.emergencyContact}
                maxLength={13}
                onChange={(e) => setProfile({ ...profile, emergencyContact: e.target.value })}
                onBlur={() => handleBlur('emergencyContact')}
                placeholder="9XXXXXXXXX"
                aria-invalid={!!errors.emergencyContact}
              />
              {errors.emergencyContact
                ? <p className="text-xs text-destructive">{errors.emergencyContact}</p>
                : <p className="text-xs text-muted-foreground">10-digit Indian mobile number</p>
              }
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

      {/* Save */}
      <div className="flex justify-end pt-4">
        <Button size="lg" className="gap-2" onClick={handleSave} disabled={saving || uploadingPhoto}>
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
