import { useState } from 'react';
import { Upload, Filter, FileImage, Lock, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

const healthRecords = [
  {
    id: 1,
    type: 'Blood Report',
    member: 'Anita Sharma',
    date: '28 Dec 2025',
    emergency: false,
    immutable: true,
  },
  {
    id: 2,
    type: 'X-Ray',
    member: 'Rajesh Sharma',
    date: '20 Dec 2025',
    emergency: true,
    immutable: true,
  },
  {
    id: 3,
    type: 'Prescription',
    member: 'Vikram Sharma',
    date: '15 Dec 2025',
    emergency: false,
    immutable: true,
  },
  {
    id: 4,
    type: 'Vaccination Record',
    member: 'Priya Sharma',
    date: '10 Dec 2025',
    emergency: false,
    immutable: true,
  },
];

const members = ['All Members', 'Anita Sharma', 'Rajesh Sharma', 'Vikram Sharma', 'Priya Sharma'];

export default function Health() {
  const { mode } = useApp();
  const [selectedMember, setSelectedMember] = useState('All Members');

  const filteredRecords = selectedMember === 'All Members'
    ? healthRecords
    : healthRecords.filter((r) => r.member === selectedMember);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-heading-lg text-foreground">Health Records</h1>
          <p className="mt-1 text-body text-muted-foreground">
            Securely store and access family health documents.
          </p>
        </div>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Record
        </Button>
      </div>
      
      <Hint id="health-intro">
        Upload medical documents like prescriptions, reports, and X-rays. 
        Filter by family member to find records quickly. All uploads are permanent and secure.
      </Hint>

      {/* Filters */}
      <Card className="animate-fade-in opacity-0" style={{ animationDelay: '0.1s' }}>
        <CardContent className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by:</span>
          </div>
          <Select value={selectedMember} onValueChange={setSelectedMember}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select member" />
            </SelectTrigger>
            <SelectContent>
              {members.map((member) => (
                <SelectItem key={member} value={member}>
                  {member}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="space-y-4">
        {filteredRecords.map((record, index) => (
          <Card
            key={record.id}
            hover
            className="animate-fade-in opacity-0"
            style={{ animationDelay: `${(index + 2) * 0.1}s` }}
          >
            <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-destructive-light">
                  <FileImage className="h-7 w-7 text-destructive" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground">{record.type}</h3>
                    {record.emergency && (
                      <Badge variant="destructive" className="text-xs">
                        Emergency Access
                      </Badge>
                    )}
                    {record.immutable && (
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <Lock className="h-3 w-3" />
                        Immutable
                      </Badge>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {record.member}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {record.date}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View
                </Button>
                <Button variant="ghost" size="sm">
                  Audit Log
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mode === 'simple' && (
        <Card className="animate-fade-in border-accent bg-accent-light opacity-0" style={{ animationDelay: '0.5s' }}>
          <CardContent className="py-4">
            <p className="text-sm text-accent-foreground">
              <strong>Tip:</strong> All uploaded records are immutable and cannot be modified or deleted.
              This ensures data integrity for medical and legal purposes.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
