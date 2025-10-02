import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "wouter";
import { UserProfile, PurchaseButton } from "@/components/auth-components";
import { 
  CheckCircle, 
  Star, 
  Award, 
  BookOpen, 
  Clock, 
  Users, 
  ShoppingCart, 
  ArrowLeft,
  Filter,
  X,
  Sparkles,
  TrendingUp
} from "lucide-react";

interface PracticeTest {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  questions: number;
  duration: string;
  rating: number;
  reviews: number;
  difficulty: "Associate" | "Professional" | "Specialty";
  features: string[];
  popular?: boolean;
}

const practiceTests: PracticeTest[] = [
  {
    id: "saa-c03",
    title: "AWS Certified Solutions Architect",
    subtitle: "Associate (SAA-C03)",
    price: 49,
    questions: 390,
    duration: "65 mins per test",
    rating: 4.8,
    reviews: 1250,
    difficulty: "Associate",
    features: [
      "6 full-length practice tests",
      "Detailed explanations for all answers",
      "Performance tracking dashboard",
      "Mobile-friendly interface"
    ],
    popular: true
  },
  {
    id: "sap-c02",
    title: "AWS Certified Solutions Architect",
    subtitle: "Professional (SAP-C02)",
    price: 69,
    questions: 450,
    duration: "75 mins per test",
    rating: 4.9,
    reviews: 890,
    difficulty: "Professional",
    features: [
      "6 full-length practice tests",
      "Advanced scenario-based questions",
      "Exam tips and strategies",
      "Lifetime access to updates"
    ]
  },
  {
    id: "dva-c02",
    title: "AWS Certified Developer",
    subtitle: "Associate (DVA-C02)",
    price: 45,
    questions: 325,
    duration: "65 mins per test",
    rating: 4.7,
    reviews: 1100,
    difficulty: "Associate",
    features: [
      "5 full-length practice tests",
      "Code-based questions included",
      "Video explanations available",
      "Practice mode & timed mode"
    ]
  },
  {
    id: "soa-c02",
    title: "AWS Certified SysOps Administrator",
    subtitle: "Associate (SOA-C02)",
    price: 45,
    questions: 300,
    duration: "65 mins per test",
    rating: 4.6,
    reviews: 780,
    difficulty: "Associate",
    features: [
      "5 full-length practice tests",
      "Hands-on lab scenarios",
      "Performance analytics",
      "Study mode available"
    ]
  },
  {
    id: "dop-c02",
    title: "AWS Certified DevOps Engineer",
    subtitle: "Professional (DOP-C02)",
    price: 69,
    questions: 425,
    duration: "75 mins per test",
    rating: 4.8,
    reviews: 650,
    difficulty: "Professional",
    features: [
      "6 full-length practice tests",
      "CI/CD scenario questions",
      "Infrastructure as Code focus",
      "Expert-level explanations"
    ],
    popular: true
  },
  {
    id: "ans-c01",
    title: "AWS Certified Advanced Networking",
    subtitle: "Specialty (ANS-C01)",
    price: 59,
    questions: 325,
    duration: "65 mins per test",
    rating: 4.7,
    reviews: 420,
    difficulty: "Specialty",
    features: [
      "5 full-length practice tests",
      "Network architecture scenarios",
      "Hybrid connectivity questions",
      "VPC deep-dive questions"
    ]
  },
  {
    id: "scs-c02",
    title: "AWS Certified Security",
    subtitle: "Specialty (SCS-C02)",
    price: 59,
    questions: 325,
    duration: "65 mins per test",
    rating: 4.9,
    reviews: 580,
    difficulty: "Specialty",
    features: [
      "5 full-length practice tests",
      "Security best practices focus",
      "Compliance scenarios included",
      "IAM & encryption deep-dive"
    ]
  },
  {
    id: "dbs-c01",
    title: "AWS Certified Database",
    subtitle: "Specialty (DBS-C01)",
    price: 59,
    questions: 325,
    duration: "65 mins per test",
    rating: 4.6,
    reviews: 390,
    difficulty: "Specialty",
    features: [
      "5 full-length practice tests",
      "Database migration scenarios",
      "Performance optimization focus",
      "Multi-DB service coverage"
    ]
  },
  {
    id: "mls-c01",
    title: "AWS Certified Machine Learning",
    subtitle: "Specialty (MLS-C01)",
    price: 59,
    questions: 325,
    duration: "65 mins per test",
    rating: 4.8,
    reviews: 510,
    difficulty: "Specialty",
    features: [
      "5 full-length practice tests",
      "ML algorithms & frameworks",
      "SageMaker deep-dive",
      "Real-world ML scenarios"
    ],
    popular: true
  },
  {
    id: "das-c01",
    title: "AWS Certified Data Analytics",
    subtitle: "Specialty (DAS-C01)",
    price: 59,
    questions: 325,
    duration: "65 mins per test",
    rating: 4.7,
    reviews: 460,
    difficulty: "Specialty",
    features: [
      "5 full-length practice tests",
      "Big data architecture focus",
      "Analytics service coverage",
      "ETL pipeline scenarios"
    ]
  },
  {
    id: "sap-bundle",
    title: "Solutions Architect Bundle",
    subtitle: "Associate + Professional",
    price: 99,
    questions: 840,
    duration: "Multiple tests",
    rating: 4.9,
    reviews: 320,
    difficulty: "Professional",
    features: [
      "Both SAA-C03 & SAP-C02 tests",
      "Save $19 on bundle",
      "Complete learning path",
      "Priority email support"
    ]
  },
  {
    id: "cloud-practitioner",
    title: "AWS Certified Cloud Practitioner",
    subtitle: "Foundational (CLF-C02)",
    price: 35,
    questions: 260,
    duration: "65 mins per test",
    rating: 4.8,
    reviews: 1850,
    difficulty: "Associate",
    features: [
      "4 full-length practice tests",
      "Perfect for beginners",
      "Cloud concepts explained",
      "AWS service overview"
    ]
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

export default function PracticeTests() {
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [minRating, setMinRating] = useState(0);
  const [showPopularOnly, setShowPopularOnly] = useState(false);
  const [sortBy, setSortBy] = useState("popular");

  const filteredAndSortedTests = useMemo(() => {
    let filtered = practiceTests.filter((test) => {
      // Difficulty filter
      if (selectedDifficulties.length > 0 && !selectedDifficulties.includes(test.difficulty)) {
        return false;
      }

      // Price range filter
      if (test.price < priceRange[0] || test.price > priceRange[1]) {
        return false;
      }

      // Rating filter
      if (test.rating < minRating) {
        return false;
      }

      // Popular filter
      if (showPopularOnly && !test.popular) {
        return false;
      }

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "questions":
          return b.questions - a.questions;
        case "popular":
        default:
          // Popular first, then by rating
          if (a.popular && !b.popular) return -1;
          if (!a.popular && b.popular) return 1;
          return b.rating - a.rating;
      }
    });

    return filtered;
  }, [selectedDifficulties, priceRange, minRating, showPopularOnly, sortBy]);

  const handleDifficultyToggle = (difficulty: string) => {
    setSelectedDifficulties(prev =>
      prev.includes(difficulty)
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  const resetFilters = () => {
    setSelectedDifficulties([]);
    setPriceRange([0, 100]);
    setMinRating(0);
    setShowPopularOnly(false);
    setSortBy("popular");
  };

  const hasActiveFilters = selectedDifficulties.length > 0 || 
    priceRange[0] !== 0 || 
    priceRange[1] !== 100 || 
    minRating > 0 || 
    showPopularOnly;

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
              <Link href="/">
                <Button variant="ghost" className="flex items-center gap-2" data-testid="button-back-home">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <UserProfile />
            </div>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <section className="pt-28 pb-12 bg-gradient-to-br from-primary/10 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              AWS Certification <span className="text-primary">Practice Tests</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Prepare for your AWS certification exams with our comprehensive practice tests. 
              Realistic questions, detailed explanations, and performance tracking.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 mt-8 text-muted-foreground">
              <div className="flex items-center">
                <Award className="h-5 w-5 text-accent mr-2" />
                <span>12+ Certifications Covered</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-accent mr-2" />
                <span>4,000+ Practice Questions</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-accent mr-2" />
                <span>10,000+ Students Passed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Filters */}
            <aside className="lg:w-80 flex-shrink-0">
              <div className="sticky top-20">
                <Card className="border-2 bg-gradient-to-br from-primary/5 to-accent/5">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">Filters</CardTitle>
                      </div>
                      {hasActiveFilters && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={resetFilters}
                          className="h-8 text-xs"
                          data-testid="button-reset-filters"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Reset
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Sort By */}
                    <div>
                      <Label className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        Sort By
                      </Label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full" data-testid="select-sort">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="popular">Most Popular</SelectItem>
                          <SelectItem value="rating">Highest Rated</SelectItem>
                          <SelectItem value="price-low">Price: Low to High</SelectItem>
                          <SelectItem value="price-high">Price: High to Low</SelectItem>
                          <SelectItem value="questions">Most Questions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    {/* Difficulty Level */}
                    <div>
                      <Label className="text-sm font-semibold mb-3 block">Difficulty Level</Label>
                      <div className="space-y-3">
                        {["Associate", "Professional", "Specialty"].map((difficulty) => (
                          <div key={difficulty} className="flex items-center space-x-2">
                            <Checkbox
                              id={`diff-${difficulty}`}
                              checked={selectedDifficulties.includes(difficulty)}
                              onCheckedChange={() => handleDifficultyToggle(difficulty)}
                              data-testid={`checkbox-difficulty-${difficulty.toLowerCase()}`}
                            />
                            <label
                              htmlFor={`diff-${difficulty}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {difficulty}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Price Range */}
                    <div>
                      <Label className="text-sm font-semibold mb-3 block">
                        Price Range: ${priceRange[0]} - ${priceRange[1]}
                      </Label>
                      <Slider
                        min={0}
                        max={100}
                        step={5}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="mt-2"
                        data-testid="slider-price-range"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>$0</span>
                        <span>$100</span>
                      </div>
                    </div>

                    <Separator />

                    {/* Rating */}
                    <div>
                      <Label className="text-sm font-semibold mb-3 block">Minimum Rating</Label>
                      <div className="space-y-3">
                        {[4.5, 4.0, 3.5, 0].map((rating) => (
                          <div key={rating} className="flex items-center space-x-2">
                            <Checkbox
                              id={`rating-${rating}`}
                              checked={minRating === rating}
                              onCheckedChange={() => setMinRating(rating)}
                              data-testid={`checkbox-rating-${rating}`}
                            />
                            <label
                              htmlFor={`rating-${rating}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-1"
                            >
                              {rating > 0 ? (
                                <>
                                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                  {rating}+ Stars
                                </>
                              ) : (
                                "All Ratings"
                              )}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Popular Only */}
                    <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="popular-only"
                          checked={showPopularOnly}
                          onCheckedChange={(checked) => setShowPopularOnly(checked as boolean)}
                          data-testid="checkbox-popular-only"
                        />
                        <label
                          htmlFor="popular-only"
                          className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                        >
                          <Sparkles className="h-4 w-4 text-accent" />
                          Show Popular Only
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Results Count */}
                <div className="mt-4 text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Showing <span className="font-bold text-foreground" data-testid="text-results-count">{filteredAndSortedTests.length}</span> of {practiceTests.length} tests
                  </p>
                </div>
              </div>
            </aside>

            {/* Practice Tests Grid */}
            <div className="flex-1">
              {filteredAndSortedTests.length === 0 ? (
                <Card className="p-12 text-center">
                  <Filter className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No tests found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters to see more results
                  </p>
                  <Button onClick={resetFilters} data-testid="button-reset-filters-empty">
                    Reset All Filters
                  </Button>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-8">
                  {filteredAndSortedTests.map((test) => (
                    <Card 
                      key={test.id} 
                      className={`relative hover:shadow-xl transition-all duration-300 ${
                        test.popular ? 'border-2 border-accent' : 'hover:border-primary/50'
                      }`}
                      data-testid={`practice-test-${test.id}`}
                    >
                      {test.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-accent text-accent-foreground px-3 py-1">
                            POPULAR
                          </Badge>
                        </div>
                      )}
                      
                      <CardHeader>
                        <div className="flex justify-between items-start mb-3">
                          <Badge className={getDifficultyColor(test.difficulty)}>
                            {test.difficulty}
                          </Badge>
                          <div className="flex items-center text-sm">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                            <span className="font-semibold">{test.rating}</span>
                            <span className="text-muted-foreground ml-1">({test.reviews})</span>
                          </div>
                        </div>
                        <CardTitle className="text-xl font-heading mb-1">{test.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{test.subtitle}</p>
                      </CardHeader>

                      <CardContent>
                        <div className="mb-4">
                          <div className="text-3xl font-bold text-primary mb-2">
                            ${test.price}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center">
                              <BookOpen className="h-4 w-4 mr-1" />
                              {test.questions} Q's
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {test.duration}
                            </div>
                          </div>
                        </div>

                        <ul className="space-y-2 mb-6">
                          {test.features.map((feature, index) => (
                            <li key={index} className="flex items-start text-sm">
                              <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="space-y-2">
                          <Link href={`/practice-tests/${test.id}`}>
                            <Button 
                              variant="outline"
                              className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                              data-testid={`button-details-${test.id}`}
                            >
                              <BookOpen className="mr-2 h-4 w-4" />
                              View Details
                            </Button>
                          </Link>
                          <PurchaseButton
                            testId={test.id}
                            popular={test.popular}
                            className={`w-full ${
                              test.popular 
                                ? 'bg-accent hover:bg-accent/90 text-accent-foreground' 
                                : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                            } transition-all duration-300 transform hover:scale-105`}
                            testIdAttr={`button-purchase-${test.id}`}
                          >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Purchase Now
                          </PurchaseButton>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
              Why Choose Our Practice Tests?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="text-primary h-8 w-8" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3">Exam-Like Experience</h3>
                <p className="text-muted-foreground">
                  Questions mirror the actual AWS certification exam format and difficulty level
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="text-accent h-8 w-8" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3">Detailed Explanations</h3>
                <p className="text-muted-foreground">
                  Every answer includes comprehensive explanations to help you understand concepts
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-green-600 dark:text-green-300 h-8 w-8" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3">Performance Tracking</h3>
                <p className="text-muted-foreground">
                  Track your progress with detailed analytics and identify areas for improvement
                </p>
              </CardContent>
            </Card>
          </div>
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
