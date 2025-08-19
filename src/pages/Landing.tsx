import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Microscope, BookOpen, Users, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ArticleCard } from '@/components/ArticleCard';
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

const Landing = () => {
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchRecentArticles();
  }, []);

  const fetchRecentArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles_with_metadata')
        .select('*')
        .order('publication_date', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching articles:', error);
        return;
      }

      // Transform to match expected Article interface
      const transformedArticles = (data || []).map(article => ({
        ...article,
        tags: article.combined_tags?.map((tag: string) => ({ name: tag })) || [],
        categories: [{
          level_1_discipline: article.level_1_discipline,
          level_2_field: article.level_2_field
        }].filter(Boolean)
      }));

      setRecentArticles(transformedArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Microscope className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">BenchLabs</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link to="/sign-in">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/sign-up">Sign Up</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Accelerate Scientific Breakthroughs
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Our vision for BenchLabs is to build integrated tools that gives researchers the modern workflow they need to accelerate science. We're building the platform that unifies the entire research lifecycle: from initial discovery and deep analysis to seamless collaboration and global sharing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link to="/sign-up">
                Start Your Research Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
              <Link to="/discovery">
                Explore Discovery Feed
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Operating System Built for Scientists</h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to discover, analyze, and collaborate on cutting-edge research
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center p-6 rounded-lg border bg-card">
            <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Discovery Feed</h3>
            <p className="text-muted-foreground">
              Stay up-to-date with the latest research papers, breakthroughs, and scientific developments 
              in your field of interest.
            </p>
          </div>
          
          <div className="text-center p-6 rounded-lg border bg-card">
            <Microscope className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">BenchTop</h3>
            <p className="text-muted-foreground">
              Powerful laboratory management and experiment tracking tools to streamline your research workflow.
            </p>
          </div>
          
          <div className="text-center p-6 rounded-lg border bg-card">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">BenchMate</h3>
            <p className="text-muted-foreground">
              Your social research platform for collaboration and community engagement.
            </p>
          </div>
        </div>
      </section>

      {/* Today's Discoveries Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Today's Discoveries</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Explore the latest research papers and scientific breakthroughs
          </p>
          <Button asChild variant="outline">
            <Link to="/discovery">View Full Discovery Feed</Link>
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {recentArticles.map((article) => (
            <ArticleCard key={article.id} {...article} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="flex items-center space-x-2">
              <Microscope className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">BenchLabs</span>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Stay Updated</h3>
              <p className="text-sm text-muted-foreground">
                Get the latest scientific discoveries delivered to your inbox
              </p>
              <form onSubmit={handleNewsletterSignup} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button type="submit">Subscribe</Button>
              </form>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 BenchLabs. Advancing scientific research through innovation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;