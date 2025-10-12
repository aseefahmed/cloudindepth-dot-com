import { useState, useEffect, useMemo } from "react";
import { useRoute, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  Flag,
  Award,
  TrendingUp,
  BookOpen,
  Home
} from "lucide-react";
import { Link } from "wouter";
import { useAuth0Safe } from "@/components/auth-components";

export default function Quiz() {
  const [, params] = useRoute("/dashboard/quiz/:testId");
  const [, setLocation] = useLocation();
  const testId = params?.testId || "";
  const { user } = useAuth0Safe();
  const userId = useMemo(() => (user && (user.sub || (user as any).user_id)) || "", [user]);
  const [quizData, setQuizData] = useState<any | null>(null);
  const [originalQuestions, setOriginalQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string>("");
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number[] }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [showResults, setShowResults] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [apiResults, setApiResults] = useState<{
    right_answers: number;
    wrong_answers: number;
    unanswered: number;
  } | null>(null);

  useEffect(() => {
    if (showResults) return;
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [showResults]);

  useEffect(() => {
    if (!testId || !userId) {
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setLoadError("");

    fetch("https://9s5z6fbk84.execute-api.ap-southeast-6.amazonaws.com/prod/fetch_questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ test_id: testId, user_id: userId }),
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('API Response:', data);
        
        // The API response structure might vary
        // Try to extract questions from different possible structures
        let questions = [];
        if (Array.isArray(data)) {
          questions = data;
        } else if (data.questions && Array.isArray(data.questions)) {
          questions = data.questions;
        } else if (data.data && Array.isArray(data.data)) {
          questions = data.data;
        }
        
        // Store the full response for student's answers
        setQuizData(data);
        // Store the original questions array for review
        setOriginalQuestions(questions);
        setIsLoading(false);
      })
      .catch((err) => {
        setLoadError(err?.message || "Failed to load questions");
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [testId, userId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-12 text-center">
            <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Loading Quiz</h2>
            <p className="text-muted-foreground mb-6">Fetching your questions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-12 text-center">
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Quiz Not Found</h2>
            <p className="text-muted-foreground mb-6">{loadError || "The practice test you're looking for doesn't exist."}</p>
            <Link href="/dashboard">
              <Button data-testid="button-back-to-tests">
                <Home className="h-4 w-4 mr-2" />
                Back to My Tests
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // In review mode, use original questions; otherwise use student's questions
  const currentQuestion = isReviewMode 
    ? originalQuestions[currentQuestionIndex] 
    : (Array.isArray(quizData) ? quizData[currentQuestionIndex] : 
       (quizData?.questions?.[currentQuestionIndex] || quizData?.[currentQuestionIndex]));
  const totalQuestions = originalQuestions?.length || 0;
  
  // Debug logging
  console.log('Review mode:', isReviewMode);
  console.log('Current question index:', currentQuestionIndex);
  console.log('Current question:', currentQuestion);
  console.log('Original questions:', originalQuestions);
  console.log('Quiz data:', quizData);
  console.log('Selected answers:', selectedAnswers);
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
  const answeredCount = Object.keys(selectedAnswers).length;

  // Return loading state if no questions available
  if (totalQuestions === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-12 text-center">
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Questions Available {totalQuestions}</h2>
            <p className="text-muted-foreground mb-6">This quiz doesn't contain any questions.</p>
            <Link href="/dashboard/practice-tests">
              <Button>
                <Home className="h-4 w-4 mr-2" />
                Back to My Tests
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper function to compare arrays
  const arraysEqual = (arr1: number[], arr2: number[] | number) => {
    if (typeof arr2 === 'number') {
      return arr1.length === 1 && arr1[0] === arr2;
    }
    if (arr1.length !== arr2.length) return false;
    const sorted1 = [...arr1].sort();
    const sorted2 = [...arr2].sort();
    return sorted1.every((val, index) => val === sorted2[index]);
  };

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedAnswers(prev => {
      const currentSelections = prev[currentQuestionIndex] || [];
      const isSelected = currentSelections.includes(optionIndex);
      
      if (isSelected) {
        // Remove the option if it's already selected
        return {
          ...prev,
          [currentQuestionIndex]: currentSelections.filter(opt => opt !== optionIndex)
        };
      } else {
        // Add the option to selections
        return {
          ...prev,
          [currentQuestionIndex]: [...currentSelections, optionIndex]
        };
      }
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleQuestionJump = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const toggleFlag = () => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestionIndex)) {
        newSet.delete(currentQuestionIndex);
      } else {
        newSet.add(currentQuestionIndex);
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    // Prepare the quiz data with chosen options
    const quizDataWithChoices = originalQuestions.map((question: any, index: number) => {
      const chosenOptions = selectedAnswers[index] || [];
      
      return {
        ...question,
        choosen_options: chosenOptions
      };
    });
    
    console.log('Submitting quiz data with chosen options:', quizDataWithChoices);
    
    // Make API call to check answers
    try {
      const response = await fetch('https://9s5z6fbk84.execute-api.ap-southeast-6.amazonaws.com/prod/check-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          practice_test_id: testId,
          questions: quizDataWithChoices
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Check answers result:', result);
        // Store the API results for display
        setApiResults(result);
      } else {
        console.error('Failed to check answers:', response.statusText);
        // Set default results if API fails
        setApiResults({
          right_answers: 0,
          wrong_answers: 0,
          unanswered: totalQuestions
        });
      }
    } catch (error) {
      console.error('Error checking answers:', error);
      // Set default results if API call fails
      setApiResults({
        right_answers: 0,
        wrong_answers: 0,
        unanswered: totalQuestions
      });
    }
    
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    originalQuestions.forEach((question: any, index: number) => {
      if (arraysEqual(selectedAnswers[index] || [], question.correctAnswer)) {
        correct++;
      }
    });
    return Math.round((correct / totalQuestions) * 100);
  };

  if (showResults) {
    // Use API results if available, otherwise fall back to local calculation
    const correct = apiResults?.right_answers ?? originalQuestions.filter((q: any, i: number) => arraysEqual(selectedAnswers[i] || [], q.correctAnswer)).length;
    const incorrect = apiResults?.wrong_answers ?? (answeredCount - correct);
    const unanswered = apiResults?.unanswered ?? (totalQuestions - answeredCount);
    const score = apiResults ? Math.round((correct / totalQuestions) * 100) : calculateScore();

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Results Header */}
          <Card className="bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 border-2">
            <CardContent className="p-8 text-center">
              <Award className="h-20 w-20 text-primary mx-auto mb-4" />
              <h1 className="text-4xl font-heading font-bold mb-2">Quiz Complete!</h1>
              <p className="text-xl text-muted-foreground">{quizData.certificationName}</p>
            </CardContent>
          </Card>

          {/* Score Card */}
          <Card className="border-2">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent mb-4">
                  <span className="text-5xl font-bold text-white">{score}%</span>
                </div>
                <p className="text-lg text-muted-foreground">Your Score</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{correct}</p>
                  <p className="text-sm text-muted-foreground">Correct</p>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-600">{incorrect}</p>
                  <p className="text-sm text-muted-foreground">Incorrect</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-950 rounded-lg">
                  <BookOpen className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-600">{unanswered}</p>
                  <p className="text-sm text-muted-foreground">Unanswered</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Time: {formatTime(timeElapsed)}
                </div>
                <div>•</div>
                <div className="flex items-center gap-2">
                  <Flag className="h-4 w-4" />
                  Flagged: {flaggedQuestions.size}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setShowResults(false);
                setIsReviewMode(true);
                setCurrentQuestionIndex(0);
              }}
              data-testid="button-review-answers"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Review Answers
            </Button>
            <Link href="/dashboard">
              <Button data-testid="button-back-to-tests-results">
                <Home className="h-4 w-4 mr-2" />
                Back to My Tests
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="font-heading font-bold text-lg">
                {quizData.certificationName}
                {isReviewMode && (
                  <Badge className="ml-2 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    Review Mode
                  </Badge>
                )}
              </h2>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {totalQuestions}
                {isReviewMode && " (Review)"}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono font-semibold" data-testid="text-timer">
                  {formatTime(timeElapsed)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-semibold" data-testid="text-answered-count">
                  {answeredCount}/{totalQuestions}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExitDialog(true)}
                data-testid="button-exit-quiz"
              >
                Exit Quiz
              </Button>
            </div>
          </div>
          <Progress value={progress} className="mt-3 h-2" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigator */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Question Navigator
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {originalQuestions.map((_: any, index: number) => {
                    const isAnswered = selectedAnswers.hasOwnProperty(index) && selectedAnswers[index].length > 0;
                    const isFlagged = flaggedQuestions.has(index);
                    const isCurrent = index === currentQuestionIndex;
                    
                    // Check if the question was answered incorrectly (only in review mode)
                    const isWrong = isReviewMode && isAnswered && originalQuestions[index] && 
                      !arraysEqual(selectedAnswers[index], originalQuestions[index].correctAnswer);

                    return (
                      <button
                        key={index}
                        onClick={() => handleQuestionJump(index)}
                        className={`
                          relative h-10 rounded-md font-semibold text-sm transition-all
                          ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}
                          ${isWrong && !isCurrent ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' : ''}
                          ${isAnswered && !isWrong && !isCurrent ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' : ''}
                          ${isAnswered && !isReviewMode && !isCurrent ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : ''}
                          ${!isAnswered && !isCurrent ? 'bg-muted hover:bg-muted/80' : ''}
                        `}
                        data-testid={`nav-question-${index + 1}`}
                      >
                        {index + 1}
                        {isFlagged && (
                          <Flag className="h-3 w-3 text-accent absolute -top-1 -right-1 fill-current" />
                        )}
                        {isWrong && isReviewMode && (
                          <XCircle className="h-3 w-3 text-red-500 absolute -top-1 -right-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Card */}
          <div className="lg:col-span-3">
            <Card className="border-2">
              <CardContent className="p-8">
                {/* Question Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className="text-base px-3 py-1">
                        Question {currentQuestionIndex + 1}
                      </Badge>
                      <Badge variant="outline" className="text-sm">
                        {currentQuestion.domain}
                      </Badge>
                    </div>
                    <h3 
                      className="text-xl font-medium leading-relaxed text-justify"
                      dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
                    />
                  </div>
                  <Button
                    variant={flaggedQuestions.has(currentQuestionIndex) ? "default" : "outline"}
                    size="sm"
                    onClick={toggleFlag}
                    className="ml-4"
                    data-testid="button-flag-question"
                  >
                    <Flag className={`h-4 w-4 ${flaggedQuestions.has(currentQuestionIndex) ? 'fill-current' : ''}`} />
                  </Button>
                </div>

                {/* Answer Options */}
                <div className="space-y-3 mb-8">
                  {currentQuestion.options.map((option: string, index: number) => {
                    const isSelected = selectedAnswers[currentQuestionIndex]?.includes(index) || false;
                    const isCorrect = currentQuestion.correctAnswer === index;
                    const optionLetter = String.fromCharCode(65 + index);
                    
                    // In review mode, check if the option matches the correct answer
                    const isCorrectAnswer = isReviewMode ? 
                      (Array.isArray(currentQuestion.correctAnswer) ? 
                        currentQuestion.correctAnswer.includes(index) : 
                        currentQuestion.correctAnswer === index) : 
                      isCorrect;
                    
                    // In review mode, check if this option was chosen by the student
                    const isChosenByStudent = isReviewMode ? 
                      (currentQuestion.choosen_options && 
                       Array.isArray(currentQuestion.choosen_options) && 
                       currentQuestion.choosen_options.includes(index)) : 
                      isSelected;
                    
                    // Debug logging for review mode
                    if (isReviewMode && index === 0) {
                      console.log('Review mode debug:', {
                        questionIndex: currentQuestionIndex,
                        correctAnswer: currentQuestion.correctAnswer,
                        choosen_options: currentQuestion.choosen_options,
                        optionIndex: index,
                        isCorrectAnswer,
                        isChosenByStudent
                      });
                    }

                    // In review mode, show correct/incorrect styling
                    const getOptionStyling = () => {
                      if (isReviewMode) {
                        if (isCorrectAnswer && isChosenByStudent) {
                          // Correct answer that was chosen - show in green
                          return 'border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300';
                        } else if (isCorrectAnswer && !isChosenByStudent) {
                          // Correct answer that was not chosen - show in green (lighter)
                          return 'border-green-300 bg-green-25 dark:bg-green-900 text-green-600 dark:text-green-400';
                        } else if (!isCorrectAnswer && isChosenByStudent) {
                          // Wrong answer that was chosen - show in light red background
                          return 'border-red-300 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300';
                        } else {
                          // Unselected wrong answers - show in muted
                          return 'border-muted bg-muted/50';
                        }
                      }
                      return isSelected 
                        ? 'border-primary bg-primary/10 shadow-md' 
                        : 'border-muted hover:border-primary/50 hover:bg-muted/50';
                    };

                    const getLetterStyling = () => {
                      if (isReviewMode) {
                        if (isCorrectAnswer && isChosenByStudent) {
                          // Correct answer that was chosen - green
                          return 'bg-green-500 text-white';
                        } else if (isCorrectAnswer && !isChosenByStudent) {
                          // Correct answer that was not chosen - lighter green
                          return 'bg-green-400 text-white';
                        } else if (!isCorrectAnswer && isChosenByStudent) {
                          // Wrong answer that was chosen - light red
                          return 'bg-red-400 text-white';
                        } else {
                          // Unselected wrong answers - muted
                          return 'bg-muted text-muted-foreground';
                        }
                      }
                      return isSelected 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground';
                    };

                    return (
                      <div
                        key={index}
                        className={`
                          w-full text-left p-4 rounded-lg border-2 transition-all
                          ${getOptionStyling()}
                          ${!isReviewMode ? 'cursor-pointer hover:shadow-sm' : 'cursor-default'}
                        `}
                        onClick={!isReviewMode ? () => handleAnswerSelect(index) : undefined}
                        data-testid={`option-${index}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`
                            flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm
                            ${getLetterStyling()}
                          `}>
                            {optionLetter}
                          </div>
                          <span 
                            className="flex-1 pt-1"
                            dangerouslySetInnerHTML={{ __html: option }}
                          />
                          {isReviewMode && isCorrectAnswer && isChosenByStudent && (
                            <div className="flex items-center gap-1 mt-1">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              <span className="text-xs font-semibold text-green-600">CORRECT</span>
                            </div>
                          )}
                          {isReviewMode && !isCorrectAnswer && isChosenByStudent && (
                            <div className="flex items-center gap-1 mt-1">
                              <XCircle className="h-5 w-5 text-red-500" />
                              <span className="text-xs font-semibold text-red-500">WRONG</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation in Review Mode */}
                {isReviewMode && currentQuestion?.explanation && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Explanation</h4>
                        <div 
                          className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: currentQuestion.explanation }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    data-testid="button-previous"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  {isReviewMode ? (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsReviewMode(false);
                          setShowResults(true);
                        }}
                        data-testid="button-back-to-results"
                      >
                        <Award className="h-4 w-4 mr-2" />
                        Back to Results
                      </Button>
                      {currentQuestionIndex < totalQuestions - 1 && (
                        <Button
                          onClick={handleNext}
                          data-testid="button-next-review"
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  ) : currentQuestionIndex === totalQuestions - 1 ? (
                    <Button
                      onClick={handleSubmit}
                      className="gap-2 bg-gradient-to-r from-primary to-accent"
                      data-testid="button-submit"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Submit Quiz
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      data-testid="button-next"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress will be lost if you exit now. Are you sure you want to leave?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-exit">Continue Quiz</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => setLocation("/dashboard")}
              data-testid="button-confirm-exit"
            >
              Exit Quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
