import { Heart, FileImage, Pill } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const healthRecord = {
  type: 'Blood Report',
  date: '28 Dec 2025',
  doctor: 'Dr. Priya Sharma',
};

const medicines = [
  { name: 'Metformin', dose: '500mg', time: 'Morning', taken: true },
  { name: 'Vitamin D3', dose: '1000IU', time: 'Afternoon', taken: false },
  { name: 'Calcium', dose: '600mg', time: 'Night', taken: false },
];

export function PersonalHealthCard() {
  return (
    <Card className="animate-fade-in opacity-0" style={{ animationDelay: '0.3s' }}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Heart className="h-4 w-4 text-destructive" />
          Your Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Latest Report */}
        <div className="rounded-lg bg-destructive-light p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background">
              <FileImage className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="font-medium text-foreground">{healthRecord.type}</p>
              <p className="text-xs text-muted-foreground">
                {healthRecord.date} • {healthRecord.doctor}
              </p>
            </div>
          </div>
        </div>

        {/* Medicine Tracker */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Pill className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Today's Medicines</span>
          </div>
          <div className="space-y-2">
            {medicines.map((med) => (
              <div
                key={med.name}
                className="flex items-center justify-between rounded-lg border border-border p-2"
              >
                <div>
                  <p className="text-sm font-medium">{med.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {med.dose} • {med.time}
                  </p>
                </div>
                <Badge variant={med.taken ? 'default' : 'outline'}>
                  {med.taken ? 'Taken' : 'Pending'}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
