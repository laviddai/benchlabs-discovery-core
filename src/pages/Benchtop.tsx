import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Microscope, Beaker, Calendar, Timer } from 'lucide-react';

const BenchTop = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-muted/30">
          <header className="h-14 border-b bg-background flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold">BenchTop</h1>
            </div>
          </header>

          <div className="p-6 max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Microscope className="h-16 w-16 text-primary" />
                </div>
              </div>
              <h2 className="text-4xl font-bold mb-4">Laboratory Management Suite</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                BenchTop is your intelligent research workbench, powered by AI to help with data analysis, literature reviews, and generating insights. Coming soon.
              </p>
              <Badge variant="secondary" className="mt-4">
                Coming Soon
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-dashed border-2">
                <CardHeader className="text-center">
                  <Beaker className="h-12 w-12 text-primary mx-auto mb-2" />
                  <CardTitle>Experiment Tracking</CardTitle>
                  <CardDescription>
                    Track and manage your ongoing experiments with detailed protocols and results logging
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Protocol management</li>
                    <li>• Real-time data collection</li>
                    <li>• Automated documentation</li>
                    <li>• Collaborative workflows</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-dashed border-2">
                <CardHeader className="text-center">
                  <Calendar className="h-12 w-12 text-primary mx-auto mb-2" />
                  <CardTitle>Lab Scheduling</CardTitle>
                  <CardDescription>
                    Schedule equipment usage, book lab time, and coordinate with team members
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Equipment booking</li>
                    <li>• Team calendar integration</li>
                    <li>• Resource management</li>
                    <li>• Automated reminders</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-dashed border-2">
                <CardHeader className="text-center">
                  <Beaker className="h-12 w-12 text-primary mx-auto mb-2" />
                  <CardTitle>Sample Management</CardTitle>
                  <CardDescription>
                    Organize and track your biological samples, chemicals, and research materials
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Inventory tracking</li>
                    <li>• Barcode integration</li>
                    <li>• Storage location mapping</li>
                    <li>• Expiration monitoring</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-dashed border-2">
                <CardHeader className="text-center">
                  <Timer className="h-12 w-12 text-primary mx-auto mb-2" />
                  <CardTitle>Data Analysis</CardTitle>
                  <CardDescription>
                    Built-in statistical tools and visualization for analyzing your experimental data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Statistical analysis suite</li>
                    <li>• Interactive visualizations</li>
                    <li>• Automated reporting</li>
                    <li>• Export capabilities</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-dashed border-2">
                <CardHeader className="text-center">
                  <Microscope className="h-12 w-12 text-primary mx-auto mb-2" />
                  <CardTitle>Quality Control</CardTitle>
                  <CardDescription>
                    Ensure research integrity with built-in quality control and compliance tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• SOP management</li>
                    <li>• Audit trails</li>
                    <li>• Compliance tracking</li>
                    <li>• Risk assessment</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-dashed border-2">
                <CardHeader className="text-center">
                  <Microscope className="h-12 w-12 text-primary mx-auto mb-2" />
                  <CardTitle>Integration Hub</CardTitle>
                  <CardDescription>
                    Connect with existing lab equipment and external research databases
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Equipment integration</li>
                    <li>• API connections</li>
                    <li>• Data synchronization</li>
                    <li>• Cloud backup</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <Card className="max-w-2xl mx-auto">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">Get Early Access</h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to know when the BenchTop launches. We're building powerful laboratory 
                    management tools designed by researchers, for researchers.
                  </p>
                  <Badge variant="outline">
                    Early 2024 Release
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

export default BenchTop;