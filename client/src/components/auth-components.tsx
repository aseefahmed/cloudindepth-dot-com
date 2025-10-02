import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogIn, LogOut, User } from "lucide-react";

function useAuth0Safe() {
  try {
    return useAuth0();
  } catch (error) {
    return {
      isAuthenticated: false,
      isLoading: false,
      user: null,
      loginWithRedirect: () => console.warn("Auth0 not configured"),
      logout: () => console.warn("Auth0 not configured"),
    };
  }
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
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
