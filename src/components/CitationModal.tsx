import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check } from 'lucide-react';
import { formatCitation, CitationData } from '@/lib/citations';
import { useToast } from '@/hooks/use-toast';

interface CitationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  citationData: CitationData;
  onCitationCopy?: (format: string) => void;
}

export const CitationModal = ({ 
  open, 
  onOpenChange, 
  citationData, 
  onCitationCopy 
}: CitationModalProps) => {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCopy = async (format: 'bibtex' | 'apa' | 'mla') => {
    const citation = formatCitation(citationData, format);
    
    try {
      await navigator.clipboard.writeText(citation);
      setCopiedFormat(format);
      onCitationCopy?.(format);
      
      toast({
        title: "Citation copied",
        description: `${format.toUpperCase()} citation copied to clipboard`,
      });
      
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy citation to clipboard",
        variant: "destructive",
      });
    }
  };

  const formats = [
    { key: 'apa', label: 'APA' },
    { key: 'mla', label: 'MLA' },
    { key: 'bibtex', label: 'BibTeX' },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Cite This Article</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="apa" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {formats.map(({ key, label }) => (
              <TabsTrigger key={key} value={key}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {formats.map(({ key, label }) => (
            <TabsContent key={key} value={key} className="space-y-4">
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg text-sm whitespace-pre-wrap font-mono overflow-x-auto">
                  {formatCitation(citationData, key)}
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => handleCopy(key)}
                >
                  {copiedFormat === key ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copiedFormat === key ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};