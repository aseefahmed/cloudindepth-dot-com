import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { UserProfile, PurchaseButton } from "@/components/auth-components";
import Navigation from "@/components/Navigation";
import { 
  CheckCircle, Star, Award, BookOpen, Clock, Users, ShoppingCart, 
  ArrowLeft, Shield, TrendingUp, Target, Zap, PlayCircle, 
  BarChart, Download, Video, FileText, MessageCircle, Loader2, AlertCircle
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
    questions: apiData.questions || apiData.total_questions || apiData.question_count || 0,
    practiceTests: apiData.practiceTests || apiData.practice_tests || apiData.test_count || 0,
    duration: apiData.duration || apiData.time_limit || apiData.exam_duration || "65 mins per test",
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
    topics: apiData.topics || apiData.course_topics || apiData.subject_areas || [
      { name: "Core Concepts", percentage: 50 },
      { name: "Advanced Topics", percentage: 30 },
      { name: "Practical Applications", percentage: 20 }
    ],
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
    testimonials: apiData.testimonials || apiData.review_count || apiData.student_feedback || [
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
  const testId = params?.id || "saa-c03";
  
  // State for API data
  const [test, setTest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApiData, setIsApiData] = useState(false);

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
        setTest(practiceTestsData.find(t => t.id === testId) || practiceTestsData.find(t => t.id === "saa-c03") || practiceTestsData[0]);
        setIsApiData(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourseDetails();
  }, [testId]);

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
        setTest(practiceTestsData.find(t => t.id === testId) || practiceTestsData.find(t => t.id === "saa-c03") || practiceTestsData[0]);
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

  // If no test data available, show error
  if (!test) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested course could not be found.</p>
          <Button onClick={() => window.history.back()}>
            Go Back
          </Button>
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
              <p className="text-xl text-muted-foreground mb-6">
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
              
              {/* API Success Banner */}
              {isApiData && !error && (
                <div className="mb-6">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        ✓ Live data loaded from APIaseef
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
              
              {/* Debug info - remove in production */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-4 p-2 bg-gray-100 text-xs">
                  Debug: Status = "{test.status}" (type: {typeof test.status})
                </div>
              )}
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center text-muted-foreground">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-2" />
                  <span className="font-semibold text-foreground">{test.rating}</span>
                  <span className="ml-1">({test.reviews_count} reviews)</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <BookOpen className="h-5 w-5 text-primary mr-2" />
                  <span>{test.questions} Questions</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-5 w-5 text-primary mr-2" />
                  <span>{test.duration}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Target className="h-5 w-5 text-primary mr-2" />
                  <span>Passing: {test.passingScore}</span>
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <Card className="sticky top-24 border-2 border-primary/20 shadow-xl">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-4xl font-bold text-primary">${test.price}</span>
                    <span className="text-2xl text-muted-foreground line-through">${test.originalPrice}</span>
                  </div>
                  <Badge className="bg-accent text-accent-foreground">
                    Save ${test.originalPrice - test.price}
                  </Badge>
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
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mb-4 py-6 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                  testIdAttr="button-purchase-main"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Purchase Now asee
                </PurchaseButton>
                )}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    30-day money-back guarantee
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Lifetime access to all tests
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
                Samples
              </TabsTrigger>
              <TabsTrigger value="reviews" className="py-3" data-testid="tab-reviews">
                <MessageCircle className="h-4 w-4 mr-2" />
                Reviews
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-heading flex items-center">
                    <Zap className="h-6 w-6 text-accent mr-3" />
                    What You'll Get11
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
                    {test.topics.map((topic: any, index: number) => (
                      <div key={index}>
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold">{topic.name}</span>
                          <span className="text-muted-foreground">{topic.percentage}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div 
                            className="bg-primary h-3 rounded-full transition-all duration-500"
                            style={{ width: `${topic.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
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
                  <CardTitle className="text-2xl font-heading">Sample Questions</CardTitle>
                  <p className="text-muted-foreground">Get a preview of the question quality and format</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {test.sampleQuestions?.map((q: any, index: number) => (
                      <div key={index} className="border-l-4 border-primary pl-6">
                        <h4 className="font-semibold mb-4">Question {index + 1}:</h4>
                        <p className="mb-4">{q.question}</p>
                        <div className="space-y-2 mb-4">
                          {q.options.map((opt: string, i: number) => (
                            <div key={i} className="bg-muted/50 p-3 rounded-lg">
                              {opt}
                            </div>
                          ))}
                        </div>
                        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                          <p className="text-sm font-semibold text-primary mb-2">Explanation:</p>
                          <p className="text-sm">{q.explanation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-heading">Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {test.faqs?.map((faq: any, index: number) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-heading">Student Reviews</CardTitle>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center">
                      <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                      <span className="text-3xl font-bold ml-2">{test.rating}</span>
                    </div>
                    <span className="text-muted-foreground">Based on {test.reviews_count} reviews</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {test.testimonials?.map((review: any, index: number) => (
                      <Card key={index} className="bg-muted/30">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="font-semibold">{review.name}</h4>
                              <p className="text-sm text-muted-foreground">{review.role}</p>
                            </div>
                            <div className="flex">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              ))}
                            </div>
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
          <Button 
            className={`px-8 py-6 text-lg font-semibold transition-all duration-300 ${
              (test.status === 'coming soon' || test.status === 'coming_soon')
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-accent hover:bg-accent/90 text-accent-foreground transform hover:scale-105'
            }`}
            data-testid="button-purchase-bottom"
            disabled={test.status === 'coming soon' || test.status === 'coming_soon'}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {(test.status === 'coming soon' || test.status === 'coming_soon') ? 'Coming Soon' : `Get Started Now - $${test.price}`}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-background/60">&copy; 2024 AWS Expert Training by Aseef Ahmed. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}