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
import StudentPortal from "@/pages/dashboard";
import MyPracticeTests from "@/pages/my-practice-tests";
import MyOrders from "@/pages/my-orders";
import Bookmarks from "@/pages/bookmarks";
import LearningPaths from "@/pages/learning-paths";
import Quiz from "@/pages/quiz";
import Checkout from "@/pages/checkout";
import Support from "@/pages/support";
import DevOpsEngineerPath from "@/pages/devops-engineer-path";
import CloudArchitectPath from "@/pages/cloud-architect-path";
import SecuritySpecialistPath from "@/pages/security-specialist-path";
import Downloads from "@/pages/downloads";
import DashboardDownloads from "@/pages/dashboard-downloads";
import Flashcards from "@/pages/flashcards";
import QuestionsBank from "@/pages/questions-bank";
import Blog from "@/pages/blog";
import BlogDetails from "@/pages/blog-details";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/practice-tests" component={PracticeTests} />
      <Route path="/practice-tests/:id" component={PracticeTestDetails} />
      <Route path="/downloads" component={Downloads} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:id" component={BlogDetails} />
      <Route path="/checkout/:testId" component={Checkout} />
      <Route path="/dashboard">
        {() => (
          <AuthenticatedRoute>
            <StudentPortalLayout>
              <StudentPortal />
            </StudentPortalLayout>
          </AuthenticatedRoute>
        )}
      </Route>
      <Route path="/dashboard/">
        {() => (
          <AuthenticatedRoute>
            <StudentPortalLayout>
              <MyPracticeTests />
            </StudentPortalLayout>
          </AuthenticatedRoute>
        )}
      </Route>
      <Route path="/dashboard/my-orders">
        {() => (
          <AuthenticatedRoute>
            <StudentPortalLayout>
              <MyOrders />
            </StudentPortalLayout>
          </AuthenticatedRoute>
        )}
      </Route>
      <Route path="/dashboard/bookmarks">
        {() => (
          <AuthenticatedRoute>
            <StudentPortalLayout>
              <Bookmarks />
            </StudentPortalLayout>
          </AuthenticatedRoute>
        )}
      </Route>
      <Route path="/dashboard/learning-paths">
        {() => (
          <AuthenticatedRoute>
            <StudentPortalLayout>
              <LearningPaths />
            </StudentPortalLayout>
          </AuthenticatedRoute>
        )}
      </Route>
      <Route path="/dashboard/learning-paths/devops-engineer">
        {() => (
          <AuthenticatedRoute>
            <StudentPortalLayout>
              <DevOpsEngineerPath />
            </StudentPortalLayout>
          </AuthenticatedRoute>
        )}
      </Route>
      <Route path="/dashboard/learning-paths/cloud-architect">
        {() => (
          <AuthenticatedRoute>
            <StudentPortalLayout>
              <CloudArchitectPath />
            </StudentPortalLayout>
          </AuthenticatedRoute>
        )}
      </Route>
      <Route path="/dashboard/learning-paths/security-specialist">
        {() => (
          <AuthenticatedRoute>
            <StudentPortalLayout>
              <SecuritySpecialistPath />
            </StudentPortalLayout>
          </AuthenticatedRoute>
        )}
      </Route>
      <Route path="/dashboard/quiz/:testId">
        {() => (
          <AuthenticatedRoute>
            <Quiz />
          </AuthenticatedRoute>
        )}
      </Route>
      <Route path="/dashboard/support">
        {() => (
          <AuthenticatedRoute>
            <StudentPortalLayout>
              <Support />
            </StudentPortalLayout>
          </AuthenticatedRoute>
        )}
      </Route>
      <Route path="/dashboard/downloads">
        {() => (
          <AuthenticatedRoute>
            <StudentPortalLayout>
              <DashboardDownloads />
            </StudentPortalLayout>
          </AuthenticatedRoute>
        )}
      </Route>
             <Route path="/dashboard/flashcards/:testId">
               {() => (
                 <AuthenticatedRoute>
                   <StudentPortalLayout>
                     <Flashcards />
                   </StudentPortalLayout>
                 </AuthenticatedRoute>
               )}
             </Route>
             <Route path="/dashboard/questions-bank/:testId">
               {() => (
                 <AuthenticatedRoute>
                   <StudentPortalLayout>
                     <QuestionsBank />
                   </StudentPortalLayout>
                 </AuthenticatedRoute>
               )}
             </Route>
      <Route path="/dashboard/:rest*">
        {() => (
          <AuthenticatedRoute>
            <StudentPortalLayout>
              <StudentPortal />
            </StudentPortalLayout>
          </AuthenticatedRoute>
        )}
      </Route>
      <Route path="/404" component={NotFound} />
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
