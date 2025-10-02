import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthenticatedRoute } from "@/components/AuthenticatedRoute";
import { StudentPortalLayout } from "@/components/StudentPortalLayout";
import Home from "@/pages/home";
import PracticeTests from "@/pages/practice-tests";
import PracticeTestDetails from "@/pages/practice-test-details";
import StudentPortal from "@/pages/student-portal";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/practice-tests" component={PracticeTests} />
      <Route path="/practice-tests/:id" component={PracticeTestDetails} />
      <Route path="/student-portal">
        {() => (
          <AuthenticatedRoute>
            <StudentPortalLayout>
              <StudentPortal />
            </StudentPortalLayout>
          </AuthenticatedRoute>
        )}
      </Route>
      <Route path="/student-portal/:rest*">
        {() => (
          <AuthenticatedRoute>
            <StudentPortalLayout>
              <StudentPortal />
            </StudentPortalLayout>
          </AuthenticatedRoute>
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
