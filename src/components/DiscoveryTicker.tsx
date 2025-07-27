import { TrendingUp } from 'lucide-react';

const trendingTopics = [
  'CRISPR Gene Editing Breakthrough',
  'Quantum Computing in Drug Discovery', 
  'COVID-19 Vaccine Efficacy Studies',
  'AI-Powered Protein Folding',
  'Cancer Immunotherapy Advances',
  'Climate Change Research',
  'Renewable Energy Storage',
  'Neuroscience Memory Studies',
  'Stem Cell Regenerative Medicine',
  'Machine Learning in Genomics'
];

export const DiscoveryTicker = () => {
  return (
    <div className="bg-primary text-primary-foreground py-2 overflow-hidden">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 px-4 shrink-0">
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm font-medium">Trending:</span>
        </div>
        <div className="flex animate-scroll">
          {[...trendingTopics, ...trendingTopics].map((topic, index) => (
            <div
              key={index}
              className="flex items-center space-x-8 whitespace-nowrap"
            >
              <span className="text-sm">{topic}</span>
              <span className="text-primary-foreground/60">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};