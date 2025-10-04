import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogIn, LogOut, User, AlertCircle, ShoppingCart } from "lucide-react";

export const isAuth0Configured = () => {
  return !!(import.meta.env.VITE_AUTH0_DOMAIN && import.meta.env.VITE_AUTH0_CLIENT_ID);
};

export function useAuth0Safe() {
  const configured = isAuth0Configured();
  
  if (!configured) {
    // In dev mode without Auth0, show logged-out state
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

export function LoginButton() {
  const { loginWithRedirect } = useAuth0Safe();

  return (
    <Button
      onClick={() => loginWithRedirect()}
      variant="default"
      className="bg-primary hover:bg-primary/90"
      data-testid="button-login"
    >
      <LogIn className="mr-2 h-4 w-4" />
      Log In
    </Button>
  );
}

export function LogoutButton() {
  const { logout } = useAuth0Safe();

  return (
    <DropdownMenuItem
      onClick={() =>
        logout({
          logoutParams: { returnTo: window.location.origin },
        })
      }
      data-testid="button-logout"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Log Out
    </DropdownMenuItem>
  );
}

export function UserProfile() {
  const { user, isAuthenticated, isLoading } = useAuth0Safe();

  if (isLoading) {
    return (
      <Button variant="ghost" disabled data-testid="user-profile-loading">
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
      </Button>
    );
  }

  if (!isAuthenticated || !user) {
    return <LoginButton />;
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : user.email
    ? user.email.substring(0, 2).toUpperCase()
    : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full"
          data-testid="button-user-menu"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.picture} alt={user.name || "User"} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none" data-testid="text-user-name">
              {user.name || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground" data-testid="text-user-email">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem data-testid="menu-profile">
          <Link href="/dashboard" className="flex items-center w-full">
          <User className="mr-2 h-4 w-4" />
          Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface PurchaseButtonProps {
  testId: string;
  className?: string;
  children?: React.ReactNode;
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary";
  testIdAttr?: string;
  popular?: boolean;
}

export function PurchaseButton({ 
  testId, 
  className = "", 
  children, 
  variant = "default",
  testIdAttr,
  popular = false 
}: PurchaseButtonProps) {
  const { isAuthenticated, loginWithRedirect } = useAuth0Safe();
  const [, setLocation] = useLocation();

  const handlePurchaseClick = () => {
    if (!isAuthenticated) {
      if (isAuth0Configured()) {
        // Redirect to login, then to checkout after authentication
        loginWithRedirect({
          appState: { 
            returnTo: `/checkout/${testId}`
          }
        });
      } else {
        // Dev mode without Auth0: allow proceeding directly to checkout
        setLocation(`/checkout/${testId}`);
      }
    } else {
      // Authenticated - go directly to checkout (test details fetched securely from backend)
      setLocation(`/checkout/${testId}`);
    }
  };

  return (
    <Button 
      onClick={handlePurchaseClick}
      variant={variant}
      className={className}
      data-testid={testIdAttr}
    >
      {children || (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Purchase Now
        </>
      )}
    </Button>
  );
}
