import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { DiscoveryArticleCard } from '@/components/DiscoveryArticleCard';
import { DiscoveryFilters } from '@/components/DiscoveryFilters';
import { UserPreferencesModal } from '@/components/UserPreferencesModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronLeft, ChevronRight, ArrowLeft, Filter, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useAuth } from '@/hooks/useAuth';

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

interface FilterState {
  searchQuery: string;
  selectedDiscipline: string;
  selectedField: string;
  selectedTickerSymbol: string;
  selectedJournal: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
}

interface UserPreferences {
  include_keywords: string[];
  exclude_keywords: string[];
  preferred_disciplines: string[];
  preferred_fields: string[];
  followed_ticker_symbols: string[];
  followed_journals: string[];
  excluded_journals: string[];
  keyword_logic: 'OR' | 'AND';
}

const DiscoveryArticles = () => {
  const { user } = useAuth();
  const { preferences, updatePreferences } = useUserPreferences();
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedDiscipline: '',
    selectedField: '',
    selectedTickerSymbol: '',
    selectedJournal: '',
    dateFrom: undefined,
    dateTo: undefined
  });
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 20;

  useEffect(() => {
    fetchArticles();
  }, [filters.selectedDiscipline, filters.selectedField, filters.selectedTickerSymbol, filters.selectedJournal, filters.dateFrom, filters.dateTo, filters.searchQuery, preferences, currentPage]);

  const fetchArticles = async () => {
    setLoading(true);
    
    try {
      // Build the base query with proper pagination
      let query = supabase
        .from('articles_with_metadata')
        .select('*', { count: 'exact' })
        .order('publication_date', { ascending: false });

      // Apply manual filters first
      if (filters.selectedDiscipline) {
        query = query.eq('level_1_discipline', filters.selectedDiscipline);
      }
      if (filters.selectedField) {
        query = query.eq('level_2_field', filters.selectedField);
      }
      if (filters.selectedTickerSymbol) {
        query = query.eq('ticker_symbol', filters.selectedTickerSymbol);
      }
      if (filters.selectedJournal) {
        query = query.eq('journal_name', filters.selectedJournal);
      }
      if (filters.dateFrom) {
        query = query.gte('publication_date', filters.dateFrom.toISOString());
      }
      if (filters.dateTo) {
        query = query.lte('publication_date', filters.dateTo.toISOString());
      }

      // Apply search filter if provided
      if (filters.searchQuery.trim()) {
        const searchTerm = `%${filters.searchQuery.trim()}%`;
        query = query.or(`title.ilike.${searchTerm},summary.ilike.${searchTerm},author.ilike.${searchTerm},journal_name.ilike.${searchTerm}`);
      }

      // Apply user preferences if available
      if (preferences && user) {
        // Apply discipline preferences
        if (preferences.preferred_disciplines.length > 0 && !filters.selectedDiscipline) {
          query = query.in('level_1_discipline', preferences.preferred_disciplines);
        }
        
        // Apply field preferences  
        if (preferences.preferred_fields.length > 0 && !filters.selectedField) {
          query = query.in('level_2_field', preferences.preferred_fields);
        }

        // Apply journal preferences
        if (preferences.followed_journals.length > 0) {
          query = query.in('journal_name', preferences.followed_journals);
        }
        
        // Apply journal exclusions
        if (preferences.excluded_journals.length > 0) {
          query = query.not('journal_name', 'in', `(${preferences.excluded_journals.map(j => `"${j}"`).join(',')})`);
        }
      }

      // Apply pagination
      const startIndex = (currentPage - 1) * articlesPerPage;
      query = query.range(startIndex, startIndex + articlesPerPage - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching articles:', error);
        return;
      }

      // Filter by keywords client-side for more flexible matching
      let filteredData = data || [];
      
      if (preferences && user) {
        // Apply keyword filters
        if (preferences.include_keywords.length > 0) {
          filteredData = filteredData.filter(article => {
            const text = `${article.title || ''} ${article.summary || ''} ${(article.combined_tags || []).join(' ')}`.toLowerCase();
            
            if (preferences.keyword_logic === 'AND') {
              return preferences.include_keywords.every(keyword => 
                text.includes(keyword.toLowerCase())
              );
            } else {
              return preferences.include_keywords.some(keyword => 
                text.includes(keyword.toLowerCase())
              );
            }
          });
        }

        // Apply keyword exclusions
        if (preferences.exclude_keywords.length > 0) {
          filteredData = filteredData.filter(article => {
            const text = `${article.title || ''} ${article.summary || ''} ${(article.combined_tags || []).join(' ')}`.toLowerCase();
            return !preferences.exclude_keywords.some(keyword => 
              text.includes(keyword.toLowerCase())
            );
          });
        }
      }

      setArticles(filteredData);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / articlesPerPage);
  
  const hasActivePreferences = preferences && (
    preferences.include_keywords.length > 0 ||
    preferences.exclude_keywords.length > 0 ||
    preferences.preferred_disciplines.length > 0 ||
    preferences.preferred_fields.length > 0 ||
    preferences.followed_journals.length > 0 ||
    preferences.excluded_journals.length > 0
  );

  const hasActiveFilters = filters.selectedDiscipline || filters.selectedField || 
    filters.selectedTickerSymbol || filters.selectedJournal || filters.dateFrom || filters.dateTo || filters.searchQuery;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFiltersChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearAllFilters = () => {
    setFilters({
      searchQuery: '',
      selectedDiscipline: '',
      selectedField: '',
      selectedTickerSymbol: '',
      selectedJournal: '',
      dateFrom: undefined,
      dateTo: undefined
    });
    setCurrentPage(1);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-background">
          <header className="h-14 border-b bg-background flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4 flex items-center space-x-4 flex-1">
              <Link to="/discovery" className="flex items-center text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Discovery
              </Link>
              <span className="text-muted-foreground">/</span>
              <h1 className="text-lg font-semibold">Recent Articles</h1>
              
              {hasActivePreferences && (
                <Badge variant="secondary" className="ml-4">
                  Personalized for you
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Moved to filter section */}
            </div>
          </header>

          <div className="flex">
            {/* Left Sidebar - Filters */}
            <div className="w-80 border-r bg-muted/30 p-4">
              <DiscoveryFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onPreferencesChange={updatePreferences}
                currentPreferences={preferences}
                user={user}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 max-w-7xl">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="flex gap-4 items-center">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search articles, authors, or journals..."
                      value={filters.searchQuery}
                      onChange={(e) => handleFiltersChange({ searchQuery: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                  
                  {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={clearAllFilters}>
                      <X className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>

              {/* Active Preferences Summary */}
              {hasActivePreferences && (
                <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span className="text-sm font-medium">Active Preferences:</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {preferences?.include_keywords.slice(0, 3).map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        +{keyword}
                      </Badge>
                    ))}
                    {preferences?.include_keywords && preferences.include_keywords.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{preferences.include_keywords.length - 3} more keywords
                      </Badge>
                    )}
                    {preferences?.preferred_disciplines.slice(0, 2).map((discipline, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {discipline}
                      </Badge>
                    ))}
                    {preferences?.preferred_disciplines && preferences.preferred_disciplines.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{preferences.preferred_disciplines.length - 2} more fields
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Results Summary */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">
                  {loading ? 'Loading...' : (
                    <>
                      Showing {((currentPage - 1) * articlesPerPage) + 1}-{Math.min(currentPage * articlesPerPage, totalCount)} of {totalCount.toLocaleString()} articles
                      {hasActiveFilters && <span> (filtered)</span>}
                      {hasActivePreferences && <span> (personalized)</span>}
                    </>
                  )}
                </p>
              </div>

              {/* Articles Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div key={index} className="h-80 bg-muted animate-pulse rounded-lg"></div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {articles.map((article) => (
                      <DiscoveryArticleCard key={article.id} article={article} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      
                      <div className="flex space-x-1">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          let page;
                          if (totalPages <= 5) {
                            page = i + 1;
                          } else if (currentPage <= 3) {
                            page = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            page = totalPages - 4 + i;
                          } else {
                            page = currentPage - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={page}
                              variant={page === currentPage ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                              className="w-10"
                            >
                              {page}
                            </Button>
                          );
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}

              {!loading && articles.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No articles found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or removing some filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DiscoveryArticles;