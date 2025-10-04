import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

const isAuth0Configured = () => {
  return !!(import.meta.env.VITE_AUTH0_DOMAIN && import.meta.env.VITE_AUTH0_CLIENT_ID);
};

function useAuth0Safe() {
  const configured = isAuth0Configured();
  
  if (!configured) {
    // In dev mode without Auth0, require authentication
    return {
      isAuthenticated: false,
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
  const configured = isAuth0Configured();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && configured) {
      loginWithRedirect({
        appState: { returnTo: window.location.pathname }
      });
    }
  }, [isAuthenticated, isLoading, loginWithRedirect, configured]);

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

  if (!configured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Authentication Required</h2>
            <p className="text-muted-foreground mb-4">
              Auth0 is not configured. Please set up VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID environment variables to access the student portal.
            </p>
            <button
              onClick={() => window.location.href = "/"}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
