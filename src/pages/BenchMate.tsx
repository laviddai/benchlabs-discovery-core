import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Brain, Search, BookOpen, Lightbulb, Zap } from 'lucide-react';

const BenchMate = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-muted/30">
          <header className="h-14 border-b bg-background flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">BenchMate</h1>
            </div>
          </header>

          <div className="p-6 max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Bot className="h-16 w-16 text-primary" />
                </div>
              </div>
              <h2 className="text-4xl font-bold mb-4">Your Social Research Platform</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                BenchMate is the social side of scientific research, connecting researchers worldwide for collaboration, knowledge sharing, and community building.
              </p>
              <Badge variant="secondary" className="mt-4">
                Coming Soon
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-dashed border-2">
                <CardHeader className="text-center">
                  <Brain className="h-12 w-12 text-primary mx-auto mb-2" />
                  <CardTitle>Intelligent Analysis</CardTitle>
                  <CardDescription>
                    AI-powered analysis of your experimental data with automated insights and pattern recognition
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Automated data interpretation</li>
                    <li>• Statistical significance testing</li>
                    <li>• Pattern recognition</li>
                    <li>• Anomaly detection</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-dashed border-2">
                <CardHeader className="text-center">
                  <Search className="h-12 w-12 text-primary mx-auto mb-2" />
                  <CardTitle>Smart Literature Search</CardTitle>
                  <CardDescription>
                    Find relevant research papers and studies using natural language queries and semantic search
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Natural language queries</li>
                    <li>• Semantic paper matching</li>
                    <li>• Citation analysis</li>
                    <li>• Research gap identification</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-dashed border-2">
                <CardHeader className="text-center">
                  <BookOpen className="h-12 w-12 text-primary mx-auto mb-2" />
                  <CardTitle>Protocol Optimization</CardTitle>
                  <CardDescription>
                    AI-driven suggestions to optimize your experimental protocols and improve research outcomes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Protocol recommendations</li>
                    <li>• Parameter optimization</li>
                    <li>• Efficiency improvements</li>
                    <li>• Best practice suggestions</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-dashed border-2">
                <CardHeader className="text-center">
                  <Lightbulb className="h-12 w-12 text-primary mx-auto mb-2" />
                  <CardTitle>Hypothesis Generation</CardTitle>
                  <CardDescription>
                    Generate novel research hypotheses based on your data and existing scientific literature
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Data-driven hypotheses</li>
                    <li>• Cross-domain insights</li>
                    <li>• Novel connections</li>
                    <li>• Testable predictions</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-dashed border-2">
                <CardHeader className="text-center">
                  <Zap className="h-12 w-12 text-primary mx-auto mb-2" />
                  <CardTitle>Automated Reporting</CardTitle>
                  <CardDescription>
                    Generate comprehensive research reports and summaries with AI-assisted writing and formatting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Automated report generation</li>
                    <li>• Scientific writing assistance</li>
                    <li>• Data visualization</li>
                    <li>• Citation management</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-dashed border-2">
                <CardHeader className="text-center">
                  <Bot className="h-12 w-12 text-primary mx-auto mb-2" />
                  <CardTitle>Conversational Interface</CardTitle>
                  <CardDescription>
                    Chat with your AI assistant to get instant answers about your research and experimental design
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Natural language interface</li>
                    <li>• Research Q&A</li>
                    <li>• Method explanations</li>
                    <li>• Real-time assistance</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-12">
              <Card>
                <CardHeader>
                  <CardTitle>How BenchMate Works</CardTitle>
                  <CardDescription>
                    Our AI assistant is trained on vast scientific literature and research methodologies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-sm font-medium text-primary">1</div>
                    <div>
                      <h4 className="font-medium">Data Integration</h4>
                      <p className="text-sm text-muted-foreground">
                        Connect your experimental data, protocols, and research context
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-sm font-medium text-primary">2</div>
                    <div>
                      <h4 className="font-medium">AI Analysis</h4>
                      <p className="text-sm text-muted-foreground">
                        Advanced algorithms analyze patterns and generate insights
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-sm font-medium text-primary">3</div>
                    <div>
                      <h4 className="font-medium">Actionable Insights</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive personalized recommendations and research guidance
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Early Access Program</CardTitle>
                  <CardDescription>
                    Join our beta program to help shape the future of AI-assisted research
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded-lg">
                      <h4 className="font-medium text-sm">Beta Testing</h4>
                      <p className="text-xs text-muted-foreground">
                        Get early access to core features and provide feedback
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <h4 className="font-medium text-sm">Feature Requests</h4>
                      <p className="text-xs text-muted-foreground">
                        Suggest new capabilities tailored to your research needs
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <h4 className="font-medium text-sm">Research Collaboration</h4>
                      <p className="text-xs text-muted-foreground">
                        Partner with us to validate AI-generated insights
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="mt-4">
                    Beta Launch Q2 2024
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default BenchMate;