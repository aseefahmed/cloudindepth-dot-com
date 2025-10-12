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
  Download,
  X,
  LogOut,
  User,
  GraduationCap,
  TrendingUp,
  Award,
  Clock,
  Star,
  ChevronRight,
  HomeIcon,
  Rocket,
  LogIn,
  Map
} from "lucide-react";
import Navigation from "./Navigation";
const isAuth0Configured = () => {
  return !!(import.meta.env.VITE_AUTH0_DOMAIN && import.meta.env.VITE_AUTH0_CLIENT_ID);
};

function useAuth0Safe() {
  const configured = isAuth0Configured();
  
  if (!configured) {
    return {
      user: null,
      logout: () => {
        console.log("Logging out (dev mode)");
        window.location.href = "/";
      },
    };
  }
  
  return useAuth0();
}

interface StudentPortalLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { 
    icon: LayoutDashboard, 
    label: "Dashboard", 
    path: "/dashboard", 
    testId: "nav-dashboard",
    description: "Overview & progress"
  },
  //bookmarks
  { 
    icon: Bookmark, 
    label: "Bookmarks", 
    path: "/dashboard/bookmarks", 
    testId: "nav-bookmarks",
    description: "Saved Items"
  },
  // Learning Paths
  { 
    icon: Map, 
    label: "Learning Paths", 
    path: "/dashboard/learning-paths", 
    testId: "nav-learning-paths",
    description: "DevOps roadmap"
  },
  // Downloads
  { 
    icon: Download, 
    label: "Downloads", 
    path: "/dashboard/downloads", 
    testId: "nav-downloads",
    description: "Saved Files"
  },
  { 
    icon: HelpCircle, 
    label: "Support", 
    path: "/dashboard/support", 
    testId: "nav-support",
    description: "Get help & contact"
  },
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
    : "U";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Top Navigation Bar */}
      <Navigation />

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-20 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-200"
          data-testid="button-mobile-menu"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-80 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-xl z-30 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        
      

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="mb-4">
            
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                
                return (
                  <Link key={item.path} href={item.path}>
                    <div
                      className={`group flex items-center p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                      data-testid={item.testId}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <div className={`p-2 rounded-lg mr-3 ${
                        isActive 
                          ? "bg-white/20" 
                          : "bg-slate-100 dark:bg-slate-700 group-hover:bg-slate-200 dark:group-hover:bg-slate-600"
                      }`}>
                        <Icon className={`h-5 w-5 ${
                          isActive ? "text-white" : "text-slate-600 dark:text-slate-400"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${
                          isActive ? "text-white" : "text-slate-900 dark:text-white"
                        }`}>
                          {item.label}
                        </p>
                        <p className={`text-xs ${
                          isActive ? "text-white/80" : "text-slate-500 dark:text-slate-400"
                        }`}>
                          {item.description}
                        </p>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

        </div>

      </aside>

      {/* Main Content */}
      <main className="lg:ml-80 min-h-screen pt-16">
        {/* Content Area */}
        <div className="p-6 lg:p-8 bg-slate-50/50 dark:bg-slate-900/50 min-h-screen">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
