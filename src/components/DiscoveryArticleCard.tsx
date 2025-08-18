import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ExternalLink, 
  Calendar, 
  User, 
  BookOpen, 
  Bookmark,
  Plus,
  Quote,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { format } from 'date-fns';
import { useSavedArticles } from '@/hooks/useSavedArticles';
import { useCollections } from '@/hooks/useCollections';
import { useAuth } from '@/hooks/useAuth';
import { AddToCollectionDialog } from '@/components/AddToCollectionDialog';
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

interface DiscoveryArticleCardProps {
  article: Article;
}

export const DiscoveryArticleCard = ({ article }: DiscoveryArticleCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isSaved, toggleSaveArticle } = useSavedArticles();
  const { collections } = useCollections();
  const [showAddToCollection, setShowAddToCollection] = useState(false);
  const [showCitation, setShowCitation] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const isArticleSaved = isSaved(article.id);
  const publicCollections = collections.filter(c => c.is_public);
  const userCollections = collections.filter(c => !c.is_public);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  const handleSaveToggle = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save articles.",
        variant: "destructive"
      });
      return;
    }
    
    await toggleSaveArticle(article.id);
  };

  const handleAddToCollection = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add articles to collections.",
        variant: "destructive"
      });
      return;
    }
    setShowAddToCollection(true);
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
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CardDescription className="mb-2">
                {truncateText(article.summary, 100)}
              </CardDescription>
              
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-0 h-auto mb-3 text-primary hover:text-primary/80"
                >
                  {isExpanded ? (
                    <span className="flex items-center gap-1">
                      Show less <ChevronUp className="h-3 w-3" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      Show more <ChevronDown className="h-3 w-3" />
                    </span>
                  )}
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="animate-accordion-down">
                <div className="pt-2 border-t border-border/50 space-y-3">
                  <CardDescription>
                    {article.summary}
                  </CardDescription>
                  
                  {/* Full tags shown when expanded */}
                  {displayTags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {displayTags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Compact Tags - only show when not expanded */}
          {!isExpanded && displayTags.length > 0 && (
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
                onClick={handleSaveToggle}
                className={isArticleSaved ? 'bg-primary text-primary-foreground' : ''}
              >
                <Bookmark className={`h-4 w-4 mr-1 ${isArticleSaved ? 'fill-current' : ''}`} />
                {isArticleSaved ? 'Saved' : 'Save'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddToCollection}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
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
      <AddToCollectionDialog
        open={showAddToCollection}
        onOpenChange={setShowAddToCollection}
        articleId={article.id}
        collections={userCollections}
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