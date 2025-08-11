import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share, Globe, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArticleCard } from '@/components/ArticleCard';
import { useCollections } from '@/hooks/useCollections';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Article {
  id: string;
  title: string;
  summary?: string;
  link: string;
  publication_date?: string;
  journal_name?: string;
}

const Collection = () => {
  const { id } = useParams<{ id: string }>();
  const { collections, getCollectionArticles } = useCollections();
  const [collection, setCollection] = useState<any>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      if (!id) return;

      try {
        // First try to find in user's collections
        const userCollection = collections.find(c => c.id === id);
        
        if (userCollection) {
          setCollection(userCollection);
        } else {
          // Try to fetch public collection
          const { data, error } = await supabase
            .from('collections')
            .select('*')
            .eq('id', id)
            .eq('is_public', true)
            .single();

          if (error) {
            console.error('Error fetching collection:', error);
            return;
          }
          
          setCollection(data);
        }

        // Fetch articles
        const articleData = await getCollectionArticles(id);
        if (Array.isArray(articleData)) {
          setArticles(articleData);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [id, collections, getCollectionArticles]);

  const handleShare = () => {
    if (!collection?.is_public) {
      toast.error('Only public collections can be shared');
      return;
    }
    
    navigator.clipboard.writeText(window.location.href);
    toast.success('Collection link copied to clipboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">Loading collection...</div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-muted/30 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Collection not found</h1>
            <p className="text-muted-foreground mb-6">
              This collection doesn't exist or is not public.
            </p>
            <Button asChild>
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    {collection.name}
                    {collection.is_public ? (
                      <Globe className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </CardTitle>
                  {collection.description && (
                    <p className="text-muted-foreground mt-2">
                      {collection.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {articles.length} articles
                  </Badge>
                  {collection.is_public && (
                    <>
                      <Badge variant="outline">Public</Badge>
                      <Button variant="outline" size="sm" onClick={handleShare}>
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Articles */}
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No articles yet</h3>
            <p className="text-muted-foreground">
              Articles added to this collection will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                id={article.id}
                title={article.title}
                summary={article.summary}
                link={article.link}
                publication_date={article.publication_date}
                journal_name={article.journal_name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;