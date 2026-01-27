import React from 'react';
import { ValidationDemo } from '@/components/demo/ValidationDemo';

export default function ValidationTest() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Field-Level Validation Test</h1>
          <p className="text-muted-foreground mt-2">
            Test the new validation system with real-time field-level error messages
          </p>
        </div>
        
        <ValidationDemo />
      </div>
    </div>
  );
}