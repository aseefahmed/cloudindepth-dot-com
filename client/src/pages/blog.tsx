import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import blogPostsData from "../data/articles.json";

import {
  Search,
  Calendar,
  User,
  Clock,
  ArrowRight,
  Filter,
  TrendingUp,
  BookOpen,
  Code,
  Cloud,
  Shield,
  Database,
  Server,
  Globe,
  Zap
} from "lucide-react";
import Footer from "@/components/Footer";

interface Author {
  name: string;
  title: string;
  avatar: string;
  bio: string;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: Author;
  publishDate: string;
  readTime: string;
  category: string;
  tags: string[];
  image_url: string;
  featured: boolean;
  trending: boolean;
  views: number;
  likes: number;
  comments: number;
}


export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFeatured, setShowFeatured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate categories dynamically from the data
  const categories = [
    { name: "All", icon: BookOpen, count: posts.length },
    { name: "Cloud Architecture", icon: Cloud, count: posts.filter(p => p.category === "Cloud Architecture").length },
    { name: "DevOps", icon: Code, count: posts.filter(p => p.category === "DevOps").length },
    { name: "Security", icon: Shield, count: posts.filter(p => p.category === "Security").length },
    { name: "Database", icon: Database, count: posts.filter(p => p.category === "Database").length }
  ];

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

  // Load blog posts from local JSON data
  useEffect(() => {
    console.log('Loading blog posts from local JSON data...');
    const blogPosts = blogPostsData;
    console.log('Local data loaded:', blogPosts.length, 'posts');
    setPosts(blogPosts);
    setFilteredPosts(blogPosts);
    setIsLoading(false);
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let filtered = posts;
   
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filter by featured
    if (showFeatured) {
      filtered = filtered.filter(post => post.featured);
    }

    setFilteredPosts(filtered);
  }, [posts, searchQuery, selectedCategory, showFeatured]);

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(cat => cat.name === category);
    return categoryData ? categoryData.icon : BookOpen;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Cloud Architecture": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      "DevOps": "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      "Security": "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      "Database": "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
    };
    return colors[category] || "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
  };

  if (isLoading) {
    console.log('Loading blog posts...');
    console.log('Blog posts:', blogPostsData.posts);
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <Navigation scrollToSection={scrollToSection} />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading blog posts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Navigation scrollToSection={scrollToSection} />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-accent text-white pt-20">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Cloud In Depth Blog</h1>
            <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
              Stay updated with the latest insights, tutorials, and best practices in cloud computing, 
              DevOps, and modern software architecture.
            </p>
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/70"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold">Filters:</span>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.name}
                    variant={selectedCategory === category.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.name)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {category.name}
                    <Badge variant="secondary" className="ml-1">
                      {category.count}
                    </Badge>
                  </Button>
                );
              })}
            </div>

            {/* Featured Toggle */}
            <Button
              variant={showFeatured ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFeatured(!showFeatured)}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Featured Only
            </Button>
          </div>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground">
            Showing {filteredPosts.length} of {posts.length} articles
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => {
            const CategoryIcon = getCategoryIcon(post.category);
            return (
              <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                <div className="relative">
                  <img
                    src={post.image_url} 
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {post.featured && (
                      <Badge className="bg-yellow-500 text-white">
                        <Zap className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {post.trending && (
                      <Badge className="bg-red-500 text-white">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className={getCategoryColor(post.category)}>
                      <CategoryIcon className="h-3 w-3 mr-1" />
                      {post.category}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{post.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Meta Information */}
                  {/* <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </div>
                  </div> */}

                  {/* Read More Button */}
                  <Link href={`/blog/${post.id}`}>
                    <Button className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                      Read Article
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <Button onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setShowFeatured(false);
            }}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Newsletter Signup */}
        {/* <div className="mt-16 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Get the latest articles, tutorials, and industry insights delivered straight to your inbox.
          </p>
          <div className="flex justify-center gap-4 max-w-md mx-auto">
            <Input
              placeholder="Enter your email"
              className="flex-1"
            />
            <Button>
              Subscribe
            </Button>
          </div>
        </div> */}

      </div>
      <Footer />
    </div>
  );
}
