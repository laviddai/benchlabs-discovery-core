import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { User, Lock, Settings, AlertCircle, CheckCircle, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Account = () => {
  const { user, updatePassword } = useAuth();
  const { toast } = useToast();
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [displayName, setDisplayName] = useState('');
  const [editingDisplayName, setEditingDisplayName] = useState(false);
  const [loading, setLoading] = useState(false);
  const [displayNameLoading, setDisplayNameLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        return;
      }

      // Get display name from user metadata or preferences
      const userDisplayName = user.user_metadata?.display_name || data?.display_name || '';
      setDisplayName(userDisplayName);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleDisplayNameUpdate = async () => {
    if (!user || !displayName.trim()) return;

    setDisplayNameLoading(true);
    try {
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { display_name: displayName.trim() }
      });

      if (updateError) {
        throw updateError;
      }

      // Also store in user_preferences for backup
      const { error: upsertError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          display_name: displayName.trim()
        }, {
          onConflict: 'user_id'
        });

      if (upsertError) {
        console.error('Error updating preferences:', upsertError);
      }

      toast({
        title: "Display name updated",
        description: "Your display name has been successfully updated.",
      });
      
      setEditingDisplayName(false);
    } catch (error: any) {
      toast({
        title: "Error updating display name",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setDisplayNameLoading(false);
    }
  };

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
                    <Label>Display Name</Label>
                    <div className="flex space-x-2">
                      <Input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        disabled={!editingDisplayName}
                        placeholder="Enter your display name"
                        className={!editingDisplayName ? "bg-muted" : ""}
                      />
                      {editingDisplayName ? (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={handleDisplayNameUpdate}
                            disabled={displayNameLoading || !displayName.trim()}
                          >
                            {displayNameLoading ? 'Saving...' : 'Save'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingDisplayName(false);
                              fetchUserProfile(); // Reset to original value
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingDisplayName(true)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This name will be displayed publicly on your profile and contributions.
                    </p>
                  </div>

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

              {/* Linked Accounts */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Linked Accounts</span>
                  </CardTitle>
                  <CardDescription>
                    Connect your professional and social accounts for enhanced features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        OR
                      </div>
                      <span className="text-sm">Connect ORCID</span>
                    </Button>
                    
                    <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        IG
                      </div>
                      <span className="text-sm">Connect Instagram</span>
                    </Button>
                    
                    <Button variant="outline" className="h-16 flex flex-col items-center justify-center space-y-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        in
                      </div>
                      <span className="text-sm">Connect LinkedIn</span>
                    </Button>
                  </div>
                  
                  <Alert className="mt-6">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Coming Soon:</strong> Link your professional profiles to automatically 
                      import your publications, sync with your ORCID record, and share your research 
                      discoveries on social platforms.
                    </AlertDescription>
                  </Alert>
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