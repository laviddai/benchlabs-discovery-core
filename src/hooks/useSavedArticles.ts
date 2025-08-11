import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const useSavedArticles = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [savedArticleIds, setSavedArticleIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Fetch saved articles for the current user
  const fetchSavedArticles = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_saved_articles')
        .select('article_id')
        .eq('user_id', user.id);

      if (error) throw error;

      const articleIds = new Set(data?.map(item => item.article_id) || []);
      setSavedArticleIds(articleIds);
    } catch (error) {
      console.error('Error fetching saved articles:', error);
    }
  };

  // Toggle save status for an article
  const toggleSaveArticle = async (articleId: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to save articles',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const isSaved = savedArticleIds.has(articleId);

    try {
      if (isSaved) {
        // Remove from saved articles
        const { error } = await supabase
          .from('user_saved_articles')
          .delete()
          .eq('user_id', user.id)
          .eq('article_id', articleId);

        if (error) throw error;

        setSavedArticleIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(articleId);
          return newSet;
        });

        toast({
          title: 'Article removed',
          description: 'Article removed from your saved list',
        });
      } else {
        // Add to saved articles
        const { error } = await supabase
          .from('user_saved_articles')
          .insert({
            user_id: user.id,
            article_id: articleId,
          });

        if (error) throw error;

        setSavedArticleIds(prev => new Set([...prev, articleId]));

        toast({
          title: 'Article saved',
          description: 'Article added to your saved list',
        });
      }
    } catch (error) {
      console.error('Error toggling save status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update save status',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Get saved articles with full article data
  const getSavedArticles = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('user_saved_articles')
        .select(`
          created_at,
          articles (
            id,
            title,
            link,
            summary,
            publication_date,
            journal_name
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(item => ({
        ...item.articles,
        saved_at: item.created_at,
      })) || [];
    } catch (error) {
      console.error('Error fetching saved articles:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchSavedArticles();
  }, [user]);

  return {
    savedArticleIds,
    toggleSaveArticle,
    getSavedArticles,
    isSaved: (articleId: string) => savedArticleIds.has(articleId),
    loading,
  };
};