import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function SelectFamily() {
  const navigate = useNavigate();
  const { user, isAuthenticated, selectedFamily, setSelectedFamily } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // If already selected family, go to mode selection
    if (selectedFamily) {
      navigate('/select-mode');
    }

    // If user has only one family, auto-select and proceed
    if (user?.families.length === 1) {
      setSelectedFamily(user.families[0]);
      navigate('/select-mode');
    }
  }, [isAuthenticated, selectedFamily, user, navigate, setSelectedFamily]);

  const handleSelectFamily = (family: typeof user.families[0]) => {
    setSelectedFamily(family);
    navigate('/select-mode');
  };

  if (!user || user.families.length <= 1) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground mb-4">
            <Home className="h-8 w-8" />
          </div>
        </div>

        {/* Selection Card */}
        <Card className="border-border shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Select Family</CardTitle>
            <CardDescription>
              Welcome back, {user.name}. Choose which family to manage.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {user.families.map((family) => (
              <Button
                key={family.id}
                variant="outline"
                className="w-full h-auto p-4 justify-between hover:bg-primary-light hover:border-primary"
                onClick={() => handleSelectFamily(family)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground">{family.name}</p>
                    <p className="text-sm text-muted-foreground">{family.memberCount} members</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
