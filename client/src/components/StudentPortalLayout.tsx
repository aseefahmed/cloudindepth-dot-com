import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  BookOpen,
  Bookmark,
  Settings,
  HelpCircle,
  Menu,
  X,
  LogOut,
  User,
  GraduationCap,
  TrendingUp
} from "lucide-react";

const isAuth0Configured = () => {
  return !!(import.meta.env.VITE_AUTH0_DOMAIN && import.meta.env.VITE_AUTH0_CLIENT_ID);
};

function useAuth0Safe() {
  const configured = isAuth0Configured();
  
  if (!configured) {
    return {
      user: null,
      logout: () => console.warn("Auth0 not configured"),
    };
  }
  
  return useAuth0();
}

interface StudentPortalLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/student-portal", testId: "nav-dashboard" },
  { icon: BookOpen, label: "My Practice Tests", path: "/student-portal/tests", testId: "nav-tests" },
  { icon: TrendingUp, label: "Progress", path: "/student-portal/progress", testId: "nav-progress" },
  { icon: Bookmark, label: "Bookmarks", path: "/student-portal/bookmarks", testId: "nav-bookmarks" },
  { icon: Settings, label: "Settings", path: "/student-portal/settings", testId: "nav-settings" },
  { icon: HelpCircle, label: "Support", path: "/student-portal/support", testId: "nav-support" },
];

export function StudentPortalLayout({ children }: StudentPortalLayoutProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth0Safe();

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : "ST";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-card/95 backdrop-blur-md"
          data-testid="button-mobile-menu"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-card/95 backdrop-blur-md border-r border-border shadow-2xl z-40 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo & Brand */}
        <div className="p-6 border-b border-border">
          <Link href="/student-portal">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-lg group-hover:scale-110 transition-transform">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-heading font-bold text-foreground">Student Portal</h1>
                <p className="text-xs text-muted-foreground">AWS Expert Training</p>
              </div>
            </div>
          </Link>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-primary/10"
                data-testid="button-sidebar-user"
              >
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={user?.picture} alt={user?.name || "Student"} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {user?.name || "Student"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || "student@example.com"}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem data-testid="menu-sidebar-profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  logout({
                    logoutParams: { returnTo: window.location.origin },
                  })
                }
                data-testid="button-sidebar-logout"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "hover:bg-primary/10"
                  }`}
                  data-testid={item.testId}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Bottom CTA */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border">
          <Link href="/practice-tests">
            <Button
              variant="outline"
              className="w-full border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              data-testid="button-browse-tests"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Browse More Tests
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen">
        {/* Top Bar - Mobile */}
        <div className="lg:hidden h-16 bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-30 flex items-center justify-center">
          <h1 className="text-lg font-heading font-bold text-primary">Student Portal</h1>
        </div>

        {/* Content Area */}
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
