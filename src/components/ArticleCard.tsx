import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ExternalLink, Clock, Bookmark, BookmarkCheck, FolderPlus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useSavedArticles } from '@/hooks/useSavedArticles';
import { AddToCollectionDialog } from './AddToCollectionDialog';

interface ArticleCardProps {
  id: string;
  title: string;
  link: string;
  summary?: string;
  publication_date?: string;
  journal_name?: string;
  ticker_symbol?: string;
  tags?: { name: string }[] | string[];
  categories?: { level_1_discipline: string, level_2_field: string }[] | string[];
}

export const ArticleCard = ({ 
  id,
  title, 
  link, 
  summary, 
  publication_date, 
  journal_name,
  ticker_symbol,
  tags,
  categories 
}: ArticleCardProps) => {
  const { toggleSaveArticle, isSaved, loading } = useSavedArticles();
  
  // Normalize tags to consistent format
  const normalizedTags = tags?.map(tag => 
    typeof tag === 'string' ? tag : tag.name
  ).filter(Boolean) || [];

  // Normalize categories to consistent format
  const normalizedCategories = categories?.map(cat => 
    typeof cat === 'string' ? cat : cat.level_1_discipline || cat.level_2_field
  ).filter(Boolean) || [];

  const handleSaveClick = () => {
    toggleSaveArticle(id);
  };

  return (
    <TooltipProvider>
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg leading-tight line-clamp-2 flex-1">
              {title}
            </CardTitle>
            <div className="flex items-center gap-2 shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <AddToCollectionDialog articleId={id}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <FolderPlus className="h-4 w-4" />
                    </Button>
                  </AddToCollectionDialog>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to collection</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSaveClick}
                    disabled={loading}
                    className="h-8 w-8 p-0"
                  >
                    {isSaved(id) ? (
                      <BookmarkCheck className="h-4 w-4 text-primary" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isSaved(id) ? 'Remove from saved' : 'Save article'}</p>
                </TooltipContent>
              </Tooltip>
              {ticker_symbol && (
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline" className="text-xs">
                      {ticker_symbol}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{journal_name}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {journal_name && !ticker_symbol && (
              <span className="font-medium">{journal_name}</span>
            )}
            {publication_date && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>
                  {formatDistanceToNow(new Date(publication_date), { addSuffix: true })}
                </span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          {summary && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
              {summary}
            </p>
          )}
          
          <div className="space-y-3">
            {normalizedTags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {normalizedTags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {normalizedTags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{normalizedTags.length - 3} more
                  </Badge>
                )}
              </div>
            )}
            
            <Button asChild size="sm" className="w-full">
              <a href={link} target="_blank" rel="noopener noreferrer">
                Read Paper
                <ExternalLink className="ml-2 h-3 w-3" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};