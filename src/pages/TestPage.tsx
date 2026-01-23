import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>🧪 KutumbOS Test Page</CardTitle>
            <CardDescription>
              This page confirms that routing is working correctly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">✅ Routes Working</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>If you can see this page, the routing system is functioning properly.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🔐 Test Credentials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <strong>Super Admin:</strong><br/>
                    Email: <code>super.admin@kutumb.com</code><br/>
                    Password: <code>Qwerty@123</code>
                  </div>
                  <div>
                    <strong>Family User:</strong><br/>
                    Email: <code>rahul@sharma.com</code><br/>
                    Password: <code>password123</code>
                  </div>
                  <div>
                    <strong>New Registration:</strong><br/>
                    Use password like: <code>Password123!</code><br/>
                    <small className="text-muted-foreground">
                      Must have: uppercase, lowercase, number, special char
                    </small>
                  </div>
                  <div className="pt-2">
                    <Link to="/simple-register">
                      <Button variant="default" className="w-full">Try Registration</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🚀 Backend Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Backend API: <code>http://localhost:5005</code></p>
                <p>Frontend: <code>http://localhost:8080</code></p>
                <p>Test Results: <strong>5/8 tests passed</strong></p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}