import { useState, useEffect } from "react";
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
import { LogIn, LogOut, User, AlertCircle, ShoppingCart, CheckCircle } from "lucide-react";

export const isAuth0Configured = () => {
  return !!(import.meta.env.VITE_AUTH0_DOMAIN && import.meta.env.VITE_AUTH0_CLIENT_ID);
};

// Custom hook to check if user has already purchased a course
const useEnrollmentStatus = (testId: string, userId?: string) => {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userId || !testId) {
      setIsEnrolled(false);
      return;
    }

    setIsLoading(true);
    const controller = new AbortController();

    fetch(
      "https://9s5z6fbk84.execute-api.ap-southeast-6.amazonaws.com/prod/my_orders",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
        signal: controller.signal,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const purchasedTests = Array.isArray(data) ? data : (data?.items || []);
        const hasEnrolled = purchasedTests.some((test: any) => 
          test?.practice_test_id === testId || 
          test?.course_id === testId || 
          test?.id === testId
        );
        setIsEnrolled(hasEnrolled);
      })
      .catch(() => {
        setIsEnrolled(false);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [testId, userId]);

  return { isEnrolled, isLoading };
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
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <p className="text-xs text-muted-foreground text-center">
            v2.1.0
          </p>
        </div>
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
  price?: number;
  testTitle?: string;
  questions?: number;
  flashcards?: number;
}

export function PurchaseButton({ 
  testId, 
  className = "", 
  children, 
  variant = "default",
  testIdAttr,
  popular = false,
  price = 0,
  testTitle = "",
  questions = 0,
  flashcards = 0
}: PurchaseButtonProps) {
  const { isAuthenticated, loginWithRedirect, user } = useAuth0Safe();
  const [, setLocation] = useLocation();
  const userId = (user && (user.sub || user.user_id)) || undefined;
  const { isEnrolled, isLoading } = useEnrollmentStatus(testId, userId);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFreeEnrollment = async () => {
    if (isProcessing) return; // Prevent double-clicking
    
    setIsProcessing(true);
    
    try {
      if (!isAuthenticated) {
        if (isAuth0Configured()) {
          // Redirect to login, then to dashboard after authentication
          loginWithRedirect({
            appState: { 
              returnTo: `/dashboard`
            }
          });
        } else {
          // Dev mode without Auth0: allow proceeding directly to dashboard
          setLocation(`/dashboard`);
        }
      } else {
        // Authenticated - record the free enrollment and redirect to dashboard
        const userId = (user && (user.sub || user.user_id)) || undefined;
        if (userId) {
          try {
            await fetch('https://9s5z6fbk84.execute-api.ap-southeast-6.amazonaws.com/prod/record_purchase', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                user_id: userId,
                practice_test_id: testId,
                test_title: testTitle,
                price: price,
                questions: questions,
                flashcards: flashcards,
                email: user?.email
              }),
              keepalive: true,
            });
          } catch (error) {
            console.error('Error recording free enrollment:', error);
          }
        }
        setLocation(`/dashboard`);
      }
    } finally {
      // Reset processing state after a short delay to allow navigation
      setTimeout(() => setIsProcessing(false), 1000);
    }
  };

  const handlePurchaseClick = () => {
    if (isProcessing) return; // Prevent double-clicking
    
    if (price === 0) {
      handleFreeEnrollment();
      return;
    }

    setIsProcessing(true);
    
    try {
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
    } finally {
      // Reset processing state after a short delay to allow navigation
      setTimeout(() => setIsProcessing(false), 1000);
    }
  };

  // Show "Already Enrolled" if user has already purchased this course
  if (isAuthenticated && isEnrolled) {
    return (
      <Button 
        variant="secondary"
        className={`${className} bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800`}
        data-testid={testIdAttr}
        disabled
      >
        <CheckCircle className="mr-2 h-4 w-4" />
        Already Enrolled
      </Button>
    );
  }

  // Show loading state while checking enrollment
  if (isAuthenticated && isLoading) {
    return (
      <Button 
        variant={variant}
        className={className}
        data-testid={testIdAttr}
        disabled
      >
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        Checking...
      </Button>
    );
  }

  return (
    <Button 
      onClick={handlePurchaseClick}
      variant={variant}
      className={className}
      data-testid={testIdAttr}
      disabled={isProcessing}
    >
      {isProcessing ? (
        <>
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {price === 0 ? "Enrolling..." : "Processing..."}
        </>
      ) : (
        children || (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Purchase Now
          </>
        )
      )}
    </Button>
  );
}
