import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

interface UploadHealthRecordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const members = ['Rajesh Sharma', 'Anita Sharma', 'Vikram Sharma', 'Priya Sharma', 'Shanti Devi'];
const recordTypes = ['Blood Report', 'X-Ray', 'Prescription', 'Vaccination Record', 'MRI/CT Scan', 'Other'];

export function UploadHealthRecordModal({ open, onOpenChange }: UploadHealthRecordModalProps) {
  const [recordType, setRecordType] = useState('');
  const [member, setMember] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [emergencyAccess, setEmergencyAccess] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordType || !member || !fileName) {
      toast.error('Please fill in all required fields and upload a file');
      return;
    }
    toast.success(`${recordType} for ${member} uploaded successfully`);
    setRecordType('');
    setMember('');
    setDate(new Date().toISOString().split('T')[0]);
    setEmergencyAccess(false);
    setFileName('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Health Record</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recordType">Record Type *</Label>
            <Select value={recordType} onValueChange={setRecordType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select record type" />
              </SelectTrigger>
              <SelectContent>
                {recordTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="member">Family Member *</Label>
            <Select value={member} onValueChange={setMember} required>
              <SelectTrigger>
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Record Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">Upload File *</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                onClick={() => document.getElementById('file')?.click()}
              >
                <Upload className="h-4 w-4" />
                {fileName || 'Choose file'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Accepted formats: PDF, JPG, PNG</p>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="emergency"
              checked={emergencyAccess}
              onCheckedChange={(checked) => setEmergencyAccess(checked as boolean)}
            />
            <Label htmlFor="emergency" className="font-normal">
              Enable emergency access (visible without login in emergencies)
            </Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Upload Record</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
