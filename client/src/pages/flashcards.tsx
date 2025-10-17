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
  ArrowRight,
  RotateCcw,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Shuffle,
  BookOpen,
  Target,
  Clock,
  Star,
  TrendingUp,
  RefreshCw,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Loader2
} from "lucide-react";
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

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  explanation?: string;
}

interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  totalCards: number;
  category: string;
  difficulty: string;
  flashcards: Flashcard[];
}

// Helper function to transform API response to our flashcard format
const transformApiResponse = (apiData: any, testId: string): FlashcardSet => {
  // Handle the nested structure where testId is a key in the response
  console.log("AA")
  console.log(apiData)
  let flashcardData = null;
  
  if (apiData && typeof apiData === 'object') {
    // Check if the response has the testId as a key
    if (apiData['response']) {
      flashcardData = apiData['response'];
    } else if (apiData.flashcards) {
      // Fallback: check if flashcards are directly in the response
      flashcardData = apiData;
    } else if (Array.isArray(apiData)) {
      // Fallback: if it's an array, treat it as flashcards
      flashcardData = {
        flashcards: apiData,
        title: "Practice Flashcards",
        description: "Interactive flashcards for exam preparation",
        totalCards: apiData.length,
        category: "AWS",
        difficulty: "Associate"
      };
    }
  }

  if (!flashcardData || !flashcardData.flashcards || !Array.isArray(flashcardData.flashcards)) {
    return {
      id: testId || "unknown",
      title: "Flashcards",
      description: "Practice flashcards for your exam",
      totalCards: 0,
      category: "AWS",
      difficulty: "Associate",
      flashcards: []
    };
  }

  const flashcards: Flashcard[] = flashcardData.flashcards.map((item: any, index: number) => ({
    id: item.id || `card-${index}`,
    front: item.front || item.question || "Question not available",
    back: item.back || item.answer || "Answer not available",
    category: item.category || item.domain || "General",
    difficulty: item.difficulty || "Medium",
    tags: item.tags || [],
    explanation: item.explanation || ""
  }));

  return {
    id: flashcardData.id || testId || "api-flashcards",
    title: flashcardData.title || "Practice Flashcards",
    description: flashcardData.description || "Interactive flashcards for exam preparation",
    totalCards: flashcards.length,
    category: flashcardData.category || "AWS",
    difficulty: flashcardData.difficulty || "Associate",
    flashcards
  };
};

export default function Flashcards() {
  const [, params] = useRoute("/dashboard/flashcards/:testId");
  const testId = params?.testId;
  const { user } = useAuth0Safe();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState<"review" | "quiz">("review");
  const [shuffled, setShuffled] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState<Set<string>>(new Set());
  const [incorrectAnswers, setIncorrectAnswers] = useState<Set<string>>(new Set());
  const [showExplanation, setShowExplanation] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoPlayInterval, setAutoPlayInterval] = useState<NodeJS.Timeout | null>(null);
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const currentCard = flashcardSet?.flashcards[currentCardIndex];

  // Fetch flashcards from API
  useEffect(() => {
    const fetchFlashcards = async () => {
      if (!testId || !user?.sub) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          "https://9s5z6fbk84.execute-api.ap-southeast-6.amazonaws.com/prod/generate_flashcards",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              practice_test_id: testId,
              user_id: user.sub,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Flashcards API response:", data);

        // Transform the API response to our format
        const transformedData = transformApiResponse(data, testId);
        setFlashcardSet(transformedData);
        console.log("__________________________")
        console.log(transformedData)
        if (transformedData.flashcards.length === 0) {
          setError("No flashcards available for this exam.");
        }
      } catch (err) {
        console.error("Error fetching flashcards:", err);
        setError(err instanceof Error ? err.message : "Failed to load flashcards");
        toast({
          title: "Error Loading Flashcards",
          description: "Unable to load flashcards. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [testId, user?.sub, toast]);

  useEffect(() => {
    if (autoPlay && flashcardSet) {
      const interval = setInterval(() => {
        setCurrentCardIndex((prev) => (prev + 1) % flashcardSet.flashcards.length);
        setIsFlipped(false);
        setShowExplanation(false);
      }, 5000);
      setAutoPlayInterval(interval);
      return () => clearInterval(interval);
    } else if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      setAutoPlayInterval(null);
    }
  }, [autoPlay, flashcardSet]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Loading Flashcards...</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Please wait while we prepare your flashcards.</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !flashcardSet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              {error ? "Error Loading Flashcards" : "Flashcard Set Not Found"}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {error || "The requested flashcard set could not be found."}
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

  const handleNext = () => {
    if (currentCardIndex < flashcardSet.flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
      setShowExplanation(false);
    }
  };

  const handleShuffle = () => {
    setShuffled(!shuffled);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setShowExplanation(false);
    toast({
      title: shuffled ? "Cards Unshuffled" : "Cards Shuffled",
      description: shuffled ? "Cards are now in original order" : "Cards are now in random order",
    });
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleCorrect = () => {
    if (currentCard) {
      setCorrectAnswers(prev => new Set(Array.from(prev).concat(currentCard.id)));
      setIncorrectAnswers(prev => {
        const newSet = new Set(Array.from(prev));
        newSet.delete(currentCard.id);
        return newSet;
      });
      toast({
        title: "Marked as Correct",
        description: "Great job! This card is marked as correct.",
      });
    }
  };

  const handleIncorrect = () => {
    if (currentCard) {
      setIncorrectAnswers(prev => new Set(Array.from(prev).concat(currentCard.id)));
      setCorrectAnswers(prev => {
        const newSet = new Set(Array.from(prev));
        newSet.delete(currentCard.id);
        return newSet;
      });
      toast({
        title: "Marked as Incorrect",
        description: "This card needs more review.",
      });
    }
  };

  const handleReset = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setShowExplanation(false);
    setCorrectAnswers(new Set());
    setIncorrectAnswers(new Set());
    setShuffled(false);
    setAutoPlay(false);
    toast({
      title: "Progress Reset",
      description: "All progress has been reset.",
    });
  };

  const progress = ((currentCardIndex + 1) / flashcardSet.flashcards.length) * 100;
  const isCorrect = currentCard ? correctAnswers.has(currentCard.id) : false;
  const isIncorrect = currentCard ? incorrectAnswers.has(currentCard.id) : false;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{flashcardSet.title}</h1>
              <p className="text-xl text-slate-600 dark:text-slate-400">{flashcardSet.description}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Card {currentCardIndex + 1} of {flashcardSet.flashcards.length}
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Controls */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Study Controls
              </h3>
              
              <div className="space-y-4">
                {/* Study Mode */}
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Study Mode
                  </label>
                  <div className="flex gap-2">
                    <Button
                      variant={studyMode === "review" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStudyMode("review")}
                      className="flex-1"
                    >
                      Review
                    </Button>
                    <Button
                      variant={studyMode === "quiz" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStudyMode("quiz")}
                      className="flex-1"
                    >
                      Quiz
                    </Button>
                  </div>
                </div>

                {/* Auto Play */}
                <div>
                  <Button
                    variant={autoPlay ? "default" : "outline"}
                    onClick={() => setAutoPlay(!autoPlay)}
                    className="w-full gap-2"
                  >
                    {autoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {autoPlay ? "Pause Auto" : "Auto Play"}
                  </Button>
                </div>

                {/* Shuffle */}
                <div>
                  <Button
                    variant={shuffled ? "default" : "outline"}
                    onClick={handleShuffle}
                    className="w-full gap-2"
                  >
                    <Shuffle className="h-4 w-4" />
                    {shuffled ? "Unshuffle" : "Shuffle"}
                  </Button>
                </div>

                {/* Reset */}
                <div>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="w-full gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reset Progress
                  </Button>
                </div>
              </div>
            </Card>

            {/* Stats */}
            <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Progress Stats
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Correct</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {correctAnswers.size}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Incorrect</span>
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    {incorrectAnswers.size}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Remaining</span>
                  <Badge variant="outline">
                    {flashcardSet.flashcards.length - correctAnswers.size - incorrectAnswers.size}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content - Flashcard */}
          <div className="lg:col-span-3">
            {currentCard && (
              <Card className="border-0 shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                <CardContent className="p-8">
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Badge className={getDifficultyColor(currentCard.difficulty)}>
                        {currentCard.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        {currentCard.category}
                      </Badge>
                      {isCorrect && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Correct
                        </Badge>
                      )}
                      {isIncorrect && (
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          <XCircle className="h-3 w-3 mr-1" />
                          Incorrect
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleFlip}
                      className="gap-2"
                    >
                      {isFlipped ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {isFlipped ? "Show Front" : "Show Answer"}
                    </Button>
                  </div>

                  {/* Card Content */}
                  <div className="min-h-[300px] flex items-center justify-center">
                    <div className="text-center max-w-4xl">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                        {isFlipped ? "Answer" : "Question"}
                      </h2>
                      <div
                        className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed"
                        dangerouslySetInnerHTML={{
                            __html: isFlipped ? currentCard.back : currentCard.front,
                        }}
                        />
                      
                      {isFlipped && currentCard.explanation && (
                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg border border-blue-200 dark:border-blue-800">
                          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Explanation:</h3>
                          <p className="text-sm text-blue-800 dark:text-blue-200">{currentCard.explanation}</p>
                        </div>
                      )}

                      {isFlipped && (
                        <div className="mt-6 flex flex-wrap gap-2 justify-center">
                          {currentCard.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Actions */}
                  {isFlipped && studyMode === "quiz" && (
                    <div className="flex gap-4 justify-center mt-6">
                      <Button
                        variant="outline"
                        onClick={handleIncorrect}
                        className="gap-2 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/50"
                      >
                        <XCircle className="h-4 w-4" />
                        Incorrect
                      </Button>
                      <Button
                        onClick={handleCorrect}
                        className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Correct
                      </Button>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentCardIndex === 0}
                      className="gap-2"
                    >
                      <SkipBack className="h-4 w-4" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentCardIndex(0)}
                        disabled={currentCardIndex === 0}
                      >
                        First
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentCardIndex(flashcardSet.flashcards.length - 1)}
                        disabled={currentCardIndex === flashcardSet.flashcards.length - 1}
                      >
                        Last
                      </Button>
                    </div>

                    <Button
                      variant="outline"
                      onClick={handleNext}
                      disabled={currentCardIndex === flashcardSet.flashcards.length - 1}
                      className="gap-2"
                    >
                      Next
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
