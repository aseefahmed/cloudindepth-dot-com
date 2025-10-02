import { useState, useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "wouter";
import {
  BookOpen,
  PlayCircle,
  Clock,
  CheckCircle,
  TrendingUp,
  Award,
  Search,
  Filter,
  BarChart3,
  Target,
  Zap,
  Calendar,
  Download
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

const purchasedTests = [
  {
    id: "saa-c03",
    title: "AWS Certified Solutions Architect",
    subtitle: "Associate (SAA-C03)",
    difficulty: "Associate",
    progress: 75,
    questionsCompleted: 290,
    totalQuestions: 390,
    practiceTests: 6,
    lastAccessed: "2 hours ago",
    nextTest: "Practice Test #4",
    avgScore: 82,
    timeSpent: "12h 30m",
    status: "in-progress",
    purchaseDate: "2024-01-15",
    expiryDate: "Lifetime Access"
  },
  {
    id: "dva-c02",
    title: "AWS Certified Developer",
    subtitle: "Associate (DVA-C02)",
    difficulty: "Associate",
    progress: 45,
    questionsCompleted: 146,
    totalQuestions: 325,
    practiceTests: 5,
    lastAccessed: "1 day ago",
    nextTest: "Practice Test #3",
    avgScore: 78,
    timeSpent: "8h 15m",
    status: "in-progress",
    purchaseDate: "2024-02-01",
    expiryDate: "Lifetime Access"
  },
  {
    id: "sap-c02",
    title: "AWS Certified Solutions Architect",
    subtitle: "Professional (SAP-C02)",
    difficulty: "Professional",
    progress: 0,
    questionsCompleted: 0,
    totalQuestions: 450,
    practiceTests: 6,
    lastAccessed: "Never",
    nextTest: "Practice Test #1",
    avgScore: 0,
    timeSpent: "0h",
    status: "not-started",
    purchaseDate: "2024-02-15",
    expiryDate: "Lifetime Access"
  },
  {
    id: "scs-c02",
    title: "AWS Certified Security",
    subtitle: "Specialty (SCS-C02)",
    difficulty: "Specialty",
    progress: 100,
    questionsCompleted: 325,
    totalQuestions: 325,
    practiceTests: 5,
    lastAccessed: "1 week ago",
    nextTest: "Review Mode",
    avgScore: 91,
    timeSpent: "15h 45m",
    status: "completed",
    purchaseDate: "2023-12-10",
    expiryDate: "Lifetime Access"
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Associate":
      return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
    case "Professional":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
    case "Specialty":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return (
        <Badge className="bg-green-500 text-white">
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    case "in-progress":
      return (
        <Badge className="bg-primary text-primary-foreground">
          <Zap className="h-3 w-3 mr-1" />
          In Progress
        </Badge>
      );
    case "not-started":
      return (
        <Badge variant="outline">
          <PlayCircle className="h-3 w-3 mr-1" />
          Not Started
        </Badge>
      );
    default:
      return null;
  }
};

export default function MyPracticeTests() {
  const { user } = useAuth0Safe();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredTests = useMemo(() => {
    return purchasedTests.filter(test => {
      const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           test.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || test.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const totalTests = purchasedTests.length;
  const avgProgress = Math.round(purchasedTests.reduce((acc, t) => acc + t.progress, 0) / purchasedTests.length);
  const completedTests = purchasedTests.filter(t => t.status === 'completed').length;
  const totalTime = "36h";

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-accent p-8 md:p-10 text-white">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-8 w-8" />
            <h1 className="text-3xl md:text-4xl font-heading font-bold" data-testid="page-title">
              My Practice Tests
            </h1>
          </div>
          <p className="text-white/90 text-lg mb-6 max-w-3xl">
            Track your progress, review completed tests, and continue your AWS certification journey.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-white/80" />
                <span className="text-sm text-white/80">Total Tests</span>
              </div>
              <p className="text-2xl font-bold" data-testid="stat-total-tests-value">{totalTests}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-white/80" />
                <span className="text-sm text-white/80">Avg Progress</span>
              </div>
              <p className="text-2xl font-bold" data-testid="stat-avg-progress-value">{avgProgress}%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-white/80" />
                <span className="text-sm text-white/80">Completed</span>
              </div>
              <p className="text-2xl font-bold" data-testid="stat-completed-value">{completedTests}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-white/80" />
                <span className="text-sm text-white/80">Total Time</span>
              </div>
              <p className="text-2xl font-bold" data-testid="stat-total-time-value">{totalTime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search practice tests..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search-tests"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2" data-testid="button-filter">
              <Filter className="h-4 w-4" />
              Filter: {statusFilter === "all" ? "All" : statusFilter === "in-progress" ? "In Progress" : statusFilter === "not-started" ? "Not Started" : "Completed"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setStatusFilter("all")} data-testid="filter-all">
              All Tests
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("in-progress")} data-testid="filter-in-progress">
              In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("not-started")} data-testid="filter-not-started">
              Not Started
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("completed")} data-testid="filter-completed">
              Completed
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Practice Tests Grid */}
      <div className="grid gap-6">
        {filteredTests.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-2">No practice tests found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
          </Card>
        ) : filteredTests.map((test) => (
          <Card 
            key={test.id} 
            className="hover:shadow-xl transition-all duration-300 group overflow-hidden"
            data-testid={`practice-test-card-${test.id}`}
          >
            <div className="flex flex-col md:flex-row">
              {/* Left Section - Main Info */}
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={getDifficultyColor(test.difficulty)}>
                        {test.difficulty}
                      </Badge>
                      {getStatusBadge(test.status)}
                    </div>
                    <h3 className="text-xl font-heading font-bold text-foreground mb-1">
                      {test.title}
                    </h3>
                    <p className="text-muted-foreground">{test.subtitle}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Overall Progress</span>
                    <span className="text-sm font-bold text-primary">{test.progress}%</span>
                  </div>
                  <Progress value={test.progress} className="h-3" />
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Questions</p>
                      <p className="font-semibold">{test.questionsCompleted}/{test.totalQuestions}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Avg Score</p>
                      <p className="font-semibold">{test.avgScore}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Time Spent</p>
                      <p className="font-semibold">{test.timeSpent}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Last Access</p>
                      <p className="font-semibold">{test.lastAccessed}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Link href={`/student-portal/tests/${test.id}/practice`}>
                    <Button 
                      className="bg-primary hover:bg-primary/90"
                      data-testid={`button-continue-${test.id}`}
                    >
                      <PlayCircle className="mr-2 h-4 w-4" />
                      {test.status === 'not-started' ? 'Start Test' : test.status === 'completed' ? 'Review' : 'Continue'}
                    </Button>
                  </Link>
                  <Link href={`/student-portal/tests/${test.id}/analytics`}>
                    <Button variant="outline" data-testid={`button-analytics-${test.id}`}>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Analytics
                    </Button>
                  </Link>
                  <Button variant="outline" data-testid={`button-download-${test.id}`}>
                    <Download className="mr-2 h-4 w-4" />
                    Resources
                  </Button>
                </div>
              </div>

              {/* Right Section - Next Test Info */}
              <div className="md:w-64 bg-gradient-to-br from-accent/10 to-primary/5 p-6 flex flex-col justify-between border-l border-border">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Next Up</p>
                  <p className="text-lg font-bold text-foreground mb-4">{test.nextTest}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="h-4 w-4 text-accent" />
                      <span className="text-muted-foreground">{test.practiceTests} Practice Tests</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-accent" />
                      <span className="text-muted-foreground">{test.expiryDate}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">Purchased on</p>
                  <p className="text-sm font-semibold text-foreground">
                    {new Date(test.purchaseDate).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-dashed border-primary/30">
        <CardContent className="p-8 text-center">
          <Award className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-heading font-bold text-foreground mb-3">
            Ready for More Certifications?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Expand your AWS expertise with our comprehensive practice tests covering all certification levels.
          </p>
          <Link href="/practice-tests">
            <Button size="lg" className="bg-primary hover:bg-primary/90" data-testid="button-browse-more">
              <BookOpen className="mr-2 h-5 w-5" />
              Browse All Practice Tests
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
