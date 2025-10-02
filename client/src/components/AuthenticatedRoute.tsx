import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

const isAuth0Configured = () => {
  return !!(import.meta.env.VITE_AUTH0_DOMAIN && import.meta.env.VITE_AUTH0_CLIENT_ID);
};

function useAuth0Safe() {
  const configured = isAuth0Configured();
  
  if (!configured) {
    // In dev mode without Auth0, allow access with mock authentication
    return {
      isAuthenticated: true,
      isLoading: false,
      loginWithRedirect: () => {
        alert("Auth0 login is not configured yet. Please add VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID to enable authentication.");
      },
    };
  }
  
  return useAuth0();
}

interface AuthenticatedRouteProps {
  children: React.ReactNode;
}

export function AuthenticatedRoute({ children }: AuthenticatedRouteProps) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0Safe();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && isAuth0Configured()) {
      loginWithRedirect({
        appState: { returnTo: window.location.pathname }
      });
    }
  }, [isAuthenticated, isLoading, loginWithRedirect]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && isAuth0Configured()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
