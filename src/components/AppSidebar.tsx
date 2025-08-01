import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Home, User, Microscope, Bot, LogOut, UserPlus, LogIn } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const navigationItems = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'Discovery', url: '/discovery', icon: BookOpen },
  { title: 'BenchTop', url: '/benchtop', icon: Microscope },
  { title: 'BenchMate', url: '/benchmate', icon: Bot },
];

const accountItems = [
  { title: 'Account Settings', url: '/account', icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { signOut, user } = useAuth();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath === path;
  const getNavCls = (path: string) =>
    isActive(path) ? 'bg-accent text-accent-foreground font-medium' : 'hover:bg-accent/50';

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Sidebar className={collapsed ? 'w-14' : 'w-60'} collapsible="icon">
      <SidebarHeader className="border-b p-4">
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Microscope className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">BenchLabs</span>
          </Link>
        )}
        {collapsed && (
          <Link to="/dashboard" className="flex justify-center">
            <Microscope className="h-6 w-6 text-primary" />
          </Link>
        )}
      </SidebarHeader>

      <SidebarContent>
        {user ? (
          <>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link to={item.url} className={getNavCls(item.url)}>
                          <item.icon className="h-4 w-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Account</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {accountItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link to={item.url} className={getNavCls(item.url)}>
                          <item.icon className="h-4 w-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        ) : (
          <SidebarGroup>
            <SidebarGroupLabel>Get Started</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/sign-up" className="hover:bg-accent/50">
                      <UserPlus className="h-4 w-4" />
                      {!collapsed && <span>Sign Up</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/sign-in" className="hover:bg-accent/50">
                      <LogIn className="h-4 w-4" />
                      {!collapsed && <span>Log In</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-2 mb-2">
          <ThemeToggle />
          {!collapsed && <span className="text-sm text-muted-foreground">Theme</span>}
        </div>
        {user && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Sign Out</span>}
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}