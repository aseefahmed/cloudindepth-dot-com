/**
 * Practice Tests Page
 * 
 * This component loads practice tests from local JSON data:
 * client/src/data/practice-tests.json
 * 
 * Features:
 * - Local JSON data integration
 * - Filtering and sorting capabilities
 * - Responsive design
 */

import { useState, useMemo, useEffect } from "react";
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
import ChatWithMe from "@/components/ChatWithMe";
import Footer from "@/components/Footer";
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
  Sparkles
} from "lucide-react";
import Navigation from "@/components/Navigation";
import practiceTestsData from "../data/practice-tests.json";
interface PracticeTest {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  retail_price?: number;
  flashcards?: number;
  offer_message?: string;
  questions: number;
  duration: string;
  rating: number;
  reviews: number;
  difficulty: "Associate" | "Professional" | "Specialty";
  features: string[];
  popular?: boolean;
  status?: string;
  sort_number?: number;
}

// Transform local JSON data to match component expectations
const transformLocalData = (localData: any): PracticeTest => {
  return {
    id: localData.id,
    title: localData.title,
    subtitle: localData.subtitle,
    price: localData.price,
    retail_price: localData.retail_price,
    offer_message: localData.offer_message,
    questions: localData.questions,
    flashcards: localData.flashcards,
    duration: localData.duration,
    rating: localData.rating,
    reviews: localData.reviews_count,
    difficulty: localData.difficulty,
    features: localData.features,
    popular: localData.popular,
    status: localData.status,
    sort_number: localData.sort_number
  };
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
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
};

export default function PracticeTests() {
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(["Associate", "Professional", "Specialty"]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [showPopularOnly, setShowPopularOnly] = useState(false);
  
  // Local data state management
  const [practiceTests, setPracticeTests] = useState<PracticeTest[]>([]);

  // Load practice tests from local JSON data
  useEffect(() => {
    console.log('Loading practice tests from local JSON data...');
    const transformedTests = practiceTestsData.map(transformLocalData);
    console.log('Local data loaded:', transformedTests.length, 'tests');
    setPracticeTests(transformedTests);
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const filteredAndSortedTests = useMemo(() => {
    console.log('Filtering tests:', {
      totalTests: practiceTests.length,
      selectedDifficulties,
      priceRange,
      showPopularOnly
    });
    
    let filtered = practiceTests.filter((test) => {
      // Difficulty filter
      if (selectedDifficulties.length > 0 && !selectedDifficulties.includes(test.difficulty)) {
        console.log('Filtered out by difficulty:', test.title, test.difficulty);
        return false;
      }

      // Price range filter
      if (test.price < priceRange[0] || test.price > priceRange[1]) {
        console.log('Filtered out by price:', test.title, test.price, priceRange);
        return false;
      }

      // Popular filter
      if (showPopularOnly && !test.popular) {
        console.log('Filtered out by popular:', test.title, test.popular);
        return false;
      }

      return true;
    });
    
    console.log('Filtered results:', filtered.length, 'out of', practiceTests.length);

    // Sorting - always sort by sort_number, then by popularity, then by rating
    filtered.sort((a, b) => {
          const aSortNumber = a.sort_number || 0;
          const bSortNumber = b.sort_number || 0;
          
          if (aSortNumber !== bSortNumber) {
            return aSortNumber - bSortNumber;
          }
          
          // If sort_number is the same, fall back to popularity and rating
          if (a.popular && !b.popular) return -1;
          if (!a.popular && b.popular) return 1;
          return b.rating - a.rating;
    });

    return filtered;
  }, [practiceTests, selectedDifficulties, priceRange, showPopularOnly]);

  const resetFilters = () => {
    setSelectedDifficulties(["Associate", "Professional", "Specialty"]);
    setPriceRange([0, 100]);
    setShowPopularOnly(false);
  };

  const hasActiveFilters = selectedDifficulties.length !== 3 || 
    priceRange[0] !== 0 || 
    priceRange[1] !== 100 || 
    showPopularOnly;


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
      <Navigation scrollToSection={scrollToSection}  />

      {/* Header Section */}
      <section className="pt-28 pb-12 bg-gradient-to-br from-primary/10 to-accent/5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
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
                    {/* Difficulty Level */}
                    <div>
                      <Label className="text-sm font-semibold mb-3 block">Difficulty Level</Label>
                      <Select value={selectedDifficulties.join(',')} onValueChange={(value) => {
                        if (value === 'all') {
                          setSelectedDifficulties(["Associate", "Professional", "Specialty"]);
                        } else {
                          setSelectedDifficulties([value]);
                        }
                      }}>
                        <SelectTrigger className="w-full" data-testid="select-difficulty">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Levels</SelectItem>
                          <SelectItem value="Associate">Associate</SelectItem>
                          <SelectItem value="Professional">Professional</SelectItem>
                          <SelectItem value="Specialty">Specialty</SelectItem>
                        </SelectContent>
                      </Select>
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
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                        <div className="flex items-center justify-center gap-3 mb-2">
                    {test.price === 0 ? (
                      <>
                        <span className="text-4xl font-bold text-green-600 dark:text-green-400">Free</span>
                         <span className="text-2xl text-muted-foreground line-through">${test.retail_price || test.price * 1.5}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-primary">${test.price}</span>
                         <span className="text-2xl text-muted-foreground line-through">${test.retail_price || test.price * 1.5}</span>
                      </>
                    )}
                  </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center">
                              <BookOpen className="h-4 w-4 mr-1" />
                              {test.questions} Q's
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {test.flashcards} flashcards
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
                          {(test.status === 'coming soon' || test.status === 'coming_soon') ? (
                            <Button
                              className="w-full bg-gray-400 text-gray-600 cursor-not-allowed"
                              disabled
                            >
                              <Clock className="mr-2 h-4 w-4" />
                              Coming Soon
                            </Button>
                          ) : (
                            <PurchaseButton
                              testId={test.id}
                              price={test.price}
                              testTitle={test.title}
                              questions={test.questions}
                              flashcards={test.flashcards || 0}
                              popular={test.popular}
                              className={`w-full ${
                                test.popular 
                                  ? 'bg-accent hover:bg-accent/90 text-accent-foreground' 
                                  : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                              } transition-all duration-300 transform hover:scale-105`}
                              testIdAttr={`button-purchase-${test.id}`}
                            >
                              {test.price === 0 ? (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Enrol for Free
                                </>
                              ) : (
                                <>
                                  <ShoppingCart className="mr-2 h-4 w-4" />
                                  Purchase Now
                                </>
                              )}
                            </PurchaseButton>
                          )}
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
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
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
      <Footer scrollToSection={scrollToSection} />

      {/* Chat with Me Button */}
      <ChatWithMe 
        showOnScroll={true}
        scrollThreshold={300}
        position="bottom-right"
      />
    </div>
  );
}
