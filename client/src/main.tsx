import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App";
import "./index.css";

const domain = "dev-2bl5sf67k380whvu.au.auth0.com"
const clientId = "vmk2RaCIxYEOw16NnJfGr2GQomrz7o6W";

const rootElement = document.getElementById("root")!;

const onRedirectCallback = (appState?: any) => {
  const returnTo = appState?.returnTo || '/dashboard';
  // Use window.location to navigate to the student portal
  window.location.pathname = returnTo;
};

if (!domain || !clientId) {
  console.warn(
    "Auth0 credentials not configured. Login functionality will be disabled. " +
    "Please set VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID environment variables."
  );
  createRoot(rootElement).render(<App />);
} else {
  createRoot(rootElement).render(
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        scope: "openid profile email",
      }}
      cacheLocation="localstorage"
      useRefreshTokens
      onRedirectCallback={onRedirectCallback}
    >
      <App />
    </Auth0Provider>
  );
}
