import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ExternalLink, Clock, Bookmark, BookmarkCheck, FolderPlus, Quote } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useSavedArticles } from '@/hooks/useSavedArticles';
import { useCollections } from '@/hooks/useCollections';
import { CitationModal } from './CitationModal';
import { useState } from 'react';

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
  const { collections, addArticleToCollection } = useCollections();
  const [citationModalOpen, setCitationModalOpen] = useState(false);
  
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

  const handleAddToCollection = async () => {
    // Add to default collection or first available collection
    if (collections.length > 0) {
      await addArticleToCollection(collections[0].id, id);
    }
  };

  const handleCitationCopy = (format: string) => {
    // Track citation export for analytics
    console.log(`Citation exported: ${format} for article ${id}`);
  };

  const article = {
    id,
    title,
    link,
    summary,
    publication_date,
    journal_name,
    ticker_symbol
  };

  return (
    <TooltipProvider>
      <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-lg">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <CardTitle className="text-lg leading-tight mb-2">
                <a 
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {title}
                </a>
              </CardTitle>
              
              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setCitationModalOpen(true)}
                      >
                        <Quote className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Cite article</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={handleAddToCollection}
                      >
                        <FolderPlus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add to collection</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={handleSaveClick}
                      disabled={loading}
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
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-grow flex flex-col">
          {/* Journal and Date */}
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            {journal_name && (
              <span className="font-medium">{journal_name}</span>
            )}
            {publication_date && (
              <>
                {journal_name && <span className="mx-2">•</span>}
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDistanceToNow(new Date(publication_date), { addSuffix: true })}
                </div>
              </>
            )}
          </div>

          {/* Summary */}
          {summary && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-grow">
              {summary}
            </p>
          )}

          {/* Tags */}
          {normalizedTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {normalizedTags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {normalizedTags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{normalizedTags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Categories */}
          {normalizedCategories.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {normalizedCategories.slice(0, 2).map((category, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>
          )}
            
          <Button asChild size="sm" className="w-full mt-auto">
            <a href={link} target="_blank" rel="noopener noreferrer">
              Read Paper
              <ExternalLink className="ml-2 h-3 w-3" />
            </a>
          </Button>
        </CardContent>
      </Card>
      
      <CitationModal
        open={citationModalOpen}
        onOpenChange={setCitationModalOpen}
        article={article}
        onCitationCopy={handleCitationCopy}
      />
    </TooltipProvider>
  );
};