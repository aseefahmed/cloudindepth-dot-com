import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { 
  BookOpen, 
  Tag, 
  ArrowLeft, 
  Search, 
  Filter,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Target,
  Award,
  Clock,
  Users,
  TrendingUp,
  Shield
} from "lucide-react";

interface StudyNote {
  Tag: string;
  "Exam Tip": string[];
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

const getTagColor = (tag: string) => {
  const colors: { [key: string]: string } = {
    "AI/ML": "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    "Backup": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    "Compute": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    "Database": "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    "Networking": "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    "Security": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    "Storage": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
    "Monitoring": "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
    "Cost": "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
    "Migration": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300"
  };
  return colors[tag] || "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
};

const getTagIcon = (tag: string) => {
  const icons: { [key: string]: any } = {
    "AI/ML": Target,
    "Backup": Award,
    "Compute": TrendingUp,
    "Database": BookOpen,
    "Networking": Users,
    "Security": Shield,
    "Storage": Clock,
    "Monitoring": TrendingUp,
    "Cost": Award,
    "Migration": ArrowLeft
  };
  return icons[tag] || BookOpen;
};

export default function StudyNotes() {
  const [, params] = useRoute("/dashboard/study-notes/:testId");
  const testId = params?.testId || "saa";
  
  const [studyNotes, setStudyNotes] = useState<StudyNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [expandedTags, setExpandedTags] = useState<Set<string>>(new Set());

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load study notes from local JSON data
  useEffect(() => {
    const loadStudyNotes = async () => {
      try {
        setIsLoading(true);
        console.log('Loading study notes for test:', testId);
        
        // Import the study notes data dynamically
        const studyNotesData = await import(`../../../data/study_notes/${testId}.json`);
        console.log('Study notes loaded:', studyNotesData.default.length, 'tags');
        setStudyNotes(studyNotesData.default);
      } catch (error) {
        console.error('Error loading study notes:', error);
        setStudyNotes([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadStudyNotes();
  }, [testId]);

  // Filter study notes based on search query and selected tag
  const filteredStudyNotes = studyNotes.filter(note => {
    const matchesSearch = searchQuery === "" || 
      note.Tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note["Exam Tip"].some(tip => tip.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTag = selectedTag === null || note.Tag === selectedTag;
    
    return matchesSearch && matchesTag;
  });

  // Get all unique tags for filtering
  const allTags = Array.from(new Set(studyNotes.map(note => note.Tag)));

  // Toggle tag expansion
  const toggleTagExpansion = (tag: string) => {
    const newExpanded = new Set(expandedTags);
    if (newExpanded.has(tag)) {
      newExpanded.delete(tag);
    } else {
      newExpanded.add(tag);
    }
    setExpandedTags(newExpanded);
  };

  // Expand all tags
  const expandAllTags = () => {
    setExpandedTags(new Set(allTags));
  };

  // Collapse all tags
  const collapseAllTags = () => {
    setExpandedTags(new Set());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Loading Study Notes</h2>
          <p className="text-muted-foreground">Fetching study materials...</p>
        </div>
      </div>
    );
  }

  if (studyNotes.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation scrollToSection={scrollToSection} />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center max-w-2xl mx-auto p-8">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Study Notes Not Found</h1>
            <p className="text-muted-foreground mb-6">
              No study notes are available for this test. Please check back later or contact support.
            </p>
            <Link href="/dashboard">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      
      
      {/* Header Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Link href="/dashboard">
                <Button variant="outline" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <Badge className="bg-primary text-primary-foreground px-4 py-2">
                {testId.toUpperCase()} Study Notes
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              Study Notes & Exam Tips
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive study materials organized by topic to help you prepare for your AWS certification exam.
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search study notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={expandAllTags}
                  className="flex items-center gap-2"
                >
                  <ChevronDown className="h-4 w-4" />
                  Expand All
                </Button>
                <Button
                  variant="outline"
                  onClick={collapseAllTags}
                  className="flex items-center gap-2"
                >
                  <ChevronUp className="h-4 w-4" />
                  Collapse All
                </Button>
              </div>
            </div>

            {/* Tag Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={selectedTag === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(null)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                All Tags
              </Button>
              {allTags.map((tag) => {
                const Icon = getTagIcon(tag);
                return (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {tag}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Study Notes Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredStudyNotes.length === 0 ? (
            <Card className="p-12 text-center">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No study notes found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button onClick={() => {
                setSearchQuery("");
                setSelectedTag(null);
              }}>
                Clear Filters
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredStudyNotes.map((note, index) => {
                const TagIcon = getTagIcon(note.Tag);
                const isExpanded = expandedTags.has(note.Tag);
                
                return (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader 
                      className="bg-gradient-to-r from-primary/5 to-accent/5 cursor-pointer"
                      onClick={() => toggleTagExpansion(note.Tag)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <TagIcon className="h-6 w-6 text-primary" />
                          <CardTitle className="text-xl">{note.Tag}</CardTitle>
                          <Badge className={getTagColor(note.Tag)}>
                            {note["Exam Tip"].length} Tips
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    {isExpanded && (
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {note["Exam Tip"].map((tip, tipIndex) => (
                            <div 
                              key={tipIndex}
                              className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border-l-4 border-primary"
                            >
                              
                              <div 
                                className="text-sm leading-relaxed"
                                dangerouslySetInnerHTML={{ 
                                  __html: tip.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
              Study Materials Overview
            </h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive coverage of all exam topics
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Tag className="text-primary h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{allTags.length}</h3>
                <p className="text-muted-foreground">Topic Areas</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="text-accent h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {studyNotes.reduce((total, note) => total + note["Exam Tip"].length, 0)}
                </h3>
                <p className="text-muted-foreground">Exam Tips</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="text-green-600 dark:text-green-300 h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">100%</h3>
                <p className="text-muted-foreground">Exam Coverage</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="text-blue-600 dark:text-blue-300 h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Expert</h3>
                <p className="text-muted-foreground">Curated Content</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
