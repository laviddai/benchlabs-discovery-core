import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Folder, MoreVertical, Share, Edit, Trash2, Globe, Lock } from 'lucide-react';
import { useCollections, Collection } from '@/hooks/useCollections';
import { CollectionDialog } from './CollectionDialog';
import { toast } from 'sonner';

interface CollectionsListProps {
  onCollectionClick?: (collection: Collection) => void;
}

export const CollectionsList = ({ onCollectionClick }: CollectionsListProps) => {
  const { collections, loading, deleteCollection } = useCollections();

  const handleShare = (collection: Collection) => {
    if (!collection.is_public) {
      toast.error('Only public collections can be shared');
      return;
    }
    
    const url = `${window.location.origin}/collections/${collection.id}`;
    navigator.clipboard.writeText(url);
    toast.success('Collection link copied to clipboard');
  };

  const handleDelete = async (collection: Collection) => {
    if (confirm(`Are you sure you want to delete "${collection.name}"?`)) {
      await deleteCollection(collection.id);
    }
  };

  if (loading) {
    return <div className="text-center py-6">Loading collections...</div>;
  }

  if (collections.length === 0) {
    return (
      <div className="text-center py-12">
        <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No collections yet</h3>
        <p className="text-muted-foreground mb-4">
          Create your first collection to organize your saved articles
        </p>
        <CollectionDialog />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {collections.map((collection) => (
        <Card 
          key={collection.id} 
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onCollectionClick ? onCollectionClick(collection) : window.location.href = `/collections/${collection.id}`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Folder className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{collection.name}</CardTitle>
                {collection.is_public ? (
                  <Globe className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    handleShare(collection);
                  }}>
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(collection);
                    }}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          
          <CardContent>
            {collection.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {collection.description}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <Badge variant="secondary">
                {collection.article_count || 0} articles
              </Badge>
              {collection.is_public && (
                <Badge variant="outline" className="text-xs">
                  Public
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};