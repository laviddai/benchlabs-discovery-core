import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';

const trendingTopics = [
  'Nature • 1,247 articles',
  'Science • 892 articles', 
  'Cell • 634 articles',
  'NEJM • 445 articles',
  'Lancet • 321 articles',
  'PNAS • 567 articles',
  'Nat Biotechnol • 234 articles',
  'Nat Med • 189 articles',
  'Nat Genet • 156 articles',
  'Nat Neurosci • 123 articles'
];

export const DiscoveryTicker = () => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 overflow-hidden border-b">
      <div className="flex items-center">
        <div className="flex items-center space-x-2 px-6 shrink-0 bg-black/10 py-1">
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm font-bold tracking-wide">TRENDING JOURNALS</span>
        </div>
        <div 
          className={`flex ${isPaused ? '' : 'animate-scroll'} ml-4`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {[...trendingTopics, ...trendingTopics, ...trendingTopics].map((topic, index) => (
            <div
              key={index}
              className="flex items-center space-x-8 whitespace-nowrap"
            >
              <span className="text-sm font-medium bg-white/10 px-3 py-1 rounded-full">
                {topic}
              </span>
              <span className="text-white/40 text-lg">▲</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};