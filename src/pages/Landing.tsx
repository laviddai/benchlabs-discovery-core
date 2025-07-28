import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Microscope, BookOpen, Users, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const Landing = () => {
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
            Our vision for BenchLabs is to build an 'Ecosystem' that gives researchers the modern workflow they need to accelerate science. We're building the platform that unifies the entire research lifecycle: from initial discovery and deep analysis to seamless collaboration and global sharing
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
          <h2 className="text-3xl font-bold mb-4">Research Tools Built for Scientists</h2>
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

      {/* Footer */}
      <footer className="border-t bg-background/95">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Microscope className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">BenchLabs</span>
            </div>
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