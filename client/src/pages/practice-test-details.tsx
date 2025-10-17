import { useState, useEffect } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { UserProfile, PurchaseButton } from "@/components/auth-components";
import Navigation from "@/components/Navigation";
import ChatWithMe from "@/components/ChatWithMe";
import Footer from "@/components/Footer";
import { 
  CheckCircle, Star, Award, BookOpen, Clock, Users, ShoppingCart, 
  ArrowLeft, Shield, TrendingUp, Target, Zap, PlayCircle, 
  BarChart, Download, Video, FileText, MessageCircle, Loader2, AlertCircle,
  ChevronLeft, ChevronRight, Maximize2, X
} from "lucide-react";
import { practiceTestsData } from "../../../shared/practice-tests-data";
// Transform API data to match component expectations
const transformApiData = (apiData: any): any => {
  console.log('Transforming API data:', apiData);
  console.log("__________________________")
  
  // Map API fields to component expected fields
  return {
    id: apiData.id || apiData.course_id || apiData.courseId,
    title: apiData.title || apiData.name || apiData.course_title,
    subtitle: apiData.subtitle || apiData.short_description || apiData.course_subtitle,
    fullTitle: apiData.fullTitle || apiData.full_title || apiData.course_name || apiData.title,
    price: apiData.price || apiData.cost || apiData.course_price || 0,
    originalPrice: apiData.originalPrice || apiData.original_price || apiData.retail_price || apiData.price * 1.5,
    offer_message: apiData.offer_message || apiData.offer_message || apiData.offer_message || "Limited Time Offer - Valid until Dec 31, 2024",
    questions: apiData.questions || apiData.total_questions || apiData.question_count || 0,
    flashcards: apiData.flashcards || apiData.flashcard_count || apiData.flashcard_count || 0,
    practiceTests: apiData.practiceTests || apiData.practice_tests || apiData.test_count || 0,
    duration: apiData.duration || apiData.time_limit || apiData.exam_duration || "180 mins per test",
    rating: apiData.rating || apiData.average_rating || apiData.star_rating || 4.5,
    reviews: apiData.review_count || apiData.review_count || apiData.total_reviews || 0,
    difficulty: apiData.difficulty || apiData.level || apiData.course_level || "Associate",
    passingScore: apiData.passingScore || apiData.passing_score || apiData.minimum_score || "720/1000",
    description: apiData.description || apiData.course_description || apiData.overview || "Course description not available",
    status: apiData.status,
    whatYouGet: apiData.whatYouGet || apiData.features || apiData.included_features || apiData.benefits || [
      "Practice tests included",
      "Detailed explanations",
      "Performance tracking",
      "Lifetime access"
    ],
    topics: apiData.domains_details || apiData.domains || [
      { name: "Core Concepts", percentage: 50 },
      { name: "Advanced Topics", percentage: 30 },
      { name: "Practical Applications", percentage: 20 }
    ],
    domains: apiData.domains_details || apiData.domains || apiData.exam_domains || apiData.subject_domains || [],
    sampleQuestions: apiData.sampleQuestions || apiData.sample_questions || apiData.preview_questions || [
      {
        question: "Sample question from the course",
        options: ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
        explanation: "This is a sample explanation for the question."
      }
    ],
    faqs: apiData.faqs || apiData.frequently_asked_questions || apiData.common_questions || [
      {
        question: "What is included in this course?",
        answer: "This course includes practice tests, detailed explanations, and performance tracking."
      }
    ],
    testimonials: apiData.testimonials || apiData.reviews || apiData.student_reviews || apiData.student_feedback || [
      {
        name: "Student",
        role: "Learner",
        rating: 5,
        comment: "Great course with excellent content!"
      }
    ]
  };
};

// API function to fetch course details
const fetchCourseDetails = async (courseId: string): Promise<any> => {
  try {
    console.log('Fetching course details for ID:', courseId);
    const response = await fetch(`https://9s5z6fbk84.execute-api.ap-southeast-6.amazonaws.com/prod/get_course_details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ id: courseId }),
    });
    
    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('API requires authentication. Please check API configuration.');
      }
      if (response.status === 404) {
        throw new Error('Course not found. Please check the course ID.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response data:', data);
    
    // Handle different possible response formats
    let courseData;
    if (data.course) {
      courseData = data.course;
    } else if (data.data) {
      courseData = data.data;
    } else if (data.message) {
      throw new Error(`API Error: ${data.message}`);
    } else {
      courseData = data;
    }
    
    // Transform the API data to match component expectations
    const transformedData = transformApiData(courseData);
    console.log('Transformed data for component:', transformedData);
    return transformedData;
  } catch (error) {
    console.error('Error fetching course details:', error);
    throw error;
  }
};

// Static fallback data in case API fails


const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Associate":
      return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
    case "Professional":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
    case "Specialty":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function PracticeTestDetails() {
  const [, params] = useRoute("/practice-tests/:id");
  const [, setLocation] = useLocation();
  const testId = params?.id || "saa-c03";
  
  // State for API data
  const [test, setTest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApiData, setIsApiData] = useState(false);
  
  // State for gallery
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const galleryImages = [
    "/images/simulator-screenshot-1.png",
    "/images/simulator-screenshot-2.png",
    "/images/simulator-screenshot-3.png"
  ];

  // Fetch course details from API
  useEffect(() => {
    const loadCourseDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Fetching course details for:', testId);
        const data = await fetchCourseDetails(testId);
        console.log('API data received:', data);
        setTest(data);
        setIsApiData(true);
      } catch (err) {
        console.error('Failed to fetch course details:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load course details';
        setError(errorMessage);
        
        // Fallback to static data
        console.log('Using fallback data for:', testId);
        const fallbackTest = practiceTestsData.find(t => t.id === testId) || practiceTestsData.find(t => t.id === "saa-c03") || practiceTestsData[0];
        
        if (!fallbackTest) {
          // No fallback data available, set test to null to show not found message
          setTest(null);
          return;
        }
        
        setTest(fallbackTest);
        setIsApiData(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourseDetails();
  }, [testId, setLocation]);

  // Retry function for failed API calls
  const retryFetch = () => {
    const loadCourseDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchCourseDetails(testId);
        setTest(data);
        setIsApiData(true);
      } catch (err) {
        console.error('Failed to fetch course details:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load course details';
        setError(errorMessage);
        
        const fallbackTest = practiceTestsData.find(t => t.id === testId) || practiceTestsData.find(t => t.id === "saa-c03") || practiceTestsData[0];
        
        if (!fallbackTest) {
          // No fallback data available, set test to null to show not found message
          setTest(null);
          return;
        }
        
        setTest(fallbackTest);
        setIsApiData(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourseDetails();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">Loading Course Details</h2>
          <p className="text-muted-foreground">Fetching the latest course information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !test) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Failed to Load Course Details</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <p className="text-sm text-muted-foreground mb-6">
            Showing fallback data. Please check your connection and try again.
          </p>
          <div className="flex gap-2 justify-center">
            <Button 
              onClick={retryFetch} 
              variant="outline"
            >
              Try Again
            </Button>
            <Button 
              onClick={() => window.location.reload()} 
              variant="default"
            >
              Reload Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  // Gallery functions
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // If no test data available, show not found message
  if (!test.title) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <Navigation scrollToSection={scrollToSection} />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center max-w-2xl mx-auto p-8">
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                <AlertCircle className="h-16 w-16 text-red-500" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Practice Test Not Found
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                The practice test you're looking for doesn't exist or may have been removed. 
                This could be due to an incorrect URL or the test being temporarily unavailable.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What you can do:</h3>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Check the URL</h4>
                    <p className="text-gray-600 text-sm">Make sure the practice test ID in the URL is correct</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Browse Available Tests</h4>
                    <p className="text-gray-600 text-sm">Explore our collection of practice tests</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Contact Support</h4>
                    <p className="text-gray-600 text-sm">Get help from our support team</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 font-semibold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Try Again Later</h4>
                    <p className="text-gray-600 text-sm">The test might be temporarily unavailable</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setLocation('/practice-tests')}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Browse Practice Tests
              </Button>
              <Button 
                onClick={() => setLocation('/')}
                variant="outline"
                className="px-8 py-3 border-2 border-gray-300 hover:border-blue-500 hover:text-blue-500 font-semibold rounded-xl transition-all duration-300"
              >
                Go Home
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <Navigation scrollToSection={scrollToSection} />

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
              
              <Badge className={`${getDifficultyColor(test.difficulty)} mb-4`}>
                {test.difficulty} Level
              </Badge>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                {test.fullTitle}
              </h1>
              <p className="text-xl text-muted-foreground mb-6 text-justify">
                {test.description}
              </p>
              
              {/* API Status Banner */}
              {error && (
                <div className="mb-6">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                      <AlertCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        Using offline data. API connection failed: {error}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              
              {/* Coming Soon Banner */}
              {(test.status === 'coming soon' || test.status === 'coming_soon') && (
                <div className="mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                      <Clock className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        🚀 Coming Soon - This course is currently in development
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              
              <div className="flex flex-wrap gap-6 mb-6">
                {/* <div className="flex items-center text-muted-foreground">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-2" />
                  <span className="font-semibold text-foreground">{test.rating}</span>
                  <span className="ml-1">({test.reviews_count} reviews)</span>
                </div> */}
                <div className="flex items-center text-muted-foreground">
                  <BookOpen className="h-5 w-5 text-primary mr-2" />
                  <span>{test.questions} Questions</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <BookOpen className="h-5 w-5 text-primary mr-2" />
                  <span>{test.flashcards} flashcards</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-5 w-5 text-primary mr-2" />
                  <span>{test.duration}</span>
                </div>
                {/* <div className="flex items-center text-muted-foreground">
                  <Target className="h-5 w-5 text-primary mr-2" />
                  <span>Passing: {test.passingScore}</span>
                </div> */}
              </div>
            </div>

            {/* Pricing Card */}
            <Card className="sticky top-24 border-2 border-primary/20 shadow-xl">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  {/* Course Image */}
                  
                  <div className="flex items-center justify-center gap-3 mb-2">
                    {test.price === 0 ? (
                      <>
                        <span className="text-4xl font-bold text-green-600 dark:text-green-400">Free</span>
                        <span className="text-2xl text-muted-foreground line-through">${test.originalPrice}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-primary">${test.price}</span>
                        <span className="text-2xl text-muted-foreground line-through">${test.originalPrice}</span>
                      </>
                    )}
                  </div>
                  {test.price > 0 && (
                    <Badge className="bg-accent text-accent-foreground">
                      Save ${Math.round(test.originalPrice - test.price)}
                    </Badge>
                  )}
                  {test.price === 0 && (
                    <div className="space-y-2">
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                        🎉 Save ${test.originalPrice} - Completely Free
                      </Badge>
                      <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                        ⏰ ${test.offer_message}
                      </div>
                    </div>
                  )}
                </div>
                {(test.status === 'coming soon' || test.status === 'coming_soon') ? (
                  <Button
                    className="w-full mb-4 py-6 text-lg font-semibold bg-gray-400 text-gray-600 cursor-not-allowed"
                    disabled
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Coming Soon
                  </Button>
                ) : (
                <PurchaseButton
                  testId={test.id}
                  price={test.price}
                  testTitle={test.fullTitle}
                  questions={test.questions}
                  flashcards={test.flashcards}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mb-4 py-6 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                  testIdAttr="button-purchase-main"
                >
                  {test.price === 0 ? (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Enrol for Free
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Purchase Now
                    </>
                  )}
                </PurchaseButton>
                )}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    7-day money-back guarantee
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    1 Year access
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Free updates forever
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-center text-muted-foreground">
                    Instant access after purchase
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-4 h-auto">
              <TabsTrigger value="overview" className="py-3" data-testid="tab-overview">
                <Award className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="content" className="py-3" data-testid="tab-content">
                <BookOpen className="h-4 w-4 mr-2" />
                Content
              </TabsTrigger>
              <TabsTrigger value="samples" className="py-3" data-testid="tab-samples">
                <FileText className="h-4 w-4 mr-2" />
                Sample Questions
              </TabsTrigger>
              <TabsTrigger value="faq" className="py-3" data-testid="tab-faq">
                <MessageCircle className="h-4 w-4 mr-2" />
                FAQ
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-heading flex items-center">
                    <Zap className="h-6 w-6 text-accent mr-3" />
                    What You'll Get
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {test.whatYouGet.map((item: string, index: number) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="text-primary h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold mb-2">Realistic Questions</h3>
                    <p className="text-muted-foreground">
                      Questions designed to match the actual exam format and difficulty
                    </p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart className="text-accent h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold mb-2">Track Progress</h3>
                    <p className="text-muted-foreground">
                      Detailed analytics to identify strengths and areas for improvement
                    </p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="p-6">
                    <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="text-green-600 dark:text-green-300 h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold mb-2">Pass Guaranteed</h3>
                    <p className="text-muted-foreground">
                      30-day money-back guarantee if you're not satisfied
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-heading">Exam Topics Coverage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {test.domains && test.domains.length > 0 ? (
                      test.domains.map((domain: any, index: number) => (
                        <div key={index}>
                          <div className="flex justify-between mb-2">
                            <span className="font-semibold">{domain.name || domain}</span>
                            <span className="text-muted-foreground">{domain.weight || 0}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-3">
                            <div 
                              className="bg-primary h-3 rounded-full transition-all duration-500"
                              style={{ width: `100%` }}
                            ></div>
                          </div>
                        </div>
                      ))
                    ) : (
                      test.topics.map((topic: any, index: number) => (
                        <div key={index}>
                          <div className="flex justify-between mb-2">
                            <span className="font-semibold">{topic.name}</span>
                            <span className="text-muted-foreground">{topic.weight}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-3">
                            <div 
                              className="bg-primary h-3 rounded-full transition-all duration-500"
                              style={{ width: `${topic.weight}%` }}
                            ></div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-heading">Practice Test Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start">
                      <PlayCircle className="h-6 w-6 text-primary mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">Timed Mode</h4>
                        <p className="text-sm text-muted-foreground">Simulate real exam conditions with countdown timer</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <BookOpen className="h-6 w-6 text-primary mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">Study Mode</h4>
                        <p className="text-sm text-muted-foreground">Review questions at your own pace with instant feedback</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <BarChart className="h-6 w-6 text-primary mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">Performance Analytics</h4>
                        <p className="text-sm text-muted-foreground">Track your progress with detailed statistics</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Download className="h-6 w-6 text-primary mr-3 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">Downloadable Resources</h4>
                        <p className="text-sm text-muted-foreground">Study guides and cheat sheets included</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sample Questions Tab */}
            <TabsContent value="samples" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-heading flex items-center">
                    <FileText className="h-6 w-6 text-primary mr-3" />
                    Sample Questions
                  </CardTitle>
                  <p className="text-muted-foreground">Get a preview of the question quality and format</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {(test.sampleQuestions && test.sampleQuestions.length > 0) ? (
                      test.sampleQuestions.map((q: any, index: number) => (
                        <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 bg-slate-50/50 dark:bg-slate-800/50">
                          <div className="flex items-center gap-3 mb-4">
                            <Badge className="bg-primary text-primary-foreground">Question {index + 1}</Badge>
                            <Badge variant="outline">{q.difficulty || 'Medium'}</Badge>
                            <Badge variant="outline">{q.domain || 'General'}</Badge>
                          </div>
                          
                          <div className="mb-6">
                            <h4 className="text-lg font-semibold text-foreground mb-4 leading-relaxed">
                              <div dangerouslySetInnerHTML={{ __html: q.question }} />
                            </h4>
                            
                            <div className="space-y-3 mb-6">
                              {q.options.map((opt: string, i: number) => {
                                const isCorrect = q.correctAnswer && q.correctAnswer.includes(i + 1);
                                return (
                                  <div 
                                    key={i} 
                                    className={`p-4 rounded-lg border transition-colors ${
                                      isCorrect 
                                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                                    }`}
                                  >
                                    <div className="flex items-start gap-3">
                                      <span className={`font-semibold text-sm ${
                                        isCorrect 
                                          ? 'text-green-700 dark:text-green-300' 
                                          : 'text-slate-600 dark:text-slate-400'
                                      }`}>
                                        {String.fromCharCode(65 + i)}.
                                      </span>
                                      <div 
                                        className={`flex-1 ${
                                          isCorrect 
                                            ? 'text-green-800 dark:text-green-200' 
                                            : 'text-slate-700 dark:text-slate-300'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: opt }}
                                      />
                                      {isCorrect && (
                                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          
                          {q.explanation && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <BookOpen className="h-4 w-4 text-blue-600" />
                                <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">Explanation:</p>
                              </div>
                              <div 
                                className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: q.explanation }}
                              />
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Sample Questions Coming Soon</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                          We're preparing high-quality sample questions to give you a preview of our practice tests.
                        </p>
                        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-6 max-w-md mx-auto">
                          <h4 className="font-semibold text-foreground mb-2">What to expect:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1 text-left">
                            <li>• Realistic exam-style questions</li>
                            <li>• Detailed explanations for each answer</li>
                            <li>• Multiple difficulty levels</li>
                            <li>• Domain-specific content coverage</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-heading flex items-center">
                    <MessageCircle className="h-6 w-6 text-primary mr-3" />
                    Frequently Asked Questions
                  </CardTitle>
                  <p className="text-muted-foreground">Find answers to common questions about this practice test</p>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {/* Always show default FAQs for now */}
                    {[
                        {
                          question: "How many questions are in this practice test?",
                          answer: `This practice test contains ${test.questions || '65'} questions, designed to simulate the actual exam experience. Each question is carefully crafted to match the difficulty and format of the real certification exam.`
                        },
                        {
                          question: "What's the passing score for the actual exam?",
                          answer: `The passing score for the actual certification exam is typically ${test.passingScore || '720 out of 1000'} points. Our practice tests help you gauge your readiness and identify areas that need more study.`
                        },
                        {
                          question: "How long does the practice test take?",
                          answer: `The practice test is designed to be completed in approximately ${test.duration || '65 minutes'}, matching the time constraints of the actual exam. You can pause and resume at any time during your practice session.`
                        },
                        {
                          question: "Can I retake the practice test?",
                          answer: "Yes! You have unlimited access to retake the practice tests as many times as you need. Each attempt helps you improve your understanding and track your progress over time."
                        },
                        {
                          question: "What topics are covered in this practice test?",
                          answer: `This practice test covers all the key domains and topics outlined in the official exam guide. The questions are distributed across different areas to ensure comprehensive coverage of the ${test.difficulty || 'Associate'} level curriculum.`
                        },
                        {
                          question: "Do I get explanations for the answers?",
                          answer: "Yes! Each question includes detailed explanations that help you understand not just the correct answer, but also why other options are incorrect. This learning approach helps reinforce your knowledge."
                        },
                        {
                          question: "Is this practice test updated regularly?",
                          answer: "Absolutely! We regularly update our practice tests to reflect the latest exam changes, new services, and current best practices. You'll always have access to the most current content."
                        },
                        {
                          question: "What if I'm not satisfied with the practice test?",
                          answer: "We offer a 30-day money-back guarantee. If you're not completely satisfied with the quality of our practice tests, you can request a full refund within 30 days of purchase."
                        }
                      ].map((faq: any, index: number) => (
                        <AccordionItem key={index} value={`default-item-${index}`}>
                          <AccordionTrigger className="text-left hover:no-underline">
                            <span className="font-medium">{faq.question}</span>
                        </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground pt-2">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                      ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Simulator Gallery Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Practice Test Simulator
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience our realistic exam simulator with the same interface and functionality as the actual AWS exam
            </p>
          </div>

          {/* Gallery Container */}
          <div className="relative max-w-5xl mx-auto">
            {/* Main Image Display */}
            <div className="relative bg-gray-100 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={galleryImages[currentImageIndex]}
                alt={`Simulator Screenshot ${currentImageIndex + 1}`}
                className="w-full h-auto max-h-[600px] object-contain"
              />
              
              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Fullscreen Button */}
              <button
                onClick={openFullscreen}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
                aria-label="View fullscreen"
              >
                <Maximize2 className="h-5 w-5" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {galleryImages.length}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex justify-center gap-4 mt-8">
              {galleryImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
                    index === currentImageIndex
                      ? 'ring-4 ring-blue-500 scale-110'
                      : 'hover:scale-105 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-20 h-16 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">
            
            Ready to Pass Your {test.fullTitle} Exam?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of successful candidates who used our practice tests
          </p>
          <PurchaseButton
          testId={test.id}
          price={test.price}
          testTitle={test.fullTitle}
          questions={test.questions}
          flashcards={test.flashcards}
            className={`px-8 py-6 text-lg font-semibold transition-all duration-300 ${
              (test.status === 'coming soon' || test.status === 'coming_soon')
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-accent hover:bg-accent/90 text-accent-foreground transform hover:scale-105'
            }`}
            data-testid="button-purchase-bottom"
          >
            {test.status === 'coming soon' || test.status === 'coming_soon' ? (
              <>
                <Clock className="mr-2 h-5 w-5" />
                Coming Soon
              </>
            ) : test.price === 0 ? (
              <>
                <CheckCircle className="mr-2 h-5 w-5" />
                Enrol for Free
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Get Started Now - ${test.price}
              </>
            )}
          </PurchaseButton>

          
        </div>
      </section>

      {/* Footer */}
      <Footer scrollToSection={scrollToSection} />

      {/* Chat with Me Button */}
      <ChatWithMe 
        showOnScroll={true}
        scrollThreshold={300}
        position="bottom-right"
      />

      {/* Fullscreen Gallery Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 z-10 transition-all duration-300"
              aria-label="Close fullscreen"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-4 z-10 transition-all duration-300"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-4 z-10 transition-all duration-300"
              aria-label="Next image"
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            {/* Fullscreen Image */}
            <img
              src={galleryImages[currentImageIndex]}
              alt={`Simulator Screenshot ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-lg">
              {currentImageIndex + 1} / {galleryImages.length}
            </div>

            {/* Thumbnail Navigation */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-3">
              {galleryImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
                    index === currentImageIndex
                      ? 'ring-4 ring-white scale-110'
                      : 'hover:scale-105 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-16 h-12 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}