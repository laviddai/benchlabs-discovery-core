import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArticleCard } from '@/components/ArticleCard';
import { useSavedArticles } from '@/hooks/useSavedArticles';
import { Skeleton } from '@/components/ui/skeleton';

interface SavedArticle {
  id: string;
  title: string;
  link: string;
  summary?: string;
  publication_date?: string;
  journal_name?: string;
  saved_at: string;
}

export const SavedArticlesList = () => {
  const { getSavedArticles } = useSavedArticles();
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedArticles = async () => {
      setLoading(true);
      const articles = await getSavedArticles();
      setSavedArticles(articles);
      setLoading(false);
    };

    fetchSavedArticles();
  }, [getSavedArticles]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (savedArticles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No saved articles yet. Start saving articles you want to read later!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Articles ({savedArticles.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {savedArticles.map((article) => (
            <ArticleCard
              key={article.id}
              id={article.id}
              title={article.title}
              link={article.link}
              summary={article.summary}
              publication_date={article.publication_date}
              journal_name={article.journal_name}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};