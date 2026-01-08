import { useState } from 'react';
import { Upload, FileImage, Lock, Calendar, User, Download, Eye, ClipboardList, AlertTriangle, FileText, Receipt, Pill } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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
import { UploadHealthRecordModal } from '@/components/modals/UploadHealthRecordModal';
import { cn } from '@/lib/utils';

interface HealthRecord {
  id: number;
  type: 'Prescription' | 'Report' | 'Bill';
  member: string;
  visitDate: string;
  uploadDate: string;
  uploadedBy: string;
  emergencyAccessed: boolean;
  thumbnail?: string;
}

const healthRecords: HealthRecord[] = [
  {
    id: 1,
    type: 'Report',
    member: 'Anita Sharma',
    visitDate: '28 Dec 2025',
    uploadDate: '29 Dec 2025',
    uploadedBy: 'Vikram Sharma',
    emergencyAccessed: false,
  },
  {
    id: 2,
    type: 'Prescription',
    member: 'Rajesh Sharma',
    visitDate: '20 Dec 2025',
    uploadDate: '21 Dec 2025',
    uploadedBy: 'Priya Sharma',
    emergencyAccessed: true,
  },
  {
    id: 3,
    type: 'Bill',
    member: 'Vikram Sharma',
    visitDate: '15 Dec 2025',
    uploadDate: '15 Dec 2025',
    uploadedBy: 'Vikram Sharma',
    emergencyAccessed: false,
  },
  {
    id: 4,
    type: 'Report',
    member: 'Priya Sharma',
    visitDate: '10 Dec 2025',
    uploadDate: '12 Dec 2025',
    uploadedBy: 'Anita Sharma',
    emergencyAccessed: false,
  },
];

const members = ['All Members', 'Anita Sharma', 'Rajesh Sharma', 'Vikram Sharma', 'Priya Sharma'];
const recordTypes = ['All Types', 'Prescription', 'Report', 'Bill'];

const getRecordIcon = (type: string) => {
  switch (type) {
    case 'Prescription':
      return Pill;
    case 'Report':
      return FileText;
    case 'Bill':
      return Receipt;
    default:
      return FileImage;
  }
};

const getRecordColor = (type: string) => {
  switch (type) {
    case 'Prescription':
      return 'bg-primary/10 text-primary';
    case 'Report':
      return 'bg-success/10 text-success';
    case 'Bill':
      return 'bg-warning/10 text-warning';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export default function Health() {
  const { mode } = useApp();
  const [selectedMember, setSelectedMember] = useState('All Members');
  const [selectedType, setSelectedType] = useState('All Types');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [emergencyMode] = useState(false);

  const filteredRecords = healthRecords.filter((record) => {
    const memberMatch = selectedMember === 'All Members' || record.member === selectedMember;
    const typeMatch = selectedType === 'All Types' || record.type === selectedType;
    return memberMatch && typeMatch;
  });

  const isSimple = mode === 'simple';

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Emergency Access Banner */}
      {emergencyMode && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive-light p-4">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <p className="text-sm font-medium text-destructive">
            Emergency access enabled. All actions are logged.
          </p>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-heading-lg text-foreground">Health Records</h1>
          <p className="mt-1 text-body text-muted-foreground">
            All medical documents in one place.
          </p>
        </div>
        <Button 
          size={isSimple ? 'lg' : 'default'} 
          className="gap-2 shrink-0" 
          onClick={() => setUploadOpen(true)}
        >
          <Upload className="h-4 w-4" />
          Upload Record
        </Button>
      </div>

      {/* Filters */}
      <Card className="animate-fade-in opacity-0" style={{ animationDelay: '0.1s' }}>
        <CardContent className={cn(
          "flex flex-col gap-4 sm:flex-row sm:items-center",
          isSimple ? "py-5" : "py-4"
        )}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 w-full">
            <Select value={selectedMember} onValueChange={setSelectedMember}>
              <SelectTrigger className={cn("w-full sm:w-[180px]", isSimple && "h-11")}>
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Family Member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member} value={member}>
                    {member}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className={cn("w-full sm:w-[160px]", isSimple && "h-11")}>
                <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Record Type" />
              </SelectTrigger>
              <SelectContent>
                {recordTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      {filteredRecords.length > 0 ? (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden sm:block" />
          
          <div className={cn("space-y-4", isSimple && "space-y-5")}>
            {filteredRecords.map((record, index) => {
              const Icon = getRecordIcon(record.type);
              const colorClass = getRecordColor(record.type);
              
              return (
                <div
                  key={record.id}
                  className="relative animate-fade-in opacity-0"
                  style={{ animationDelay: `${(index + 2) * 0.1}s` }}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 top-6 z-10 h-4 w-4 rounded-full border-2 border-background bg-primary hidden sm:block" />
                  
                  <Card 
                    hover
                    className={cn("sm:ml-12", isSimple && "shadow-md")}
                  >
                    <CardContent className={cn(
                      "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
                      isSimple ? "py-6" : "py-5"
                    )}>
                      <div className="flex items-start gap-4">
                        {/* Document Icon */}
                        <div className={cn(
                          "flex shrink-0 items-center justify-center rounded-xl",
                          colorClass,
                          isSimple ? "h-16 w-16" : "h-14 w-14"
                        )}>
                          <Icon className={isSimple ? "h-8 w-8" : "h-7 w-7"} />
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          {/* Type and badges */}
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className={cn(
                              "font-semibold text-foreground",
                              isSimple ? "text-xl" : "text-lg"
                            )}>
                              {record.type}
                            </h3>
                            {record.emergencyAccessed && (
                              <Badge variant="destructive" className="text-xs gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Emergency Access Used
                              </Badge>
                            )}
                            <Badge variant="secondary" className="text-xs gap-1">
                              <Lock className="h-3 w-3" />
                              Read-only
                            </Badge>
                          </div>
                          
                          {/* Member and dates */}
                          <div className={cn(
                            "mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground",
                            isSimple ? "text-base" : "text-sm"
                          )}>
                            <span className="flex items-center gap-1.5">
                              <User className="h-4 w-4" />
                              {record.member}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4" />
                              {record.visitDate}
                            </span>
                          </div>
                          
                          {/* Audit info */}
                          {isSimple && (
                            <p className="mt-2 text-sm text-muted-foreground">
                              Uploaded by {record.uploadedBy} on {record.uploadDate}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2 shrink-0">
                        <Button 
                          variant="outline" 
                          size={isSimple ? 'default' : 'sm'}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                        <Button 
                          variant="ghost" 
                          size={isSimple ? 'default' : 'sm'}
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          {isSimple && 'Download'}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size={isSimple ? 'default' : 'sm'}
                          className="gap-2"
                        >
                          <ClipboardList className="h-4 w-4" />
                          {isSimple && 'Activity'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Empty State */
        <Card className="animate-fade-in opacity-0" style={{ animationDelay: '0.2s' }}>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mb-6">
              <FileImage className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className={cn(
              "font-semibold text-foreground mb-2",
              isSimple ? "text-xl" : "text-lg"
            )}>
              No health records uploaded yet.
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Upload prescriptions or reports to keep them safe and accessible during emergencies.
            </p>
            <Button size="lg" className="gap-2" onClick={() => setUploadOpen(true)}>
              <Upload className="h-5 w-5" />
              Upload Your First Record
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Simple Mode Tip */}
      {isSimple && filteredRecords.length > 0 && (
        <Card 
          className="animate-fade-in border-accent bg-accent/30 opacity-0" 
          style={{ animationDelay: '0.5s' }}
        >
          <CardContent className="py-4">
            <p className="text-sm text-foreground">
              <strong>Remember:</strong> Uploaded documents cannot be edited or deleted. 
              This ensures your medical records stay safe and trustworthy.
            </p>
          </CardContent>
        </Card>
      )}

      <UploadHealthRecordModal open={uploadOpen} onOpenChange={setUploadOpen} />
    </div>
  );
}
