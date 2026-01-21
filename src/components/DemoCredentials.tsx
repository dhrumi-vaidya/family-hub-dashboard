import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Shield, Users } from 'lucide-react';

export function DemoCredentials() {
  return (
    <Card className="w-full max-w-md mx-auto mt-4 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-blue-800 dark:text-blue-200 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Demo Credentials
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-200">
              <Shield className="h-3 w-3 mr-1" />
              Super Admin
            </Badge>
          </div>
          <div className="text-sm space-y-1">
            <p className="font-mono text-blue-800 dark:text-blue-200">super.admin@kutumb.com</p>
            <p className="font-mono text-blue-800 dark:text-blue-200">Qwerty@123</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900 dark:text-amber-200">
              <User className="h-3 w-3 mr-1" />
              Family Admin
            </Badge>
          </div>
          <div className="text-sm space-y-1">
            <p className="font-mono text-blue-800 dark:text-blue-200">rahul@sharma.com</p>
            <p className="font-mono text-blue-800 dark:text-blue-200">password123</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-200">
              <Users className="h-3 w-3 mr-1" />
              Family Member
            </Badge>
          </div>
          <div className="text-sm space-y-1">
            <p className="font-mono text-blue-800 dark:text-blue-200">9876543211</p>
            <p className="font-mono text-blue-800 dark:text-blue-200">password123</p>
          </div>
        </div>
        
        <div className="pt-2 border-t border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            This is a demo deployment with mock data. All features are functional for demonstration purposes.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}