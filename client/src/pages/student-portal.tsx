import { useAuth0 } from "@auth0/auth0-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import {
  BookOpen,
  Trophy,
  Clock,
  TrendingUp,
  Target,
  Award,
  PlayCircle,
  ChevronRight,
  Sparkles,
  Calendar,
  Brain,
  Zap
} from "lucide-react";

const isAuth0Configured = () => {
  return !!(import.meta.env.VITE_AUTH0_DOMAIN && import.meta.env.VITE_AUTH0_CLIENT_ID);
};

function useAuth0Safe() {
  const configured = isAuth0Configured();
  
  if (!configured) {
    return {
      user: { name: "Student", email: "student@example.com" },
    };
  }
  
  return useAuth0();
}

const practiceTests = [
  {
    id: "saa-c03",
    title: "AWS Solutions Architect Associate",
    progress: 75,
    questionsCompleted: 290,
    totalQuestions: 390,
    lastAccessed: "2 hours ago",
    status: "in-progress"
  },
  {
    id: "dva-c02",
    title: "AWS Developer Associate",
    progress: 45,
    questionsCompleted: 146,
    totalQuestions: 325,
    lastAccessed: "1 day ago",
    status: "in-progress"
  },
  {
    id: "sap-c02",
    title: "AWS Solutions Architect Professional",
    progress: 0,
    questionsCompleted: 0,
    totalQuestions: 450,
    lastAccessed: "Never",
    status: "not-started"
  }
];

const stats = [
  { label: "Total Tests", value: "3", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Avg Score", value: "82%", icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { label: "Study Time", value: "24h", icon: Clock, color: "text-green-500", bg: "bg-green-500/10" },
  { label: "Streak", value: "7 days", icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-500/10" }
];

const upcomingSessions = [
  { title: "Review: EC2 & Auto Scaling", date: "Today, 3:00 PM", type: "Review Session" },
  { title: "Practice Test: SAA-C03 #4", date: "Tomorrow, 10:00 AM", type: "Practice Test" },
  { title: "1-on-1 Coaching Call", date: "Friday, 2:00 PM", type: "Coaching" }
];

export default function StudentPortal() {
  const { user } = useAuth0Safe();
  const firstName = user?.name?.split(" ")[0] || "Student";

  return (
    <div className="space-y-8">
      {/* Welcome Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-accent p-8 md:p-12 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
            <Badge className="bg-white/20 text-white border-white/30" data-testid="badge-welcome">
              Welcome Back!
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-3" data-testid="text-welcome-message">
            Hello, {firstName}! 👋
          </h1>
          <p className="text-white/90 text-lg mb-6 max-w-2xl">
            You're making great progress! Keep up the momentum and achieve your AWS certification goals.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/student-portal/tests">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold"
                data-testid="button-continue-learning"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Continue Learning
              </Button>
            </Link>
            <Link href="/practice-tests">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                data-testid="button-browse-all"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Browse All Tests
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`stat-${stat.label.toLowerCase().replace(' ', '-')}`}>
              <CardContent className="p-6">
                <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Practice Tests Progress */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              My Practice Tests
            </h2>
            <Link href="/student-portal/tests">
              <Button variant="ghost" size="sm" data-testid="button-view-all-tests">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {practiceTests.map((test) => (
              <Card key={test.id} className="hover:shadow-lg transition-all duration-300 group" data-testid={`test-card-${test.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">{test.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {test.questionsCompleted}/{test.totalQuestions} questions
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {test.lastAccessed}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={test.status === "in-progress" ? "default" : "secondary"}
                      className={test.status === "in-progress" ? "bg-primary" : ""}
                    >
                      {test.status === "in-progress" ? "In Progress" : "Not Started"}
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Progress</span>
                      <span className="text-sm font-semibold text-primary">{test.progress}%</span>
                    </div>
                    <Progress value={test.progress} className="h-2" />
                  </div>

                  <Link href={`/student-portal/tests/${test.id}`}>
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      data-testid={`button-continue-${test.id}`}
                    >
                      <PlayCircle className="mr-2 h-4 w-4" />
                      {test.status === "not-started" ? "Start Test" : "Continue"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />
                Upcoming
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingSessions.map((session, index) => (
                <div key={index} className="pb-4 border-b border-border last:border-0 last:pb-0" data-testid={`upcoming-session-${index}`}>
                  <p className="font-semibold text-sm text-foreground mb-1">{session.title}</p>
                  <p className="text-xs text-muted-foreground mb-2">{session.date}</p>
                  <Badge variant="outline" className="text-xs">{session.type}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/student-portal/tests">
                <Button variant="outline" className="w-full justify-start" data-testid="button-quick-take-test">
                  <Target className="mr-2 h-4 w-4" />
                  Take Practice Test
                </Button>
              </Link>
              <Link href="/student-portal/bookmarks">
                <Button variant="outline" className="w-full justify-start" data-testid="button-quick-review">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Review Bookmarks
                </Button>
              </Link>
              <Link href="/student-portal/progress">
                <Button variant="outline" className="w-full justify-start" data-testid="button-quick-progress">
                  <Award className="mr-2 h-4 w-4" />
                  View Progress
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
