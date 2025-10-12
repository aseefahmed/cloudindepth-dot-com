import { useState, useMemo, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "wouter";
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
  Calendar,
  CreditCard,
  FileText
} from "lucide-react";

const isAuth0Configured = () => {
  return !!(import.meta.env.VITE_AUTH0_DOMAIN && import.meta.env.VITE_AUTH0_CLIENT_ID);
};

function useAuth0Safe() {
  const configured = isAuth0Configured();
  
  if (!configured) {
    return {
      user: null,
    };
  }
  
  return useAuth0();
}

const defaultPurchasedTests = [
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
    id: "soa-c02",
    title: "AWS Certified SysOps Administrator",
    subtitle: "Associate (SOA-C02)",
    difficulty: "Associate",
    progress: 0,
    questionsCompleted: 0,
    totalQuestions: 280,
    practiceTests: 5,
    lastAccessed: "Never",
    nextTest: "Practice Test #1",
    avgScore: 0,
    timeSpent: "0h",
    status: "not-started",
    purchaseDate: "2024-02-20",
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
      return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return (
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 gap-1">
          <CheckCircle className="h-3 w-3" />
          Completed
        </Badge>
      );
    case "in-progress":
      return (
        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 gap-1">
          <TrendingUp className="h-3 w-3" />
          In Progress
        </Badge>
      );
    case "not-started":
      return (
        <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
          Not Started
        </Badge>
      );
    default:
      return null;
  }
};

export default function MyPracticeTests() {
  const { user } = useAuth0Safe();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [purchasedTests, setPurchasedTests] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.sub) {
      return;
    }

    const controller = new AbortController();

    fetch(
      "https://9s5z6fbk84.execute-api.ap-southeast-6.amazonaws.com/prod/my_orders",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.sub }),
        signal: controller.signal,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPurchasedTests(data);
        } else if (data && Array.isArray(data?.items)) {
          setPurchasedTests(data.items);
        }
      })
      .catch(() => {
        // silently keep defaults on error
      });

    return () => controller.abort();
  }, [user?.sub]);

  const filteredTests = useMemo(() => {
    return purchasedTests.filter((test: any) => {
      const tTitle = (test?.title || test?.name || "").toString().toLowerCase();
      const tSubtitle = (test?.subtitle || test?.description || "").toString().toLowerCase();
      const matchesSearch = tTitle.includes(searchQuery.toLowerCase()) || tSubtitle.includes(searchQuery.toLowerCase());

      const tStatus = (test?.status || "").toString();
      const matchesStatus = statusFilter === "all" || tStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter, purchasedTests]);

  const totalTests = purchasedTests.length;
  const inProgressTests = purchasedTests.filter((t: any) => (t?.status || "").toString() === "in-progress").length;
  const totalAttempted = purchasedTests.reduce((sum: number, t: any) => sum + (Number(t?.no_of_attempt ?? 0) || 0), 0);
  const totalQuestions = purchasedTests.reduce((sum: number, t: any) => sum + (Number(t?.questions ?? 0) || 0), 0);
  const totalFlashcards = purchasedTests.reduce((sum: number, t: any) => sum + (Number(t?.flashcards ?? 0) || 0), 0);
  const avgProgress = purchasedTests.length
    ? Math.round(
        purchasedTests.reduce((sum: number, t: any) => sum + (Number(t?.progress ?? 0) || 0), 0) / purchasedTests.length
      )
    : 0;

  const handleStartTest = async (test: any) => {
    const practiceTestId = test?.practice_test_id || test?.id;
    const userId = user?.sub || (user as any)?.user_id;
    if (!practiceTestId || !userId) {
      return;
    }

    try {
      await fetch(
        "https://9s5z6fbk84.execute-api.ap-southeast-6.amazonaws.com/prod/generate_mock_test",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            test_id: practiceTestId,
            user_id: userId,
            type: "mock"
          }),
          keepalive: true,
        }
      );
    } catch {}

    setLocation(`/dashboard/quiz/${practiceTestId}`);
  };

  const handleQuestionsBank = async (test: any) => {
    const practiceTestId = test?.practice_test_id || test?.id;
    const userId = user?.sub || (user as any)?.user_id;
    if (!practiceTestId || !userId) {
      return;
    }

    try {
      const response = await fetch(
        "https://9s5z6fbk84.execute-api.ap-southeast-6.amazonaws.com/prod/generate_mock_test",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            test_id: practiceTestId,
            type: "question_bank"
          }),
          keepalive: true,
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Navigate to a questions bank page or show the questions
        // For now, we'll navigate to a questions bank page
        setLocation(`/dashboard/questions-bank/${practiceTestId}`);
      } else {
        console.error('Failed to fetch questions bank');
      }
    } catch (error) {
      console.error('Error fetching questions bank:', error);
    }
  };

  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* Header Section with Gradient */}
      <div className="relative rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 p-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/30 rounded-full blur-3xl -z-10" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-primary/20 rounded-xl backdrop-blur-sm">
              <BookOpen className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground">Dashbaord</h1>
              <p className="text-muted-foreground mt-1">Track your progress and continue learning</p>
          </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="stat-total-tests">{totalTests}</p>
                <p className="text-sm text-muted-foreground">Total Tests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="stat-in-progress">{totalQuestions}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Target className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="stat-avg-progress">{totalFlashcards}</p>
                <p className="text-sm text-muted-foreground">Flashcards</p>
              </div>
                </div>
              </CardContent>
            </Card>
            
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="stat-completed">{totalAttempted}</p>
                <p className="text-sm text-muted-foreground">Tests Attempted</p>
              </div>
            </div>
          </CardContent>
        </Card>

        
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search practice tests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search"
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

      {/* Practice Tests Table */}
      {filteredTests.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-2">No practice tests found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-bold">Certification</TableHead>
                  <TableHead className="font-bold">Questions</TableHead>
                  <TableHead className="font-bold">Attempted</TableHead>
                  <TableHead className="font-bold">Last Accessed</TableHead>
                  <TableHead className="font-bold text-center">Flashcards</TableHead>
                  <TableHead className="font-bold text-center">Questions Bank</TableHead>
                  <TableHead className="font-bold text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTests.map((test) => (
                  <TableRow 
                    key={test.practice_test_id} 
                    className="hover:bg-muted/50 transition-colors"
                    data-testid={`test-row-${test.id}`}
                  >
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-semibold text-foreground">{test.test_title || test.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {test.questions || test.total_questions || test.question_count || "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2 min-w-[150px]">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{Number(test.no_of_attempt ?? 0)}</span>
                    </div>
                    
                        {/* <Progress value={Number(test.no_of_attempt ?? 0)} className="h-2" /> */}
                  </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {test.last_attempted ||  "N/A"}
                  </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Link href={`/dashboard/flashcards/${test.practice_test_id || test.id}`}>
                    <Button
                          size="sm" 
                      variant="outline"
                          className="gap-2 border-primary/30 text-primary hover:bg-primary/10"
                          data-testid={`button-flashcards-${test.id}`}
                    >
                          <CreditCard className="h-4 w-4" />
                          Study
                    </Button>
                  </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 border-green-500/30 text-green-600 hover:bg-green-500/10"
                        data-testid={`button-questions-bank-${test.id}`}
                        onClick={() => handleQuestionsBank(test)}
                      >
                        <FileText className="h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button 
                        size="sm" 
                        className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                        data-testid={`button-start-${test.id}`}
                        onClick={() => handleStartTest(test)}
                      >
                        <PlayCircle className="h-4 w-4" />
                        Start
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          </Card>
      )}

      {/* Call to Action */}
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-dashed border-primary/30">
        <CardContent className="p-8 text-center">
          <Award className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-heading font-bold mb-2">Want More Practice Tests?</h3>
          <p className="text-muted-foreground mb-6">
            Explore our full collection of AWS certification practice tests
          </p>
          <Link href="/practice-tests">
            <Button className="gap-2" data-testid="button-browse-tests">
              <BookOpen className="h-4 w-4" />
              Browse All Tests
                </Button>
              </Link>
            </CardContent>
          </Card>
    </div>
  );
}
