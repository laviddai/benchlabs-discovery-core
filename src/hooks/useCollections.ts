import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface Collection {
  id: string;
  name: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  article_count?: number;
}

export const useCollections = () => {
  const { user } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCollections = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('collections')
        .select(`
          *,
          collection_articles(count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const collectionsWithCount = data?.map(collection => ({
        ...collection,
        article_count: collection.collection_articles?.[0]?.count || 0
      })) || [];

      setCollections(collectionsWithCount);
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast.error('Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  const createCollection = async (name: string, description?: string, isPublic = false) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('collections')
        .insert({
          name,
          description,
          is_public: isPublic,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Collection created successfully');
      fetchCollections();
      return data;
    } catch (error) {
      console.error('Error creating collection:', error);
      toast.error('Failed to create collection');
      return null;
    }
  };

  const updateCollection = async (id: string, updates: Partial<Pick<Collection, 'name' | 'description' | 'is_public'>>) => {
    try {
      const { error } = await supabase
        .from('collections')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast.success('Collection updated successfully');
      fetchCollections();
    } catch (error) {
      console.error('Error updating collection:', error);
      toast.error('Failed to update collection');
    }
  };

  const deleteCollection = async (id: string) => {
    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Collection deleted successfully');
      fetchCollections();
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast.error('Failed to delete collection');
    }
  };

  const addArticleToCollection = async (collectionId: string, articleId: string) => {
    try {
      const { error } = await supabase
        .from('collection_articles')
        .insert({
          collection_id: collectionId,
          article_id: articleId
        });

      if (error) {
        if (error.code === '23505') {
          toast.error('Article is already in this collection');
          return;
        }
        throw error;
      }

      toast.success('Article added to collection');
      fetchCollections();
    } catch (error) {
      console.error('Error adding article to collection:', error);
      toast.error('Failed to add article to collection');
    }
  };

  const removeArticleFromCollection = async (collectionId: string, articleId: string) => {
    try {
      const { error } = await supabase
        .from('collection_articles')
        .delete()
        .eq('collection_id', collectionId)
        .eq('article_id', articleId);

      if (error) throw error;

      toast.success('Article removed from collection');
      fetchCollections();
    } catch (error) {
      console.error('Error removing article from collection:', error);
      toast.error('Failed to remove article from collection');
    }
  };

  const getCollectionArticles = async (collectionId: string) => {
    try {
      // First get article IDs from collection_articles
      const { data: collectionData, error: collectionError } = await supabase
        .from('collection_articles')
        .select('article_id')
        .eq('collection_id', collectionId);

      if (collectionError) throw collectionError;

      if (!collectionData || collectionData.length === 0) {
        return [];
      }

      // Then get article details
      const articleIds = collectionData.map(item => item.article_id);
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select('id, title, summary, link, publication_date, journal_name')
        .in('id', articleIds);

      if (articlesError) throw articlesError;

      return articlesData || [];
    } catch (error) {
      console.error('Error fetching collection articles:', error);
      toast.error('Failed to load collection articles');
      return [];
    }
  };

  const isArticleInCollection = (collectionId: string, articleId: string): boolean => {
    // This would need to be implemented with a separate query or state management
    // For now, we'll implement this in the component that uses it
    return false;
  };

  useEffect(() => {
    if (user) {
      fetchCollections();
    }
  }, [user]);

  return {
    collections,
    loading,
    createCollection,
    updateCollection,
    deleteCollection,
    addArticleToCollection,
    removeArticleFromCollection,
    getCollectionArticles,
    isArticleInCollection,
    fetchCollections
  };
};