import React, { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useAuth0 } from "@auth0/auth0-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import {
  ArrowLeft,
  FileText,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  BookOpen,
  Search,
  Filter,
  Eye,
  EyeOff,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

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

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number[];
  explanation: string;
  domain: string;
  difficulty: string;
  tags?: string[];
}

interface QuestionsBankData {
  testId: string;
  testTitle: string;
  totalQuestions: number;
  questions: Question[];
}

export default function QuestionsBank() {
  const [, params] = useRoute("/dashboard/questions-bank/:testId");
  const testId = params?.testId;
  const { user } = useAuth0Safe();
  const [questionsData, setQuestionsData] = useState<QuestionsBankData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [showAnswers, setShowAnswers] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [allExpanded, setAllExpanded] = useState(false);
  const [showProtectionDialog, setShowProtectionDialog] = useState(false);
  const { toast } = useToast();

  // Disable right-click, text selection, and drag
  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      setShowProtectionDialog(true);
    };

    const handleSelectStart = (event: Event) => {
      event.preventDefault();
      setShowProtectionDialog(true);
    };

    const handleMouseDown = (event: MouseEvent) => {
      // Prevent text selection on mouse down
      if (event.detail > 1) {
        event.preventDefault();
        setShowProtectionDialog(true);
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
      // Clear any text selection
      window.getSelection()?.removeAllRanges();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+S
      if (event.ctrlKey && ['a', 'c', 'v', 'x', 's'].includes(event.key.toLowerCase())) {
        event.preventDefault();
        setShowProtectionDialog(true);
        return;
      }
      // Prevent F12 (developer tools)
      if (event.key === 'F12') {
        event.preventDefault();
        setShowProtectionDialog(true);
        return;
      }
    };

    const handleDragStart = (event: Event) => {
      event.preventDefault();
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('dragstart', handleDragStart);

    // Cleanup function to remove the event listeners
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  // Dynamic import function for questions data
  const loadQuestionsData = async (testId: string) => {
    try {
      // Dynamic import based on testId
      const module = await import(`../data/questions/${testId}/full/questions.json`);
      return module.default;
    } catch (error) {
      console.error(`Failed to load questions for testId: ${testId}`, error);
      throw new Error(`Questions data not found for test: ${testId}`);
    }
  };

  // Get test title based on testId
  const getTestTitle = (testId: string) => {
    const titles: { [key: string]: string } = {
      'saa': 'AWS Certified Solutions Architect - Associate (SAA-C03) Questions Bank',
      'sap': 'AWS Certified Solutions Architect - Professional (SAP-C02) Questions Bank',
      'dva': 'AWS Certified Developer - Associate (DVA-C02) Questions Bank',
      'dop': 'AWS Certified DevOps Engineer - Professional (DOP-C02) Questions Bank',
      'scs': 'AWS Certified Security - Specialty (SCS-C02) Questions Bank',
      'mls': 'AWS Certified Machine Learning - Specialty (MLS-C01) Questions Bank',
      'dbs': 'AWS Certified Database - Specialty (DBS-C01) Questions Bank',
      'ans': 'AWS Certified Advanced Networking - Specialty (ANS-C01) Questions Bank',
      'das': 'AWS Certified Data Analytics - Specialty (DAS-C01) Questions Bank',
      'pas': 'AWS Certified SAP on AWS - Specialty (PAS-C01) Questions Bank',
      'cls': 'AWS Certified Cloud Practitioner (CLF-C02) Questions Bank',
      'sys': 'AWS Certified SysOps Administrator - Associate (SOA-C02) Questions Bank'
    };
    return titles[testId] || `${testId.toUpperCase()} Questions Bank`;
  };

  // Load questions bank data from local JSON
  useEffect(() => {
    const loadQuestionsBank = async () => {
      if (!testId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log(`Loading questions for testId: ${testId}`);
        
        // Dynamically import the questions data
        const questionsData = await loadQuestionsData(testId);
        console.log(`Loaded questions data for ${testId}:`, questionsData);

        // Transform the local JSON data to our format
        const transformedData: QuestionsBankData = {
          testId: testId,
          testTitle: getTestTitle(testId),
          totalQuestions: questionsData.length,
          questions: questionsData.map((q: any) => ({
            ...q,
            difficulty: "medium" // Add default difficulty since it's not in the JSON
          }))
        };

        setQuestionsData(transformedData);
        console.log("Transformed data:", transformedData);
        
        if (transformedData.questions.length === 0) {
          setError("No questions available for this exam.");
        }
      } catch (err) {
        console.error("Error loading questions bank:", err);
        setError(err instanceof Error ? err.message : "Failed to load questions bank");
        toast({
          title: "Error Loading Questions Bank",
          description: "Unable to load questions. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadQuestionsBank();
  }, [testId, toast]);

  // Filter questions based on search and filters
  const filteredQuestions = questionsData?.questions.filter(question => {
    const matchesSearch = 
      (question.question?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (question.domain?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      question.tags?.some(tag => (tag?.toLowerCase() || '').includes(searchTerm.toLowerCase()));
    
    const matchesDomain = selectedDomain === "All" || question.domain === selectedDomain;
    const matchesDifficulty = selectedDifficulty === "All" || question.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesDomain && matchesDifficulty;
  }) || [];

  // Get unique domains and difficulties for filters
  const domains = ["All", ...Array.from(new Set(questionsData?.questions.map(q => q.domain).filter(Boolean) || []))];
  const difficulties = ["All", ...Array.from(new Set(questionsData?.questions.map(q => q.difficulty).filter(Boolean) || []))];

  const toggleQuestionExpansion = (questionId: string) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const toggleExpandAll = () => {
    if (allExpanded) {
      // Collapse all
      setExpandedQuestions(new Set());
      setAllExpanded(false);
    } else {
      // Expand all
      const allQuestionIds = new Set(filteredQuestions.map(q => q.id));
      setExpandedQuestions(allQuestionIds);
      setAllExpanded(true);
    }
  };

  // Update allExpanded state when individual questions are toggled
  useEffect(() => {
    const totalFilteredQuestions = filteredQuestions.length;
    const expandedCount = expandedQuestions.size;
    setAllExpanded(totalFilteredQuestions > 0 && expandedCount === totalFilteredQuestions);
  }, [expandedQuestions, filteredQuestions.length]);

  const getDifficultyColor = (difficulty: string) => {
    if (!difficulty) return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
    
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      case "hard":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getDomainColor = (domain: string) => {
    if (!domain) return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
    
    const colors = [
      "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
      "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
    ];
    const hash = domain.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Loading Questions Bank...</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Please wait while we prepare your questions.</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !questionsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              {error ? "Error Loading Questions Bank" : "Questions Bank Not Found"}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {error || "The requested questions bank could not be found."}
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/dashboard">
                <Button className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{questionsData.testTitle}</h1>
              <p className="text-xl text-slate-600 dark:text-slate-400">Questions Bank - {questionsData.totalQuestions} Questions</p>
            </div>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-fit mx-auto mb-3">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{questionsData.totalQuestions}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Questions</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full w-fit mx-auto mb-3">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{domains.length - 1}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Domains</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full w-fit mx-auto mb-3">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{filteredQuestions.length}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Filtered Questions</p>
            </CardContent>
          </Card>

          {/* <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full w-fit mx-auto mb-3">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{difficulties.length - 1}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Difficulty Levels</p>
            </CardContent>
          </Card> */}
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Filters & Search</CardTitle>
              <Button
                variant="outline"
                onClick={toggleExpandAll}
                className="gap-2"
                disabled={filteredQuestions.length === 0}
              >
                {allExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {allExpanded ? "Collapse All" : "Expand All"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Domain Filter */}
              <select
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
              >
                {domains.map(domain => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>

              {/* Difficulty Filter */}
              {/* <select
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select> */}

              {/* Show Answers Toggle */}
              <Button
                variant={showAnswers ? "default" : "outline"}
                onClick={() => setShowAnswers(!showAnswers)}
                className="gap-2"
              >
                {showAnswers ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showAnswers ? "Hide Answers" : "Show Answers"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map((question, index) => {
            const isExpanded = expandedQuestions.has(question.id);
            return (
              <Card key={question.id} className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        Q{index + 1}
                      </Badge>
                      <Badge className={getDomainColor(question.domain)}>
                        {question.domain}
                      </Badge>
                      <Badge className={getDifficultyColor(question.difficulty)}>
                        {question.difficulty}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleQuestionExpansion(question.id)}
                      className="gap-2"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      {isExpanded ? "Collapse" : "Expand"}
                    </Button>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                      <div dangerouslySetInnerHTML={{ __html: question.question }} />
                    </h3>
                  </div>

                  {isExpanded && (
                    <div className="space-y-4">
                      {/* Options */}
                      <div>
                        <h4 className="text-md font-semibold text-slate-900 dark:text-white mb-2">Options:</h4>
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => {
                            const isCorrect = question.correctAnswer.includes(optionIndex);
                            return (
                              <div
                                key={optionIndex}
                                className={`p-3 rounded-lg border ${
                                  showAnswers && isCorrect
                                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                                    : "bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <span className={`font-semibold ${
                                    showAnswers && isCorrect
                                      ? "text-green-700 dark:text-green-300"
                                      : "text-slate-600 dark:text-slate-400"
                                  }`}>
                                    {String.fromCharCode(65 + optionIndex)}.
                                  </span>
                                  <div 
                                    className={`flex-1 ${
                                      showAnswers && isCorrect
                                        ? "text-green-800 dark:text-green-200"
                                        : "text-slate-700 dark:text-slate-300"
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: option }}
                                  />
                                  {showAnswers && isCorrect && (
                                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Explanation */}
                      {question.explanation && (
                        <div>
                          <h4 className="text-md font-semibold text-slate-900 dark:text-white mb-2">Explanation:</h4>
                          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-justify">
                            <div 
                              className="text-slate-700 dark:text-slate-300"
                              dangerouslySetInnerHTML={{ __html: question.explanation }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {question.tags && question.tags.length > 0 && (
                        <div>
                          <h4 className="text-md font-semibold text-slate-900 dark:text-white mb-2">Tags:</h4>
                          <div className="flex flex-wrap gap-2">
                            {question.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No Results */}
        {filteredQuestions.length === 0 && (
          <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-12 text-center">
            <FileText className="h-16 w-16 text-slate-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No Questions Found</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Try adjusting your search or filter criteria to find questions.
            </p>
            <Button onClick={() => { setSearchTerm(""); setSelectedDomain("All"); setSelectedDifficulty("All"); }}>
              Clear Filters
            </Button>
          </Card>
        )}
      </div>

      {/* Protection Dialog */}
      <AlertDialog open={showProtectionDialog} onOpenChange={setShowProtectionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Content Protection Active
            </AlertDialogTitle>
            <AlertDialogDescription>
              Right-click and text selection are disabled to protect exam content. Please focus on studying the questions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowProtectionDialog(false)}>
              I Understand
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}