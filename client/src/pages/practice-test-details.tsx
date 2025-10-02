import { useState } from "react";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { UserProfile } from "@/components/auth-components";
import { 
  CheckCircle, Star, Award, BookOpen, Clock, Users, ShoppingCart, 
  ArrowLeft, Shield, TrendingUp, Target, Zap, PlayCircle, 
  BarChart, Download, Video, FileText, MessageCircle
} from "lucide-react";

const practiceTestsData: { [key: string]: any } = {
  "saa-c03": {
    id: "saa-c03",
    title: "AWS Certified Solutions Architect",
    subtitle: "Associate (SAA-C03)",
    fullTitle: "AWS Certified Solutions Architect - Associate",
    price: 49,
    originalPrice: 79,
    questions: 390,
    practiceTests: 6,
    duration: "65 mins per test",
    rating: 4.8,
    reviews: 1250,
    difficulty: "Associate",
    passingScore: "720/1000",
    description: "Master the AWS Solutions Architect Associate certification with our comprehensive practice test package. Designed to mirror the actual exam experience with realistic questions and detailed explanations.",
    whatYouGet: [
      "6 full-length practice tests (390 total questions)",
      "Detailed explanations for every question",
      "Performance tracking and analytics dashboard",
      "Mobile-friendly access on any device",
      "Lifetime access to all updates",
      "Timed and practice modes",
      "Bookmark difficult questions",
      "Downloadable study notes"
    ],
    topics: [
      { name: "Design Resilient Architectures", percentage: 30 },
      { name: "Design High-Performing Architectures", percentage: 28 },
      { name: "Design Secure Applications", percentage: 24 },
      { name: "Design Cost-Optimized Architectures", percentage: 18 }
    ],
    sampleQuestions: [
      {
        question: "A company needs to store frequently accessed data with high durability. Which AWS service combination provides the best solution?",
        options: ["A) S3 Standard + CloudFront", "B) EBS + EC2", "C) Glacier + Lambda", "D) DynamoDB + ElastiCache"],
        explanation: "S3 Standard offers 99.999999999% durability and CloudFront provides low-latency access globally."
      },
      {
        question: "What is the most cost-effective way to run a batch processing job that can be interrupted?",
        options: ["A) On-Demand Instances", "B) Spot Instances", "C) Reserved Instances", "D) Dedicated Hosts"],
        explanation: "Spot Instances offer up to 90% discount and are perfect for flexible, interruptible workloads."
      }
    ],
    faqs: [
      {
        question: "How similar are these questions to the actual exam?",
        answer: "Our questions are carefully crafted to match the difficulty and format of the real AWS SAA-C03 exam. They're based on the official exam guide and real-world scenarios."
      },
      {
        question: "Can I retake the practice tests?",
        answer: "Yes! You have unlimited attempts on all practice tests. We recommend retaking them until you consistently score above 80%."
      },
      {
        question: "Do you offer a money-back guarantee?",
        answer: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with the practice tests."
      },
      {
        question: "How long do I have access?",
        answer: "You get lifetime access to all practice tests and any future updates at no additional cost."
      }
    ],
    testimonials: [
      {
        name: "Sarah Johnson",
        role: "Cloud Engineer",
        rating: 5,
        comment: "These practice tests were instrumental in passing my SAA-C03 exam on the first try! The explanations are thorough and helped me understand the concepts deeply."
      },
      {
        name: "Michael Chen",
        role: "DevOps Engineer",
        rating: 5,
        comment: "Best investment I made for my certification prep. The questions are very similar to the actual exam. Highly recommended!"
      },
      {
        name: "Emily Rodriguez",
        role: "Solutions Architect",
        rating: 5,
        comment: "The performance tracking helped me identify my weak areas. Passed with 890/1000 thanks to these tests!"
      }
    ]
  },
  "sap-c02": {
    id: "sap-c02",
    title: "AWS Certified Solutions Architect",
    subtitle: "Professional (SAP-C02)",
    fullTitle: "AWS Certified Solutions Architect - Professional",
    price: 69,
    originalPrice: 99,
    questions: 450,
    practiceTests: 6,
    duration: "75 mins per test",
    rating: 4.9,
    reviews: 890,
    difficulty: "Professional",
    passingScore: "750/1000",
    description: "Advance your AWS career with our Professional-level practice tests. Tackle complex scenarios and multi-tier architectures that reflect real enterprise challenges.",
    whatYouGet: [
      "6 full-length professional practice tests",
      "450 advanced scenario-based questions",
      "In-depth architectural explanations",
      "Case study questions included",
      "Exam strategies and tips",
      "Priority email support",
      "Performance analytics dashboard",
      "Lifetime access with updates"
    ],
    topics: [
      { name: "Design Solutions for Organizational Complexity", percentage: 26 },
      { name: "Design for New Solutions", percentage: 29 },
      { name: "Continuous Improvement for Existing Solutions", percentage: 25 },
      { name: "Accelerate Workload Migration and Modernization", percentage: 20 }
    ],
    sampleQuestions: [
      {
        question: "A global company needs to migrate a 500TB database with minimal downtime. Which migration strategy is most appropriate?",
        options: ["A) AWS DMS with CDC", "B) Snowball Edge", "C) Direct Connect + DMS", "D) S3 Transfer Acceleration"],
        explanation: "AWS DMS with Change Data Capture allows continuous replication with minimal downtime for large databases."
      }
    ],
    faqs: [
      {
        question: "What's the difference between Associate and Professional level?",
        answer: "Professional-level questions are more complex, involving multi-account strategies, hybrid architectures, and enterprise-scale design patterns."
      },
      {
        question: "Should I have work experience before taking this?",
        answer: "AWS recommends 2+ years of hands-on experience. Our practice tests help bridge the gap between theory and practice."
      }
    ],
    testimonials: [
      {
        name: "David Martinez",
        role: "Senior Solutions Architect",
        rating: 5,
        comment: "The complexity of these questions prepared me perfectly for the SAP-C02 exam. Worth every penny!"
      }
    ]
  },
  "dva-c02": {
    id: "dva-c02",
    title: "AWS Certified Developer",
    subtitle: "Associate (DVA-C02)",
    fullTitle: "AWS Certified Developer - Associate",
    price: 45,
    originalPrice: 69,
    questions: 325,
    practiceTests: 5,
    duration: "65 mins per test",
    rating: 4.7,
    reviews: 1100,
    difficulty: "Associate",
    passingScore: "720/1000",
    description: "Perfect your AWS development skills with practice tests covering Lambda, API Gateway, DynamoDB, and more. Includes code-based questions!",
    whatYouGet: [
      "5 full-length developer practice tests",
      "325 code-focused questions",
      "Video explanations for complex topics",
      "SDK and CLI question coverage",
      "Serverless architecture scenarios",
      "CI/CD pipeline questions",
      "Practice and timed modes",
      "Mobile app access"
    ],
    topics: [
      { name: "Development with AWS Services", percentage: 32 },
      { name: "Security", percentage: 26 },
      { name: "Deployment", percentage: 24 },
      { name: "Troubleshooting and Optimization", percentage: 18 }
    ],
    sampleQuestions: [
      {
        question: "Which SDK method should you use to implement exponential backoff for DynamoDB throttling?",
        options: ["A) Custom retry logic", "B) Built-in SDK retry", "C) Lambda retry", "D) SQS DLQ"],
        explanation: "AWS SDKs have built-in exponential backoff for retrying throttled requests automatically."
      }
    ],
    faqs: [
      {
        question: "Do I need to know programming?",
        answer: "Yes, the DVA-C02 exam includes code-based questions. Familiarity with at least one programming language (Python, JavaScript, or Java) is essential."
      }
    ],
    testimonials: [
      {
        name: "Alex Thompson",
        role: "Full Stack Developer",
        rating: 5,
        comment: "The code examples and SDK questions were spot-on. Passed with 850!"
      }
    ]
  }
};

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
  const test = practiceTestsData[testId] || practiceTestsData["saa-c03"];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-card/95 backdrop-blur-md border-b border-border shadow-lg z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-heading font-bold text-primary">AWS Expert Training</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/practice-tests">
                <Button variant="ghost" className="flex items-center gap-2" data-testid="button-back-tests">
                  <ArrowLeft className="h-4 w-4" />
                  All Tests
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" data-testid="button-home">
                  Home
                </Button>
              </Link>
              <UserProfile />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
              <Link href="/practice-tests">
                <Button variant="ghost" size="sm" className="mb-4 -ml-2">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to all tests
                </Button>
              </Link>
              <Badge className={`${getDifficultyColor(test.difficulty)} mb-4`}>
                {test.difficulty} Level
              </Badge>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                {test.fullTitle}
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                {test.description}
              </p>
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center text-muted-foreground">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-2" />
                  <span className="font-semibold text-foreground">{test.rating}</span>
                  <span className="ml-1">({test.reviews} reviews)</span>
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
                <Button 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mb-4 py-6 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                  data-testid="button-purchase-main"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Purchase Now
                </Button>
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
                    <span className="text-muted-foreground">Based on {test.reviews} reviews</span>
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
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            data-testid="button-purchase-bottom"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Get Started Now - ${test.price}
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
