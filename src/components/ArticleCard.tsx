import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Clock, BookOpen } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ArticleCardProps {
  id: string;
  title: string;
  link: string;
  summary?: string;
  publication_date?: string;
  journal_name?: string;
  tags?: string[];
  categories?: string[];
}

export const ArticleCard = ({
  title,
  link,
  summary,
  publication_date,
  journal_name,
  tags = [],
  categories = []
}: ArticleCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown date';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg leading-tight mb-2 line-clamp-2">
              {title}
            </CardTitle>
            {journal_name && (
              <CardDescription className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span className="font-medium">{journal_name}</span>
                {publication_date && (
                  <>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(publication_date)}</span>
                    </span>
                  </>
                )}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {summary && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {summary}
          </p>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 4).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag.replace(/_/g, ' ')}
              </Badge>
            ))}
            {tags.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 4} more
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button asChild size="sm">
            <a href={link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1" />
              Read Paper
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};