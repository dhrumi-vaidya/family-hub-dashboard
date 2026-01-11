import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, MousePointerClick, Zap, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

type ModeOption = 'simple' | 'fast';

export default function SelectMode() {
  const navigate = useNavigate();
  const { user, isAuthenticated, selectedFamily } = useAuth();
  const { setMode, setCurrentFamily } = useApp();
  const [selected, setSelected] = useState<ModeOption>('simple');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!selectedFamily) {
      navigate('/select-family');
      return;
    }

    // Check if mode already selected this session
    const modeSelected = localStorage.getItem('kutumbos_mode_selected');
    if (modeSelected === 'true') {
      // Sync selected family to AppContext
      setCurrentFamily(selectedFamily);
      navigate(user?.role === 'admin' ? '/' : '/member-dashboard');
    }
  }, [isAuthenticated, selectedFamily, user, navigate, setCurrentFamily]);

  const handleContinue = () => {
    setMode(selected);
    localStorage.setItem('kutumbos_mode_selected', 'true');
    
    // Sync selected family to AppContext
    if (selectedFamily) {
      setCurrentFamily(selectedFamily);
    }

    // Redirect based on role
    if (user?.role === 'admin') {
      navigate('/');
    } else {
      navigate('/member-dashboard');
    }
  };

  if (!user || !selectedFamily) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground mb-4">
            <Home className="h-8 w-8" />
          </div>
        </div>

        {/* Mode Selection Card */}
        <Card className="border-border shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Choose how you want to use KutumbOS</CardTitle>
            <CardDescription>
              You can change this later in settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Simple Mode */}
            <button
              onClick={() => setSelected('simple')}
              className={cn(
                'w-full rounded-xl border-2 p-5 text-left transition-all',
                selected === 'simple'
                  ? 'border-primary bg-primary-light'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-lg',
                  selected === 'simple' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}>
                  <MousePointerClick className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">Simple Mode</h3>
                    {selected === 'simple' && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <li>• Guided steps for every action</li>
                    <li>• Larger text and buttons</li>
                    <li>• Confirmation before important actions</li>
                  </ul>
                </div>
              </div>
            </button>

            {/* Fast Mode */}
            <button
              onClick={() => setSelected('fast')}
              className={cn(
                'w-full rounded-xl border-2 p-5 text-left transition-all',
                selected === 'fast'
                  ? 'border-primary bg-primary-light'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-lg',
                  selected === 'fast' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}>
                  <Zap className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">Fast Mode</h3>
                    {selected === 'fast' && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <li>• Quick actions and shortcuts</li>
                    <li>• Compact view with more data</li>
                    <li>• Fewer confirmations</li>
                  </ul>
                </div>
              </div>
            </button>

            <Button onClick={handleContinue} className="w-full h-12 text-base mt-6">
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
