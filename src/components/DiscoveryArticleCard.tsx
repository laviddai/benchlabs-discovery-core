import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  Calendar, 
  User, 
  BookOpen, 
  Bookmark,
  Quote,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { SaveOptionsDialog } from '@/components/SaveOptionsDialog';
import { CitationModal } from '@/components/CitationModal';
import { ArticleExpandModal } from '@/components/ArticleExpandModal';
import { useToast } from '@/hooks/use-toast';

interface Article {
  id: string;
  title: string;
  link: string;
  summary?: string;
  publication_date?: string;
  author?: string;
  journal_name?: string;
  ticker_symbol?: string;
  category_id?: string;
  level_1_discipline?: string;
  level_2_field?: string;
  category_name?: string;
  category_color?: string;
  category_description?: string;
  combined_tags?: string[];
  all_tags?: string[];
  created_at: string;
}

interface DiscoveryArticleCardProps {
  article: Article;
}

export const DiscoveryArticleCard = ({ article }: DiscoveryArticleCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showSaveOptions, setShowSaveOptions] = useState(false);
  const [showCitation, setShowCitation] = useState(false);
  const [showExpandModal, setShowExpandModal] = useState(false);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  const handleSaveClick = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save articles.",
        variant: "destructive"
      });
      return;
    }
    setShowSaveOptions(true);
  };

  const displayTags = article.combined_tags || article.all_tags || [];
  const categoryColor = article.category_color || '#3b82f6';

  return (
    <>
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              {article.category_name && (
                <Badge 
                  variant="secondary" 
                  className="mb-2"
                  style={{ 
                    backgroundColor: `${categoryColor}20`,
                    color: categoryColor,
                    border: `1px solid ${categoryColor}40`
                  }}
                >
                  {article.category_name}
                </Badge>
              )}
              <CardTitle className="text-lg leading-tight">
                <a 
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-start group"
                >
                  {truncateText(article.title, 80)}
                  <ExternalLink className="h-4 w-4 ml-1 mt-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </CardTitle>
            </div>
          </div>

          {/* Article metadata */}
          <div className="space-y-1 text-sm text-muted-foreground">
            {article.journal_name && (
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                {truncateText(article.journal_name, 30)}
              </div>
            )}
            {article.author && (
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {truncateText(article.author, 25)}
              </div>
            )}
            {article.publication_date && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {format(new Date(article.publication_date), 'MMM dd, yyyy')}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-grow flex flex-col">
          {/* Compact Summary */}
          {article.summary && (
            <CardDescription className="mb-3">
              {truncateText(article.summary, 120)}
            </CardDescription>
          )}

          {/* Compact Tags */}
          {displayTags.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {displayTags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {displayTags.length > 2 && (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    +{displayTags.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveClick}
              >
                <Bookmark className="h-4 w-4 mr-1" />
                Save
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExpandModal(true)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCitation(true)}
            >
              <Quote className="h-4 w-4 mr-1" />
              Cite
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <SaveOptionsDialog
        open={showSaveOptions}
        onOpenChange={setShowSaveOptions}
        articleId={article.id}
        articleTitle={article.title}
      />

      <CitationModal
        open={showCitation}
        onOpenChange={setShowCitation}
        article={{
          id: article.id,
          title: article.title,
          link: article.link,
          summary: article.summary,
          publication_date: article.publication_date,
          journal_name: article.journal_name,
          ticker_symbol: article.ticker_symbol
        }}
      />

      <ArticleExpandModal
        article={article}
        open={showExpandModal}
        onOpenChange={setShowExpandModal}
      />
    </>
  );
};