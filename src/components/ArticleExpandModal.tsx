import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  Calendar, 
  User, 
  BookOpen, 
  Bookmark,
  Quote,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { useSavedArticles } from '@/hooks/useSavedArticles';
import { useAuth } from '@/hooks/useAuth';
import { SaveOptionsDialog } from '@/components/SaveOptionsDialog';
import { CitationModal } from '@/components/CitationModal';
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

interface ArticleExpandModalProps {
  article: Article;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ArticleExpandModal = ({ article, open, onOpenChange }: ArticleExpandModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showSaveOptions, setShowSaveOptions] = useState(false);
  const [showCitation, setShowCitation] = useState(false);

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
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                {article.category_name && (
                  <Badge 
                    variant="secondary"
                    style={{ 
                      backgroundColor: `${categoryColor}20`,
                      color: categoryColor,
                      border: `1px solid ${categoryColor}40`
                    }}
                  >
                    {article.category_name}
                  </Badge>
                )}
                <DialogTitle className="text-2xl leading-tight">
                  {article.title}
                </DialogTitle>
              </div>
            </div>

            {/* Article metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              {article.journal_name && (
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>{article.journal_name}</span>
                </div>
              )}
              {article.author && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>{article.author}</span>
                </div>
              )}
              {article.publication_date && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{format(new Date(article.publication_date), 'MMM dd, yyyy')}</span>
                </div>
              )}
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Full Summary */}
            {article.summary && (
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Summary</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {article.summary}
                </p>
              </div>
            )}

            {/* All Tags */}
            {displayTags.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {displayTags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleSaveClick}
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save Article
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setShowCitation(true)}
                >
                  <Quote className="h-4 w-4 mr-2" />
                  Generate Citation
                </Button>
              </div>

              <Button
                variant="default"
                onClick={() => window.open(article.link, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Read Full Article
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
    </>
  );
};