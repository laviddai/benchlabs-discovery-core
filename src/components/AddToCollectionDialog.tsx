import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FolderPlus } from 'lucide-react';
import { useCollections } from '@/hooks/useCollections';
import { CollectionDialog } from './CollectionDialog';

interface AddToCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  articleId: string;
  collections: any[];
  children?: React.ReactNode;
}

export const AddToCollectionDialog = ({ 
  open, 
  onOpenChange, 
  articleId, 
  collections, 
  children 
}: AddToCollectionDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const { addArticleToCollection, removeArticleFromCollection } = useCollections();
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCollectionToggle = async (collectionId: string, isChecked: boolean) => {
    setLoading(true);
    
    if (isChecked) {
      await addArticleToCollection(collectionId, articleId);
      setSelectedCollections(prev => [...prev, collectionId]);
    } else {
      await removeArticleFromCollection(collectionId, articleId);
      setSelectedCollections(prev => prev.filter(id => id !== collectionId));
    }
    
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm">
            <FolderPlus className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Collections</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {collections.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">No collections yet</p>
              <CollectionDialog trigger={
                <Button>
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Create First Collection
                </Button>
              } />
            </div>
          ) : (
            <>
              <ScrollArea className="max-h-60">
                <div className="space-y-3">
                  {collections.map((collection) => (
                    <div key={collection.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={collection.id}
                        checked={selectedCollections.includes(collection.id)}
                        onCheckedChange={(checked) => 
                          handleCollectionToggle(collection.id, checked as boolean)
                        }
                        disabled={loading}
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={collection.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {collection.name}
                        </label>
                        {collection.description && (
                          <p className="text-xs text-muted-foreground">
                            {collection.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="border-t pt-4">
                <CollectionDialog trigger={
                  <Button variant="outline" className="w-full">
                    <FolderPlus className="h-4 w-4 mr-2" />
                    Create New Collection
                  </Button>
                } />
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};