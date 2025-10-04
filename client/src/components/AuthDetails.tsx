/**
 * AuthDetails Component
 * 
 * Displays comprehensive authentication information for logged-in students
 * in the student portal dashboard. Shows user profile, authentication status,
 * provider details, and additional user information.
 * 
 * Features:
 * - User profile with avatar and basic info
 * - Authentication status badges
 * - Provider information (Google, Auth0, etc.)
 * - Last login timestamp
 * - User ID and locale information
 * - Additional user data (first name, last name, nickname)
 * - Debug information in development mode
 */

import { useAuth0 } from "@auth0/auth0-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  CheckCircle, 
  Clock,
  Globe,
  Key
} from "lucide-react";

const isAuth0Configured = () => {
  return !!(import.meta.env.VITE_AUTH0_DOMAIN && import.meta.env.VITE_AUTH0_CLIENT_ID);
};

function useAuth0Safe() {
  const configured = isAuth0Configured();
  
  if (!configured) {
    return {
      user: null,
      isAuthenticated: false,
    };
  }
  
  return useAuth0();
}

export function AuthDetails() {
  const { user, isAuthenticated } = useAuth0Safe();

  if (!isAuthenticated || !user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            Authentication Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Authentication details not available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown';
    }
  };

  const getProviderName = (provider: string) => {
    const providers: Record<string, string> = {
      'google-oauth2': 'Google',
      'auth0': 'Email/Password',
      'facebook': 'Facebook',
      'twitter': 'Twitter',
      'github': 'GitHub',
      'linkedin': 'LinkedIn',
      'windowslive': 'Microsoft',
      'apple': 'Apple'
    };
    return providers[provider] || provider;
  };

  const getProviderIcon = (provider: string) => {
    const icons: Record<string, string> = {
      'google-oauth2': '🔍',
      'auth0': '📧',
      'facebook': '📘',
      'twitter': '🐦',
      'github': '🐙',
      'linkedin': '💼',
      'windowslive': '🪟',
      'apple': '🍎'
    };
    return icons[provider] || '🔐';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Authentication Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Profile Section */}
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.picture} alt={user.name || "User"} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {user.name || 'User'}
            </h3>
            <p className="text-muted-foreground mb-2">{user.email}</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-green-600 border-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Authenticated
              </Badge>
              {user.email_verified && (
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Email Verified
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Authentication Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Key className="h-4 w-4" />
            Authentication Information
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User ID */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">User ID</label>
              <div className="p-3 bg-muted rounded-md">
                <code className="text-sm text-foreground break-all">
                  {user.sub || 'N/A'}
                </code>
              </div>
            </div>

            {/* Authentication Provider */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Provider</label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <span className="text-lg">{getProviderIcon(user.sub?.split('|')[0] || 'auth0')}</span>
                <span className="text-sm text-foreground">
                  {getProviderName(user.sub?.split('|')[0] || 'auth0')}
                </span>
              </div>
            </div>

            {/* Last Login */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Last Login</label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  {user.updated_at ? formatDate(user.updated_at) : 'Unknown'}
                </span>
              </div>
            </div>

            {/* Locale */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Locale</label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  {user.locale || 'en'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Additional User Data */}
        {(user.given_name || user.family_name || user.nickname) && (
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              Additional Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.given_name && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">First Name</label>
                  <div className="p-3 bg-muted rounded-md">
                    <span className="text-sm text-foreground">{user.given_name}</span>
                  </div>
                </div>
              )}
              
              {user.family_name && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                  <div className="p-3 bg-muted rounded-md">
                    <span className="text-sm text-foreground">{user.family_name}</span>
                  </div>
                </div>
              )}
              
              {user.nickname && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Nickname</label>
                  <div className="p-3 bg-muted rounded-md">
                    <span className="text-sm text-foreground">{user.nickname}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Debug Information (only in development) */}
        {import.meta.env.DEV && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Debug Information
              </h4>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Raw User Object</label>
                <div className="p-3 bg-muted rounded-md max-h-40 overflow-auto">
                  <pre className="text-xs text-foreground whitespace-pre-wrap">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
