import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bookmark, Plus, FolderPlus } from 'lucide-react';
import { useSavedArticles } from '@/hooks/useSavedArticles';
import { useCollections } from '@/hooks/useCollections';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CollectionDialog } from '@/components/CollectionDialog';

interface SaveOptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  articleId: string;
  articleTitle: string;
}

export const SaveOptionsDialog = ({ open, onOpenChange, articleId, articleTitle }: SaveOptionsDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isSaved, toggleSaveArticle } = useSavedArticles();
  const { collections, fetchCollections } = useCollections();
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [addingToCollection, setAddingToCollection] = useState<string | null>(null);

  const isArticleSaved = isSaved(articleId);
  const userCollections = collections.filter(c => !c.is_public);

  const handleSaveToGeneral = async () => {
    await toggleSaveArticle(articleId);
    onOpenChange(false);
  };

  const handleAddToCollection = async (collectionId: string) => {
    if (!user) return;
    
    setAddingToCollection(collectionId);
    
    try {
      // Check if article is already in the collection
      const { data: existing } = await supabase
        .from('collection_articles')
        .select('id')
        .eq('collection_id', collectionId)
        .eq('article_id', articleId)
        .single();

      if (existing) {
        toast({
          title: "Already in collection",
          description: "This article is already in the selected collection.",
        });
        return;
      }

      // Add to collection
      const { error } = await supabase
        .from('collection_articles')
        .insert({
          collection_id: collectionId,
          article_id: articleId,
          added_by: user.id,
        });

      if (error) throw error;

      // Also save to general saved articles if not already saved
      if (!isArticleSaved) {
        await toggleSaveArticle(articleId);
      }

      toast({
        title: "Added to collection",
        description: `Article added to collection successfully.`,
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error adding to collection:', error);
      toast({
        title: "Error",
        description: "Failed to add article to collection.",
        variant: "destructive",
      });
    } finally {
      setAddingToCollection(null);
    }
  };

  const handleCreateCollection = () => {
    setShowCreateCollection(true);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Article</DialogTitle>
            <DialogDescription>
              Choose how you'd like to save "{articleTitle.substring(0, 50)}..."
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* General Save Option */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Bookmark className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">
                    {isArticleSaved ? 'Remove from Saved' : 'Save to Reading List'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isArticleSaved 
                      ? 'Remove from your general saved articles' 
                      : 'Add to your general saved articles'
                    }
                  </p>
                </div>
              </div>
              <Button 
                variant={isArticleSaved ? "destructive" : "default"}
                size="sm"
                onClick={handleSaveToGeneral}
              >
                {isArticleSaved ? 'Remove' : 'Save'}
              </Button>
            </div>

            <Separator />

            {/* Collections Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Add to Collection</h4>
                <CollectionDialog>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <FolderPlus className="h-4 w-4" />
                    New
                  </Button>
                </CollectionDialog>
              </div>

              <ScrollArea className="max-h-48">
                {userCollections.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No collections yet. Create your first collection!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {userCollections.map((collection) => (
                      <div
                        key={collection.id}
                        className="flex items-center justify-between p-2 border rounded-lg hover:bg-accent/50"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{collection.name}</p>
                          {collection.description && (
                            <p className="text-xs text-muted-foreground">
                              {collection.description.substring(0, 60)}...
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {collection.article_count || 0} articles
                            </Badge>
                            {collection.is_public && (
                              <Badge variant="secondary" className="text-xs">
                                Public
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddToCollection(collection.id)}
                          disabled={addingToCollection === collection.id}
                          className="ml-2"
                        >
                          {addingToCollection === collection.id ? (
                            "Adding..."
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};