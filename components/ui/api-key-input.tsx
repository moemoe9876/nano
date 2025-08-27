'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Key, CheckCircle } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeyChange: (apiKey: string) => void;
}

export function ApiKeyInput({ onApiKeyChange }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load saved API key from localStorage on component mount
    const savedKey = localStorage.getItem('google_ai_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setIsValid(true);
      setIsSaved(true);
      onApiKeyChange(savedKey);
    }
  }, [onApiKeyChange]);

  const validateApiKey = (key: string) => {
    // Basic validation - Google AI API keys start with specific patterns
    const isValidFormat = key.length > 20 && (key.startsWith('AIza') || key.startsWith('GOOGLE_AI'));
    setIsValid(isValidFormat);
    return isValidFormat;
  };

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    setIsSaved(false);

    if (validateApiKey(value)) {
      onApiKeyChange(value);
    } else {
      onApiKeyChange('');
    }
  };

  const handleSave = () => {
    if (isValid && apiKey) {
      localStorage.setItem('google_ai_api_key', apiKey);
      setIsSaved(true);
    }
  };

  const handleClear = () => {
    setApiKey('');
    setIsValid(false);
    setIsSaved(false);
    localStorage.removeItem('google_ai_api_key');
    onApiKeyChange('');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Google AI API Key Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            To use this application, you need to provide your own Google AI API key.
            Get one from{' '}
            <a
              href="https://makersuite.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:no-underline"
            >
              Google AI Studio
            </a>
            .
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="api-key"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder="Enter your Google AI API key..."
                className={`pr-10 ${isValid ? 'border-green-500' : apiKey && !isValid ? 'border-red-500' : ''}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              onClick={handleSave}
              disabled={!isValid || isSaved}
              variant={isSaved ? "outline" : "default"}
            >
              {isSaved ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Saved
                </>
              ) : (
                'Save'
              )}
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              disabled={!apiKey}
            >
              Clear
            </Button>
          </div>
        </div>

        {apiKey && (
          <div className="text-sm text-muted-foreground">
            {isValid ? (
              <span className="text-green-600 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                Valid API key format
              </span>
            ) : (
              <span className="text-red-600">
                Invalid API key format. Please check your key.
              </span>
            )}
          </div>
        )}

        {isSaved && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              API key saved successfully! You can now generate images.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}