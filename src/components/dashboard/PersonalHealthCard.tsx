import { useState, useEffect } from 'react';
import { Heart, FileImage, Pill } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';

export function PersonalHealthCard() {
  const [healthRecord, setHealthRecord] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        setLoading(true);
        const [recordResponse, medicineResponse] = await Promise.all([
          apiClient.get('/health/latest-record'),
          apiClient.get('/health/medicines/today')
        ]);
        
        if (recordResponse.success) {
          setHealthRecord(recordResponse.data);
        }
        
        if (medicineResponse.success) {
          setMedicines(medicineResponse.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch health data:', error);
        setHealthRecord(null);
        setMedicines([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, []);
  return (
    <Card className="animate-fade-in opacity-0" style={{ animationDelay: '0.3s' }}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Heart className="h-4 w-4 text-destructive" />
          Your Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading health data...</div>
        ) : (
          <>
            {/* Latest Report */}
            {healthRecord && (
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
            )}

            {/* Medicine Tracker */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Pill className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Today's Medicines</span>
              </div>
              <div className="space-y-2">
                {medicines.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No medicines scheduled</div>
                ) : (
                  medicines.map((med: any) => (
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
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
