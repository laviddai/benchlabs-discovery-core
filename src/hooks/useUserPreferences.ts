import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface UserPreferences {
  include_keywords: string[];
  exclude_keywords: string[];
  preferred_disciplines: string[];
  preferred_fields: string[];
  followed_ticker_symbols: string[];
  followed_journals: string[];
  excluded_journals: string[];
  keyword_logic: 'OR' | 'AND';
}

export const useUserPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPreferences();
    } else {
      setPreferences(null);
      setLoading(false);
    }
  }, [user]);

  const fetchPreferences = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('discovery_feed_settings')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching preferences:', error);
        return;
      }

      const feedSettings = data?.discovery_feed_settings as any;
      if (feedSettings && typeof feedSettings === 'object') {
        setPreferences({
          include_keywords: Array.isArray(feedSettings.include_keywords) ? feedSettings.include_keywords : [],
          exclude_keywords: Array.isArray(feedSettings.exclude_keywords) ? feedSettings.exclude_keywords : [],
          preferred_disciplines: Array.isArray(feedSettings.preferred_disciplines) ? feedSettings.preferred_disciplines : [],
          preferred_fields: Array.isArray(feedSettings.preferred_fields) ? feedSettings.preferred_fields : [],
          followed_ticker_symbols: Array.isArray(feedSettings.followed_ticker_symbols) ? feedSettings.followed_ticker_symbols : [],
          followed_journals: Array.isArray(feedSettings.followed_journals) ? feedSettings.followed_journals : [],
          excluded_journals: Array.isArray(feedSettings.excluded_journals) ? feedSettings.excluded_journals : [],
          keyword_logic: (feedSettings.keyword_logic === 'AND' || feedSettings.keyword_logic === 'OR') ? feedSettings.keyword_logic : 'OR'
        });
      } else {
        setPreferences(null);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = (newPreferences: UserPreferences | null) => {
    setPreferences(newPreferences);
  };

  return {
    preferences,
    loading,
    updatePreferences,
    refetch: fetchPreferences
  };
};