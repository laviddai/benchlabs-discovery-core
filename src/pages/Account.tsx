import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { User, Lock, Settings, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Account = () => {
  const { user, updatePassword } = useAuth();
  const { toast } = useToast();
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { error } = await updatePassword(passwordData.newPassword);
      
      if (error) {
        setError(error.message);
      } else {
        toast({
          title: "Password updated successfully!",
          description: "Your password has been changed.",
        });
        setPasswordData({ newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-muted/30">
          <header className="h-14 border-b bg-background flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">Account Settings</h1>
            </div>
          </header>

          <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Account Settings</h2>
              <p className="text-muted-foreground">
                Manage your account preferences and security settings.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Profile Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Profile Information</span>
                  </CardTitle>
                  <CardDescription>
                    Your basic account information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input
                      value={user?.email || ''}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed. Contact support if needed.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Account Created</Label>
                    <Input
                      value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Password Security */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="h-5 w-5" />
                    <span>Password & Security</span>
                  </CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Enter new password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ 
                          ...prev, 
                          newPassword: e.target.value 
                        }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ 
                          ...prev, 
                          confirmPassword: e.target.value 
                        }))}
                        required
                      />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? 'Updating Password...' : 'Update Password'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Discovery Feed Preferences */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Discovery Feed Preferences</span>
                  </CardTitle>
                  <CardDescription>
                    Customize your research discovery experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Coming Soon:</strong> Customize your feed by saving your favorite filters, 
                      journals, and research topics. You'll be able to set up personalized alerts 
                      and manage your research preferences here.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="mt-6 p-4 border border-dashed rounded-lg bg-muted/50">
                    <h4 className="font-medium mb-2">Future Features:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Save and manage custom category filters</li>
                      <li>• Subscribe to specific journals and authors</li>
                      <li>• Set up email alerts for new research</li>
                      <li>• Bookmark and organize articles</li>
                      <li>• Export your reading lists</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Account;