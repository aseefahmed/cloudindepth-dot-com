import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth0 } from "@auth0/auth0-react";
import { UserProfile } from "@/components/auth-components";

import {
  HomeIcon,
  Rocket,
  Menu,
  LogIn,
  LogOut,
} from "lucide-react";

const isAuth0Configured = () => {
  return !!(import.meta.env.VITE_AUTH0_DOMAIN && import.meta.env.VITE_AUTH0_CLIENT_ID);
};

function useAuth0Safe() {
  const configured = isAuth0Configured();
  
  if (!configured) {
    return {
      isAuthenticated: false,
      isLoading: false,
      user: null,
      loginWithRedirect: () => {
        alert("Auth0 login is not configured yet. Please add VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID to enable authentication.");
      },
      logout: () => {
        console.log("Logging out (dev mode)");
        window.location.href = "/";
      },
    };
  }
  
  return useAuth0();
}

interface NavigationProps {
  scrollToSection: (sectionId: string) => void;
}

const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

export default function Navigation({ scrollToSection }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0Safe();

  return (
    <nav className="fixed top-0 w-full bg-[#f2f4f7] text-black backdrop-blur-md border-b border-transparent z-40 shadow-lg shadow-gray-900/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img src="/images/logo.png" width="70%" />
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
             
              <Link href="/">
                <button className="text-black/90 hover:text-black-300 hover:font-bold transition-colors" data-testid="nav-practice-tests">
                  Home
                </button>
              </Link>
              <Link href="/practice-tests">
                <button className="text-black/90 hover:text-black-300 hover:font-bold transition-colors" data-testid="nav-practice-tests">
                  AWS
                </button>
              </Link>
              <Link href="/practice-tests">
                <button className="text-black/90 hover:text-black-300 hover:font-bold transition-colors" data-testid="nav-practice-tests">
                  Azure
                </button>
              </Link>
              <Link href="/practice-tests">
                <button className="text-black/90 hover:text-black-300 hover:font-bold transition-colors" data-testid="nav-practice-tests">
                  DevOps
                </button>
              </Link>
              <Button
                onClick={() => scrollToSection("pricing")}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <Rocket className="mr-2 h-4 w-4" />
                Enroll Now
              </Button>
              {isAuthenticated ? (
                <UserProfile />
              ) : (
                <Button
                  onClick={() => loginWithRedirect()}
                  variant="default"
                  className="bg-primary hover:bg-primary/90"
                  data-testid="button-login"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Log In
                </Button>
              )}
            </div>
          </div>
          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated ? (
              <Button
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                variant="outline"
                size="sm"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                data-testid="button-logout-mobile"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={() => loginWithRedirect()}
                variant="default"
                size="sm"
                className="bg-primary hover:bg-primary/90"
                data-testid="button-login-mobile"
              >
                <LogIn className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5 text-black" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}