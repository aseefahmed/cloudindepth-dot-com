import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Bookmark,
  ExternalLink,
  Search,
  Star,
  Globe,
  Code,
  Database,
  Cloud,
  Shield,
  Zap,
  Users,
  TrendingUp,
  BookOpen,
  Video,
  FileText,
  Github,
  Youtube,
  Twitter,
  Linkedin,
  Filter,
  Grid,
  List,
  Plus,
  Heart,
  Clock,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BookmarkItem {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  icon: string;
  isPopular: boolean;
  isFavorite: boolean;
  tags: string[];
  lastVisited?: string;
  visitCount?: number;
}

const bookmarkCategories = [
  { id: "all", name: "All", icon: Grid, count: 0 },
  { id: "aws", name: "AWS", icon: Cloud, count: 0 },
  { id: "programming", name: "Programming", icon: Code, count: 0 },
  { id: "database", name: "Database", icon: Database, count: 0 },
  { id: "security", name: "Security", icon: Shield, count: 0 },
  { id: "devops", name: "DevOps", icon: Zap, count: 0 },
  { id: "learning", name: "Learning", icon: BookOpen, count: 0 },
  { id: "tools", name: "Tools", icon: Globe, count: 0 },
  { id: "community", name: "Community", icon: Users, count: 0 }
];

const mockBookmarks: BookmarkItem[] = [
  // AWS Resources
  {
    id: "1",
    title: "AWS Documentation",
    description: "Official AWS documentation and guides",
    url: "https://docs.aws.amazon.com/",
    category: "aws",
    icon: "aws",
    isPopular: true,
    isFavorite: true,
    tags: ["documentation", "official", "aws"],
    lastVisited: "2024-01-15",
    visitCount: 45
  },
  {
    id: "2",
    title: "AWS Well-Architected Framework",
    description: "Best practices for building secure, high-performing, resilient, and efficient infrastructure",
    url: "https://aws.amazon.com/architecture/well-architected/",
    category: "aws",
    icon: "aws",
    isPopular: true,
    isFavorite: false,
    tags: ["architecture", "best-practices", "aws"],
    lastVisited: "2024-01-10",
    visitCount: 23
  },
  {
    id: "3",
    title: "AWS Free Tier",
    description: "Explore AWS services with free tier offerings",
    url: "https://aws.amazon.com/free/",
    category: "aws",
    icon: "aws",
    isPopular: true,
    isFavorite: true,
    tags: ["free-tier", "aws", "learning"],
    lastVisited: "2024-01-12",
    visitCount: 18
  },
  {
    id: "4",
    title: "AWS Training and Certification",
    description: "Official AWS training courses and certification paths",
    url: "https://aws.amazon.com/training/",
    category: "aws",
    icon: "aws",
    isPopular: true,
    isFavorite: false,
    tags: ["training", "certification", "aws"],
    lastVisited: "2024-01-08",
    visitCount: 31
  },

  // Programming Resources
  {
    id: "5",
    title: "GitHub",
    description: "Code repository hosting and collaboration platform",
    url: "https://github.com/",
    category: "programming",
    icon: "github",
    isPopular: true,
    isFavorite: true,
    tags: ["git", "code", "collaboration"],
    lastVisited: "2024-01-14",
    visitCount: 67
  },
  {
    id: "6",
    title: "Stack Overflow",
    description: "Programming questions and answers community",
    url: "https://stackoverflow.com/",
    category: "programming",
    icon: "stackoverflow",
    isPopular: true,
    isFavorite: true,
    tags: ["q&a", "programming", "help"],
    lastVisited: "2024-01-13",
    visitCount: 89
  },
  {
    id: "7",
    title: "MDN Web Docs",
    description: "Comprehensive web development documentation",
    url: "https://developer.mozilla.org/",
    category: "programming",
    icon: "mdn",
    isPopular: true,
    isFavorite: false,
    tags: ["web", "documentation", "javascript"],
    lastVisited: "2024-01-11",
    visitCount: 34
  },
  {
    id: "8",
    title: "W3Schools",
    description: "Web development tutorials and references",
    url: "https://www.w3schools.com/",
    category: "programming",
    icon: "w3schools",
    isPopular: true,
    isFavorite: false,
    tags: ["tutorials", "web", "learning"],
    lastVisited: "2024-01-09",
    visitCount: 28
  },

  // Database Resources
  {
    id: "9",
    title: "MongoDB Documentation",
    description: "Official MongoDB documentation and guides",
    url: "https://docs.mongodb.com/",
    category: "database",
    icon: "mongodb",
    isPopular: true,
    isFavorite: false,
    tags: ["mongodb", "nosql", "documentation"],
    lastVisited: "2024-01-07",
    visitCount: 15
  },
  {
    id: "10",
    title: "PostgreSQL Documentation",
    description: "Official PostgreSQL documentation",
    url: "https://www.postgresql.org/docs/",
    category: "database",
    icon: "postgresql",
    isPopular: true,
    isFavorite: true,
    tags: ["postgresql", "sql", "database"],
    lastVisited: "2024-01-06",
    visitCount: 22
  },

  // Security Resources
  {
    id: "11",
    title: "OWASP",
    description: "Open Web Application Security Project",
    url: "https://owasp.org/",
    category: "security",
    icon: "owasp",
    isPopular: true,
    isFavorite: false,
    tags: ["security", "web", "owasp"],
    lastVisited: "2024-01-05",
    visitCount: 12
  },
  {
    id: "12",
    title: "NIST Cybersecurity Framework",
    description: "National Institute of Standards and Technology cybersecurity guidelines",
    url: "https://www.nist.gov/cyberframework",
    category: "security",
    icon: "nist",
    isPopular: true,
    isFavorite: true,
    tags: ["security", "framework", "nist"],
    lastVisited: "2024-01-04",
    visitCount: 8
  },

  // DevOps Resources
  {
    id: "13",
    title: "Docker Documentation",
    description: "Official Docker documentation and guides",
    url: "https://docs.docker.com/",
    category: "devops",
    icon: "docker",
    isPopular: true,
    isFavorite: true,
    tags: ["docker", "containers", "devops"],
    lastVisited: "2024-01-03",
    visitCount: 41
  },
  {
    id: "14",
    title: "Kubernetes Documentation",
    description: "Official Kubernetes documentation",
    url: "https://kubernetes.io/docs/",
    category: "devops",
    icon: "kubernetes",
    isPopular: true,
    isFavorite: false,
    tags: ["kubernetes", "orchestration", "devops"],
    lastVisited: "2024-01-02",
    visitCount: 19
  },

  // Learning Resources
  {
    id: "15",
    title: "Coursera",
    description: "Online learning platform with courses from top universities",
    url: "https://www.coursera.org/",
    category: "learning",
    icon: "coursera",
    isPopular: true,
    isFavorite: false,
    tags: ["courses", "education", "online"],
    lastVisited: "2024-01-01",
    visitCount: 25
  },
  {
    id: "16",
    title: "Udemy",
    description: "Online learning marketplace with thousands of courses",
    url: "https://www.udemy.com/",
    category: "learning",
    icon: "udemy",
    isPopular: true,
    isFavorite: true,
    tags: ["courses", "learning", "skills"],
    lastVisited: "2023-12-30",
    visitCount: 33
  },

  // Tools
  {
    id: "17",
    title: "Postman",
    description: "API development and testing platform",
    url: "https://www.postman.com/",
    category: "tools",
    icon: "postman",
    isPopular: true,
    isFavorite: true,
    tags: ["api", "testing", "development"],
    lastVisited: "2023-12-29",
    visitCount: 56
  },
  {
    id: "18",
    title: "Figma",
    description: "Collaborative interface design tool",
    url: "https://www.figma.com/",
    category: "tools",
    icon: "figma",
    isPopular: true,
    isFavorite: false,
    tags: ["design", "ui", "ux"],
    lastVisited: "2023-12-28",
    visitCount: 14
  },

  // Community
  {
    id: "19",
    title: "Reddit - r/aws",
    description: "AWS community discussions and help",
    url: "https://www.reddit.com/r/aws/",
    category: "community",
    icon: "reddit",
    isPopular: true,
    isFavorite: false,
    tags: ["community", "discussions", "aws"],
    lastVisited: "2023-12-27",
    visitCount: 37
  },
  {
    id: "20",
    title: "AWS Community Forums",
    description: "Official AWS community forums",
    url: "https://repost.aws/",
    category: "community",
    icon: "aws",
    isPopular: true,
    isFavorite: true,
    tags: ["community", "aws", "forums"],
    lastVisited: "2023-12-26",
    visitCount: 29
  }
];

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(mockBookmarks);
  const [filteredBookmarks, setFilteredBookmarks] = useState<BookmarkItem[]>(mockBookmarks);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showPopularOnly, setShowPopularOnly] = useState(false);
  
  const { toast } = useToast();

  // Update category counts
  const categoriesWithCounts = bookmarkCategories.map(category => ({
    ...category,
    count: category.id === "all" 
      ? bookmarks.length 
      : bookmarks.filter(bookmark => bookmark.category === category.id).length
  }));

  // Filter bookmarks
  const filterBookmarks = () => {
    let filtered = bookmarks;

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(bookmark => bookmark.category === selectedCategory);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(bookmark =>
        bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter(bookmark => bookmark.isFavorite);
    }

    // Popular filter
    if (showPopularOnly) {
      filtered = filtered.filter(bookmark => bookmark.isPopular);
    }

    setFilteredBookmarks(filtered);
  };

  // Apply filters when dependencies change
  React.useEffect(() => {
    filterBookmarks();
  }, [bookmarks, searchTerm, selectedCategory, showFavoritesOnly, showPopularOnly]);

  const toggleFavorite = (id: string) => {
    setBookmarks(prev => prev.map(bookmark =>
      bookmark.id === id
        ? { ...bookmark, isFavorite: !bookmark.isFavorite }
        : bookmark
    ));
    
    toast({
      title: "Bookmark Updated",
      description: "Favorite status updated successfully.",
    });
  };

  const handleBookmarkClick = (bookmark: BookmarkItem) => {
    // Update visit count and last visited
    setBookmarks(prev => prev.map(b =>
      b.id === bookmark.id
        ? { 
            ...b, 
            visitCount: (b.visitCount || 0) + 1,
            lastVisited: new Date().toISOString().split('T')[0]
          }
        : b
    ));

    // Open in new tab
    window.open(bookmark.url, '_blank');
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      aws: Cloud,
      github: Github,
      stackoverflow: Code,
      mdn: Globe,
      w3schools: BookOpen,
      mongodb: Database,
      postgresql: Database,
      owasp: Shield,
      nist: Shield,
      docker: Cloud,
      kubernetes: Cloud,
      coursera: Video,
      udemy: BookOpen,
      postman: Code,
      figma: Globe,
      reddit: Users
    };
    
    return iconMap[iconName] || Globe;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      aws: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      programming: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      database: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      security: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      devops: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      learning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      tools: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
      community: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
    };
    
    return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
              <Bookmark className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Bookmarks</h1>
              <p className="text-slate-600 dark:text-slate-400">Your curated collection of useful resources</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Bookmarks</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{bookmarks.length}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Bookmark className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Favorites</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {bookmarks.filter(b => b.isFavorite).length}
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Popular</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {bookmarks.filter(b => b.isPopular).length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Categories</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{bookmarkCategories.length - 1}</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <Grid className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search and View Controls */}
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search bookmarks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>

                {/* View Controls */}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={showFavoritesOnly ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className="border-slate-200 dark:border-slate-700"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Favorites
                  </Button>
                  <Button
                    variant={showPopularOnly ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowPopularOnly(!showPopularOnly)}
                    className="border-slate-200 dark:border-slate-700"
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Popular
                  </Button>
                  <div className="flex border border-slate-200 dark:border-slate-700 rounded-md">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categoriesWithCounts.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="border-slate-200 dark:border-slate-700"
                    >
                      <IconComponent className="mr-2 h-4 w-4" />
                      {category.name}
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {category.count}
                      </Badge>
                    </Button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookmarks Grid/List */}
        <div className="w-full">
            {filteredBookmarks.length === 0 ? (
              <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <Bookmark className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No Bookmarks Found</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    {searchTerm || selectedCategory !== "all" || showFavoritesOnly || showPopularOnly
                      ? "No bookmarks match your current filters."
                      : "You haven't added any bookmarks yet."}
                  </p>
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                      setShowFavoritesOnly(false);
                      setShowPopularOnly(false);
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }>
                {filteredBookmarks.map((bookmark) => {
                  const IconComponent = getIconComponent(bookmark.icon);
                  return (
                    <Card
                      key={bookmark.id}
                      className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:shadow-xl transition-all duration-200 cursor-pointer group"
                      onClick={() => handleBookmarkClick(bookmark)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
                            <IconComponent className="h-6 w-6 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                {bookmark.title}
                              </h3>
                              <div className="flex items-center gap-1 ml-2">
                                {bookmark.isPopular && (
                                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(bookmark.id);
                                  }}
                                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                                >
                                  <Heart 
                                    className={`h-4 w-4 ${
                                      bookmark.isFavorite 
                                        ? "text-red-500 fill-red-500" 
                                        : "text-slate-400 hover:text-red-500"
                                    }`} 
                                  />
                                </button>
                              </div>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                              {bookmark.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge className={getCategoryColor(bookmark.category)}>
                                  {bookmark.category}
                                </Badge>
                                {bookmark.visitCount && (
                                  <div className="flex items-center gap-1 text-xs text-slate-500">
                                    <Eye className="h-3 w-3" />
                                    {bookmark.visitCount}
                                  </div>
                                )}
                              </div>
                              <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                            </div>
                            {bookmark.lastVisited && (
                              <div className="flex items-center gap-1 text-xs text-slate-500 mt-2">
                                <Clock className="h-3 w-3" />
                                Last visited: {formatDate(bookmark.lastVisited)}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
