import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Settings, X, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UserPreferences {
  include_keywords: string[];
  exclude_keywords: string[];
  preferred_disciplines: string[];
  preferred_fields: string[];
  followed_journals: string[];
  excluded_journals: string[];
  keyword_logic: 'OR' | 'AND';
}

interface UserPreferencesModalProps {
  onPreferencesChange: (preferences: UserPreferences | null) => void;
  currentPreferences: UserPreferences | null;
}

export const UserPreferencesModal = ({ onPreferencesChange, currentPreferences }: UserPreferencesModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableDisciplines, setAvailableDisciplines] = useState<string[]>([]);
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [availableJournals, setAvailableJournals] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [newExcludeKeyword, setNewExcludeKeyword] = useState('');
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    include_keywords: [],
    exclude_keywords: [],
    preferred_disciplines: [],
    preferred_fields: [],
    followed_journals: [],
    excluded_journals: [],
    keyword_logic: 'OR'
  });

  useEffect(() => {
    if (currentPreferences) {
      setPreferences(currentPreferences);
    }
  }, [currentPreferences]);

  useEffect(() => {
    if (open) {
      fetchAvailableOptions();
    }
  }, [open]);

  const fetchAvailableOptions = async () => {
    try {
      // Fetch available disciplines
      const { data: disciplines } = await supabase
        .from('articles_with_metadata')
        .select('level_1_discipline')
        .not('level_1_discipline', 'is', null);
      
      // Fetch available fields  
      const { data: fields } = await supabase
        .from('articles_with_metadata')
        .select('level_2_field')
        .not('level_2_field', 'is', null);

      // Fetch available journals
      const { data: journals } = await supabase
        .from('articles_with_metadata')
        .select('journal_name')
        .not('journal_name', 'is', null);

      const uniqueDisciplines = [...new Set(disciplines?.map(d => d.level_1_discipline).filter(Boolean))] as string[];
      const uniqueFields = [...new Set(fields?.map(f => f.level_2_field).filter(Boolean))] as string[];
      const uniqueJournals = [...new Set(journals?.map(j => j.journal_name).filter(Boolean))] as string[];

      setAvailableDisciplines(uniqueDisciplines.sort());
      setAvailableFields(uniqueFields.sort());
      setAvailableJournals(uniqueJournals.sort());
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  const addKeyword = (keyword: string, type: 'include' | 'exclude') => {
    if (!keyword.trim()) return;
    
    const key = type === 'include' ? 'include_keywords' : 'exclude_keywords';
    if (!preferences[key].includes(keyword.trim())) {
      setPreferences(prev => ({
        ...prev,
        [key]: [...prev[key], keyword.trim()]
      }));
    }
    
    if (type === 'include') {
      setNewKeyword('');
    } else {
      setNewExcludeKeyword('');
    }
  };

  const removeKeyword = (keyword: string, type: 'include' | 'exclude') => {
    const key = type === 'include' ? 'include_keywords' : 'exclude_keywords';
    setPreferences(prev => ({
      ...prev,
      [key]: prev[key].filter(k => k !== keyword)
    }));
  };

  const toggleDiscipline = (discipline: string) => {
    setPreferences(prev => ({
      ...prev,
      preferred_disciplines: prev.preferred_disciplines.includes(discipline)
        ? prev.preferred_disciplines.filter(d => d !== discipline)
        : [...prev.preferred_disciplines, discipline]
    }));
  };

  const toggleField = (field: string) => {
    setPreferences(prev => ({
      ...prev,
      preferred_fields: prev.preferred_fields.includes(field)
        ? prev.preferred_fields.filter(f => f !== field)
        : [...prev.preferred_fields, field]
    }));
  };

  const toggleJournal = (journal: string, type: 'follow' | 'exclude') => {
    const key = type === 'follow' ? 'followed_journals' : 'excluded_journals';
    setPreferences(prev => ({
      ...prev,
      [key]: prev[key].includes(journal)
        ? prev[key].filter(j => j !== journal)
        : [...prev[key], journal]
    }));
  };

  const savePreferences = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          discovery_feed_settings: {
            ...preferences,
            created_at: new Date().toISOString()
          }
        });

      if (error) throw error;

      onPreferencesChange(preferences);
      setOpen(false);
      toast({
        title: "Preferences saved",
        description: "Your discovery feed preferences have been updated."
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error saving preferences",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const clearPreferences = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          discovery_feed_settings: null
        });

      if (error) throw error;

      setPreferences({
        include_keywords: [],
        exclude_keywords: [],
        preferred_disciplines: [],
        preferred_fields: [],
        followed_journals: [],
        excluded_journals: [],
        keyword_logic: 'OR'
      });
      
      onPreferencesChange(null);
      setOpen(false);
      toast({
        title: "Preferences cleared",
        description: "Your discovery feed preferences have been reset."
      });
    } catch (error) {
      console.error('Error clearing preferences:', error);
      toast({
        title: "Error clearing preferences",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Preferences
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Discovery Feed Preferences</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="keywords" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="fields">Fields</TabsTrigger>
            <TabsTrigger value="journals">Journals</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="keywords" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Include Keywords</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Articles matching these keywords will be prioritized in your feed
                </p>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add keyword..."
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addKeyword(newKeyword, 'include')}
                  />
                  <Button onClick={() => addKeyword(newKeyword, 'include')} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {preferences.include_keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary">
                      {keyword}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => removeKeyword(keyword, 'include')}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Exclude Keywords</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Articles containing these keywords will be hidden from your feed
                </p>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add keyword to exclude..."
                    value={newExcludeKeyword}
                    onChange={(e) => setNewExcludeKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addKeyword(newExcludeKeyword, 'exclude')}
                  />
                  <Button onClick={() => addKeyword(newExcludeKeyword, 'exclude')} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {preferences.exclude_keywords.map((keyword, index) => (
                    <Badge key={index} variant="destructive">
                      {keyword}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer" 
                        onClick={() => removeKeyword(keyword, 'exclude')}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="fields" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Preferred Disciplines</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
                  {availableDisciplines.map((discipline) => (
                    <div key={discipline} className="flex items-center space-x-2">
                      <Checkbox
                        id={`discipline-${discipline}`}
                        checked={preferences.preferred_disciplines.includes(discipline)}
                        onCheckedChange={() => toggleDiscipline(discipline)}
                      />
                      <Label htmlFor={`discipline-${discipline}`} className="text-sm">
                        {discipline}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Preferred Fields</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
                  {availableFields.map((field) => (
                    <div key={field} className="flex items-center space-x-2">
                      <Checkbox
                        id={`field-${field}`}
                        checked={preferences.preferred_fields.includes(field)}
                        onCheckedChange={() => toggleField(field)}
                      />
                      <Label htmlFor={`field-${field}`} className="text-sm">
                        {field}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="journals" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Followed Journals</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Show articles only from these journals (if any selected)
                </p>
                <div className="grid grid-cols-1 gap-2 mt-2 max-h-40 overflow-y-auto">
                  {availableJournals.slice(0, 50).map((journal) => (
                    <div key={journal} className="flex items-center space-x-2">
                      <Checkbox
                        id={`follow-${journal}`}
                        checked={preferences.followed_journals.includes(journal)}
                        onCheckedChange={() => toggleJournal(journal, 'follow')}
                      />
                      <Label htmlFor={`follow-${journal}`} className="text-sm">
                        {journal}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Excluded Journals</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Never show articles from these journals
                </p>
                <div className="grid grid-cols-1 gap-2 mt-2 max-h-40 overflow-y-auto">
                  {availableJournals.slice(0, 50).map((journal) => (
                    <div key={journal} className="flex items-center space-x-2">
                      <Checkbox
                        id={`exclude-${journal}`}
                        checked={preferences.excluded_journals.includes(journal)}
                        onCheckedChange={() => toggleJournal(journal, 'exclude')}
                      />
                      <Label htmlFor={`exclude-${journal}`} className="text-sm">
                        {journal}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Keyword Matching Logic</Label>
                <Select 
                  value={preferences.keyword_logic} 
                  onValueChange={(value: 'OR' | 'AND') => setPreferences(prev => ({ ...prev, keyword_logic: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OR">OR - Match any keyword</SelectItem>
                    <SelectItem value="AND">AND - Match all keywords</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  {preferences.keyword_logic === 'OR' 
                    ? 'Articles matching any of your keywords will be shown'
                    : 'Articles must match all of your keywords to be shown'
                  }
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4">
          <Button variant="destructive" onClick={clearPreferences} disabled={loading}>
            Clear All Preferences
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={savePreferences} disabled={loading}>
              {loading ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};