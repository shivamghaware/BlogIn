'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Sun, Moon, Laptop } from 'lucide-react';

export default function SettingsPage() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold font-headline">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account and site settings.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize the look and feel of the application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme">Theme</Label>
                <div className="flex items-center gap-2 rounded-lg border p-1">
                  <Button
                    variant={theme === 'light' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setTheme('light')}
                    className="h-8 w-8"
                  >
                    <Sun className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setTheme('dark')}
                    className="h-8 w-8"
                  >
                    <Moon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={theme === 'system' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setTheme('system')}
                    className="h-8 w-8"
                  >
                    <Laptop className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
