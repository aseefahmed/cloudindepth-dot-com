import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App";
import "./index.css";

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

const rootElement = document.getElementById("root")!;

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
      }}
    >
      <App />
    </Auth0Provider>
  );
}
