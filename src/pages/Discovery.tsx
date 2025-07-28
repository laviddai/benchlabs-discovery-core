import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { DiscoveryTicker } from '@/components/DiscoveryTicker';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ArticleCard } from '@/components/ArticleCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Article {
  id: string;
  title: string;
  link: string;
  summary?: string;
  publication_date?: string;
  journal_name?: string;
  ticker_symbol?: string;
  tags?: { name: string }[];
  categories?: { level_1_discipline: string, level_2_field: string }[];
}

const Discovery = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 24;

  useEffect(() => {
    fetchArticles();
  }, [selectedCategories]);

  const fetchArticles = async () => {
    setLoading(true);
    
    try {
      let query = supabase
        .from('articles')
        .select(`
          *,
          article_tag_maps(
            tags(name)
          ),
          article_category_maps(
            categories(id, level_1_discipline, level_2_field, level_3_specialization, level_4_subspecialization)
          )
        `)
        .order('publication_date', { ascending: false });

      // Filter by categories if selected
      if (selectedCategories.length > 0) {
        const { data: categoryMaps } = await supabase
          .from('article_category_maps')
          .select('article_id')
          .in('category_id', selectedCategories);
        
        const articleIds = categoryMaps?.map(m => m.article_id) || [];
        if (articleIds.length > 0) {
          query = query.in('id', articleIds);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching articles:', error);
        return;
      }

      // Transform the data to include tags and categories
      const transformedArticles = data?.map(article => ({
        ...article,
        tags: article.article_tag_maps?.map((tagMap: any) => ({ name: tagMap.tags?.name })).filter(Boolean) || [],
        categories: article.article_category_maps?.map((catMap: any) => ({
          level_1_discipline: catMap.categories?.level_1_discipline,
          level_2_field: catMap.categories?.level_2_field
        })).filter(Boolean) || []
      })) || [];

      setArticles(transformedArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.journal_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-background">
          <header className="h-14 border-b bg-background flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">Discovery Feed</h1>
            </div>
          </header>

          <DiscoveryTicker />

          <div className="flex">
            {/* Left Sidebar - Filters */}
            <div className="w-80 border-r bg-muted/30 p-4">
              <CategoryFilter
                selectedCategories={selectedCategories}
                onCategoryChange={setSelectedCategories}
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Results Summary */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">
                  {loading ? 'Loading...' : `${filteredArticles.length} articles found`}
                  {selectedCategories.length > 0 && ` (filtered by ${selectedCategories.length} categories)`}
                </p>
              </div>

              {/* Articles Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 24 }).map((_, index) => (
                    <div key={index} className="h-64 bg-muted animate-pulse rounded-lg"></div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {paginatedArticles.map((article) => (
                      <ArticleCard key={article.id} {...article} />
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
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={page === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="w-10"
                          >
                            {page}
                          </Button>
                        ))}
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

export default Discovery;