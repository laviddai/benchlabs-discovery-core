import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FlaskConical, 
  Calendar, 
  Users, 
  Building2, 
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Discovery = () => {
  const navigate = useNavigate();

  const sections = [
    {
      id: 'recent-articles',
      title: 'Recent Articles',
      description: 'Latest research publications and papers from leading journals',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      available: true,
      path: '/discovery/articles'
    },
    {
      id: 'tools-resources',
      title: 'Tools & Resources',
      description: 'Laboratory equipment, software, and research tools',
      icon: FlaskConical,
      color: 'from-green-500 to-green-600',
      available: false
    },
    {
      id: 'events-conferences',
      title: 'Events & Conferences',
      description: 'Upcoming conferences, seminars, and scientific meetings',
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      available: false
    },
    {
      id: 'societies-associations',
      title: 'Societies & Associations',
      description: 'Professional organizations and scientific societies',
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      available: false
    },
    {
      id: 'companies-industry',
      title: 'Companies & Industry',
      description: 'Biotechnology companies and industry partnerships',
      icon: Building2,
      color: 'from-indigo-500 to-indigo-600',
      available: false
    }
  ];

  const handleSectionClick = (section: typeof sections[0]) => {
    if (section.available) {
      navigate(section.path);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-background">
          <header className="h-14 border-b bg-background flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">Discovery</h1>
            </div>
          </header>

          <div className="p-6 max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Discover Scientific Resources</h2>
              <p className="text-muted-foreground text-lg">
                Explore the latest research, tools, events, and industry connections in life sciences
              </p>
            </div>

            {/* Discovery Sections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.map((section) => (
                <Card 
                  key={section.id} 
                  className={`relative overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    section.available ? 'hover:scale-105' : 'opacity-70'
                  }`}
                  onClick={() => handleSectionClick(section)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-5`} />
                  
                  <CardHeader className="relative">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${section.color} text-white`}>
                        <section.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                        {!section.available && (
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                            Coming Soon
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative">
                    <CardDescription className="mb-4">
                      {section.description}
                    </CardDescription>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {section.available ? 'Available now' : 'Coming soon'}
                      </div>
                      {section.available && (
                        <Button variant="ghost" size="sm" className="p-0">
                          <span className="mr-2">Explore</span>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Stats Section */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-primary mb-2">10,000+</div>
                  <div className="text-sm text-muted-foreground">Research Articles</div>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-primary mb-2">500+</div>
                  <div className="text-sm text-muted-foreground">Scientific Journals</div>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-primary mb-2">50+</div>
                  <div className="text-sm text-muted-foreground">Research Categories</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Discovery;