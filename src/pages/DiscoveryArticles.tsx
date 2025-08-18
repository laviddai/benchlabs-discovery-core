import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { DiscoveryArticleCard } from '@/components/DiscoveryArticleCard';
import { DiscoveryFilters } from '@/components/DiscoveryFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

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
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
}

const DiscoveryArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedDiscipline: '',
    selectedField: '',
    dateFrom: undefined,
    dateTo: undefined
  });
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 12;

  useEffect(() => {
    fetchArticles();
  }, [filters.selectedDiscipline, filters.selectedField, filters.dateFrom, filters.dateTo]);

  const fetchArticles = async () => {
    setLoading(true);
    
    try {
      // Use a raw query since articles_with_metadata is a view
      let query = `
        SELECT * FROM articles_with_metadata 
        ORDER BY publication_date DESC
      `;
      
      const conditions: string[] = [];
      const params: any[] = [];

      // Apply discipline filter
      if (filters.selectedDiscipline) {
        conditions.push(`level_1_discipline = $${params.length + 1}`);
        params.push(filters.selectedDiscipline);
      }

      // Apply field filter
      if (filters.selectedField) {
        conditions.push(`level_2_field = $${params.length + 1}`);
        params.push(filters.selectedField);
      }

      // Apply date range filter
      if (filters.dateFrom) {
        conditions.push(`publication_date >= $${params.length + 1}`);
        params.push(filters.dateFrom.toISOString());
      }
      if (filters.dateTo) {
        conditions.push(`publication_date <= $${params.length + 1}`);
        params.push(filters.dateTo.toISOString());
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      // Since we can't use rpc, let's use the regular articles table and join manually
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          article_categories!inner(
            categories(*)
          )
        `)
        .order('publication_date', { ascending: false });

      if (error) {
        console.error('Error fetching articles:', error);
        return;
      }

      // Transform the data to match our Article interface
      const transformedArticles = data?.map((article: any) => ({
        id: article.id,
        title: article.title,
        link: article.link,
        summary: article.summary,
        publication_date: article.publication_date,
        author: article.author,
        journal_name: article.journal_name,
        ticker_symbol: article.ticker_symbol,
        category_id: article.article_categories?.[0]?.categories?.id,
        level_1_discipline: article.article_categories?.[0]?.categories?.level_1_discipline,
        level_2_field: article.article_categories?.[0]?.categories?.level_2_field,
        category_name: article.article_categories?.[0]?.categories?.name,
        category_color: article.article_categories?.[0]?.categories?.color_hex,
        category_description: article.article_categories?.[0]?.categories?.description,
        combined_tags: article.all_tags,
        all_tags: article.all_tags,
        created_at: article.created_at
      })) || [];

      setArticles(transformedArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter articles based on search query
  const filteredArticles = articles.filter(article =>
    filters.searchQuery === '' ||
    article.title?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
    article.summary?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
    article.author?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
    article.journal_name?.toLowerCase().includes(filters.searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFiltersChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-background">
          <header className="h-14 border-b bg-background flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4 flex items-center space-x-4">
              <Link to="/discovery" className="flex items-center text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Discovery
              </Link>
              <span className="text-muted-foreground">/</span>
              <h1 className="text-lg font-semibold">Recent Articles</h1>
            </div>
          </header>

          <div className="flex">
            {/* Left Sidebar - Filters */}
            <div className="w-80 border-r bg-muted/30 p-4">
              <DiscoveryFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 max-w-7xl">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search articles, authors, or journals..."
                    value={filters.searchQuery}
                    onChange={(e) => handleFiltersChange({ searchQuery: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Results Summary */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">
                  {loading ? 'Loading...' : `${filteredArticles.length} articles found`}
                  {(filters.selectedDiscipline || filters.selectedField || filters.dateFrom || filters.dateTo) && (
                    <span> (filtered)</span>
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
                    {paginatedArticles.map((article) => (
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

              {!loading && filteredArticles.length === 0 && (
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