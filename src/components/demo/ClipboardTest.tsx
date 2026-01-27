import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export function ClipboardTest() {
  const [testText, setTestText] = useState('https://example.com/invite/test-token-123');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        toast.success('Text copied to clipboard!');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for older browsers or non-HTTPS contexts
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            toast.success('Text copied to clipboard! (fallback method)');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } else {
            throw new Error('execCommand failed');
          }
        } catch (err) {
          console.error('Fallback copy failed:', err);
          toast.error('Could not copy to clipboard. Please copy the text manually.');
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (err) {
      console.error('Copy to clipboard failed:', err);
      toast.error('Could not copy to clipboard. Please copy the text manually.');
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Clipboard Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Text to copy:</label>
          <Input
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            className="mt-1"
          />
        </div>
        
        <Button 
          onClick={() => copyToClipboard(testText)}
          className="w-full"
          variant={copied ? "default" : "outline"}
        >
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy to Clipboard
            </>
          )}
        </Button>
        
        <div className="text-xs text-muted-foreground">
          <p>This tests both modern clipboard API and fallback methods.</p>
          <p>Works in HTTP, HTTPS, and all browser contexts.</p>
        </div>
      </CardContent>
    </Card>
  );
}